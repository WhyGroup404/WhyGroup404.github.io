function openTab(tabName) {
    var i, pages, tabs;
    pages = document.getElementsByClassName("page");
    for (i = 0; i < pages.length; i++) {
        pages[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");

    tabs = document.getElementsByClassName("tab");
    for (i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
    }
    event.currentTarget.classList.add("active");
}

function closeWindow() {
    var container = document.querySelector('.container');
    container.style.display = 'none';
}

function showSettings() {
    var container = document.querySelector('.container');
    container.style.display = 'flex';
}
function showCustomAlert() {
    document.getElementById("customAlert").style.display = "block";
  }
  
  function hideCustomAlert() {
    document.getElementById("customAlert").style.display = "none";
  }