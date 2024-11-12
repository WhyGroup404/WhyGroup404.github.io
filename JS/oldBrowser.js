function detectBrowser() {
    var ua = window.navigator.userAgent;
    var browserInfo = {
        ie: null,
        firefox: null,
        chromium: null
    };

    // 检测 IE 浏览器
    if (ua.indexOf('MSIE ') > -1) {
        browserInfo.ie = ua.match(/MSIE ([0-9]+)/)[1];
    } else if (ua.indexOf('Trident/') > -1) {
        browserInfo.ie = ua.match(/rv:([0-9]+)/)[1];
    }

    // 检测 Chromium 浏览器
    var chromeMatch = ua.match(/Chrome\/([0-9]+)/);
    if (chromeMatch) {
        browserInfo.chromium = chromeMatch[1];
    }

    // 检测 Firefox 浏览器
    var firefoxMatch = ua.match(/Firefox\/([0-9]+)/);
    if (firefoxMatch) {
        browserInfo.firefox = firefoxMatch[1];
    }

    return browserInfo;
}

function showPopup(popupId) {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById(popupId).style.display = 'block';
}

function closePopup(popupId) {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById(popupId).style.display = 'none';
}

function confirmContinue() {
    if (confirm("确定要继续使用旧浏览器访问吗？如果使用不正常，后续你可以在右键菜单>设置中切换版本")) {
        closePopup('ie-popup');
        closePopup('upgrade-popup');
    }
}

function handleUpgradeClick(browser) {
    var urls = {
        chrome: 'https://www.google.com/chrome/',
        edge: 'https://www.microsoft.com/edge',
        firefox: 'https://www.mozilla.org/firefox/'
    };
    window.location.href = urls[browser];
}

function displayBrowserVersion() {
    var info = detectBrowser();
    var versionText = '当前浏览器版本：';

    if (info.ie) {
        versionText += 'IE ' + info.ie + ' ';
    }
    if (info.chromium) {
        versionText += 'Chrome ' + info.chromium + ' ';
    }
    if (info.firefox) {
        versionText += 'Firefox ' + info.firefox + ' ';
    }
    if (!info.ie && !info.chromium && !info.firefox) {
        versionText += '未知';
    }

    document.getElementById('browser-version').innerText = versionText;
}

function displayUpgradeVersion() {
    var info = detectBrowser();
    var versionText = '您的浏览器版本：';

    if (info.chromium) {
        versionText += 'Chrome ' + info.chromium + ' ';
    }
    if (info.firefox) {
        versionText += 'Firefox ' + info.firefox + ' ';
    }

    document.getElementById('upgrade-version').innerText = versionText;
}

function checkBrowser() {
    var info = detectBrowser();
    var isOldBrowser = info.ie || (info.chromium && parseInt(info.chromium) < 69) || (info.firefox && parseInt(info.firefox) < 75);
    var isOlderButNotTooOld = (info.chromium && parseInt(info.chromium) >= 70 && parseInt(info.chromium) < 90) || (info.firefox && parseInt(info.firefox) >= 70 && parseInt(info.firefox) < 90);

    if (isOldBrowser) {
        displayBrowserVersion();
        showPopup('ie-popup');
    } else if (isOlderButNotTooOld) {
        displayUpgradeVersion();
        showPopup('upgrade-popup');
    }
}

document.querySelector('.close-btn').addEventListener('click', function() {
    closePopup('upgrade-popup');
});

document.getElementById('ver6.5.1').addEventListener('click', function() {
    window.location.href = 'oldui/index.html';
});

document.getElementById('ver5.8.10').addEventListener('click', function() {
    window.location.href = 'classicui/index.html';
});

document.getElementById('chrome-upgrade').addEventListener('click', function() {
    handleUpgradeClick('chrome');
});

document.getElementById('edge-upgrade').addEventListener('click', function() {
    handleUpgradeClick('edge');
});

document.getElementById('firefox-upgrade').addEventListener('click', function() {
    handleUpgradeClick('firefox');
});

document.getElementById('skip-upgrade').addEventListener('click', function() {
    closePopup('upgrade-popup');
});

document.addEventListener('DOMContentLoaded', function() {
    checkBrowser();
});