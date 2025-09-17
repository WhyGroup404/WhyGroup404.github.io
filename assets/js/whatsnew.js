/* 新功能弹窗模块 */
(function(){
	const sheet = document.getElementById('whatsNewSheet');
	const btnOpen = document.getElementById('btnWhatsNew');
	const btnClose = document.getElementById('btnWhatsNewClose');
	const btnOk = document.getElementById('btnWhatsNewOk');
	if (!sheet) return;

	const open = () => {
		sheet.classList.remove('hidden');
		requestAnimationFrame(() => sheet.classList.add('is-open'));
		document.body.style.overflow = 'hidden';
	};
	const close = () => {
		sheet.classList.remove('is-open');
		setTimeout(() => sheet.classList.add('hidden'), 280);
		document.body.style.overflow = '';
	};

	btnOpen?.addEventListener('click', open);
	btnClose?.addEventListener('click', close);
	btnOk?.addEventListener('click', close);
})();


