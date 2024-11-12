const playPauseBtn = document.getElementById('play-pause-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const videoElement = document.querySelector('video'); // 假设视频元素已经存在

// 切换全屏功能
fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        videoElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});
