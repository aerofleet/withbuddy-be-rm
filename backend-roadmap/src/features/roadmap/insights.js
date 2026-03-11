import { CATEGORY_CONFIG } from './config.js';
import { getTaskCategoryClass } from './task-utils.js';

export function updateCategoryInsights(completedTasks) {
    const stats = buildCategoryStats(completedTasks);
    updateCategoryLegendMetrics(stats);
    renderCategoryWorkload(stats);
}

function buildCategoryStats(completedTasks) {
    const stats = {};

    Object.keys(CATEGORY_CONFIG).forEach((categoryClass) => {
        stats[categoryClass] = {
            total: 0,
            completed: 0,
            percent: 0,
            byDeveloper: { a: 0, b: 0 },
            unmetDependencies: [],
            risk: { level: 'green', label: '낮음' }
        };
    });

    document.querySelectorAll('.task-item').forEach((task) => {
        const categoryClass = getTaskCategoryClass(task);
        if (!categoryClass || !stats[categoryClass]) return;

        const taskId = task.getAttribute('data-task-id');
        stats[categoryClass].total++;
        if (completedTasks.has(taskId)) {
            stats[categoryClass].completed++;
        }

        const developerCard = task.closest('.developer-card');
        if (developerCard?.classList.contains('dev-a')) {
            stats[categoryClass].byDeveloper.a++;
        } else if (developerCard?.classList.contains('dev-b')) {
            stats[categoryClass].byDeveloper.b++;
        }
    });

    Object.keys(CATEGORY_CONFIG).forEach((categoryClass) => {
        const config = CATEGORY_CONFIG[categoryClass];
        const categoryStat = stats[categoryClass];
        categoryStat.percent = categoryStat.total > 0
            ? Math.round((categoryStat.completed / categoryStat.total) * 100)
            : 0;

        categoryStat.unmetDependencies = config.dependencies.filter((depClass) => {
            const depStats = stats[depClass];
            if (!depStats || depStats.total === 0) return true;
            return depStats.completed < depStats.total;
        });

        const dependenciesReady = categoryStat.unmetDependencies.length === 0;
        categoryStat.risk = calculateRisk(categoryStat.percent, config.priority, dependenciesReady);
    });

    return stats;
}

function calculateRisk(percent, priority, dependenciesReady) {
    if (!dependenciesReady && percent < 100) return { level: 'red', label: '높음' };
    if (percent >= 80) return { level: 'green', label: '낮음' };
    if (percent >= 45) return { level: 'yellow', label: '보통' };
    if (priority === '필수' || percent < 30) return { level: 'red', label: '높음' };
    return { level: 'yellow', label: '보통' };
}

function updateCategoryLegendMetrics(stats) {
    document.querySelectorAll('.category-item').forEach((item) => {
        const categoryClass = item.getAttribute('data-category');
        const config = CATEGORY_CONFIG[categoryClass];
        const categoryStat = stats[categoryClass];
        if (!config || !categoryStat) return;

        const progressEl = item.querySelector('[data-role="progress"]');
        const priorityEl = item.querySelector('[data-role="priority"]');
        const dependencyEl = item.querySelector('[data-role="dependency"]');
        const riskEl = item.querySelector('[data-role="risk"]');

        if (progressEl) {
            progressEl.textContent = `진행 ${categoryStat.completed}/${categoryStat.total} (${categoryStat.percent}%)`;
        }

        if (priorityEl) {
            priorityEl.textContent = `우선순위 ${config.priority}`;
            priorityEl.classList.remove('priority-required', 'priority-recommended', 'priority-optional');
            if (config.priority === '필수') {
                priorityEl.classList.add('priority-required');
            } else if (config.priority === '권장') {
                priorityEl.classList.add('priority-recommended');
            } else {
                priorityEl.classList.add('priority-optional');
            }
        }

        if (dependencyEl) {
            dependencyEl.classList.remove('dependency-warning');
            if (config.dependencies.length === 0) {
                dependencyEl.textContent = '의존성 없음';
            } else if (categoryStat.unmetDependencies.length === 0) {
                dependencyEl.textContent = '선행 완료';
            } else {
                const unmetNames = categoryStat.unmetDependencies
                    .map((depClass) => CATEGORY_CONFIG[depClass]?.name || depClass)
                    .join(', ');
                dependencyEl.textContent = `선행 필요: ${unmetNames}`;
                dependencyEl.classList.add('dependency-warning');
            }
        }

        if (riskEl) {
            riskEl.textContent = `일정 리스크 ${categoryStat.risk.label}`;
            riskEl.classList.remove('risk-green', 'risk-yellow', 'risk-red');
            riskEl.classList.add(`risk-${categoryStat.risk.level}`);
        }
    });
}

function renderCategoryWorkload(stats) {
    const container = document.getElementById('categoryWorkload');
    if (!container) return;

    container.innerHTML = '';
    Object.keys(CATEGORY_CONFIG).forEach((categoryClass) => {
        const config = CATEGORY_CONFIG[categoryClass];
        const categoryStat = stats[categoryClass];
        if (!config || !categoryStat) return;

        const card = document.createElement('div');
        card.className = 'workload-card';
        card.innerHTML = `
            <div class="workload-card-title">
                <span class="category-badge ${categoryClass}">${config.name}</span>
            </div>
            <div class="workload-row"><span>개발자 A</span><strong>${categoryStat.byDeveloper.a}개</strong></div>
            <div class="workload-row"><span>개발자 B</span><strong>${categoryStat.byDeveloper.b}개</strong></div>
            <div class="workload-row"><span>전체 업무</span><strong>${categoryStat.total}개</strong></div>
            <div class="workload-row"><span>완료율</span><strong>${categoryStat.completed}/${categoryStat.total} (${categoryStat.percent}%)</strong></div>
        `;
        container.appendChild(card);
    });
}

