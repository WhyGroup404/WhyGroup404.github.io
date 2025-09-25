// 随机诗句：优先“今日诗词”API，失败则本地候选集回退
(function(){
    var elText = document.getElementById('poemText');
    var elMeta = document.getElementById('poemMeta');
    var bar = document.getElementById('poemBar');
    if (!elText || !elMeta || !bar) return;

    var fallbackPoems = [
        { c: '苟日新，日日新，又日新。', m: '《大学》' },
        { c: '海内存知己，天涯若比邻。', m: '王勃《送杜少府之任蜀州》' },
        { c: '会当凌绝顶，一览众山小。', m: '杜甫《望岳》' },
        { c: '长风破浪会有时，直挂云帆济沧海。', m: '李白《行路难》' },
        { c: '路漫漫其修远兮，吾将上下而求索。', m: '屈原《离骚》' },
        { c: '千磨万击还坚劲，任尔东西南北风。', m: '郑板桥《竹石》' },
        { c: '业精于勤荒于嬉，行成于思毁于随。', m: '韩愈《进学解》' },
        { c: '纸上得来终觉浅，绝知此事要躬行。', m: '陆游《冬夜读书示子聿》' },
        { c: '不积跬步，无以至千里。', m: '荀子《劝学》' },
        { c: '横看成岭侧成峰，远近高低各不同。', m: '苏轼《题西林壁》' }
    ];

    function setPoem(text, meta){
        // 入场小动效，且在首次测量时锁定固定宽度，避免加载前后抖动
        try {
            if (!bar.style.minWidth) {
                var meas = document.createElement('span');
                meas.style.visibility = 'hidden';
                meas.style.whiteSpace = 'nowrap';
                meas.style.position = 'absolute';
                meas.textContent = '随机诗句加载中… — 《》';
                document.body.appendChild(meas);
                var w = Math.ceil(meas.getBoundingClientRect().width) + 8;
                bar.style.minWidth = w + 'px';
                document.body.removeChild(meas);
            }
        } catch (_) {}
        try { elText.classList.remove('poem-enter'); void elText.offsetWidth; elText.classList.add('poem-enter'); } catch (_) {}
        elText.textContent = text;
        elMeta.textContent = meta ? '— ' + meta : '';
    }

    function pickFallback(){
        var idx = Math.floor(Math.random() * fallbackPoems.length);
        var p = fallbackPoems[idx];
        setPoem(p.c, p.m);
    }

    // 今日诗词：支持 JSONP 与 JSON，本处用 JSON 以简化
    // 文档参考： https://www.jinrishici.com/
    function fetchFromJinrishici(){
        startLoading();
        var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timeoutId = null;
        if (controller) {
            timeoutId = setTimeout(function(){ try { controller.abort(); } catch (_) {} }, 4000);
        }
        fetch('https://v2.jinrishici.com/sentence', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'omit',
            signal: controller ? controller.signal : undefined
        }).then(function(resp){
            if (!resp.ok) throw new Error('status ' + resp.status);
            return resp.json();
        }).then(function(data){
            try { if (timeoutId) clearTimeout(timeoutId); } catch (_) {}
            // 兼容两种返回格式：{ status:'success', data:{content, origin:{dynasty,author,title}} }
            var content = data && (data.content || (data.data && data.data.content));
            var origin = data && (data.origin || (data.data && data.data.origin)) || {};
            if (!content) throw new Error('empty');
            var metaParts = [];
            if (origin.dynasty) metaParts.push(origin.dynasty);
            if (origin.author) metaParts.push(origin.author);
            if (origin.title) metaParts.push('《' + origin.title + '》');
            setPoem(content, metaParts.join(' · '));
            stopLoading();
        }).catch(function(){
            // 回退到 GitHub 开源诗句 API（如诗·词 API）或本地
            fetchFromHitokotoFallback();
        });
    }

    // 次级回退：一言（含诗词类），再失败用本地
    function fetchFromHitokotoFallback(){
        // 不重复叠加 loading 状态
        var controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
        var timeoutId = null;
        if (controller) {
            timeoutId = setTimeout(function(){ try { controller.abort(); } catch (_) {} }, 4000);
        }
        fetch('https://v1.hitokoto.cn/?c=i&encode=json', {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
            credentials: 'omit',
            signal: controller ? controller.signal : undefined
        }).then(function(resp){
            if (!resp.ok) throw new Error('status ' + resp.status);
            return resp.json();
        }).then(function(data){
            try { if (timeoutId) clearTimeout(timeoutId); } catch (_) {}
            var text = (data && data.hitokoto) || '';
            var meta = '';
            if (data && (data.from_who || data.from)) {
                var parts = [];
                if (data.from_who) parts.push(data.from_who);
                if (data.from) parts.push('《' + data.from + '》');
                meta = parts.join(' · ');
            }
            if (!text) throw new Error('empty');
            setPoem(text, meta);
            stopLoading();
        }).catch(function(){
            pickFallback();
            stopLoading();
        });
    }

    // 首次加载与点击换一换
    var autoTimer = null;
    function scheduleAuto(){
        try { if (autoTimer) clearInterval(autoTimer); } catch (_) {}
        autoTimer = setInterval(function(){
            refreshPoem();
        }, 60000); // 60秒
    }

    function refreshPoem(){
        // 先从主源拉取
        fetchFromJinrishici();
    }

    try {
        refreshPoem();
        scheduleAuto();
    } catch (_) {
        fetchFromHitokotoFallback();
    }

    // 允许点击诗句刷新
    try {
        if (bar) {
            bar.style.cursor = 'pointer';
            bar.title = '点击换一换';
            bar.addEventListener('click', function(){
                elText.textContent = '随机诗句加载中…';
                elMeta.textContent = '';
                startLoading();
                refreshPoem();
                scheduleAuto(); // 重置60秒计时
            });
        }
    } catch (_) {}

    function startLoading(){
        try { bar.classList.add('poem-loading'); } catch (_) {}
    }
    function stopLoading(){
        try { bar.classList.remove('poem-loading'); } catch (_) {}
    }
})();


