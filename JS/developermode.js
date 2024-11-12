let clickCount = 0;
let clickTimeout;

function resetClickCount() {
    clickCount = 0;
}

// 显示开发者模式弹窗
document.querySelector('.tab.active').addEventListener('click', function() {
    clickCount++;
    clearTimeout(clickTimeout);
    clickTimeout = setTimeout(resetClickCount, 1000); // 重置点击计数

    if (clickCount >= 8) {
        toggleDeveloperModePopup(); // 显示开发者模式弹窗
    }
});

// 切换开发者模式弹窗显示状态
function toggleDeveloperModePopup() {
    const popup = document.getElementById('developerModePopup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
}

// 应用开发者模式设置
function applyDeveloperSettings() {
    const classicControls = document.getElementById('classicControlsCheckbox').checked;
    const classicAboutBtn = document.getElementById('classicAboutBtnCheckbox').checked;

    // 控制是否显示经典控制栏
    document.querySelector('.controls').style.display = classicControls ? 'flex' : 'none';
    
    // 控制是否显示经典关于按钮
    document.getElementById('aboutBtn').style.display = classicAboutBtn ? 'block' : 'none';

    // 如果启用经典控制栏，视频容器左侧空出70px，并隐藏Dock栏
    const videoContainer = document.querySelector('.video-container');
    if (classicControls) {
        videoContainer.style.left = '70px';  // 空出控制栏宽度
        hideDockBar();  // 隐藏Dock栏
    } else {
        videoContainer.style.left = '0';  // 复位视频容器
        showDockBar();  // 显示Dock栏
    }

    // 关闭开发者模式弹窗
    toggleDeveloperModePopup();
}


