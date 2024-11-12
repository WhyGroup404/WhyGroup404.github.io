//2024/11/11 Version 8.2.5 Update
    // 用于记录最后点击时间戳的复杂变量名
    let favoriteLastClickTimestampForDetection = 0;
    const favoriteDoubleClickThresholdInMilliseconds = 1000; // 双击时间间隔阈值，单位毫秒

    // 创建并显示爱心图标的函数
    function createAndDisplayFavoriteIconAtPosition(clientXCoord, clientYCoord) {
      const favoriteIconElement = document.createElement("div");
      favoriteIconElement.classList.add("favorite-icon");
      favoriteIconElement.style.left = `${clientXCoord - 25}px`; // 设置横坐标，居中
      favoriteIconElement.style.top = `${clientYCoord - 25}px`; // 设置纵坐标，居中
      document.body.appendChild(favoriteIconElement);

      // 在动画结束后移除图标元素
      setTimeout(() => {
        favoriteIconElement.remove();
      }, 1000); // 动画持续1秒钟
    }

    // 处理点击或触摸事件的函数
    function handleTouchOrClickEvent(event) {
      const currentTimestampForEvent = Date.now();
      let touchOrClickXCoord, touchOrClickYCoord;

      // 获取触摸或点击的位置
      if (event.type === "click") {
        touchOrClickXCoord = event.clientX;
        touchOrClickYCoord = event.clientY;
      } else if (event.type === "touchstart") {
        // 触摸事件，获取触摸点的第一个位置
        touchOrClickXCoord = event.touches[0].clientX;
        touchOrClickYCoord = event.touches[0].clientY;
      }

      // 判断双击
      if (currentTimestampForEvent - favoriteLastClickTimestampForDetection <= favoriteDoubleClickThresholdInMilliseconds) {
        createAndDisplayFavoriteIconAtPosition(touchOrClickXCoord, touchOrClickYCoord); // 显示图标
      }

      // 更新最后点击时间戳
      favoriteLastClickTimestampForDetection = currentTimestampForEvent;
    }

    // 监听点击和触摸事件
    document.body.addEventListener("click", handleTouchOrClickEvent);
    document.body.addEventListener("touchstart", handleTouchOrClickEvent);