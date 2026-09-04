// ===== DOM Ready =====
document.addEventListener('DOMContentLoaded', function() {

    // ===== Navigation Highlight =====
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // ===== Animated Counter (if any .counter exists) =====
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target')) || 100;
        let count = 0;
        const step = Math.ceil(target / 60);
        const timer = setInterval(() => {
            count += step;
            if (count >= target) {
                count = target;
                clearInterval(timer);
            }
            counter.textContent = count.toLocaleString();
        }, 30);
    });

    // ===== Toast Notification System =====
    window.showToast = function(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            padding: 14px 32px;
            border-radius: 14px;
            background: rgba(0,0,0,0.85);
            backdrop-filter: blur(10px);
            color: #fff;
            font-weight: 600;
            z-index: 9999;
            border: 1px solid rgba(255,255,255,0.08);
            max-width: 90%;
            text-align: center;
            transition: opacity 0.4s;
            box-shadow: 0 8px 40px rgba(0,0,0,0.5);
        `;
        if (type === 'success') {
            toast.style.borderColor = 'rgba(0,255,100,0.3)';
            toast.style.color = '#7dffb3';
        } else if (type === 'error') {
            toast.style.borderColor = 'rgba(255,0,50,0.3)';
            toast.style.color = '#ff7d8a';
        }
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 400);
        }, 2800);
    };

    // ===== Secret Message Generator (for message.html) =====
    const secretForm = document.getElementById('secretForm');
    if (secretForm) {
        secretForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('senderName').value.trim() || 'Anonymous';
            const message = document.getElementById('secretMessage').value.trim();
            const color = document.getElementById('msgColor').value || '#ffd700';

            if (!message) {
                window.showToast('Please write a secret message!', 'error');
                return;
            }

            const output = document.getElementById('messageOutput');
            const secretText = document.getElementById('secretText');
            const senderDisplay = document.getElementById('senderDisplay');

            secretText.textContent = `"${message}"`;
            secretText.style.color = color;
            senderDisplay.textContent = `— ${name}`;
            output.classList.add('show');

            window.showToast('✨ Secret message sent!', 'success');
        });
    }

    // ===== City Selector (for city.html) =====
    const cityMessages = {
        'newyork': '🗽 The city that never sleeps — keep your dreams awake!',
        'london': '🎩 Mind the gap between who you are and who you can be.',
        'tokyo': '🌸 Even the smallest flower blooms in its own time.',
        'paris': '🥖 Love is the answer — what was the question?',
        'dubai': '🏙️ Aim for the sky, but build your foundation strong.',
        'mumbai': '🌊 Life is like the sea — sometimes calm, sometimes waves.',
        'berlin': '🎨 Be the artist of your own life story.',
        'sydney': '🏄 Ride the wave of opportunity when it comes.',
        'default': '🌍 Wherever you are, you are exactly where you need to be.'
    };

    const cityBtns = document.querySelectorAll('.city-btn');
    const cityMsgDisplay = document.getElementById('cityMessage');

    if (cityBtns.length && cityMsgDisplay) {
        cityBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                cityBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const city = this.getAttribute('data-city');
                const msg = cityMessages[city] || cityMessages['default'];
                cityMsgDisplay.textContent = msg;
                cityMsgDisplay.style.opacity = '0';
                setTimeout(() => {
                    cityMsgDisplay.style.opacity = '1';
                }, 50);
            });
        });
    }

    // ===== Age Checker (for age.html) =====
    const ageForm = document.getElementById('ageForm');
    if (ageForm) {
        ageForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const ageInput = document.getElementById('ageInput');
            const age = parseInt(ageInput.value);

            if (isNaN(age) || age < 1 || age > 120) {
                window.showToast('Please enter a valid age (1-120)', 'error');
                return;
            }

            const resultDiv = document.getElementById('ageResult');
            const ageDisplay = document.getElementById('ageDisplay');
            const ageStatus = document.getElementById('ageStatus');

            ageDisplay.textContent = age;

            if (age >= 18) {
                ageStatus.textContent = '✅ Access Granted — You are eligible!';
                ageStatus.className = 'age-status valid';
                window.showToast('🎉 Access granted!', 'success');
            } else {
                const yearsLeft = 18 - age;
                ageStatus.textContent = `🔒 Access Denied — Come back in ${yearsLeft} year${yearsLeft > 1 ? 's' : ''}!`;
                ageStatus.className = 'age-status invalid';
                window.showToast('⛔ Access denied', 'error');
            }

            resultDiv.style.display = 'block';
        });
    }

    // ===== Instagram-like Story (for instagram.html) =====
    const storyRings = document.querySelectorAll('.story-ring');
    storyRings.forEach(ring => {
        ring.addEventListener('click', function() {
            const msg = this.getAttribute('data-msg') || '🌟 Secret story!';
            const msgBox = document.getElementById('instaMessage');
            if (msgBox) {
                msgBox.textContent = msg;
                msgBox.style.color = '#ffd700';
                window.showToast('📸 Story viewed!', 'success');
            }
        });
    });

    // ===== Auto-hide flash messages =====
    const flashMessages = document.querySelectorAll('.flash-message');
    flashMessages.forEach(msg => {
        setTimeout(() => {
            msg.style.opacity = '0';
            setTimeout(() => msg.remove(), 400);
        }, 3000);
    });

    console.log('🌈 Secret Message · Colorful 2026 loaded!');
});
