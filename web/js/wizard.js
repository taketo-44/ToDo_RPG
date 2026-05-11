document.addEventListener('DOMContentLoaded', () => {
    const totalSteps = 5;
    let currentStep = 1;

    // Elements
    const form = document.getElementById('wizard-form');
    const steps = document.querySelectorAll('.wizard-step');
    const btnNext = document.getElementById('btn-next');
    const btnBack = document.getElementById('btn-back');
    const progressBar = document.getElementById('progress-bar');
    const stepIndicator = document.getElementById('step-indicator');
    const stepTitle = document.getElementById('step-title');
    const stepTitles = {
        1: "Goal",
        2: "Baseline",
        3: "Deadline",
        4: "Time Budget",
        5: "Review"
    };

    // State
    const formData = {};

    function updateUI() {
        // Show/Hide Steps
        steps.forEach(step => {
            const stepNum = parseInt(step.dataset.step);
            if (stepNum === currentStep) {
                step.classList.remove('hidden');
            } else {
                step.classList.add('hidden');
            }
        });

        // Update Progress
        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        stepIndicator.textContent = `Step ${currentStep} of ${totalSteps}`;
        stepTitle.textContent = stepTitles[currentStep];

        // Buttons
        if (currentStep === 1) {
            btnBack.classList.add('hidden');
            btnNext.classList.add('ml-auto');
        } else {
            btnBack.classList.remove('hidden');
            btnNext.classList.remove('ml-auto');
        }

        if (currentStep === totalSteps) {
            btnNext.textContent = 'Submit Quest';
            populateReview();
        } else {
            btnNext.textContent = 'Next';
        }
    }

    function populateReview() {
        const reviewContent = document.getElementById('review-content');
        reviewContent.innerHTML = `
            <p><strong class="text-white">Goal:</strong> ${formData.long_term_goal || '-'}</p>
            <p><strong class="text-white">Baseline:</strong> ${formData.baseline || '-'}</p>
            <p><strong class="text-white">Deadline:</strong> ${formData.deadline || '-'}</p>
            <p><strong class="text-white">Weekdays:</strong> ${formData.daily_time_weekday} mins</p>
            <p><strong class="text-white">Weekends:</strong> ${formData.daily_time_weekend} mins</p>
        `;
    }

    function collectData() {
        const currentInputs = document.querySelector(`.wizard-step[data-step="${currentStep}"]`).querySelectorAll('input, textarea');
        currentInputs.forEach(input => {
            formData[input.name] = input.value;
        });
    }

    function validate() {
        if (currentStep === 1 && !document.querySelector('input[name="long_term_goal"]').value.trim()) return false;
        if (currentStep === 3 && !document.querySelector('input[name="deadline"]').value) return false;
        return true;
    }

    btnNext.addEventListener('click', async () => {
        collectData();

        if (!validate()) {
            alert('Please fill in the required fields.');
            return;
        }

        if (currentStep < totalSteps) {
            currentStep++;
            updateUI();
        } else {
            // Submit
            await submitGoal();
        }
    });

    btnBack.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateUI();
        }
    });

    async function submitGoal() {
        const payload = {
            user_id: "test_user_pwa", // Temporary hardcoded ID
            long_term_goal: formData.long_term_goal,
            baseline: formData.baseline,
            deadline: formData.deadline,
            daily_time_weekday: parseInt(formData.daily_time_weekday) || 0,
            daily_time_weekend: parseInt(formData.daily_time_weekend) || 0
        };

        btnNext.disabled = true;
        btnNext.textContent = "Summoning...";

        try {
            const response = await fetch('http://localhost:8000/goals/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const result = await response.json();
                alert('Quest Accepted! Goal ID: ' + result.id);
                // Reset or Redirect
                currentStep = 1;
                updateUI();
                form.reset();
            } else {
                alert('Failed to accept quest.');
            }
        } catch (e) {
            console.error(e);
            alert('Connection lost. Please try again.');
        } finally {
            btnNext.disabled = false;
        }
    }
});
