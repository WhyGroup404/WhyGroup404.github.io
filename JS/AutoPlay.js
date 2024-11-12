 // 自动生成视频路径
 var videoIndex = 1;
 var video = document.getElementById("myVideo");
 var source = video.getElementsByTagName("source")[0];
 
 // 自动连播设置，默认开启
 var autoplayEnabled = true;
 
 function changeVideo() {
     source.setAttribute("src", "files/video" + videoIndex + ".mp4");
     video.load();
     video.play();
 
     // 更新状态栏显示当前视频序号
     document.getElementById("currentVideoIndex").innerText = "" + videoIndex;
 
         // 重置倍速按钮文本和样式
         var speedBtn = document.getElementById("speedBtn");
     video.playbackRate = 1; // 将播放速度重置为默认值
     speedBtn.innerText = "1x"; // 将按钮文本重置为默认值
     speedBtn.classList.remove("active"); // 移除按钮的活跃样式
 }
 
 // 监听播放结束事件
 video.addEventListener("ended", function() {
     // 如果自动连播功能开启且视频序号小于最大值，则切换到下一个视频
     if (autoplayEnabled && videoIndex < 10000) {
         videoIndex++;
         changeVideo();
     }
 });
 
 // 切换自动连播功能状态
 function toggleAutoplay() {
     autoplayEnabled = !autoplayEnabled;
 }