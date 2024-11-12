var videoIndex = 1; // 当前视频序号
var skippedVideos = []; // 存储跳过的视频序号
var undoFlag = false; // 标记是否处于撤销状态
var undoVideos = []; // 存储撤销的视频序号
var optimizeQualityEnabled = false; // 是否启用优化质量
var videoLengthThreshold = 0; // 视频时长阈值

// 启用或禁用视频优化质量功能
function toggleOptimizeQuality() {
    optimizeQualityEnabled = document.getElementById('optimizeVideoQualityCheckbox').checked;
}

// 更新视频长度阈值
function updateVideoLengthThreshold() {
    videoLengthThreshold = parseInt(document.getElementById('videoLengthInput').value, 10) * 60; // 秒数
}

// 检测输入框和复选框状态
function checkVideoQualityOptimization() {
    if (optimizeQualityEnabled) {
        var video = document.getElementById('myVideo');

        if (!undoFlag && !undoVideos.includes(videoIndex)) { // 撤销状态下或已撤销的视频不跳过
            skipLongVideos(videoLengthThreshold); // 跳过长视频
        }
    }
}

// 每10毫秒检查复选框和输入框的状态
setInterval(function() {
    updateVideoLengthThreshold(); // 更新视频时长阈值
    checkVideoQualityOptimization(); // 检查视频优化状态
}, 10); // 每10毫秒检查一次

// 跳过长视频的功能
function skipLongVideos(threshold) {
    var video = document.getElementById('myVideo');

    // 如果当前视频的时长大于阈值，且视频未被撤销过，跳过并记录
    if (video.duration > threshold && !undoVideos.includes(videoIndex)) {
        skippedVideos.push(videoIndex); // 记录被跳过的视频
        showVideoOptimizationPopup(video.duration, videoIndex); // 显示弹窗通知
        goToNextVideo(); // 跳到下一个视频
    }
}

// 播放下一个视频
function goToNextVideo() {
    videoIndex++;
    if (videoIndex <= 100000) { // 假设有10万视频
        changeVideo(); // 切换到下一个视频
        var video = document.getElementById('myVideo');

        // 如果下一个视频也需要跳过，递归调用跳过
        if (video.duration > videoLengthThreshold && !undoVideos.includes(videoIndex)) {
            goToNextVideo();
        }
    }
}

// 返回上一个视频
function goToPreviousVideo() {
    videoIndex--;
    if (videoIndex >= 1) { // 防止小于第一个视频
        changeVideo(); // 切换到上一个视频
        var video = document.getElementById('myVideo');

        // 如果上一个视频是长视频，跳过并递归调用，直到找到非长视频
        if (video.duration > videoLengthThreshold && !undoVideos.includes(videoIndex)) {
            showVideoOptimizationPopup(video.duration, videoIndex); // 显示提示
            goToPreviousVideo(); // 跳过长视频，继续检测上一个视频
        }
    }
}

// 更改视频源
function changeVideo() {
    var video = document.getElementById('myVideo');
    var source = video.getElementsByTagName('source')[0];
    source.setAttribute("src", "files/video" + videoIndex + ".mp4"); // 切换到相应的视频文件
    video.load();
    video.play();
    document.getElementById('currentVideoIndex').innerText = "" + videoIndex; // 更新UI
}

// 显示视频优化弹窗
function showVideoOptimizationPopup(duration, index) {
    var popup = document.createElement('div');
    popup.className = 'VideoOptimization-popup show';
    popup.innerHTML = `
        <h3>视频质量优化</h3>
        <p>已为您跳过时长为${Math.round(duration / 60)}分钟的 video${index}</p>
        <button class="undo-btn" onclick="undoSkip(${index})">撤销 →</button>
    `;

    document.body.appendChild(popup);

    // 弹窗滑入效果
    setTimeout(function() {
        popup.style.right = '20px';
        popup.style.opacity = '1';
    }, 10);

    // 5秒后自动关闭弹窗，并触发滑出效果
    setTimeout(function() {
        popup.style.right = '-300px'; // 滑出动画
        popup.style.opacity = '0';
        setTimeout(function() {
            popup.remove();
            arrangePopups(); // 重新排列弹窗
        }, 500);
    }, 5000);

    // 检查现有弹窗，进行垂直排列
    arrangePopups();
}

// 垂直排列弹窗
function arrangePopups() {
    var existingPopups = document.getElementsByClassName('VideoOptimization-popup');
    for (var i = 0; i < existingPopups.length; i++) {
        existingPopups[i].style.bottom = `${20 + i * 130}px`; // 每个弹窗垂直间隔130px
    }
}

// 撤销跳过的功能
function undoSkip(index) {
    undoFlag = true; // 标记为撤销状态
    undoVideos.push(index); // 将该视频加入撤销列表，防止再次跳过
    videoIndex = index; // 返回到被跳过的视频
    changeVideo(); // 播放视频
    undoFlag = false; // 撤销操作完成后重置
}

// 初始化页面时加载第一个视频
changeVideo();
