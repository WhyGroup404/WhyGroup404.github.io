document.addEventListener("DOMContentLoaded", function() {
    var video = document.getElementById("myVideo");
    var speedBtn = document.getElementById("speedBtn");

    speedBtn.addEventListener("click", function() {
        var currentSpeed = video.playbackRate;
        if (currentSpeed === 1) {
            video.playbackRate = 1.5;
            this.innerText = "1.5x";
        } else if (currentSpeed === 1.5) {
            video.playbackRate = 2;
            this.innerText = "2x";
        } else if (currentSpeed === 2) {
            video.playbackRate = 5;
            this.innerText = "5x";
        } else if (currentSpeed === 5) {
            video.playbackRate = 10;
            this.innerText = "10x";
        } else if (currentSpeed === 10) {
            video.playbackRate = 0.5;
            this.innerText = "0.5x";
        } else {
            video.playbackRate = 1;
            this.innerText = "1x";
        }
        // 更新按钮颜色
        if (video.playbackRate!== 1) {
            this.classList.add("active");
        } else {
            this.classList.remove("active");
        }
    });
});