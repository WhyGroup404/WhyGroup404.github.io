let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();

function updateTime() {
    const clockElement = document.querySelector('.dock-bar .clock');
    const dateElement = document.querySelector('.dock-bar .date');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    const currentDate = now.toLocaleDateString(undefined, options);
    clockElement.textContent = `${hours}:${minutes}:${seconds}`;
    dateElement.textContent = currentDate;
}

function updateCalendar(month, year) {
    const calendarBody = document.getElementById('calendar-body');
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date().getDate();
    let date = 1;
    let html = '';

    const options = { year: 'numeric', month: 'long' };
    document.getElementById('current-month').textContent = new Date(year, month).toLocaleDateString(undefined, options);

    for (let i = 0; i < 6; i++) {
        let row = '<tr>';
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                row += '<td></td>';
            } else if (date > daysInMonth) {
                break;
            } else {
                const cellClass = date === today && month === new Date().getMonth() && year === new Date().getFullYear() ? 'today' : '';
                row += `<td class="${cellClass}">${date}</td>`;
                date++;
            }
        }
        row += '</tr>';
        html += row;
        if (date > daysInMonth) {
            break;
        }
    }
    calendarBody.innerHTML = html;
}

function updatePopupTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const currentDate = now.toLocaleDateString(undefined, options);

    document.getElementById('clock-large').textContent = `${hours}:${minutes}`;
    document.getElementById('date-large').textContent = currentDate;
}

document.getElementById('time').addEventListener('click', () => {
    const datePopup = document.getElementById('date-popup');
    const overlay = document.getElementById('overlay');

    if (datePopup.classList.contains('visible')) {
        datePopup.classList.remove('visible');
        overlay.classList.remove('visible');
    } else {
        updatePopupTime(); // 更新时钟和日期
        updateCalendar(currentMonth, currentYear);  // 更新日历
        datePopup.classList.add('visible');
        overlay.classList.add('visible');
    }
});

document.getElementById('overlay').addEventListener('click', () => {
    const datePopup = document.getElementById('date-popup');
    const overlay = document.getElementById('overlay');
    datePopup.classList.remove('visible');
    overlay.classList.remove('visible');
});

// 切换月份
document.getElementById('prev-month').addEventListener('click', () => {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    updateCalendar(currentMonth, currentYear);
});

document.getElementById('next-month').addEventListener('click', () => {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    updateCalendar(currentMonth, currentYear);
});

// 每0.01秒钟更新一次弹窗时钟
setInterval(updatePopupTime, 10);
setInterval(updateTime, 10);



// 搜索图标点击事件
document.getElementById('search-wrapper').addEventListener('click', function(event) {
event.stopPropagation(); // 阻止事件冒泡

const searchContainer = document.getElementById('search-container');
searchContainer.classList.toggle('visible');
});


setInterval(updateTime, 1000);
updateTime(); // 初始调用以立即显示时间

// 获取设置按钮元素
var settingsButton = document.querySelector('.settings-icon');

// 绑定点击事件
settingsButton.addEventListener('click', function() {
// 显示设置页面
showSettings();
});

// 获取上箭头按钮和下箭头按钮元素
var upButton = document.querySelector('.arrow-buttons button:nth-of-type(1)');
var downButton = document.querySelector('.arrow-buttons button:nth-of-type(2)');

// 绑定点击事件
upButton.addEventListener('click', function() {
if (videoIndex > 1) {
    videoIndex--;
    changeVideo();
}
});

downButton.addEventListener('click', function() {
if (videoIndex < 100000) {
    videoIndex++;
    changeVideo();
}
});