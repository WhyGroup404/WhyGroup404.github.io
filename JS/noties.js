document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        var notificationBar = document.getElementById('notification-bar');
        notificationBar.classList.remove('hidden');

        setTimeout(function() {
            notificationBar.classList.add('hidden');
        }, 8000);
    }, 3000);
});
