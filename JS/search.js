document.addEventListener('DOMContentLoaded', function() {
    // 搜索图标点击事件
    document.getElementById('search-wrapper').addEventListener('click', function(event) {
        event.stopPropagation(); // 阻止事件冒泡
        const searchContainer = document.getElementById('searchContainer');
        searchContainer.classList.toggle('visible'); // 切换可见性

        // 如果显示搜索框，聚焦输入框
        if (searchContainer.classList.contains('visible')) {
            document.getElementById('searchInput').focus();
        }
    });

    // 监听搜索框输入
    document.getElementById('searchInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            const searchValue = document.getElementById('searchInput').value.trim();
            const videoIndex = parseInt(searchValue);

            // 输入有效性检查
            if (isNaN(videoIndex) || videoIndex < 1 || videoIndex > 100000) {
                showAlert("无法检索您输入的数据，请输入有效的视频序号（1-100000），ErrorCode:SearchBox 7.0"); // 调用弹窗显示函数
            } else {
                changeVideoIndex(videoIndex); // 切换到指定视频
            }
        }
    });

    // 显示警告弹窗
    function showAlert(message) {
        const alertBox = document.getElementById('search-error'); // 使用新ID
        const alertMessage = document.getElementById('alertMessage');
        alertMessage.textContent = message; // 设置警告消息
        alertBox.style.display = 'block'; // 显示弹窗
    }

    // 关闭弹窗
    document.getElementById('closeAlert').addEventListener('click', function() {
        const alertBox = document.getElementById('search-error'); // 使用新ID
        alertBox.style.display = 'none'; // 隐藏弹窗
    });

    // 更改视频序号
    function changeVideoIndex(index) {
        videoIndex = index;
        changeVideo();
    }

    // 点击空白处关闭搜索框
    document.addEventListener('click', function(event) {
        const searchContainer = document.getElementById('searchContainer');
        if (!searchContainer.contains(event.target) && searchContainer.classList.contains('visible')) {
            searchContainer.classList.remove('visible'); // 隐藏搜索框
        }
    });
});
