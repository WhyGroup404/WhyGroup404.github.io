/* 顶部横幅模块 */
(function(){
	const topBanner = document.getElementById('topBanner');
	const topBannerText = document.getElementById('topBannerText');
	const topBannerClose = document.getElementById('topBannerClose');
	const headerEl = document.querySelector('.app__header');
	if (!topBanner || !topBannerText) return;

	function hide(){
    topBanner.classList.remove('is-show');
    const delay = topBanner.classList.contains('banner--slow') ? 620 : 300;
    setTimeout(() => topBanner.classList.add('hidden'), delay);
	}

	function show(message, color = 'blue', durationMs = 3000, options = {}){
    try {
        topBanner.classList.remove('banner--blue', 'banner--red', 'banner--kaiti', 'banner--slow');
        topBanner.classList.add(color === 'red' ? 'banner--red' : 'banner--blue');
        if (options && (options.font === 'kaiti' || options.kaiti)) topBanner.classList.add('banner--kaiti');
        if (options && options.slowFade) topBanner.classList.add('banner--slow');
			topBannerText.textContent = String(message || '');
			const rect = headerEl ? headerEl.getBoundingClientRect() : { bottom: 0 };
			const top = Math.max(0, rect.bottom + 8 + (window.scrollY || window.pageYOffset || 0));
			topBanner.style.top = top + 'px';
			topBanner.classList.remove('hidden');
			requestAnimationFrame(() => topBanner.classList.add('is-show'));
			const showClose = options && Object.prototype.hasOwnProperty.call(options, 'showClose') ? !!options.showClose : true;
			if (topBannerClose) topBannerClose.style.display = showClose ? '' : 'none';
			if (Number.isFinite(durationMs) && durationMs > 0) setTimeout(hide, durationMs);
		} catch(_){}
	}

	function sync(){
		if (!topBanner || topBanner.classList.contains('hidden')) return;
		try {
			const rect = headerEl ? headerEl.getBoundingClientRect() : { bottom: 0 };
			const top = Math.max(0, rect.bottom + 8 + (window.scrollY || window.pageYOffset || 0));
			topBanner.style.top = top + 'px';
		} catch(_){}
	}

	window.addEventListener('resize', sync);
	window.addEventListener('scroll', sync, { passive: true });
	topBannerClose?.addEventListener('click', hide);

	// 暴露到全局，供主逻辑调用（例如参数校验提示）
	window.showBanner = show;
})();


