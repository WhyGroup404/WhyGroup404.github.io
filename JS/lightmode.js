
    function toggleTheme() {
        var isDarkMode = document.getElementById("themeToggle").checked;
        if (isDarkMode) {
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
        }
    }

    // 默认启用深色模式
    window.onload = function() {
        document.getElementById("themeToggle").checked = true;
    }

