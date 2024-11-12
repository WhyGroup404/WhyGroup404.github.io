var touchStartY = 0;
var touchEndY = 0;
var delayPlayTimer; // 延迟播放的定时器

// 监听触摸开始事件
document.body.addEventListener("touchstart", function(event) {
    touchStartY = event.touches[0].clientY;
});

// 监听触摸结束事件
document.body.addEventListener("touchend", function(event) {
    touchEndY = event.changedTouches[0].clientY;
    handleSwipe();
});

// 处理滑动手势
function handleSwipe() {
    var deltaY = touchEndY - touchStartY;
    // 设置一个阈值，用于确定滑动手势的方向和距离
    var threshold = 50;

    // 如果滑动距离大于阈值，且滑动方向向上，则切换到下一个视频
    if (deltaY < -threshold) {
        if (videoIndex < 10000) {
            videoIndex++;
            changeVideo();
        }
    }
    // 如果滑动距离大于阈值，且滑动方向向下，则切换到上一个视频
    else if (deltaY > threshold) {
        if (videoIndex > 1) {
            videoIndex--;
            changeVideo();
        }
    }

    // 取消之前的延迟播放定时器
    clearTimeout(delayPlayTimer);
    // 延迟一定时间再播放视频，并添加动画效果
    delayPlayTimer = setTimeout(function() {
        playVideoWithAnimation();
    }, 500); // 这里设置延迟时间为0.5秒，你可以根据需要调整
}

// 播放视频，并添加动画效果
function playVideoWithAnimation() {
    // 添加 CSS 类名以触发动画效果
    video.classList.add("slide-up-animation");
    // 等待动画完成后再播放视频
    setTimeout(function() {
        video.play();
        // 动画结束后移除 CSS 类名
        video.classList.remove("slide-up-animation");
    }, 300); // 这里设置延迟时间与 CSS 过渡的时间一致，确保动画完成后再播放视频
}