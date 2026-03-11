import { getTaskCategoryClass } from './task-utils.js';

export function initializeCategoryLegend(onToggleCategoryFilter) {
    document.querySelectorAll('.category-item').forEach((item) => {
        const categoryClass = item.getAttribute('data-category');
        const badge = item.querySelector('.category-filter');
        if (!categoryClass || !badge) return;

        badge.addEventListener('click', () => onToggleCategoryFilter(categoryClass));
        badge.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onToggleCategoryFilter(categoryClass);
            }
        });
    });
}

export function updateCategoryFilterState(activeCategoryFilter) {
    document.querySelectorAll('.category-item').forEach((item) => {
        const categoryClass = item.getAttribute('data-category');
        const badge = item.querySelector('.category-filter');
        if (!badge) return;

        const isActive = categoryClass === activeCategoryFilter;
        badge.classList.toggle('active', isActive);
        badge.setAttribute('aria-pressed', String(isActive));
    });
}

export function applyDisplayFilters({ activeCategoryFilter, listMode, completedTasks }) {
    document.querySelectorAll('.task-item').forEach((task) => {
        const categoryClass = getTaskCategoryClass(task);
        const categoryMatched = !activeCategoryFilter || categoryClass === activeCategoryFilter;
        const completionMatched = listMode !== 'completed' || task.classList.contains('completed');
        task.style.display = categoryMatched && completionMatched ? 'flex' : 'none';
    });

    document.querySelectorAll('.collab-tasks li').forEach((task) => {
        const taskId = task.getAttribute('data-task-id');
        const completionMatched = listMode !== 'completed' || completedTasks.has(taskId);
        const categoryMatched = !activeCategoryFilter;
        task.style.display = categoryMatched && completionMatched ? 'block' : 'none';
    });
}

