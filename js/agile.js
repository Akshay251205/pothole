/* ==========================================================================
   RoadGuard - Scrumban Board & Agile Metrics (js/agile.js)
   ========================================================================== */

const JIRA_STORAGE_KEY = 'roadguard_jira_stories';

const initialJiraStories = [
    // Sprint 1 Stories
    { id: 'US-01', epic: 'Citizen Reporting', title: 'As a citizen, I want to view a responsive home page so I can learn about RoadGuard features.', priority: 'High', points: 3, status: 'Done', sprint: 1 },
    { id: 'US-02', epic: 'Citizen Reporting', title: 'As a developer, I want to define CSS variable tokens for clean light/dark themes.', priority: 'Medium', points: 2, status: 'Done', sprint: 1 },
    { id: 'US-03', epic: 'Citizen Reporting', title: 'As a citizen, I want to register for a new account with email validation.', priority: 'High', points: 5, status: 'Done', sprint: 1 },
    { id: 'US-04', epic: 'Citizen Reporting', title: 'As a citizen, I want to login with my credentials to access my private dashboard.', priority: 'High', points: 3, status: 'Done', sprint: 1 },
    { id: 'US-05', epic: 'Authority Dashboard', title: 'As an admin, I want to login with credentials (admin/admin123) to access authority controls.', priority: 'High', points: 3, status: 'Done', sprint: 1 },

    // Sprint 2 Stories
    { id: 'US-06', epic: 'Citizen Reporting', title: 'As a citizen, I want to report a pothole with title, description, and road details.', priority: 'High', points: 5, status: 'Done', sprint: 2 },
    { id: 'US-07', epic: 'Citizen Reporting', title: 'As a citizen, I want to choose a severity level (Low, Medium, High, Critical) for priority signaling.', priority: 'Medium', points: 2, status: 'Done', sprint: 2 },
    { id: 'US-08', epic: 'Citizen Reporting', title: 'As a citizen, I want to upload a photograph of the pothole using FileReader.', priority: 'High', points: 8, status: 'Done', sprint: 2 },
    { id: 'US-09', epic: 'Citizen Reporting', title: 'As a citizen, I want to see an immediate image preview before form submission.', priority: 'Low', points: 3, status: 'Done', sprint: 2 },
    { id: 'US-10', epic: 'Citizen Reporting', title: 'As a system, I want to reject uploaded image files exceeding 5MB to preserve storage.', priority: 'Medium', points: 3, status: 'Done', sprint: 2 },
    { id: 'US-11', epic: 'Status Tracking', title: 'As a system, I want to generate a unique complaint ID like RG1001 automatically.', priority: 'High', points: 2, status: 'Done', sprint: 2 },

    // Sprint 3 Stories
    { id: 'US-12', epic: 'Authority Dashboard', title: 'As an admin, I want to monitor total, pending, critical, and completed counts.', priority: 'High', points: 5, status: 'Done', sprint: 3 },
    { id: 'US-13', epic: 'Authority Dashboard', title: 'As an admin, I want to view a table of recent pothole reports with vital details.', priority: 'High', points: 5, status: 'Done', sprint: 3 },
    { id: 'US-14', epic: 'Authority Dashboard', title: 'As an admin, I want to click any row to inspect pothole details and coordinates.', priority: 'High', points: 5, status: 'Done', sprint: 3 },
    { id: 'US-15', epic: 'Status Tracking', title: 'As an admin, I want to assign a municipal repair crew to a specific pothole.', priority: 'Medium', points: 3, status: 'Done', sprint: 3 },
    { id: 'US-16', epic: 'Status Tracking', title: 'As an admin, I want to set estimated completion dates and progress remarks.', priority: 'Medium', points: 3, status: 'Done', sprint: 3 },
    { id: 'US-17', epic: 'Status Tracking', title: 'As an admin, I want to update pothole status (Submitted to Closed) to keep citizens informed.', priority: 'High', points: 5, status: 'Done', sprint: 3 },

    // Sprint 4 Stories
    { id: 'US-18', epic: 'Authority Dashboard', title: 'As an admin, I want to search reports by ID, name, or street keywords in real-time.', priority: 'High', points: 5, status: 'Done', sprint: 4 },
    { id: 'US-19', epic: 'Authority Dashboard', title: 'As an admin, I want to filter complaints list by status and severity tags.', priority: 'Medium', points: 3, status: 'Done', sprint: 4 },
    { id: 'US-20', epic: 'Authority Dashboard', title: 'As an admin, I want to sort reports list by newest first or priority weight.', priority: 'Low', points: 3, status: 'Done', sprint: 4 },
    { id: 'US-21', epic: 'Analytics', title: 'As an admin, I want to view status distribution represented on a Canvas Pie Chart.', priority: 'High', points: 8, status: 'Done', sprint: 4 },
    { id: 'US-22', epic: 'Analytics', title: 'As an admin, I want to view monthly submission volumes on a Bar Chart.', priority: 'High', points: 8, status: 'Done', sprint: 4 },
    { id: 'US-23', epic: 'Analytics', title: 'As an admin, I want to analyze severity levels on a custom Donut Chart.', priority: 'Medium', points: 5, status: 'Done', sprint: 4 },

    // Sprint 5 Stories (Active / Simulation states)
    { id: 'US-24', epic: 'Status Tracking', title: 'As a tester, I want to perform cross-browser tests on Chrome, Firefox, and Safari.', priority: 'High', points: 3, status: 'In Progress', sprint: 5 },
    { id: 'US-25', epic: 'Authority Dashboard', title: 'As a developer, I want to trigger peer code reviews using validation checklists.', priority: 'Low', points: 2, status: 'Testing', sprint: 5 },
    { id: 'US-26', epic: 'Status Tracking', title: 'As an admin, I want to review CI/CD build success metrics for release verification.', priority: 'Medium', points: 5, status: 'Peer Review', sprint: 5 },
    { id: 'US-27', epic: 'Authority Dashboard', title: 'As an admin, I want to delete duplicate or invalid reports to sanitize the database.', priority: 'Medium', points: 3, status: 'Sprint', sprint: 5 },
    { id: 'US-28', epic: 'Citizen Reporting', title: 'As a user, I want to toggle dark theme controls to browse screens comfortably.', priority: 'Low', points: 3, status: 'Ready', sprint: 5 }
];

