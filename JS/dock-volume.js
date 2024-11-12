document.addEventListener("DOMContentLoaded", function() {
    var video = document.querySelector("video"); // 假设你的视频标签是 <video>
    var volumeBtn = document.getElementById("volumeBtn");
    var volumePopup = document.getElementById("volumePopup");
    var volumeSlider = document.getElementById("volumeSlider");
    var volumeIcon = document.getElementById("volumeIcon");
    var volumeValue = document.getElementById("volumeValue");

    // 初始音量设置为 0%
    video.muted = true;
    video.volume = 0;

    volumeBtn.addEventListener("click", function(event) {
        event.stopPropagation();
        var rect = volumeBtn.getBoundingClientRect();
        volumePopup.style.bottom = (window.innerHeight - rect.top + 10) + "px";
        volumePopup.style.left = (rect.left + (rect.width / 2) - 100) + "px"; // 调整左侧位置
        if (volumePopup.classList.contains("show")) {
            volumePopup.classList.remove("show");
            setTimeout(function() {
                volumePopup.style.display = "none";
            }, 300); // 等待动画结束后隐藏弹窗
        } else {
            volumePopup.style.display = "flex";
            setTimeout(function() {
                volumePopup.classList.add("show");
            }, 10); // 确保动画触发
        }
    });

    volumeSlider.addEventListener("input", function() {
        var volume = volumeSlider.value / 100;
        video.volume = volume;
        video.muted = volume === 0;
        volumeValue.textContent = Math.round(volume * 100) + "%";
        volumeSlider.style.setProperty('--value', volumeSlider.value + '%');

        if (volume === 0) {
            volumeBtn.querySelector("img").src = "png/mute.ico";
            volumeIcon.src = "png/mute.ico";
            volumeBtn.style.backgroundColor = "red"; // 静音时按钮底色为红色
        } else if (volume <= 0.25) {
            volumeBtn.querySelector("img").src = "png/volume-25.ico";
            volumeIcon.src = "png/volume-25.ico";
            volumeBtn.style.backgroundColor = ""; // 恢复正常颜色
        } else if (volume <= 0.50) {
            volumeBtn.querySelector("img").src = "png/volume-50.ico";
            volumeIcon.src = "png/volume-50.ico";
            volumeBtn.style.backgroundColor = ""; // 恢复正常颜色
        } else if (volume <= 0.75) {
            volumeBtn.querySelector("img").src = "png/volume-75.ico";
            volumeIcon.src = "png/volume-75.ico";
            volumeBtn.style.backgroundColor = ""; // 恢复正常颜色
        } else {
            volumeBtn.querySelector("img").src = "png/volume-100.ico";
            volumeIcon.src = "png/volume-100.ico";
            volumeBtn.style.backgroundColor = ""; // 恢复正常颜色
        }
    });

    // 点击空白处隐藏弹窗
    document.addEventListener("click", function(event) {
        if (!volumeBtn.contains(event.target) && !volumePopup.contains(event.target)) {
            if (volumePopup.classList.contains("show")) {
                volumePopup.classList.remove("show");
                setTimeout(function() {
                    volumePopup.style.display = "none";
                }, 300); // 等待动画结束后隐藏弹窗
            }
        }
    });

    // 阻止弹窗内的点击事件冒泡
    volumePopup.addEventListener("click", function(event) {
        event.stopPropagation();
    });
});
