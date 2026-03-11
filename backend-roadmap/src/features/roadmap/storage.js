import { STORAGE_KEY } from './config.js';

export function loadCompletedTasks() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(JSON.parse(raw || '[]'));
}

export function saveCompletedTasks(completedTasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completedTasks]));
}