// Initialize JIRA Store
function initJiraDB() {
    if (!localStorage.getItem(JIRA_STORAGE_KEY)) {
        localStorage.setItem(JIRA_STORAGE_KEY, JSON.stringify(initialJiraStories));
    }
}
initJiraDB();

let activeEpicFilter = 'All';

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const pageName = path.split("/").pop() || 'index.html';

    if (pageName === 'agile-management.html') {
        initAgileModule();
    }
});

function initAgileModule() {
    renderScrumbanBoard();
    drawAgileMetrics();
    setupEpicFilters();

    window.addEventListener('themeChanged', () => {
        drawAgileMetrics();
    });
}

function setupEpicFilters() {
    const filters = document.querySelectorAll('.epic-badge');
    filters.forEach(badge => {
        badge.addEventListener('click', () => {
            filters.forEach(f => f.classList.remove('active'));
            badge.classList.add('active');
            activeEpicFilter = badge.getAttribute('data-epic');
            renderScrumbanBoard();
        });
    });
}

function getJiraStories() {
    return JSON.parse(localStorage.getItem(JIRA_STORAGE_KEY)) || initialJiraStories;
}

function saveJiraStories(stories) {
    localStorage.setItem(JIRA_STORAGE_KEY, JSON.stringify(stories));
}

// Render Board Cards
function renderScrumbanBoard() {
    const stories = getJiraStories();
    const columns = {
        'Backlog': document.getElementById('col-backlog'),
        'Ready': document.getElementById('col-ready'),
        'Sprint': document.getElementById('col-sprint'),
        'In Progress': document.getElementById('col-progress'),
        'Peer Review': document.getElementById('col-review'),
        'Testing': document.getElementById('col-testing'),
        'Done': document.getElementById('col-done')
    };

    // Clean columns
    Object.keys(columns).forEach(key => {
        if (columns[key]) columns[key].innerHTML = '';
    });

    let filtered = stories;
    if (activeEpicFilter !== 'All') {
        filtered = stories.filter(s => s.epic === activeEpicFilter);
    }

    filtered.forEach(story => {
        const colContainer = columns[story.status];
        if (!colContainer) return;

        const epicClass = getEpicClass(story.epic);
        const card = document.createElement('div');
        card.className = `jira-card ${epicClass}`;
        card.draggable = true;
        card.id = `story-${story.id}`;
        card.innerHTML = `
            <div class="card-meta">
                <span class="card-id">${story.id}</span>
                <span class="priority-tag ${story.priority.toLowerCase()}">${story.priority}</span>
            </div>
            <div class="card-title">${story.title}</div>
            <div class="card-footer">
                <div class="card-left-footer">
                    <span class="story-points" title="Story Points">${story.points}</span>
                    <span style="font-size:10px; color:var(--text-muted); font-weight:600;">S${story.sprint}</span>
                </div>
                <div class="card-assignee" title="Assignee">${getInitials(story.epic)}</div>
            </div>
        `;

        // Register dragstart / dragend
        card.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', story.id);
            card.classList.add('dragging');
        });

        card.addEventListener('dragend', () => {
            card.classList.remove('dragging');
        });

        colContainer.appendChild(card);
    });

    // Update counters
    updateColumnCounts();

    // Register Dragover & Drop events on columns
    Object.keys(columns).forEach(colName => {
        const colContainer = columns[colName];
        if (!colContainer) return;

        colContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        colContainer.addEventListener('drop', (e) => {
            e.preventDefault();
            const storyId = e.dataTransfer.getData('text/plain');
            updateStoryStatus(storyId, colName);
        });
    });
}

