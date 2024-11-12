// 打开内置浏览器
function openInternalBrowser(url) {
    const browser = document.getElementById('internalBrowser');
    const iframe = document.getElementById('browserIframe');
    iframe.src = url;
    browser.style.display = 'block';
}

// 关闭内置浏览器
document.getElementById('closeBrowserBtn').addEventListener('click', function () {
    document.getElementById('internalBrowser').style.display = 'none';
    document.getElementById('browserIframe').src = 'about:blank';
    console.log("关闭内置浏览器");
});

// 全屏功能
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    const browser = document.getElementById('internalBrowser');
    browser.classList.toggle('fullscreen');
});

// 最小化功能
document.getElementById('minimizeBtn').addEventListener('click', function () {
    const browser = document.getElementById('internalBrowser');
    browser.classList.toggle('minimized');
});

// 拦截所有<a>标签的点击事件，使用内置浏览器打开链接
document.querySelectorAll('a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const url = this.href;
        openInternalBrowser(url);
    });
});
