import { countCompletedTasks } from './task-utils.js';

export function updateOverallProgress(completedTasks) {
    const allTasks = [...document.querySelectorAll('.task-item, .collab-tasks li')];
    const total = allTasks.length;
    const completed = countCompletedTasks(allTasks, completedTasks);
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const progressBar = document.getElementById('totalProgress');
    if (progressBar) {
        progressBar.style.width = `${percentage}%`;
        progressBar.textContent = `${percentage}%`;
    }

    const progressText = document.getElementById('totalProgressText');
    if (progressText) {
        progressText.textContent = `${completed} / ${total}`;
    }
}

export function updatePhaseProgress(completedTasks) {
    const phases = document.querySelectorAll('.phase-container');
    let currentPhaseCompleted = 0;
    let currentPhaseTotal = 0;

    if (phases.length > 0) {
        const firstPhase = phases[0];
        const phaseTasks = firstPhase.querySelectorAll('.task-item, .collab-tasks li');
        currentPhaseTotal = phaseTasks.length;
        phaseTasks.forEach((task) => {
            const taskId = task.getAttribute('data-task-id');
            if (completedTasks.has(taskId)) {
                currentPhaseCompleted++;
            }
        });
    }

    const phasePercentage = currentPhaseTotal > 0
        ? Math.round((currentPhaseCompleted / currentPhaseTotal) * 100)
        : 0;

    const phaseProgress = document.getElementById('currentPhaseProgress');
    if (phaseProgress) {
        phaseProgress.textContent = `${phasePercentage}%`;
    }
}

