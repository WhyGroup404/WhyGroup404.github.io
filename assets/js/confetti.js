// 简易彩带实现（独立模块）
window.launchConfetti = function launchConfetti(){
	const DURATION = 1600;
	const COUNT = 28;
	const colors = ['#34d399','#10b981','#22c55e','#f59e0b','#ef4444','#3b82f6'];
	const end = Date.now() + DURATION;
	const container = document.body;
	for (let i = 0; i < COUNT; i++) {
		const conf = document.createElement('i');
		conf.style.position = 'fixed';
		conf.style.top = '-12px';
		conf.style.left = (Math.random() * 100) + 'vw';
		conf.style.width = '8px';
		conf.style.height = 12 + Math.random() * 10 + 'px';
		conf.style.background = colors[i % colors.length];
		conf.style.opacity = '0.9';
		conf.style.transform = `rotate(${Math.random()*360}deg)`;
		conf.style.pointerEvents = 'none';
		conf.style.borderRadius = '2px';
		container.appendChild(conf);
		const translateY = window.innerHeight + 40 + Math.random() * 120;
		const translateX = (Math.random() * 2 - 1) * 120;
		conf.animate([
			{ transform: `translate(0, 0) rotate(0deg)` },
			{ transform: `translate(${translateX}px, ${translateY}px) rotate(${720*Math.random()}deg)` }
		], { duration: DURATION + Math.random()*600, easing: 'cubic-bezier(.22,.61,.36,1)', fill: 'forwards' });
		setTimeout(() => conf.remove(), DURATION + 800);
	}
};


