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

    // ----- Show Step -----
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
    }

    // ----- Next Step -----
    window.nextStep = function() {
        if (currentStep === 1 && !nameInput.value.trim()) {
            showToast('⚠️ Please enter your name.', 'fa-exclamation-triangle', true);
            nameInput.focus();
            return;
        }
        if (currentStep === 4 && !messageInput.value.trim()) {
            showToast('⚠️ Please write a message.', 'fa-exclamation-triangle', true);
            messageInput.focus();
            return;
        }
        if (currentStep < totalSteps) {
            showStep(currentStep + 1);
        }
    };

    // ----- Previous Step -----
    window.prevStep = function() {
        if (currentStep > 1) {
            showStep(currentStep - 1);
        }
    };

    // ----- Toast -----
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

    // ----- Send via Vercel API (Secure - No Token in Frontend) -----
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
                console.error('API error:', data);
                showToast('❌ Error: ' + (data.error || 'Unknown'), 'fa-exclamation-triangle', true);
                return false;
            }
        } catch (err) {
            console.error('Network error:', err);
            showToast('⚠️ Network error. Please try again.', 'fa-exclamation-triangle', true);
            return false;
        }
    }

    // ----- Build Message -----
    function buildMessage() {
        const name = nameInput.value.trim() || 'Anonymous';
        const age = ageInput.value.trim() || 'Not specified';
        const city = cityInput.value.trim() || 'Not specified';
        const message = messageInput.value.trim() || '(No message)';

        return `<b>📩✨ New Secret Message</b>\n` +
               `━━━━━━━━━━━━━━━━━━━━\n` +
               `👤 <b>Name:</b> ${name}\n` +
               `📅 <b>Age:</b> ${age}\n` +
               `📍 <b>City:</b> ${city}\n` +
               `━━━━━━━━━━━━━━━━━━━━\n` +
               `💬 <b>Message:</b>\n${message}\n` +
               `━━━━━━━━━━━━━━━━━━━━\n` +
               `🕐 ${new Date().toLocaleString()}`;
    }

    // ----- Form Submit -----
    async function handleSubmit(e) {
        e.preventDefault();

        if (!messageInput.value.trim()) {
            showToast('⚠️ Please write a message.', 'fa-exclamation-triangle', true);
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = `<i class="fas fa-spinner fa-pulse"></i> Sending...`;

        const message = buildMessage();
        showToast('📤 Sending your secret message...', 'fa-paper-plane');

        const success = await sendToTelegram(message);

        if (success) {
            nameInput.value = '';
            ageInput.value = '';
            cityInput.value = '';
            messageInput.value = '';
            showStep(1);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Send Secret`;
    }

    // ----- Enter key support -----
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeStep = document.querySelector('.step.active');
            if (activeStep) {
                const stepNum = parseInt(activeStep.dataset.step);
                if (stepNum === 4) {
                    if (e.target === messageInput) {
                        form.dispatchEvent(new Event('submit'));
                    }
                } else {
                    if (e.target.tagName === 'INPUT') {
                        window.nextStep();
                    }
                }
            }
        }
    });

    // ----- Initialize -----
    showStep(1);
    form.addEventListener('submit', handleSubmit);

    setTimeout(() => {
        showToast('🔒 Secure & Anonymous', 'fa-shield-halved');
    }, 600);

})();
