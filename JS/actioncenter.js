// 更新时间和日期
function actioncenterUpdateTimeAndDate() {
    const now = new Date();
    
    // 格式化时间（时:分:秒）
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    document.getElementById('actioncenterNowTime').innerText = `${hours}:${minutes}:${seconds}`;

    // 格式化日期
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    document.getElementById('actioncenterNowDate').innerText = `${year}-${month}-${day}`;
}

// 每1s更新一次时间和日期
setInterval(actioncenterUpdateTimeAndDate, 1000); // 更新频率改为1秒
actioncenterUpdateTimeAndDate(); // 页面加载时立即调用

// 防抖函数
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// 功能按钮关联逻辑
document.getElementById('actioncenterPrevVideo').addEventListener('click', function() {
    // 播放上一个视频
    document.getElementById('prevBtn').click(); // 触发页面中“上一个”按钮的点击事件
});

document.getElementById('actioncenterNextVideo').addEventListener('click', function() {
    // 播放下一个视频
    document.getElementById('nextBtn').click(); // 触发页面中“下一个”按钮的点击事件
});

// 操作中心搜索图标点击事件，触发Dock栏搜索功能
document.getElementById('actioncenterSearch').addEventListener('click', function(event) {
    event.stopPropagation(); // 阻止事件冒泡

    // 触发Dock栏搜索按钮的点击事件
    const dockSearchWrapper = document.getElementById('search-wrapper');
    
    if (dockSearchWrapper) {
        dockSearchWrapper.click(); // 模拟点击Dock栏的搜索图标
    } else {
        console.error('Dock栏搜索按钮不存在');
    }
});

// 隐藏操作中心的搜索框
function hideSearch() {
    const searchContainer = document.getElementById('search-container');
    searchContainer.style.display = 'none'; // 隐藏操作中心搜索框
}

// 点击空白区域收起搜索框和操作中心
document.addEventListener('click', function(event) {
    const actioncenterPanel = document.getElementById('actioncenterPanel');
    const searchContainer = document.getElementById('search-container');

    // 如果点击的区域不在操作中心和操作中心的搜索框内，则关闭操作中心和搜索框
    if (!actioncenterPanel.contains(event.target) && !searchContainer.contains(event.target)) {
        hideActionCenter(); // 收起操作中心
        hideSearch(); // 收起操作中心的搜索框
    }
});

document.getElementById('actioncenterSettings').addEventListener('click', function() {
    // 触发Dock栏上的设置按钮
    document.querySelector('.settings-icon').click(); // 模拟Dock栏设置按钮的点击事件
});

// 自动连播与视频质量优化选项
document.getElementById('actioncenterAutoplay').addEventListener('click', function() {
    const autoplayCheckbox = document.getElementById('autoplayCheckbox');
    autoplayCheckbox.checked = !autoplayCheckbox.checked;
    toggleAutoplay();
    updateOptionStatus('autoplayStatus', autoplayCheckbox.checked);
});

document.getElementById('actioncenterOptimizeVideo').addEventListener('click', function() {
    const optimizeCheckbox = document.getElementById('optimizeVideoQualityCheckbox');
    optimizeCheckbox.checked = !optimizeCheckbox.checked;
    toggleOptimizeQuality();
    updateOptionStatus('optimizeStatus', optimizeCheckbox.checked);
});

// 刷新选项
document.getElementById('actioncenterRefresh').addEventListener('click', function() {
    location.reload(); // 刷新页面
});

// 更新选项状态（显示已运行图标）
function updateOptionStatus(statusElementId, isEnabled) {
    const statusElement = document.getElementById(statusElementId);
    if (isEnabled) {
        statusElement.innerHTML = '✅ 已运行';
    } else {
        statusElement.innerHTML = ''; // 清空状态
    }
}
//2024。11.12 8.2.5Update 修复复选框不正常
document.addEventListener('DOMContentLoaded', function() {
    // 获取复选框元素
    const autoplayCheckbox = document.getElementById('autoplayCheckbox');
    const optimizeCheckbox = document.getElementById('optimizeVideoQualityCheckbox');

    // 更新选项状态
    updateOptionStatus('autoplayStatus', autoplayCheckbox ? autoplayCheckbox.checked : false);
    updateOptionStatus('optimizeStatus', optimizeCheckbox ? optimizeCheckbox.checked : false);
});
// 处理滑动手势和点击空白区域收起操作中心
let actioncenterTouchStartX = 0;
let actioncenterTouchEndX = 0;
const actioncenterPanel = document.getElementById('actioncenterPanel');

function actioncenterHandleGesture() {
    const swipeDistance = actioncenterTouchEndX - actioncenterTouchStartX; // 计算滑动距离

    if (swipeDistance < -200) { // 左滑超过200px，显示操作中心
        showActionCenter();
    } else if (swipeDistance > 200) { // 右滑超过200px，隐藏操作中心
        hideActionCenter();
    }
}

document.addEventListener('touchstart', function(event) {
    actioncenterTouchStartX = event.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', debounce(function(event) {
    actioncenterTouchEndX = event.changedTouches[0].screenX;
    actioncenterHandleGesture(); // 处理手势
}, 100), false); // 这里设置了100毫秒的防抖时间

// 显示操作中心
function showActionCenter() {
    actioncenterPanel.classList.add('visible'); // 展开操作中心
    document.getElementById('expandActionCenterBtn').style.display = 'none'; // 隐藏展开按钮
}

// 隐藏操作中心
function hideActionCenter() {
    actioncenterPanel.classList.remove('visible'); // 隐藏操作中心
    document.getElementById('expandActionCenterBtn').style.display = 'block'; // 显示展开按钮
}

// 为“隐藏操作中心”选项添加点击事件
document.getElementById('actioncenterHide').addEventListener('click', hideActionCenter);
