// 获取视频元素
var video = document.getElementById("myVideo");

// 更新时间显示
function updateTimeDisplay() {
    // 获取当前播放时间和总时长
    var currentTime = Math.floor(video.currentTime);
    var totalTime = Math.floor(video.duration);
    
    // 格式化时间为“时:分:秒”
    function formatTime(time) {
        var hours = Math.floor(time / 3600);
        var minutes = Math.floor((time % 3600) / 60);
        var seconds = Math.floor(time % 60);
        return (hours < 10 ? "0" + hours : hours) + ":" + (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }
    
    // 更新显示
    var currentTimeDisplay = document.getElementById("currentTimeDisplay");
    var totalTimeDisplay = document.getElementById("totalTimeDisplay");
    currentTimeDisplay.textContent = formatTime(currentTime);
    totalTimeDisplay.textContent = formatTime(totalTime);
}

// 监听视频播放时间更新事件
video.addEventListener("timeupdate", updateTimeDisplay);

// 更新当前视频信息显示
function updateVideoInfo() {
    var currentVideoIndexDisplay = document.getElementById("currentVideoIndexDisplay");
    currentVideoIndexDisplay.textContent = "视频:";
    var currentVideoIndex = document.getElementById("currentVideoIndex");
    currentVideoIndex.textContent = "Video" + videoIndex;
}

// 调用更新当前视频信息显示函数
updateVideoInfo();
