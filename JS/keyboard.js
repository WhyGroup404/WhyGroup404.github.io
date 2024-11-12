// 获取视频元素和视频序号
var video = document.getElementById("myVideo");
var videoIndex = 1;
var maxVideos = 100000; // 最大视频数
var source = video.getElementsByTagName("source")[0];

// 更新视频源函数
function changeVideo() {
    source.setAttribute("src", "files/video" + videoIndex + ".mp4");
    video.load();
    video.play();
    document.getElementById("currentVideoIndex").innerText = "" + videoIndex;
}

// 键盘控制切换视频，包括PPT翻页笔
document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "PageDown") {
        // 下一个视频
        if (videoIndex < maxVideos) {
            videoIndex++;
            changeVideo();
        }
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft" || event.key === "PageUp") {
        // 上一个视频
        if (videoIndex > 1) {
            videoIndex--;
            changeVideo();
        }
    }
});

// 鼠标滚轮控制切换视频，增加滚动阈值
let scrollThreshold = 100; // 设置阈值以降低灵敏度
let scrollAccumulator = 0; // 用于累计滚动距离

document.addEventListener("wheel", function(event) {
    scrollAccumulator += event.deltaY; // 累积滚轮滚动量

    if (scrollAccumulator > scrollThreshold) { // 当累积滚动量超过阈值时，切换到下一个视频
        if (videoIndex < maxVideos) {
            videoIndex++;
            changeVideo();
        }
        scrollAccumulator = 0; // 重置累积量
    } else if (scrollAccumulator < -scrollThreshold) { // 当累积滚动量小于负的阈值时，切换到上一个视频
        if (videoIndex > 1) {
            videoIndex--;
            changeVideo();
        }
        scrollAccumulator = 0; // 重置累积量
    }
});
