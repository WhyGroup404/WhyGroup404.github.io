//2024/11/11 8.2.5Update
(function() {
    const fpsDisplay = document.getElementById('fpsDisplay'); // 获取 FPS 显示元素
    let lastFrameTime = performance.now(); // 上一帧的时间
    let frames = 0; // 渲染的帧数
    let fps = 0; // 当前 FPS
    let colorClass = ''; // 用于更新颜色的类名
    let lowFpsCount = 0; // 记录 FPS 低于 30 的次数

    // 更新 FPS
    function updateFPS() {
        const now = performance.now(); // 获取当前时间
        frames++; // 渲染帧数加一

        if (now - lastFrameTime >= 100) {  // 每 100 毫秒（0.1 秒）更新一次
            fps = Math.round((frames * 1000) / (now - lastFrameTime)); // 计算 FPS
            frames = 0; // 重置帧数
            lastFrameTime = now; // 更新上一帧的时间

            // 更新 FPS 显示
            fpsDisplay.textContent = `FPS: ${fps}`;

            // 根据 FPS 设置颜色
            if (fps < 20) {
                colorClass = 'fps-low';
                lowFpsCount++; // FPS 低于 20，计数增加
            } else if (fps < 40) {
                colorClass = 'fps-medium';
            } else {
                colorClass = 'fps-high';
            }

            // 更新 FPS 显示的颜色
            fpsDisplay.className = colorClass;
        }

        // 请求下一帧的更新
        requestAnimationFrame(updateFPS);
    }

    // 开始更新 FPS
    requestAnimationFrame(updateFPS);
})();
