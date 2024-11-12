document.addEventListener("DOMContentLoaded", function () {
    var searchWrapper = document.getElementById("search-wrapper");
    var searchIcon = document.getElementById("search-icon");
    var searchText = searchIcon.querySelector("span");  // 确保找到文本部分

    // 根据屏幕大小判断是否隐藏搜索文本
    function adjustSearchText() {
        if (window.innerWidth < 1510) {
            // 小屏设备隐藏文字
            searchText.classList.add("hide-text");
        } else {
            // 大屏设备显示文字
            searchText.classList.remove("hide-text");
        }
    }

    // 每0.01秒检查屏幕大小并调整文本显示状态
    setInterval(adjustSearchText, 10);  // 0.01秒 = 10毫秒

    // 页面加载时检查一次
    adjustSearchText();
});
