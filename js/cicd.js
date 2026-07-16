/* ==========================================================================
   RoadGuard - CI/CD Pipeline & DoD Checklist Controller (js/cicd.js)
   ========================================================================== */

const DOD_STORAGE_KEY = 'roadguard_dod_checklist';

const pipelineDetails = {
    'developer': {
        title: 'Step 1: Developer Coding & Environment',
        description: 'Developer writes clean, semantic HTML5, responsive CSS3 styles, and modular Vanilla JS following strict linting standards and design patterns. Variables are structured under global theme tokens.'
    },
    'testing': {
        title: 'Step 2: Local Unit & Integration Testing',
        description: 'Code undergoes basic local test suites. CRUD functionality on LocalStorage is simulated, form validation bounds are verified, and file size constraints are validated before branch commit.'
    },
    'review': {
        title: 'Step 3: Peer Code Review',
        description: 'Secondary developers inspect the pull request. Checklist items like naming conventions, readability, comments, error logging, performance, and DRY violations are scrutinized.'
    },
    'bugfix': {
        title: 'Step 4: Bug Fixing & Refactoring',
        description: 'Any review comments, syntax discrepancies, or edge case failures discovered during tests are resolved. Code is updated and re-verified.'
    },
    'browser': {
        title: 'Step 5: Cross Browser & Device Testing',
        description: 'Layout layouts and scripts are tested on multiple rendering engines: Blink (Chrome, Edge), Gecko (Firefox), and WebKit (Safari) to ensure 100% consistent responsiveness.'
    },
    'dod': {
        title: 'Step 6: Definition of Done (DoD) Verification',
        description: 'Final structural checklist verification. Every item in the team-approved DoD checklist must be fully checked and passed before code merges into the production branch.'
    },
    'sprintreview': {
        title: 'Step 7: Sprint Review & Demo',
        description: 'The completed sprint increment is demoed directly to product owners and stakeholders. Visual assets and tracking dashboards are verified for deployment eligibility.'
    },
    'release': {
        title: 'Step 8: Final Deployment / Release',
        description: 'The validated codebase is packaged and deployed to static hosting environments (simulated production release). Pothole reports databases are updated.'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const pageName = path.split("/").pop() || 'index.html';

    if (pageName === 'cicd.html') {
        initCICDModule();
    }
});

function initCICDModule() {
    initPipelineClickHandlers();
    initDoDChecklist();
}

function initPipelineClickHandlers() {
    const nodes = document.querySelectorAll('.pipeline-node');
    const detailBox = document.getElementById('pipeline-detail-box');
    const detailTitle = document.getElementById('pipeline-detail-title');
    const detailDesc = document.getElementById('pipeline-detail-desc');

    if (nodes.length > 0 && detailBox) {
        nodes.forEach(node => {
            node.addEventListener('click', () => {
                // Clear active states
                nodes.forEach(n => n.classList.remove('active'));
                
                // Add active to clicked
                node.classList.add('active');
                
                // Fetch info
                const stageKey = node.getAttribute('data-stage');
                const stageData = pipelineDetails[stageKey];

                if (stageData) {
                    detailTitle.textContent = stageData.title;
                    detailDesc.textContent = stageData.description;
                    detailBox.style.animation = 'scaleIn 0.3s ease-out';
                    
                    // Reset animation class for repeat clicks
                    setTimeout(() => {
                        detailBox.style.animation = '';
                    }, 300);
                }
            });
        });
        
        // Trigger first click to show default info
        nodes[0].click();
    }
}

function initDoDChecklist() {
    const checklistContainer = document.getElementById('dod-checklist-container');
    const progressCount = document.getElementById('dod-progress-count');
    const progressFill = document.getElementById('dod-progress-fill');

    if (!checklistContainer) return;

    // Load state from localStorage or default empty
    const defaultChecklist = {
        'feat-complete': true,
        'req-satisfied': true,
        'code-reviewed': true,
        'html-val': true,
        'css-test': true,
        'js-test': false,
        'resp-verified': true,
        'browser-test': true,
        'no-bugs': false,
        'doc-updated': true,
        'team-approved': false
    };

    let savedState = localStorage.getItem(DOD_STORAGE_KEY);
    const state = savedState ? JSON.parse(savedState) : defaultChecklist;

    // Render list elements dynamically to capture clicks easily
    const items = [
        { key: 'feat-complete', label: 'Feature Completed (Code satisfies requirements)' },
        { key: 'req-satisfied', label: 'Requirements fully satisfied and documented' },
        { key: 'code-reviewed', label: 'Code reviewed by a peer (No critical blockers)' },
        { key: 'html-val', label: 'HTML validated (Clean semantic structures)' },
        { key: 'css-test', label: 'CSS tested (Responsive layout rules match wireframes)' },
        { key: 'js-test', label: 'JavaScript tested (Form validations and DOM actions)' },
        { key: 'resp-verified', label: 'Responsive design verified (Mobile, Tablet, Desktop)' },
        { key: 'browser-test', label: 'Cross browser testing completed (Chrome, Firefox, Safari, Edge)' },
        { key: 'no-bugs', label: 'No critical bugs or regressions present' },
        { key: 'doc-updated', label: 'Documentation updated (README file and comments)' },
        { key: 'team-approved', label: 'Approved by Agile Scrum Team for release' }
    ];

    checklistContainer.innerHTML = items.map(item => {
        const checkedStr = state[item.key] ? 'checked' : '';
        const itemClass = state[item.key] ? 'checklist-item checked' : 'checklist-item';
        return `
            <label class="${itemClass}" data-key="${item.key}">
                <input type="checkbox" id="chk-${item.key}" ${checkedStr}>
                <span>${item.label}</span>
            </label>
        `;
    }).join('');

    // Update progress numbers
    updateDoDProgress(state, items.length, progressCount, progressFill);

    // Register checkbox toggling
    const checkboxes = checklistContainer.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(chk => {
        chk.addEventListener('change', (e) => {
            const label = chk.closest('.checklist-item');
            const key = label.getAttribute('data-key');
            
            state[key] = chk.checked;
            localStorage.setItem(DOD_STORAGE_KEY, JSON.stringify(state));

            if (chk.checked) {
                label.classList.add('checked');
            } else {
                label.classList.remove('checked');
            }

            updateDoDProgress(state, items.length, progressCount, progressFill);
            window.showToast('Definition of Done checklist updated', 'info');
        });
    });
}

function updateDoDProgress(state, total, textNode, fillNode) {
    const checkedCount = Object.values(state).filter(Boolean).length;
    if (textNode) {
        textNode.textContent = `${checkedCount} of ${total} Items Verified`;
    }
    if (fillNode) {
        const pct = Math.round((checkedCount / total) * 100);
        fillNode.style.width = `${pct}%`;
    }
}
