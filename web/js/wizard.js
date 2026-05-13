document.addEventListener("DOMContentLoaded", () => {
    const totalSteps = 5;
    const userId = "test_user_pwa";
    const apiBaseUrl = window.location.origin;
    let currentStep = 1;
    let currentGoal = null;
    let currentTasks = [];

    const form = document.getElementById("wizard-form");
    const appNav = document.getElementById("app-nav");
    const navButtons = document.querySelectorAll("[data-page-target]");
    const appPages = document.querySelectorAll(".app-page");
    const steps = document.querySelectorAll(".wizard-step");
    const btnNext = document.getElementById("btn-next");
    const btnBack = document.getElementById("btn-back");
    const btnCancelGoal = document.getElementById("btn-cancel-goal");
    const btnChangeGoal = document.getElementById("btn-change-goal");
    const progressBar = document.getElementById("progress-bar");
    const stepIndicator = document.getElementById("step-indicator");
    const stepTitle = document.getElementById("step-title");
    const reviewContent = document.getElementById("review-content");
    const loading = document.getElementById("loading");
    const wizardContainer = document.getElementById("wizard-container");
    const todoDashboard = document.getElementById("todo-dashboard");
    const todoList = document.getElementById("todo-list");
    const todoStatus = document.getElementById("todo-status");
    const dashboardGoalTitle = document.getElementById("dashboard-goal-title");
    const dashboardGoalMeta = document.getElementById("dashboard-goal-meta");
    const statsTotal = document.getElementById("stats-total");
    const statsCompleted = document.getElementById("stats-completed");
    const statsExp = document.getElementById("stats-exp");
    const settingsGoalSummary = document.getElementById("settings-goal-summary");
    const stepTitles = {
        1: "Goal",
        2: "Baseline",
        3: "Deadline",
        4: "Time Budget",
        5: "Review"
    };

    const formData = {};

    function escapeHtml(value) {
        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#39;");
    }

    function updateUI() {
        steps.forEach((step) => {
            const stepNum = Number.parseInt(step.dataset.step, 10);
            step.classList.toggle("hidden", stepNum !== currentStep);
        });

        const progress = (currentStep / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        stepIndicator.textContent = `Step ${currentStep} of ${totalSteps}`;
        stepTitle.textContent = stepTitles[currentStep];

        if (currentStep === 1) {
            btnBack.classList.add("hidden");
            btnNext.classList.add("ml-auto");
        } else {
            btnBack.classList.remove("hidden");
            btnNext.classList.remove("ml-auto");
        }

        btnNext.textContent = currentStep === totalSteps ? "Generate ToDos" : "Next";

        if (currentStep === totalSteps) {
            populateReview();
        }
    }

    function populateReview() {
        reviewContent.innerHTML = `
            <p><strong class="text-white">Goal:</strong> ${escapeHtml(formData.long_term_goal || "-")}</p>
            <p><strong class="text-white">Baseline:</strong> ${escapeHtml(formData.baseline || "-")}</p>
            <p><strong class="text-white">Deadline:</strong> ${escapeHtml(formData.deadline || "-")}</p>
            <p><strong class="text-white">Weekdays:</strong> ${escapeHtml(formData.daily_time_weekday || 0)} mins</p>
            <p><strong class="text-white">Weekends:</strong> ${escapeHtml(formData.daily_time_weekend || 0)} mins</p>
        `;
    }

    function collectData() {
        const currentInputs = document
            .querySelector(`.wizard-step[data-step="${currentStep}"]`)
            .querySelectorAll("input, textarea");
        currentInputs.forEach((input) => {
            formData[input.name] = input.value;
        });
    }

    function validate() {
        if (currentStep === 1 && !document.querySelector('input[name="long_term_goal"]').value.trim()) {
            return false;
        }
        if (currentStep === 3 && !document.querySelector('input[name="deadline"]').value) {
            return false;
        }
        return true;
    }

    function setLoadingState(isLoading) {
        loading.classList.toggle("hidden", !isLoading);
        btnNext.disabled = isLoading;
        btnBack.disabled = isLoading;
        btnCancelGoal.disabled = isLoading;
    }

    function showPage(pageName) {
        appPages.forEach((page) => {
            page.classList.toggle("hidden", page.dataset.page !== pageName);
        });

        appNav.classList.toggle("hidden", !currentGoal);
        navButtons.forEach((button) => {
            button.classList.toggle("is-active", button.dataset.pageTarget === pageName);
        });

        if (pageName === "settings") {
            renderSettings();
        }

        document.getElementById("main-content").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function showWizard({ allowCancel = false } = {}) {
        btnCancelGoal.classList.toggle("hidden", !allowCancel);
        showPage("setup");
    }

    function showDashboard() {
        showPage("quests");
    }

    function renderSettings() {
        if (!currentGoal) {
            settingsGoalSummary.textContent = "No goal yet.";
            return;
        }

        settingsGoalSummary.textContent = `${currentGoal.long_term_goal || "Untitled goal"} • Deadline: ${currentGoal.deadline || "-"}`;
    }

    function renderDashboard(goal, tasks) {
        currentGoal = goal;
        currentTasks = Array.isArray(tasks) ? tasks : [];

        const completedCount = currentTasks.filter((task) => task.completed).length;
        const pendingTasks = currentTasks.filter((task) => !task.completed);
        const expReady = pendingTasks.reduce((sum, task) => sum + (task.xp_reward || 0), 0);

        dashboardGoalTitle.textContent = goal.long_term_goal || "Your Quest";
        dashboardGoalMeta.textContent = `Deadline: ${goal.deadline || "-"} • Weekdays ${goal.daily_time_weekday || 0} min • Weekends ${goal.daily_time_weekend || 0} min`;
        statsTotal.textContent = String(currentTasks.length);
        statsCompleted.textContent = String(completedCount);
        statsExp.textContent = String(expReady);
        todoStatus.textContent = currentTasks.length ? `${pendingTasks.length} quests left today` : "No tasks generated yet";
        renderSettings();

        if (!currentTasks.length) {
            todoList.innerHTML = `
                <article class="empty-card">
                    <p class="text-white font-semibold">No ToDos found.</p>
                    <p class="text-slate-400 text-sm mt-2">The goal was saved, but no ToDos were returned yet.</p>
                </article>
            `;
            return;
        }

        todoList.innerHTML = currentTasks
            .map((task) => {
                const completeLabel = task.completed ? "Completed" : "Complete";
                return `
                    <article class="todo-card ${task.completed ? "is-complete" : ""}">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h4 class="text-base font-semibold text-white">${escapeHtml(task.title)}</h4>
                                    <span class="difficulty-badge difficulty-${task.difficulty}">Difficulty ${escapeHtml(task.difficulty)}</span>
                                </div>
                                <p class="text-slate-300 text-sm mt-2">${escapeHtml(task.description || "No description")}</p>
                                <p class="text-amber-300 text-sm mt-3 font-semibold">+${escapeHtml(task.xp_reward || 0)} EXP</p>
                            </div>
                            <button
                                type="button"
                                class="todo-action"
                                data-task-id="${escapeHtml(task.id)}"
                                ${task.completed ? "disabled" : ""}
                            >
                                ${completeLabel}
                            </button>
                        </div>
                    </article>
                `;
            })
            .join("");
    }

    async function fetchTasks(goalId) {
        const response = await fetch(`${apiBaseUrl}/tasks/${encodeURIComponent(userId)}?goal_id=${encodeURIComponent(goalId)}`);
        if (!response.ok) {
            throw new Error("Failed to fetch tasks");
        }
        return response.json();
    }

    async function submitGoal() {
        const payload = {
            user_id: userId,
            long_term_goal: formData.long_term_goal,
            baseline: formData.baseline,
            deadline: formData.deadline,
            daily_time_weekday: Number.parseInt(formData.daily_time_weekday, 10) || 0,
            daily_time_weekend: Number.parseInt(formData.daily_time_weekend, 10) || 0
        };

        setLoadingState(true);
        btnNext.textContent = "Generating...";

        try {
            const response = await fetch(`${apiBaseUrl}/goals/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error("Failed to accept quest");
            }

            const goal = await response.json();
            renderDashboard(goal, []);
            showDashboard();

            let tasks = [];
            try {
                tasks = await fetchTasks(goal.id);
            } catch (taskError) {
                console.error(taskError);
                todoStatus.textContent = "Goal saved, but ToDos could not be loaded";
                return;
            }

            renderDashboard(goal, tasks);
        } catch (error) {
            console.error(error);
            alert("Failed to generate ToDos. Check the backend connection and try again.");
        } finally {
            setLoadingState(false);
            btnNext.textContent = "Generate ToDos";
        }
    }

    async function completeTask(taskId) {
        try {
            const response = await fetch(`${apiBaseUrl}/tasks/${encodeURIComponent(taskId)}/complete`, {
                method: "PATCH"
            });

            if (!response.ok) {
                throw new Error("Failed to complete task");
            }

            const updatedTask = await response.json();
            const nextTasks = currentTasks.map((task) => task.id === updatedTask.id ? updatedTask : task);
            renderDashboard(currentGoal, nextTasks);
        } catch (error) {
            console.error(error);
            alert("Could not mark the task as complete.");
        }
    }

    btnNext.addEventListener("click", async () => {
        collectData();

        if (!validate()) {
            alert("Please fill in the required fields.");
            return;
        }

        if (currentStep < totalSteps) {
            currentStep += 1;
            updateUI();
            return;
        }

        await submitGoal();
    });

    btnBack.addEventListener("click", () => {
        if (currentStep > 1) {
            currentStep -= 1;
            updateUI();
        }
    });

    btnCancelGoal.addEventListener("click", () => {
        if (currentGoal) {
            showDashboard();
        }
    });

    btnChangeGoal.addEventListener("click", () => {
        currentStep = 1;
        Object.keys(formData).forEach((key) => delete formData[key]);
        form.reset();
        updateUI();
        showWizard({ allowCancel: Boolean(currentGoal) });
    });

    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            showPage(button.dataset.pageTarget);
        });
    });

    todoList.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-task-id]");
        if (!button || button.disabled) {
            return;
        }
        button.disabled = true;
        await completeTask(button.dataset.taskId);
    });

    updateUI();
    showWizard();
});
