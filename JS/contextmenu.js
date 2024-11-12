document.addEventListener("contextmenu", function(event) {
    event.preventDefault(); // 阻止默认右键菜单的弹出

    // 获取右键菜单元素
    var contextMenu = document.getElementById("contextMenu");

    // 设置右键菜单的位置
    contextMenu.style.left = event.pageX + "px";
    contextMenu.style.top = event.pageY + "px";

    // 显示右键菜单并添加过渡效果
    contextMenu.classList.add("show");
});

document.addEventListener("click", function(event) {
    // 隐藏右键菜单并移除过渡效果
    var contextMenu = document.getElementById("contextMenu");
    contextMenu.classList.remove("show");
});

// 添加上一个视频、下一个视频和刷新的点击事件
document.getElementById("prevVideo").addEventListener("click", function() {
    if (videoIndex > 1) {
        videoIndex--;
        changeVideo();
    }
});

document.getElementById("nextVideo").addEventListener("click", function() {
    if (videoIndex < 10000) {
        videoIndex++;
        changeVideo();
    }
});

document.getElementById("refreshPage").addEventListener("click", function() {
    location.reload(); // 刷新页面
});

document.getElementById("versionOption").addEventListener("mouseout", function() {
    this.style.backgroundColor = ""; // 恢复默认背景色
});

document.getElementById("versionOption").addEventListener("click", function() {
    showSettings(); // 调用显示设置页面的函数
    openTab('about'); // 打开设置页面的关于部分
});


document.getElementById("prevStep").addEventListener("click", function() {
    history.back(); // 调用浏览器的后退功能
});

document.getElementById("nextStep").addEventListener("click", function() {
    window.location.href = '../index.html';// 转回黑猩主页
});
