let videoElement = document.querySelector('video');

// 如果要快进或倒退视频
document.getElementById('rewind-30s').addEventListener('click', () => {
    videoElement.currentTime -= 30;
});

document.getElementById('forward-15s').addEventListener('click', () => {
    videoElement.currentTime += 15;
});
