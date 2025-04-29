document.addEventListener("DOMContentLoaded", () => {
    // Xử lý form đăng nhập
    const loginForm = document.querySelector('.login-form');
    const errorMessage = document.querySelector('.error-message');
    const modeSelect = document.querySelector('#mode');
    const passwordInput = document.querySelector('#password');

    if (loginForm && modeSelect && passwordInput) {
        console.log("Tìm thấy form đăng nhập");

        // Ẩn/hiện trường mật khẩu dựa trên chế độ
        modeSelect.addEventListener('change', () => {
            if (modeSelect.value === 'user') {
                passwordInput.style.display = 'none';
                passwordInput.removeAttribute('required');
            } else {
                passwordInput.style.display = 'block';
                passwordInput.setAttribute('required', '');
            }
        });

        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const mode = modeSelect.value;

            if (mode === 'host') {
                const password = passwordInput.value;
                if (password === '112233445566') {
                    sessionStorage.setItem('loginMode', 'host');
                    window.location.href = 'index.html'; // Chuyển thẳng đến index.html
                } else {
                    errorMessage.textContent = 'Mật khẩu Host không đúng';
                    errorMessage.style.display = 'block';
                    if (typeof gsap !== 'undefined') {
                        gsap.fromTo(errorMessage, { opacity: 0 }, { opacity: 1, duration: 0.3 });
                    }
                }
            } else if (mode === 'user') {
                // Tạo mã ngẫu nhiên 6 ký tự và thời gian phiên 3-7 phút
                const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const randomTime = Math.floor(Math.random() * (7 - 3 + 1)) + 3; // 3 đến 7 phút
                sessionStorage.setItem('loginMode', 'user');
                sessionStorage.setItem('loginCode', randomCode);
                sessionStorage.setItem('sessionEnd', Date.now() + randomTime * 60 * 1000);
                window.location.href = 'security.html';
            }
        });
    }

    // Kiểm tra phiên đăng nhập
    function checkSession() {
        const loginMode = sessionStorage.getItem('loginMode');
        const currentPage = window.location.pathname.split('/').pop();

        if (!loginMode && currentPage !== 'login.html') {
            window.location.href = 'login.html';
        } else if (loginMode === 'user' && currentPage !== 'security.html') {
            const sessionEnd = parseInt(sessionStorage.getItem('sessionEnd'));
            if (Date.now() > sessionEnd) {
                sessionStorage.clear();
                window.location.href = 'login.html';
            }
        }
    }

    checkSession();

    // Xử lý trang bảo mật
    const loginCodeDisplay = document.getElementById('login-code');
    const timeRemainingDisplay = document.getElementById('time-remaining');
    const logoutBtn = document.getElementById('logout-btn');

    if (loginCodeDisplay && timeRemainingDisplay && logoutBtn) {
        console.log("Tìm thấy các phần tử trang bảo mật");
        const loginCode = sessionStorage.getItem('loginCode') || 'N/A';
        loginCodeDisplay.textContent = loginCode;

        function updateTimer() {
            const sessionEnd = parseInt(sessionStorage.getItem('sessionEnd'));
            const timeLeft = sessionEnd - Date.now();
            if (timeLeft <= 0) {
                sessionStorage.clear();
                window.location.href = 'login.html';
            } else {
                const minutes = Math.floor(timeLeft / 1000 / 60);
                const seconds = Math.floor((timeLeft / 1000) % 60);
                timeRemainingDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }
        }

        updateTimer();
        setInterval(updateTimer, 1000);

        logoutBtn.addEventListener('click', () => {
            sessionStorage.clear();
            window.location.href = 'login.html';
        });

        // Hiệu ứng GSAP cho phần thông tin bảo mật
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.security-info', 
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }
    }
});