function updateStoryStatus(id, newStatus) {
    const stories = getJiraStories();
    const index = stories.findIndex(s => s.id === id);
    if (index !== -1) {
        stories[index].status = newStatus;
        saveJiraStories(stories);
        renderScrumbanBoard();
        window.showToast(`Story ${id} moved to ${newStatus}`, 'success');
    }
}

function updateColumnCounts() {
    const stories = getJiraStories();
    const statuses = ['Backlog', 'Ready', 'Sprint', 'In Progress', 'Peer Review', 'Testing', 'Done'];
    
    statuses.forEach(status => {
        let count = stories.filter(s => s.status === status).length;
        if (activeEpicFilter !== 'All') {
            count = stories.filter(s => s.status === status && s.epic === activeEpicFilter).length;
        }

        let countBadge = null;
        if (status === 'Backlog') countBadge = document.getElementById('count-backlog');
        else if (status === 'Ready') countBadge = document.getElementById('count-ready');
        else if (status === 'Sprint') countBadge = document.getElementById('count-sprint');
        else if (status === 'In Progress') countBadge = document.getElementById('count-progress');
        else if (status === 'Peer Review') countBadge = document.getElementById('count-review');
        else if (status === 'Testing') countBadge = document.getElementById('count-testing');
        else if (status === 'Done') countBadge = document.getElementById('count-done');

        if (countBadge) countBadge.textContent = count;
    });
}

function getEpicClass(epic) {
    switch (epic) {
        case 'Citizen Reporting': return 'epic-card-1';
        case 'Authority Dashboard': return 'epic-card-2';
        case 'Status Tracking': return 'epic-card-3';
        case 'Analytics': return 'epic-card-4';
        default: return '';
    }
}

function getInitials(epic) {
    switch (epic) {
        case 'Citizen Reporting': return 'DEV';
        case 'Authority Dashboard': return 'QA';
        case 'Status Tracking': return 'PO';
        case 'Analytics': return 'SM';
        default: return 'RG';
    }
}

/* ==========================================================================
   Agile Metrics Charting Engines
   ========================================================================== */
function drawAgileMetrics() {
    drawThroughputChart();
    drawDefectsChart();
    drawHealthChart();
}

function setupMetricsDPI(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    return ctx;
}

function getMetricThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
        text: isDark ? '#ECEFF1' : '#263238',
        grid: isDark ? '#37474F' : '#CFD8DC'
    };
}

// 1. Throughput (5 Sprints stories count: 5, 6, 5, 7, 5)
function drawThroughputChart() {
    const canvas = document.getElementById('throughputChart');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const ctx = setupMetricsDPI(canvas);
    const colors = getMetricThemeColors();

    const sprints = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'];
    const stories = [5, 6, 5, 7, 5];

    // Margins
    const pLeft = 40;
    const pBottom = 30;
    const pTop = 20;
    const pRight = 20;

    const cW = width - pLeft - pRight;
    const cH = height - pTop - pBottom;

    // Draw Y grid
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.fillStyle = colors.text;
    ctx.font = '10px Poppins';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const maxVal = 8;
    for (let i = 0; i <= 4; i++) {
        const val = Math.round((maxVal / 4) * i);
        const y = pTop + cH - (i / 4) * cH;
        ctx.beginPath();
        ctx.moveTo(pLeft, y);
        ctx.lineTo(width - pRight, y);
        ctx.stroke();
        ctx.fillText(val, pLeft - 8, y);
    }

    // Draw bars
    const barWidth = 32;
    const gap = (cW - (barWidth * 5)) / 6;

    sprints.forEach((sprint, idx) => {
        const val = stories[idx];
        const barH = (val / maxVal) * cH;
        const x = pLeft + gap + idx * (barWidth + gap);
        const y = pTop + cH - barH;

        ctx.fillStyle = '#1565C0';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barH);
        ctx.fill();

        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.font = 'bold 11px Poppins';
        ctx.fillText(val, x + barWidth / 2, y - 8);

        ctx.font = '500 10px Poppins';
        ctx.fillText(sprint, x + barWidth / 2, pTop + cH + 15);
    });
}

