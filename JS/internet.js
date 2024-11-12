var EventUtil = {
    addHandler: function (element, type, handler) {
        if (element.addEventListener) {
            element.addEventListener(type, handler, false);
        } else if (element.attachEvent) {
            element.attachEvent("on" + type, handler);
        } else {
            element["on" + type] = handler;
        }
    }
};

window.addEventListener('load', function() {
    const offlineNotification = document.getElementById('network-offline-notification');
    const onlineNotification = document.getElementById('network-online-notification');

    function showNotification(notification) {
        notification.classList.remove('hidden');
        notification.classList.add('visible');
        
        // 7秒后自动隐藏
        setTimeout(function() {
            notification.classList.remove('visible');
            notification.classList.add('hidden');
        }, 7000);
    }

    function checkOnlineStatus() {
        if (!navigator.onLine) {
            showNotification(offlineNotification);
        }
    }

    // 初始检查，仅在无网络连接时显示弹窗
    checkOnlineStatus();

    // 监听网络状态变化
    EventUtil.addHandler(window, "online", function() {
        showNotification(onlineNotification);
    });

    EventUtil.addHandler(window, "offline", function() {
        showNotification(offlineNotification);
    });
});