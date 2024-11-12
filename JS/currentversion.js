// 当前版本信息
const currentVersion = '7.8.0'; 
const newFeatures = [
    '修复了若干已知问题。',
    '核心文件精简整理，运行更加快速高效。',
    '增强内核安全性。',
    '支持多语言切换功能。',
];

// 弹窗和相关元素
const modal = document.getElementById('uniqueVersionModal');
const versionTitle = document.getElementById('uniqueVersionTitle');
const versionDetails = document.getElementById('uniqueVersionDetails');
const versionFeatures = document.getElementById('uniqueVersionFeatures');
const closeModalBtn = document.getElementById('closeUniqueModalBtn');

// 从浏览器存储中获取版本信息
const savedVersion = localStorage.getItem('storedAppVersion');

// 检查是否是第一次访问或版本是否更新
if (!savedVersion) {
    // 第一次访问
    versionTitle.textContent = `欢迎使用！`;
    versionDetails.textContent = '感谢您使用Why视频！';
    displayFeatures(newFeatures);
    showModal();
    localStorage.setItem('storedAppVersion', currentVersion); // 存储当前版本
} else if (savedVersion !== currentVersion) {
    // 版本已更新
    versionTitle.textContent = `欢迎使用新版本 Version ${currentVersion}`;
    versionDetails.textContent = `本次更新内容：`;
    displayFeatures(newFeatures);
    showModal();
    localStorage.setItem('storedAppVersion', currentVersion); // 更新存储版本
}

// 展示弹窗
function showModal() {
    modal.style.display = 'flex';
}

// 关闭弹窗的动画效果
closeModalBtn.addEventListener('click', () => {
    modal.style.animation = 'modalFadeOut 0.5s ease-in-out';
    setTimeout(() => {
        modal.style.display = 'none';
        modal.style.animation = ''; // 重置动画
    }, 500);
});

// 显示新功能列表
function displayFeatures(features) {
    versionFeatures.innerHTML = ''; // 清空列表
    features.forEach((feature) => {
        const li = document.createElement('li');
        li.textContent = feature;
        versionFeatures.appendChild(li);
    });
}
