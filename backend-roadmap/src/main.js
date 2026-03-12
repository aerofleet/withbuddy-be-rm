import './style.css';
import { initRoadmapApp } from './features/roadmap/app.js';
import headerSection from './templates/sections/header.html?raw';
import categoryLegendSection from './templates/sections/category-legend.html?raw';
import overviewSection from './templates/sections/overview.html?raw';
import statsSection from './templates/sections/stats.html?raw';
import phase1Section from './templates/sections/phase-1.html?raw';
import phase2Section from './templates/sections/phase-2.html?raw';
import phase3Section from './templates/sections/phase-3.html?raw';
import appendixSection from './templates/sections/appendix.html?raw';

document.addEventListener('DOMContentLoaded', () => {
    const appRoot = document.getElementById('app');
    if (!appRoot) return;

    appRoot.innerHTML = `
        <div class="container">
            ${headerSection}
            ${categoryLegendSection}
            ${overviewSection}
            ${statsSection}
            ${phase1Section}
            ${phase2Section}
            ${phase3Section}
            ${appendixSection}
        </div>
    `;

    initRoadmapApp();
});
