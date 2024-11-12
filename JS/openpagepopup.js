document.addEventListener("DOMContentLoaded", function() {
    const popup = document.getElementById("openpage-popup");
    const closeButton = document.querySelector(".openpage-popup-close");
    const dontShowAgainCheckbox = document.getElementById("dont-show-again-checkbox");
    const countdownText = document.createElement("span");

    countdownText.id = "countdown";
    closeButton.appendChild(countdownText);

    // 检查本地存储中的标记
    const dontShowAgain = localStorage.getItem('dontShowAgain');
    if (dontShowAgain) {
        const now = new Date();
        const expireDate = new Date(parseInt(dontShowAgain));
        if (now < expireDate) {
            return; // 如果七天内不再弹出，则直接返回
        }
    }

    let countdown = 10;

    setTimeout(() => {
        popup.classList.add("show");
        closeButton.disabled = true;
        countdownText.textContent = ` (${countdown}s)`;  // 初始倒计时文本

        const countdownInterval = setInterval(() => {
            countdown--;
            countdownText.textContent = ` (${countdown}s)`;

            if (countdown <= 0) {
                clearInterval(countdownInterval);
                closeButton.disabled = false;
                countdownText.textContent = "";  // 移除倒计时文本
            }
        }, 1000);  // 每秒减少倒计时
    }, 500);  // 500ms 后显示弹窗

    // 监听复选框状态变化
    dontShowAgainCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // 设置七天后的过期时间
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 7);
            localStorage.setItem('dontShowAgain', expireDate.getTime().toString());
        } else {
            // 如果取消选中，移除本地存储中的标记
            localStorage.removeItem('dontShowAgain');
        }
    });
});

function closeOpenPagePopup(popupId) {
    const popup = document.getElementById(popupId);
    if (popup) {
        popup.classList.remove("show");
    }
}
