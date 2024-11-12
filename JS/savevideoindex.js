// 初始化变量
var video = document.getElementById("myVideo");
var source = video.getElementsByTagName("source")[0];
var videoIndex = 1;
var saveInterval = 10; // 每0.01秒（即10毫秒）保存一次

// 获取当前时间戳
var now = new Date().getTime();

// 获取上次保存的播放状态
var lastPlayedVideo = localStorage.getItem('lastPlayedVideo');
var lastPlayedTime = localStorage.getItem('lastPlayedTime');
var lastPlayedDate = localStorage.getItem('lastPlayedDate');

// 24小时内有效的时间
var oneDay = 24 * 60 * 60 * 1000;

// 自定义弹窗元素
var notificationPopup = document.getElementById("saveVideoNotification");
var notificationText = document.getElementById("notificationText");
var closeNotificationIcon = document.getElementById("closeNotificationIcon");
var jumpToVideoBtn = document.getElementById("jumpToVideoBtn");

// 显示上次播放提示的弹窗（只读取一天内的数据）
if (lastPlayedVideo && lastPlayedTime && lastPlayedDate && (now - lastPlayedDate) < oneDay) {
    notificationText.innerHTML = "上一次看到 Video " + lastPlayedVideo + "，时间 " + formatTime(lastPlayedTime);
    showNotification();
}

// 点击右上角箭头关闭弹窗
closeNotificationIcon.addEventListener("click", function () {
    hideNotification();
});

// 点击跳转按钮的事件
jumpToVideoBtn.addEventListener("click", function () {
    videoIndex = parseInt(lastPlayedVideo); // 跳转到上次播放的视频
    source.setAttribute("src", "files/video" + videoIndex + ".mp4"); // 设置视频源
    video.load(); // 加载新的视频
    video.play(); // 播放
    document.getElementById("currentVideoIndex").innerText = "" + videoIndex; // 更新状态栏中的视频序号
    hideNotification(); // 隐藏弹窗
});

// 每0.01秒保存一次视频状态和当前时间
setInterval(function () {
    localStorage.setItem('lastPlayedVideo', videoIndex);
    localStorage.setItem('lastPlayedTime', video.currentTime);
    localStorage.setItem('lastPlayedDate', new Date().getTime());
}, saveInterval);

// 自动隐藏弹窗
setTimeout(function () {
    hideNotification();
}, 7000); // 7秒后自动隐藏

// 显示弹窗函数
function showNotification() {
    notificationPopup.classList.add("show");
    setTimeout(function () {
        hideNotification();
    }, 7000); // 7秒后自动隐藏
}

// 隐藏弹窗函数
function hideNotification() {
    notificationPopup.classList.remove("show");
}

// 工具函数：格式化时间为 mm:ss
function formatTime(timeInSeconds) {
    var minutes = Math.floor(timeInSeconds / 60);
    var seconds = Math.floor(timeInSeconds % 60);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

