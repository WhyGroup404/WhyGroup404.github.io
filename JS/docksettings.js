function applyDockSettings() {
    // 控制搜索按钮的显示
    var toggleSearchBtn = document.getElementById("toggleSearchBtn").checked;
    var searchWrapper = document.getElementById("search-wrapper");
    searchWrapper.style.display = toggleSearchBtn ? "inline-block" : "none";

    // 控制上下切换按钮的显示
    var toggleSwitchBtn = document.getElementById("toggleSwitchBtn").checked;
    document.querySelector(".arrow-buttons").style.display = toggleSwitchBtn ? "flex" : "none";

    // 控制倍速按钮的显示
    var toggleSpeedBtn = document.getElementById("toggleSpeedBtn").checked;
    document.getElementById("speedBtn").style.display = toggleSpeedBtn ? "inline-block" : "none";

    // 控制音量按钮的显示
    var toggleVolumeBtn = document.getElementById("toggleVolumeBtn").checked;
    document.getElementById("volumeBtn").style.display = toggleVolumeBtn ? "inline-block" : "none";

    // 控制视频进度显示
    var toggleProgressBtn = document.getElementById("toggleProgressBtn").checked;
    document.querySelector(".time-display").style.display = toggleProgressBtn ? "flex" : "none";

    // 控制全屏按钮的显示
    var toggleFullscreenBtn = document.getElementById("toggleFullscreenBtn").checked;
    document.getElementById("fullscreen-btn").style.display = toggleFullscreenBtn ? "inline-block" : "none"

    // 控制日期与时间的显示
    var dateTimeDisplay = document.getElementById("dateTimeDisplay").value;
    var timeElement = document.querySelector(".time");
    if (dateTimeDisplay === "hideDateTime") {
        timeElement.classList.add("hidden"); // 隐藏时间和日期
    } else if (dateTimeDisplay === "showDateOnly") {
        timeElement.classList.remove("hidden");
        document.querySelector(".time .clock").style.display = "none"; // 仅显示日期
        document.querySelector(".time .date").style.display = "block";
    } else if (dateTimeDisplay === "showTimeOnly") {
        timeElement.classList.remove("hidden");
        document.querySelector(".time .clock").style.display = "block"; // 仅显示时间
        document.querySelector(".time .date").style.display = "none";
    } else {
        timeElement.classList.remove("hidden");
        document.querySelector(".time .clock").style.display = "block"; // 显示时间和日期
        document.querySelector(".time .date").style.display = "block";
    }

    // 自动隐藏 Dock 栏
    var autoHideDock = document.getElementById("autoHideDock").checked;
    if (autoHideDock) {
        hideDockBar();
    } else {
        showDockBar();
    }
}

function hideDockBar() {
    // 隐藏 Dock 栏并显示小三角形按钮，视频放大，同时显示浮窗
    document.querySelector(".dock-bar").classList.add("hidden");
    document.getElementById("showDockBtn").style.display = "block";
    document.querySelector(".video-container").classList.add("fullscreen");

    // 显示浮窗
    document.getElementById("floatingInfo").style.display = "block";
    updateFloatingInfo();
}

function showDockBar() {
    // 如果经典控制栏启用，弹出冲突提示
    const classicControlsEnabled = document.querySelector('.controls').style.display === 'flex';
    if (classicControlsEnabled) {
        showConflictPopup();  // 显示冲突弹窗
    } else {
        // 显示 Dock 栏并隐藏小三角形按钮，视频恢复原尺寸，同时隐藏浮窗
        document.querySelector(".dock-bar").classList.remove("hidden");
        document.getElementById("showDockBtn").style.display = "none";
        document.querySelector(".video-container").classList.remove("fullscreen");

        // 隐藏浮窗
        document.getElementById("floatingInfo").style.display = "none";
    }
}

function showConflictPopup() {
    const popup = document.getElementById('conflictPopup');
    popup.style.display = 'block';
}

function hideConflictPopup() {
    const popup = document.getElementById('conflictPopup');
    popup.style.display = 'none';
}

// 关闭 Dock 栏
function closeDock() {
    hideDockBar();  // 调用现有的隐藏 Dock 栏逻辑
    hideConflictPopup();  // 关闭冲突提示框
}

// 关闭经典控制栏
function closeClassicControls() {
    document.querySelector('.controls').style.display = 'none';  // 隐藏经典控制栏
    document.querySelector('.video-container').style.left = '0';  // 复位视频容器
    hideConflictPopup();  // 关闭冲突提示框
}

// 继续使用经典控制栏和Dock栏
function continueWithBoth() {
    hideConflictPopup();  // 关闭冲突提示框，继续使用两者
}

function updateFloatingInfo() {
    // 设置定时器，每0.001秒更新一次
    setInterval(function () {
        var videoIndex = document.getElementById("currentVideoIndex").innerText;
        var currentTime = document.getElementById("currentTimeDisplay").innerText;
        var totalTime = document.getElementById("totalTimeDisplay").innerText;

        document.getElementById("videoIndex").innerText = videoIndex;
        document.getElementById("currentTimeDisplayFloating").innerText = currentTime;
        document.getElementById("totalTimeDisplayFloating").innerText = totalTime;
    }, 1);
}


// 页面加载时，默认显示所有按钮和选项
window.onload = function() {
    applyDockSettings();
}
