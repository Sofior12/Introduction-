(function() {
    "use strict";

    let currentStep = 1;
    const totalSteps = 4;

    const form = document.getElementById('messageForm');
    const nameInput = document.getElementById('nameInput');
    const ageInput = document.getElementById('ageInput');
    const cityInput = document.getElementById('cityInput');
    const messageInput = document.getElementById('messageInput');
    const submitBtn = document.getElementById('submitBtn');
    const stepDisplay = document.getElementById('stepDisplay');
    const progressBar = document.getElementById('progressBar');
    const toastContainer = document.getElementById('toastContainer');

    // ===== SHOW STEP =====
    function showStep(step) {
        document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
        document.querySelector(`.step[data-step="${step}"]`).classList.add('active');

        document.querySelectorAll('.step-dot').forEach(el => {
            const s = parseInt(el.dataset.step);
            el.classList.remove('active', 'done');
            if (s === step) el.classList.add('active');
            else if (s < step) el.classList.add('done');
        });

        stepDisplay.textContent = step;
        progressBar.style.width = ((step / totalSteps) * 100) + '%';
        currentStep = step;

        const firstInput = document.querySelector(`.step[data-step="${step}"] input, .step[data-step="${step}"] textarea`);
        if (firstInput) {
            setTimeout(() => firstInput.focus(), 300);
        }
    }

    // ===== NEXT STEP =====
    window.nextStep = function() {
        if (currentStep === 1 && !nameInput.value.trim()) {
            showToast('⚠️ Please enter your name.', 'fa-exclamation-triangle', true);
            nameInput.focus();
            nameInput.parentElement.style.borderColor = '#ef4444';
            setTimeout(() => nameInput.parentElement.style.borderColor = '', 2000);
            return;
        }
        if (currentStep === 4 && !messageInput.value.trim()) {
            showToast('⚠️ Please write a message.', 'fa-exclamation-triangle', true);
            messageInput.focus();
            messageInput.parentElement.style.borderColor = '#ef4444';
            setTimeout(() => messageInput.parentElement.style.borderColor = '', 2000);
            return;
        }
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    };

    // ===== PREVIOUS STEP =====
    window.prevStep = function() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    };

    // ===== TOAST =====
    function showToast(message, icon = 'fa-check-circle', isError = false) {
        const toast = document.createElement('div');
        toast.className = 'toast ' + (isError ? 'error' : 'success');
        toast.innerHTML = `<i class="fas ${icon}"></i> ${message}`;
        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
        }, 5000);
    }

    // ===== SEND VIA API =====
    async function sendToTelegram(message) {
        try {
            const response = await fetch('/api/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });
            const data = await response.json();

            if (data.ok) {
                showToast('✨ Secret message sent successfully!', 'fa-check-circle');
                return true;
            } else {
                showToast('❌ ' + (data.error || 'Error'), 'fa-exclamation-triangle', true);
                return false;
            }
        } catch (err) {
            showToast('⚠️ Network error. Please try again.', 'fa-exclamation-triangle', true);
            return false;
        }
    }

    // ===== BUILD MESSAGE =====
    function buildMessage() {
        const name = nameInput.value.trim() || 'Anonymous';
        const age = ageInput.value.trim() || 'Not specified';
        const city = cityInput.value.trim() || 'Not specified';
        const message = messageInput.value.trim() || '(No message)';

        return `<b>📩 New Secret Message</b>\n` +
               `━━━━━━━━━━━━━━━━━━━━\n` +
               `👤 Name: ${name}\n` +
               `📅 Age: ${age}\n` +
               `📍 City: ${city}\n` +
               `━━━━━━━━━━━━━━━━━━━━\n` +
               `💬 Message:\n${message}\n` +
               `━━━━━━━━━━━━━━━━━━━━\n` +
               `🕐 ${new Date().toLocaleString()}`;
    }

    // ===== FORM SUBMIT =====
    async function handleSubmit(e) {
        e.preventDefault();

        if (!messageInput.value.trim()) {
            showToast('⚠️ Please write a message.', 'fa-exclamation-triangle', true);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> Sending...`;

        const message = buildMessage();
        const success = await sendToTelegram(message);

        if (success) {
            nameInput.value = '';
            ageInput.value = '';
            cityInput.value = '';
            messageInput.value = '';
            showStep(1);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Send Message`;
    }

    // ===== ENTER KEY =====
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeStep = document.querySelector('.step.active');
            if (activeStep) {
                const stepNum = parseInt(activeStep.dataset.step);
                if (stepNum === 4) {
                    if (e.target === messageInput) {
                        e.preventDefault();
                        form.dispatchEvent(new Event('submit'));
                    }
                } else {
                    if (e.target.tagName === 'INPUT') {
                        e.preventDefault();
                        window.nextStep();
                    }
                }
            }
        }
    });

    // ===== INIT =====
    showStep(1);
    form.addEventListener('submit', handleSubmit);

    setTimeout(() => {
        showToast('🌟 Step 1 of 4 · Enter your name', 'fa-info-circle');
    }, 600);

})();
