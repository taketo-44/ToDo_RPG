document.addEventListener("DOMContentLoaded", () => {
    const totalSteps = 6;
    const userId = "test_user_pwa";
    const apiBaseUrl = window.location.origin;
    let currentStep = 1;
    let currentGoal = null;
    let currentTasks = [];
    let currentLanguage = localStorage.getItem("todoRpgLanguage") || "en";
    let userSettings = loadUserSettings();

    const form = document.getElementById("wizard-form");
    const appNav = document.getElementById("app-nav");
    const navButtons = document.querySelectorAll("[data-page-target]");
    const appPages = document.querySelectorAll(".app-page");
    const steps = document.querySelectorAll(".wizard-step");
    const btnNext = document.getElementById("btn-next");
    const btnBack = document.getElementById("btn-back");
    const btnCancelGoal = document.getElementById("btn-cancel-goal");
    const btnChangeGoal = document.getElementById("btn-change-goal");
    const languageSetting = document.getElementById("language-setting");
    const autoGenTime = document.getElementById("auto-gen-time");
    const situationList = document.getElementById("situation-list");
    const newSituation = document.getElementById("new-situation");
    const btnAddSituation = document.getElementById("btn-add-situation");
    const holidayModeSummary = document.getElementById("holiday-mode-summary");
    const holidayDays = document.getElementById("holiday-days");
    const btnApplyHoliday = document.getElementById("btn-apply-holiday");
    const btnClearHoliday = document.getElementById("btn-clear-holiday");
    const progressBar = document.getElementById("progress-bar");
    const stepIndicator = document.getElementById("step-indicator");
    const stepTitle = document.getElementById("step-title");
    const reviewContent = document.getElementById("review-content");
    const loading = document.getElementById("loading");
    const todoList = document.getElementById("todo-list");
    const todoStatus = document.getElementById("todo-status");
    const dashboardGoalTitle = document.getElementById("dashboard-goal-title");
    const dashboardGoalMeta = document.getElementById("dashboard-goal-meta");
    const statsTotal = document.getElementById("stats-total");
    const statsCompleted = document.getElementById("stats-completed");
    const statsExp = document.getElementById("stats-exp");
    const settingsGoalSummary = document.getElementById("settings-goal-summary");
    const translations = {
        en: {
            appEyebrow: "Quest Planner",
            appSubtitle: "Turn one long-term goal into a week of executable quests.",
            navQuests: "Quests",
            navHome: "Home",
            navGuild: "Guild",
            navSettings: "Settings",
            loading: "Loading...",
            language: "Language",
            languageQuestion: "Choose your language",
            goal: "Goal",
            goalQuestion: "What is your long-term goal?",
            goalPlaceholder: "e.g. Master Python, Lose 5kg",
            baseline: "Baseline",
            baselineQuestion: "Where are you starting from?",
            baselinePlaceholder: "e.g. Can write basic scripts, 75kg",
            deadline: "Deadline",
            deadlineQuestion: "When do you want to achieve this?",
            timeBudget: "Time Budget",
            timeBudgetQuestion: "Daily Time Budget (minutes)",
            weekdays: "Weekdays",
            weekends: "Weekends",
            review: "Review",
            reviewTitle: "Review Your Quest",
            back: "Back",
            cancel: "Cancel",
            next: "Next",
            generateTodos: "Generate ToDos",
            generating: "Generating...",
            stepIndicator: "Step {current} of {total}",
            questsEyebrow: "Quests",
            plannedQuests: "Planned quests",
            completed: "Completed",
            expReady: "EXP ready",
            generatedTodos: "Your generated ToDos",
            homeEyebrow: "Home",
            homeTitle: "Room & Equipment",
            homeCardTitle: "Home",
            homeCardCopy: "Room setup and decoration will be added here.",
            weaponsTitle: "Weapons",
            weaponsCopy: "Weapon loadout and upgrades will be added here.",
            wearTitle: "Wear",
            wearCopy: "Outfit and gear setup will be added here.",
            guildEyebrow: "Guild",
            guildTitle: "Guild",
            toBeImplemented: "To be implemented.",
            guildCopy: "Party, rankings, and shared challenges can live here later.",
            settingsEyebrow: "Settings",
            settingsTitle: "Settings",
            currentGoal: "Current goal",
            noGoal: "No goal yet.",
            changeGoal: "Change Goal",
            languageSettingTitle: "Language",
            languageSettingCopy: "Choose the language for the app and generated quests.",
            autoGenTimeTitle: "Auto-generate ToDos",
            autoGenTimeCopy: "Choose when daily ToDos should be generated.",
            situationsTitle: "Situations",
            situationsCopy: "Add or edit context that should affect generated ToDos.",
            situationPlaceholder: "e.g. Commute days are busy",
            addSituation: "Add",
            removeSituation: "Remove",
            situationItemLabel: "Situation",
            noSituations: "No situations added yet.",
            holidayModeTitle: "Holiday mode",
            holidayActive: "Auto-generation is active.",
            holidayPaused: "Auto-generation is paused until {date}.",
            applyHoliday: "Apply",
            clearHoliday: "Clear",
            music: "Music",
            musicCopy: "Future background music and sound controls.",
            future: "Future",
            reviewGoal: "Goal",
            reviewBaseline: "Baseline",
            reviewDeadline: "Deadline",
            reviewWeekdays: "Weekdays",
            reviewWeekends: "Weekends",
            mins: "mins",
            untitledGoal: "Untitled goal",
            yourQuest: "Your Quest",
            deadlineMeta: "Deadline: {deadline}",
            goalMeta: "Deadline: {deadline} • Weekdays {weekday} min • Weekends {weekend} min",
            questsLeft: "{count} quests left today",
            noTasksGenerated: "No tasks generated yet",
            noTodosFound: "No ToDos found.",
            noTodosCopy: "The goal was saved, but no ToDos were returned yet.",
            difficulty: "Difficulty {difficulty}",
            noDescription: "No description",
            complete: "Complete",
            completeDone: "Completed",
            loadTodosFailed: "Goal saved, but ToDos could not be loaded",
            loadTodosFailedTitle: "Failed to load ToDos.",
            loadTodosFailedCopy: "Your goal was saved, but ToDos could not be retrieved. Please try again later.",
            generateFailed: "Failed to generate ToDos. Check the backend connection and try again.",
            requiredFields: "Please fill in the required fields.",
            completeFailed: "Could not mark the task as complete."
        },
        ja: {
            appEyebrow: "クエストプランナー",
            appSubtitle: "長期目標を、1週間分の実行できるクエストに変換します。",
            navQuests: "クエスト",
            navHome: "ホーム",
            navGuild: "ギルド",
            navSettings: "設定",
            loading: "読み込み中...",
            language: "言語",
            languageQuestion: "言語を選択してください",
            goal: "目標",
            goalQuestion: "長期目標は何ですか？",
            goalPlaceholder: "例: Pythonを習得する、5kgやせる",
            baseline: "現在地",
            baselineQuestion: "今はどこから始めますか？",
            baselinePlaceholder: "例: 基本的なスクリプトは書ける、75kg",
            deadline: "期限",
            deadlineQuestion: "いつまでに達成したいですか？",
            timeBudget: "時間予算",
            timeBudgetQuestion: "1日の時間予算（分）",
            weekdays: "平日",
            weekends: "週末",
            review: "確認",
            reviewTitle: "クエストを確認",
            back: "戻る",
            cancel: "キャンセル",
            next: "次へ",
            generateTodos: "ToDoを生成",
            generating: "生成中...",
            stepIndicator: "ステップ {current} / {total}",
            questsEyebrow: "クエスト",
            plannedQuests: "予定クエスト",
            completed: "完了",
            expReady: "獲得可能EXP",
            generatedTodos: "生成されたToDo",
            homeEyebrow: "ホーム",
            homeTitle: "部屋と装備",
            homeCardTitle: "ホーム",
            homeCardCopy: "部屋の設定や装飾はここに追加されます。",
            weaponsTitle: "武器",
            weaponsCopy: "武器の装備やアップグレードはここに追加されます。",
            wearTitle: "衣装",
            wearCopy: "衣装やギアの設定はここに追加されます。",
            guildEyebrow: "ギルド",
            guildTitle: "ギルド",
            toBeImplemented: "今後実装予定です。",
            guildCopy: "パーティ、ランキング、共有チャレンジはここに追加できます。",
            settingsEyebrow: "設定",
            settingsTitle: "設定",
            currentGoal: "現在の目標",
            noGoal: "目標はまだありません。",
            changeGoal: "目標を変更",
            languageSettingTitle: "言語",
            languageSettingCopy: "アプリと生成されるクエストの言語を選択します。",
            autoGenTimeTitle: "ToDo自動生成",
            autoGenTimeCopy: "毎日のToDoを生成する時刻を選択します。",
            situationsTitle: "状況",
            situationsCopy: "生成されるToDoに反映したい状況を追加・編集します。",
            situationPlaceholder: "例: 通勤日は忙しい",
            addSituation: "追加",
            removeSituation: "削除",
            situationItemLabel: "状況",
            noSituations: "状況はまだ追加されていません。",
            holidayModeTitle: "休暇モード",
            holidayActive: "自動生成は有効です。",
            holidayPaused: "{date} まで自動生成を停止しています。",
            applyHoliday: "適用",
            clearHoliday: "解除",
            music: "音楽",
            musicCopy: "BGMやサウンドの設定は今後追加されます。",
            future: "予定",
            reviewGoal: "目標",
            reviewBaseline: "現在地",
            reviewDeadline: "期限",
            reviewWeekdays: "平日",
            reviewWeekends: "週末",
            mins: "分",
            untitledGoal: "無題の目標",
            yourQuest: "あなたのクエスト",
            deadlineMeta: "期限: {deadline}",
            goalMeta: "期限: {deadline} • 平日 {weekday} 分 • 週末 {weekend} 分",
            questsLeft: "今日の残りクエスト: {count}",
            noTasksGenerated: "タスクはまだ生成されていません",
            noTodosFound: "ToDoが見つかりません。",
            noTodosCopy: "目標は保存されましたが、ToDoはまだ返されていません。",
            difficulty: "難易度 {difficulty}",
            noDescription: "説明はありません",
            complete: "完了する",
            completeDone: "完了済み",
            loadTodosFailed: "目標は保存されましたが、ToDoを読み込めませんでした",
            loadTodosFailedTitle: "ToDoの読み込みに失敗しました。",
            loadTodosFailedCopy: "目標は保存されましたが、ToDoを取得できませんでした。あとでもう一度お試しください。",
            generateFailed: "ToDoの生成に失敗しました。バックエンド接続を確認して、もう一度お試しください。",
            requiredFields: "必須項目を入力してください。",
            completeFailed: "タスクを完了にできませんでした。"
        }
    };

    const stepTitleKeys = {
        1: "language",
        2: "goal",
        3: "baseline",
        4: "deadline",
        5: "timeBudget",
        6: "review"
    };

    const formData = {
        language: currentLanguage
    };

    function loadUserSettings() {
        const fallbackSettings = {
            autoGenTime: "08:00",
            situations: [],
            holidayUntil: null
        };

        try {
            const parsedSettings = JSON.parse(localStorage.getItem("todoRpgSettings") || "{}");
            return {
                ...fallbackSettings,
                ...parsedSettings,
                situations: Array.isArray(parsedSettings.situations) ? parsedSettings.situations : []
            };
        } catch (error) {
            console.error(error);
            return fallbackSettings;
        }
    }

    function saveUserSettings() {
        localStorage.setItem("todoRpgSettings", JSON.stringify(userSettings));
    }

    function t(key, params = {}) {
        const template = translations[currentLanguage]?.[key] || translations.en[key] || key;
        return Object.entries(params).reduce(
            (value, [param, replacement]) => value.replaceAll(`{${param}}`, String(replacement)),
            template
        );
    }

    function applyTranslations() {
        document.documentElement.lang = currentLanguage;
        document.querySelectorAll("[data-i18n]").forEach((element) => {
            element.textContent = t(element.dataset.i18n);
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
            element.placeholder = t(element.dataset.i18nPlaceholder);
        });

        const checkedLanguage = form.querySelector(`input[name="language"][value="${currentLanguage}"]`);
        if (checkedLanguage) {
            checkedLanguage.checked = true;
        }
        if (languageSetting) {
            languageSetting.value = currentLanguage;
        }

        updateUI();
        if (currentGoal) {
            renderDashboard(currentGoal, currentTasks);
        } else {
            renderSettings();
        }
    }

    function setLanguage(language) {
        currentLanguage = translations[language] ? language : "en";
        formData.language = currentLanguage;
        localStorage.setItem("todoRpgLanguage", currentLanguage);
        applyTranslations();
    }

    function formatDate(value) {
        if (!value) {
            return "-";
        }
        return new Intl.DateTimeFormat(currentLanguage === "ja" ? "ja-JP" : "en-US", {
            year: "numeric",
            month: "short",
            day: "numeric"
        }).format(new Date(`${value}T00:00:00`));
    }

    function addDays(date, days) {
        const nextDate = new Date(date);
        nextDate.setDate(nextDate.getDate() + days);
        return nextDate.toISOString().slice(0, 10);
    }

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
        stepIndicator.textContent = t("stepIndicator", { current: currentStep, total: totalSteps });
        stepTitle.textContent = t(stepTitleKeys[currentStep]);

        if (currentStep === 1) {
            btnBack.classList.add("hidden");
            btnNext.classList.add("ml-auto");
        } else {
            btnBack.classList.remove("hidden");
            btnNext.classList.remove("ml-auto");
        }

        btnNext.textContent = currentStep === totalSteps ? t("generateTodos") : t("next");

        if (currentStep === totalSteps) {
            populateReview();
        }
    }

    function populateReview() {
        reviewContent.innerHTML = `
            <p><strong class="text-white">${t("reviewGoal")}:</strong> ${escapeHtml(formData.long_term_goal || "-")}</p>
            <p><strong class="text-white">${t("reviewBaseline")}:</strong> ${escapeHtml(formData.baseline || "-")}</p>
            <p><strong class="text-white">${t("reviewDeadline")}:</strong> ${escapeHtml(formData.deadline || "-")}</p>
            <p><strong class="text-white">${t("reviewWeekdays")}:</strong> ${escapeHtml(formData.daily_time_weekday || 0)} ${t("mins")}</p>
            <p><strong class="text-white">${t("reviewWeekends")}:</strong> ${escapeHtml(formData.daily_time_weekend || 0)} ${t("mins")}</p>
        `;
    }

    function collectData() {
        const currentInputs = document
            .querySelector(`.wizard-step[data-step="${currentStep}"]`)
            .querySelectorAll("input, textarea");
        currentInputs.forEach((input) => {
            if (input.type === "radio" && !input.checked) {
                return;
            }
            formData[input.name] = input.value;
        });
    }

    function validate() {
        if (currentStep === 2 && !document.querySelector('input[name="long_term_goal"]').value.trim()) {
            return false;
        }
        if (currentStep === 4 && !document.querySelector('input[name="deadline"]').value) {
            return false;
        }
        return true;
    }

    function setLoadingState(isLoading) {
        loading.classList.toggle("hidden", !isLoading);
        btnNext.disabled = isLoading;
        btnBack.disabled = isLoading;
        btnCancelGoal.disabled = isLoading;
        btnChangeGoal.disabled = isLoading;
        btnAddSituation.disabled = isLoading;
        btnApplyHoliday.disabled = isLoading;
        btnClearHoliday.disabled = isLoading;
        navButtons.forEach((button) => { button.disabled = isLoading; });
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
        autoGenTime.value = userSettings.autoGenTime || "08:00";
        renderSituations();
        renderHolidayMode();

        if (!currentGoal) {
            settingsGoalSummary.textContent = t("noGoal");
            return;
        }

        settingsGoalSummary.textContent = `${currentGoal.long_term_goal || t("untitledGoal")} • ${t("deadlineMeta", { deadline: currentGoal.deadline || "-" })}`;
    }

    function renderSituations() {
        if (!userSettings.situations.length) {
            situationList.innerHTML = `<p class="settings-copy">${t("noSituations")}</p>`;
            return;
        }

        situationList.innerHTML = userSettings.situations
            .map((situation, index) => `
                <div class="situation-item">
                    <label class="sr-only" for="situation-${index}">${t("situationItemLabel")} ${index + 1}</label>
                    <input
                        type="text"
                        id="situation-${index}"
                        class="settings-input settings-input-grow"
                        value="${escapeHtml(situation)}"
                        data-situation-index="${index}"
                    >
                    <button
                        type="button"
                        class="secondary-action secondary-action-muted"
                        data-remove-situation="${index}"
                    >
                        ${t("removeSituation")}
                    </button>
                </div>
            `)
            .join("");
    }

    function renderHolidayMode() {
        const today = new Date().toISOString().slice(0, 10);
        const holidayUntil = userSettings.holidayUntil;
        const isPaused = holidayUntil && holidayUntil >= today;
        holidayModeSummary.textContent = isPaused
            ? t("holidayPaused", { date: formatDate(holidayUntil) })
            : t("holidayActive");
    }

    function renderDashboard(goal, tasks) {
        currentGoal = goal;
        currentTasks = Array.isArray(tasks) ? tasks : [];

        const completedCount = currentTasks.filter((task) => task.completed).length;
        const pendingTasks = currentTasks.filter((task) => !task.completed);
        const expReady = pendingTasks.reduce((sum, task) => sum + (task.xp_reward || 0), 0);

        dashboardGoalTitle.textContent = goal.long_term_goal || t("yourQuest");
        dashboardGoalMeta.textContent = t("goalMeta", {
            deadline: goal.deadline || "-",
            weekday: goal.daily_time_weekday || 0,
            weekend: goal.daily_time_weekend || 0
        });
        statsTotal.textContent = String(currentTasks.length);
        statsCompleted.textContent = String(completedCount);
        statsExp.textContent = String(expReady);
        todoStatus.textContent = currentTasks.length ? t("questsLeft", { count: pendingTasks.length }) : t("noTasksGenerated");
        renderSettings();

        if (!currentTasks.length) {
            todoList.innerHTML = `
                <article class="empty-card">
                    <p class="text-white font-semibold">${t("noTodosFound")}</p>
                    <p class="text-slate-400 text-sm mt-2">${t("noTodosCopy")}</p>
                </article>
            `;
            return;
        }

        todoList.innerHTML = currentTasks
            .map((task) => {
                const completeLabel = task.completed ? t("completeDone") : t("complete");
                return `
                    <article class="todo-card ${task.completed ? "is-complete" : ""}">
                        <div class="flex items-start justify-between gap-4">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h4 class="text-base font-semibold text-white">${escapeHtml(task.title)}</h4>
                                    <span class="difficulty-badge difficulty-${task.difficulty}">${t("difficulty", { difficulty: escapeHtml(task.difficulty) })}</span>
                                </div>
                                <p class="text-slate-300 text-sm mt-2">${escapeHtml(task.description || t("noDescription"))}</p>
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
            daily_time_weekend: Number.parseInt(formData.daily_time_weekend, 10) || 0,
            language: formData.language || currentLanguage,
            auto_generate_time: userSettings.autoGenTime || "08:00",
            situations: userSettings.situations,
            holiday_until: userSettings.holidayUntil
        };

        setLoadingState(true);
        btnNext.textContent = t("generating");

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
                todoStatus.textContent = t("loadTodosFailed");
                todoList.innerHTML = `
                    <article class="empty-card">
                        <p class="text-white font-semibold">${t("loadTodosFailedTitle")}</p>
                        <p class="text-slate-400 text-sm mt-2">${t("loadTodosFailedCopy")}</p>
                    </article>
                `;
                return;
            }

            renderDashboard(goal, tasks);
        } catch (error) {
            console.error(error);
            alert(t("generateFailed"));
        } finally {
            setLoadingState(false);
            btnNext.textContent = t("generateTodos");
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
            alert(t("completeFailed"));
        }
    }

    btnNext.addEventListener("click", async () => {
        collectData();
        if (formData.language && formData.language !== currentLanguage) {
            setLanguage(formData.language);
        }

        if (!validate()) {
            alert(t("requiredFields"));
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
        formData.language = currentLanguage;
        form.reset();
        form.querySelector(`input[name="language"][value="${currentLanguage}"]`).checked = true;
        updateUI();
        showWizard({ allowCancel: Boolean(currentGoal) });
    });

    form.querySelectorAll('input[name="language"]').forEach((input) => {
        input.addEventListener("change", () => {
            setLanguage(input.value);
        });
    });

    languageSetting.addEventListener("change", () => {
        setLanguage(languageSetting.value);
    });

    autoGenTime.addEventListener("change", () => {
        userSettings.autoGenTime = autoGenTime.value || "08:00";
        saveUserSettings();
    });

    btnAddSituation.addEventListener("click", () => {
        const situation = newSituation.value.trim();
        if (!situation) {
            return;
        }

        userSettings.situations = [...userSettings.situations, situation];
        newSituation.value = "";
        saveUserSettings();
        renderSituations();
    });

    newSituation.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            btnAddSituation.click();
        }
    });

    situationList.addEventListener("input", (event) => {
        const input = event.target.closest("[data-situation-index]");
        if (!input) {
            return;
        }

        const index = Number.parseInt(input.dataset.situationIndex, 10);
        userSettings.situations[index] = input.value;
        saveUserSettings();
    });

    situationList.addEventListener("click", (event) => {
        const button = event.target.closest("[data-remove-situation]");
        if (!button) {
            return;
        }

        const index = Number.parseInt(button.dataset.removeSituation, 10);
        userSettings.situations.splice(index, 1);
        saveUserSettings();
        renderSituations();
    });

    btnApplyHoliday.addEventListener("click", () => {
        const days = Number.parseInt(holidayDays.value, 10);
        if (!Number.isFinite(days) || days < 1) {
            return;
        }

        userSettings.holidayUntil = addDays(new Date(), days);
        saveUserSettings();
        renderHolidayMode();
    });

    btnClearHoliday.addEventListener("click", () => {
        userSettings.holidayUntil = null;
        saveUserSettings();
        renderHolidayMode();
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

    applyTranslations();
    showWizard();
});
