import { loadCompletedTasks, saveCompletedTasks } from './storage.js';
import { pruneStaleCompletedTaskIds } from './task-utils.js';
import { initializeCategoryLegend, updateCategoryFilterState, applyDisplayFilters } from './filters.js';
import { updateOverallProgress, updatePhaseProgress } from './progress.js';
import { updateCategoryInsights } from './insights.js';

export function initRoadmapApp() {
    const state = {
        completedTasks: loadCompletedTasks(),
        activeCategoryFilter: null,
        listMode: 'all'
    };

    const saveProgress = () => saveCompletedTasks(state.completedTasks);

    const refresh = () => {
        if (pruneStaleCompletedTaskIds(state.completedTasks)) {
            saveProgress();
        }
        updateOverallProgress(state.completedTasks);
        updatePhaseProgress(state.completedTasks);
        updateCategoryInsights(state.completedTasks);
        applyDisplayFilters(state);
    };

    const toggleTask = (taskId, element) => {
        if (state.completedTasks.has(taskId)) {
            state.completedTasks.delete(taskId);
            element.classList.remove('completed');
        } else {
            state.completedTasks.add(taskId);
            element.classList.add('completed');
        }
        saveProgress();
        refresh();
    };

    const toggleCollabTask = (taskId, element) => {
        const isCompleted = state.completedTasks.has(taskId);
        if (isCompleted) {
            state.completedTasks.delete(taskId);
            element.style.opacity = '1';
            element.style.textDecoration = 'none';
        } else {
            state.completedTasks.add(taskId);
            element.style.opacity = '0.4';
            element.style.textDecoration = 'line-through';
        }
        saveProgress();
        refresh();
    };

    const initializeChecklist = () => {
        document.querySelectorAll('.task-item').forEach((task, index) => {
            const taskId = `task-${index}`;
            task.setAttribute('data-task-id', taskId);
            if (state.completedTasks.has(taskId)) {
                task.classList.add('completed');
            }
            task.addEventListener('click', () => toggleTask(taskId, task));
        });

        document.querySelectorAll('.collab-tasks li').forEach((task, index) => {
            const taskId = `collab-${index}`;
            task.setAttribute('data-task-id', taskId);
            task.style.cursor = 'pointer';
            if (state.completedTasks.has(taskId)) {
                task.style.opacity = '0.4';
                task.style.textDecoration = 'line-through';
            }
            task.addEventListener('click', () => toggleCollabTask(taskId, task));
        });
    };

    const toggleCategoryFilter = (categoryClass) => {
        state.activeCategoryFilter = state.activeCategoryFilter === categoryClass ? null : categoryClass;
        updateCategoryFilterState(state.activeCategoryFilter);
        applyDisplayFilters(state);
    };

    const resetProgress = () => {
        if (!confirm('정말로 모든 진행상황을 초기화하시겠습니까?')) return;

        state.completedTasks.clear();
        localStorage.removeItem('completedTasks');

        document.querySelectorAll('.task-item').forEach((task) => {
            task.classList.remove('completed');
        });

        document.querySelectorAll('.collab-tasks li').forEach((task) => {
            task.style.opacity = '1';
            task.style.textDecoration = 'none';
        });

        refresh();
    };

    const showCompletedOnly = () => {
        state.listMode = 'completed';
        applyDisplayFilters(state);
    };

    const showAll = () => {
        state.listMode = 'all';
        state.activeCategoryFilter = null;
        updateCategoryFilterState(state.activeCategoryFilter);
        applyDisplayFilters(state);
    };

    window.resetProgress = resetProgress;
    window.showCompletedOnly = showCompletedOnly;
    window.showAll = showAll;

    initializeChecklist();
    initializeCategoryLegend(toggleCategoryFilter);
    refresh();
}

