export function getTaskCategoryClass(taskElement) {
    const categoryBadge = taskElement.querySelector('.task-category');
    if (!categoryBadge) return null;

    for (const className of categoryBadge.classList) {
        if (className.startsWith('cat-')) {
            return className;
        }
    }
    return null;
}

export function pruneStaleCompletedTaskIds(completedTasks) {
    const validTaskIds = new Set(
        [...document.querySelectorAll('.task-item, .collab-tasks li')]
            .map((task) => task.getAttribute('data-task-id'))
            .filter(Boolean)
    );

    let hasDeleted = false;
    [...completedTasks].forEach((taskId) => {
        if (!validTaskIds.has(taskId)) {
            completedTasks.delete(taskId);
            hasDeleted = true;
        }
    });

    return hasDeleted;
}

export function countCompletedTasks(allTasks, completedTasks) {
    return allTasks.reduce((count, task) => {
        const taskId = task.getAttribute('data-task-id');
        return count + (completedTasks.has(taskId) ? 1 : 0);
    }, 0);
}