// 2. Escaped Defects (2, 1, 1, 0, 0)
function drawDefectsChart() {
    const canvas = document.getElementById('defectsChart');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const ctx = setupMetricsDPI(canvas);
    const colors = getMetricThemeColors();

    const sprints = ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'];
    const defects = [2, 1, 1, 0, 0];

    const pLeft = 40;
    const pBottom = 30;
    const pTop = 20;
    const pRight = 20;

    const cW = width - pLeft - pRight;
    const cH = height - pTop - pBottom;

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.fillStyle = colors.text;
    ctx.font = '10px Poppins';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const maxVal = 3;
    for (let i = 0; i <= 3; i++) {
        const y = pTop + cH - (i / 3) * cH;
        ctx.beginPath();
        ctx.moveTo(pLeft, y);
        ctx.lineTo(width - pRight, y);
        ctx.stroke();
        ctx.fillText(i, pLeft - 8, y);
    }

    // Draw line connecting data points
    ctx.strokeStyle = '#D32F2F';
    ctx.lineWidth = 3;
    ctx.beginPath();

    const gap = cW / 4;
    const coords = [];

    sprints.forEach((sprint, idx) => {
        const val = defects[idx];
        const x = pLeft + (idx * gap);
        const y = pTop + cH - (val / maxVal) * cH;
        coords.push({ x, y, val });
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Draw dots and value labels
    coords.forEach((c, idx) => {
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath();
        ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI);
        ctx.fill();

        ctx.fillStyle = colors.text;
        ctx.font = 'bold 11px Poppins';
        ctx.textAlign = 'center';
        ctx.fillText(c.val, c.x, c.y - 12);

        ctx.font = '500 10px Poppins';
        ctx.fillText(sprints[idx], c.x, pTop + cH + 15);
    });
}

// 3. Team Health (Communication=5, Collaboration=4, Planning=5, Testing=4, Documentation=5)
function drawHealthChart() {
    const canvas = document.getElementById('healthChart');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const ctx = setupMetricsDPI(canvas);
    const colors = getMetricThemeColors();

    const metrics = ['Comm.', 'Collab.', 'Plan', 'Test', 'Doc.'];
    const scores = [5, 4, 5, 4, 5];

    const pLeft = 40;
    const pBottom = 30;
    const pTop = 20;
    const pRight = 20;

    const cW = width - pLeft - pRight;
    const cH = height - pTop - pBottom;

    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.fillStyle = colors.text;
    ctx.font = '10px Poppins';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const maxVal = 5;
    for (let i = 0; i <= 5; i++) {
        const y = pTop + cH - (i / 5) * cH;
        ctx.beginPath();
        ctx.moveTo(pLeft, y);
        ctx.lineTo(width - pRight, y);
        ctx.stroke();
        ctx.fillText(i, pLeft - 8, y);
    }

    const barWidth = 26;
    const gap = (cW - (barWidth * 5)) / 6;

    metrics.forEach((metric, idx) => {
        const val = scores[idx];
        const barH = (val / maxVal) * cH;
        const x = pLeft + gap + idx * (barWidth + gap);
        const y = pTop + cH - barH;

        ctx.fillStyle = '#2E7D32';
        ctx.beginPath();
        ctx.roundRect ? ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]) : ctx.rect(x, y, barWidth, barH);
        ctx.fill();

        ctx.fillStyle = colors.text;
        ctx.textAlign = 'center';
        ctx.font = 'bold 11px Poppins';
        ctx.fillText(val, x + barWidth / 2, y - 8);

        ctx.font = '500 10px Poppins';
        ctx.fillText(metric, x + barWidth / 2, pTop + cH + 15);
    });
}
