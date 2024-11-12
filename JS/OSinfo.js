function WhyDetermineDeviceType() {
    const whyUserAgentString = navigator.userAgent.toLowerCase();
    if (whyUserAgentString.includes('mobile') || 
        whyUserAgentString.includes('android') || 
        whyUserAgentString.includes('iphone') || 
        whyUserAgentString.includes('ipad') || 
        whyUserAgentString.includes('windows phone') || 
        whyUserAgentString.includes('blackberry') || 
        whyUserAgentString.includes('webos')) {
        return 'Mobile';
    } else {
        return 'PC';
    }
}

function WhyDetermineOperatingSystem() {
    const whyUserAgentString = navigator.userAgent;
    let whyOperatingSystem = 'Unknown OS';

    if (whyUserAgentString.includes('Windows NT 10.0')) {
        whyOperatingSystem = 'Windows 10';
    } else if (whyUserAgentString.includes('Windows NT 6.3')) {
        whyOperatingSystem = 'Windows 8.1';
    } else if (whyUserAgentString.includes('Windows NT 6.2')) {
        whyOperatingSystem = 'Windows 8';
    } else if (whyUserAgentString.includes('Windows NT 6.1')) {
        whyOperatingSystem = 'Windows 7';
    } else if (whyUserAgentString.includes('Windows NT 6.0')) {
        whyOperatingSystem = 'Windows Vista';
    } else if (whyUserAgentString.includes('Windows NT 5.2')) {
        whyOperatingSystem = 'Windows Server 2003 / XP x64';
    } else if (whyUserAgentString.includes('Windows NT 5.1')) {
        whyOperatingSystem = 'Windows XP';
    } else if (whyUserAgentString.includes('Windows NT 5.0')) {
        whyOperatingSystem = 'Windows 2000';
    } else if (whyUserAgentString.includes('Windows NT 4.0')) {
        whyOperatingSystem = 'Windows NT 4.0';
    } else if (whyUserAgentString.includes('Windows 98') || 
               whyUserAgentString.includes('Win98')) {
        whyOperatingSystem = 'Windows 98';
    } else if (whyUserAgentString.includes('Windows 95') || 
               whyUserAgentString.includes('Win95')) {
        whyOperatingSystem = 'Windows 95';
    } else if (whyUserAgentString.includes('Mac OS X')) {
        whyOperatingSystem = 'macOS';
    } else if (whyUserAgentString.includes('Android')) {
        whyOperatingSystem = 'Android';
    } else if (whyUserAgentString.includes('Linux')) {
        whyOperatingSystem = 'Linux';
    } else if (whyUserAgentString.includes('iPhone') || 
               whyUserAgentString.includes('iPad')) {
        whyOperatingSystem = 'iOS';
    } else if (whyUserAgentString.includes('HarmonyOS')) {
        whyOperatingSystem = 'HarmonyOS';
    }

    return whyOperatingSystem;
}

function WhyDetermineBrowser() {
    const whyUserAgentString = navigator.userAgent;
    let whyBrowserName = 'Unknown Browser';
    let whyBrowserVersion = 'Unknown Version';

    if (whyUserAgentString.includes('Edg/')) {
        whyBrowserName = 'Edge (Chromium)';
        whyBrowserVersion = whyUserAgentString.match(/Edg\/([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('Edge/')) {
        whyBrowserName = 'Edge';
        whyBrowserVersion = whyUserAgentString.match(/Edge\/([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('Chrome/')) {
        whyBrowserName = 'Chrome';
        whyBrowserVersion = whyUserAgentString.match(/Chrome\/([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('Firefox/')) {
        whyBrowserName = 'Firefox';
        whyBrowserVersion = whyUserAgentString.match(/Firefox\/([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('360SE')) {
        whyBrowserName = '360 Browser';
        whyBrowserVersion = whyUserAgentString.match(/360SE\/([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('MSIE ')) {
        whyBrowserName = 'Internet Explorer';
        whyBrowserVersion = whyUserAgentString.match(/MSIE ([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('Trident/')) {
        whyBrowserName = 'Internet Explorer';
        whyBrowserVersion = whyUserAgentString.match(/rv:([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('QQBrowser')) {
        whyBrowserName = 'QQ Browser';
        whyBrowserVersion = whyUserAgentString.match(/QQBrowser\/([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('MicroMessenger')) {
        whyBrowserName = 'WeChat Browser';
        whyBrowserVersion = whyUserAgentString.match(/MicroMessenger\/([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('Opera/')) {
        whyBrowserName = 'Opera';
        whyBrowserVersion = whyUserAgentString.match(/Opera\/([0-9._]+)/)[1];
    } else if (whyUserAgentString.includes('Safari')) {
        whyBrowserName = 'Safari';
        whyBrowserVersion = whyUserAgentString.match(/Version\/([0-9._]+)/)[1];
    }

    return `${whyBrowserName} ${whyBrowserVersion}`;
}

function displaySystemInfo() {
    document.getElementById('whyDeviceType').textContent = WhyDetermineDeviceType();
    document.getElementById('whyOSVersion').textContent = WhyDetermineOperatingSystem();
    document.getElementById('whyBrowserDetails').textContent = WhyDetermineBrowser();
}

displaySystemInfo();