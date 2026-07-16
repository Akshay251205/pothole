/* ==========================================================================
   RoadGuard - Dashboard & Modules Controller (js/dashboard.js)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const pageName = path.split("/").pop() || 'index.html';

    // Route Guards check
    if (pageName === 'citizen-dashboard.html' || pageName === 'report-pothole.html') {
        if (!Auth.requireAuth('citizen')) return;
    }
    if (pageName === 'authority-dashboard.html') {
        if (!Auth.requireAuth('authority')) return;
    }

    // Module Initializations
    if (pageName === 'citizen-dashboard.html') {
        initCitizenDashboard();
    } else if (pageName === 'report-pothole.html') {
        initReportForm();
    } else if (pageName === 'track-status.html') {
        initTrackStatus();
    } else if (pageName === 'authority-dashboard.html') {
        initAuthorityDashboard();
    }
});

/* ==========================================================================
   Citizen Dashboard Module
   ========================================================================== */
function initCitizenDashboard() {
    const session = Auth.getSession();
    if (!session) return;

    // Set Welcome Name
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = session.name;

    const reports = ReportsDB.getReports();
    // Filter reports to current citizen's email
    const citizenReports = reports.filter(r => r.citizenEmail === session.email);

    // Calculate Counters
    const totalReports = citizenReports.length;
    const pendingRepairs = citizenReports.filter(r => ['Submitted', 'Under Review', 'Assigned', 'Repair In Progress'].includes(r.status)).length;
    const completedRepairs = citizenReports.filter(r => ['Completed', 'Verified', 'Closed'].includes(r.status)).length;

    // Set UI Counters
    const countTotal = document.getElementById('count-total');
    const countPending = document.getElementById('count-pending');
    const countCompleted = document.getElementById('count-completed');
    
    if (countTotal) countTotal.textContent = totalReports;
    if (countPending) countPending.textContent = pendingRepairs;
    if (countCompleted) countCompleted.textContent = completedRepairs;

    // Render Citizen Complaints Table
    renderCitizenTable(citizenReports);
}

function renderCitizenTable(reports) {
    const tbody = document.getElementById('citizen-reports-tbody');
    if (!tbody) return;

    if (reports.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6">
                    <div class="empty-state">
                        <i class="fas fa-folder-open"></i>
                        <h3>No Reports Found</h3>
                        <p>You have not reported any road potholes yet. Click below to start.</p>
                        <a href="report-pothole.html" class="btn btn-primary" style="margin-top: 15px;">
                            <i class="fas fa-plus"></i> Report New Pothole
                        </a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = reports.map(r => `
        <tr>
            <td style="font-weight: 700;">${r.id}</td>
            <td style="font-weight: 600;">${r.title}</td>
            <td>${r.roadName}, ${r.area}</td>
            <td><span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span></td>
            <td><span class="badge badge-${getBadgeClass(r.status)}">${r.status}</span></td>
            <td>
                <a href="track-status.html?id=${r.id}" class="btn btn-secondary" style="padding: 5px 10px; font-size: 12px;">
                    <i class="fas fa-route"></i> Track
                </a>
            </td>
        </tr>
    `).join('');
}

function getBadgeClass(status) {
    switch (status) {
        case 'Submitted': return 'submitted';
        case 'Under Review': return 'review';
        case 'Assigned': return 'assigned';
        case 'Repair In Progress': return 'progress';
        case 'Completed': return 'completed';
        case 'Verified': return 'verified';
        case 'Closed': return 'closed';
        default: return 'submitted';
    }
}

/* ==========================================================================
   Report Pothole Form Module
   ========================================================================== */
function initReportForm() {
    const session = Auth.getSession();
    const dragzone = document.getElementById('upload-dragzone');
    const fileInput = document.getElementById('pothole-image');
    const previewContainer = document.getElementById('preview-container');
    const imagePreview = document.getElementById('image-preview');
    const removeBtn = document.getElementById('remove-preview-btn');
    const form = document.getElementById('report-pothole-form');

    let base64Image = '';

    // Simulate GPS Coords button
    const gpsBtn = document.getElementById('simulate-gps-btn');
    if (gpsBtn) {
        gpsBtn.addEventListener('click', () => {
            const randomLat = (12.9 + Math.random() * 15).toFixed(4);
            const randomLng = (77.5 + Math.random() * 10).toFixed(4);
            
            const latField = document.getElementById('latitude');
            const lngField = document.getElementById('longitude');
            if (latField && lngField) {
                latField.value = randomLat;
                lngField.value = randomLng;
                showToast('GPS coordinates simulated successfully!', 'success');
            }
        });
    }

    // File Drag and Drop / Select Events
    if (dragzone && fileInput) {
        dragzone.addEventListener('click', () => fileInput.click());

        dragzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dragzone.classList.add('dragover');
        });

        dragzone.addEventListener('dragleave', () => {
            dragzone.classList.remove('dragover');
        });

        dragzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dragzone.classList.remove('dragover');
            if (e.dataTransfer.files.length) {
                validateAndPreviewFile(e.dataTransfer.files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length) {
                validateAndPreviewFile(e.target.files[0]);
            }
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            fileInput.value = '';
            base64Image = '';
            previewContainer.style.display = 'none';
            dragzone.style.display = 'block';
        });
    }

    function validateAndPreviewFile(file) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        const maxSize = 5 * 1024 * 1024; // 5MB

        if (!allowedTypes.includes(file.type)) {
            showToast('Unsupported file format. Please upload JPG, JPEG or PNG.', 'danger');
            return;
        }

        if (file.size > maxSize) {
            showToast('File is too large. Maximum size allowed is 5MB.', 'danger');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            base64Image = e.target.result;
            imagePreview.src = base64Image;
            dragzone.style.display = 'none';
            previewContainer.style.display = 'block';
            showToast('Image uploaded successfully.', 'success');
        };
        reader.readAsDataURL(file);
    }

    // Submit form logic
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const title = document.getElementById('title').value.trim();
            const description = document.getElementById('description').value.trim();
            const severity = document.getElementById('severity').value;
            const roadName = document.getElementById('roadName').value.trim();
            const area = document.getElementById('area').value.trim();
            const city = document.getElementById('city').value.trim();
            const state = document.getElementById('state').value.trim();
            const pincode = document.getElementById('pincode').value.trim();
            const latitude = document.getElementById('latitude').value.trim();
            const longitude = document.getElementById('longitude').value.trim();

            if (!base64Image) {
                showToast('Pothole image is required. Please upload a photo.', 'warning');
                return;
            }

            const now = new Date();
            const dateStr = now.toISOString().slice(0, 10);
            const timeStr = now.toTimeString().slice(0, 5);

            const newReport = {
                id: ReportsDB.generateId(),
                title,
                description,
                severity,
                roadName,
                area,
                city,
                state,
                pincode,
                latitude,
                longitude,
                image: base64Image,
                status: 'Submitted',
                assignedTeam: '',
                estimatedCompletion: '',
                remarks: 'Report generated by citizen.',
                date: dateStr,
                time: timeStr,
                citizenName: session.name,
                citizenEmail: session.email,
                citizenPhone: session.phone
            };

            ReportsDB.addReport(newReport);
            showToast(`Report submitted successfully! ID: ${newReport.id}`, 'success');

            setTimeout(() => {
                window.location.href = 'citizen-dashboard.html';
            }, 1200);
        });
    }
}

/* ==========================================================================
   Track Complaint Module
   ========================================================================== */
function initTrackStatus() {
    const searchForm = document.getElementById('track-search-form');
    const searchInput = document.getElementById('search-id-input');
    const resultsContainer = document.getElementById('track-results');

    // Parse query params to auto-track
    const urlParams = new URLSearchParams(window.location.search);
    const queryId = urlParams.get('id');

    if (queryId) {
        if (searchInput) searchInput.value = queryId;
        performSearch(queryId);
    }

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const searchId = searchInput.value.trim();
            if (!searchId) {
                showToast('Please enter a Complaint ID.', 'warning');
                return;
            }
            performSearch(searchId);
        });
    }

    function performSearch(id) {
        const report = ReportsDB.getReportById(id);
        if (!report) {
            resultsContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search-minus"></i>
                    <h3>Complaint Not Found</h3>
                    <p>No report matches ID <strong>${id}</strong>. Please check and try again.</p>
                </div>
            `;
            return;
        }

        const stages = ['Submitted', 'Under Review', 'Assigned', 'Repair In Progress', 'Completed', 'Verified', 'Closed'];
        const currentStageIndex = stages.indexOf(report.status);

        // Progress bar percentage
        const progressPercent = (currentStageIndex / (stages.length - 1)) * 100;

        resultsContainer.innerHTML = `
            <div class="track-timeline-container animate-fade-in">
                <h3 style="font-weight: 700; color: var(--primary-color); margin-bottom: 20px;">
                    Progress Timeline: ${report.id}
                </h3>
                
                <div class="timeline">
                    <div class="timeline-progress" style="width: ${progressPercent}%;"></div>
                    ${stages.map((stage, idx) => {
                        let stepClass = '';
                        if (idx < currentStageIndex) stepClass = 'active';
                        else if (idx === currentStageIndex) stepClass = 'current';
                        
                        let nodeIcon = '<i class="fas fa-check"></i>';
                        if (stage === 'Submitted') nodeIcon = '<i class="fas fa-file-alt"></i>';
                        else if (stage === 'Under Review') nodeIcon = '<i class="fas fa-search"></i>';
                        else if (stage === 'Assigned') nodeIcon = '<i class="fas fa-user-tag"></i>';
                        else if (stage === 'Repair In Progress') nodeIcon = '<i class="fas fa-tools"></i>';
                        else if (stage === 'Completed') nodeIcon = '<i class="fas fa-check-double"></i>';
                        else if (stage === 'Verified') nodeIcon = '<i class="fas fa-user-shield"></i>';
                        else if (stage === 'Closed') nodeIcon = '<i class="fas fa-lock"></i>';

                        return `
                            <div class="timeline-step ${stepClass}">
                                <div class="timeline-node">${nodeIcon}</div>
                                <div class="timeline-label">${stage}</div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>

            <div class="dashboard-grid">
                <div class="dashboard-card" style="grid-column: span 2;">
                    <h3 style="margin-bottom: 15px; font-weight: 700; color: var(--primary-color);">Complaint Details</h3>
                    <div class="form-row" style="margin-bottom: 15px;">
                        <div class="detail-item">
                            <div class="detail-label">Complaint Title</div>
                            <div class="detail-value">${report.title}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Current Status</div>
                            <div class="detail-value">
                                <span class="badge badge-${getBadgeClass(report.status)}">${report.status}</span>
                            </div>
                        </div>
                    </div>

                    <div class="detail-item" style="margin-bottom: 15px;">
                        <div class="detail-label">Description</div>
                        <div class="detail-value">${report.description}</div>
                    </div>

                    <div class="form-row" style="margin-bottom: 15px;">
                        <div class="detail-item">
                            <div class="detail-label">Location (Road & Area)</div>
                            <div class="detail-value">${report.roadName}, ${report.area}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">City & Pincode</div>
                            <div class="detail-value">${report.city} - ${report.pincode} (${report.state})</div>
                        </div>
                    </div>

                    <div class="form-row" style="margin-bottom: 15px;">
                        <div class="detail-item">
                            <div class="detail-label">Severity Level</div>
                            <div class="detail-value">
                                <span class="badge badge-${report.severity.toLowerCase()}">${report.severity}</span>
                            </div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Reported On</div>
                            <div class="detail-value">${report.date} at ${report.time}</div>
                        </div>
                    </div>

                    <div class="form-row" style="margin-bottom: 15px;">
                        <div class="detail-item">
                            <div class="detail-label">Assigned Repair Squad</div>
                            <div class="detail-value">${report.assignedTeam || 'Not Assigned Yet'}</div>
                        </div>
                        <div class="detail-item">
                            <div class="detail-label">Estimated Completion</div>
                            <div class="detail-value">${report.estimatedCompletion || 'N/A'}</div>
                        </div>
                    </div>

                    <div class="detail-item">
                        <div class="detail-label">Latest Remarks / Updates</div>
                        <div class="detail-value" style="font-style: italic; color: var(--text-muted);">"${report.remarks || 'None'}"</div>
                    </div>
                </div>

                <div class="dashboard-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <h3 style="margin-bottom: 15px; font-weight: 700; align-self: flex-start;">Pothole Photo</h3>
                    <img src="${report.image}" style="width: 100%; border-radius: var(--border-radius-md); object-fit: cover; max-height: 250px; border: 1px solid var(--border-color);" alt="Pothole Photo">
                    <div style="margin-top: 15px; font-size: 12px; color: var(--text-muted); text-align: center;">
                        <i class="fas fa-map-marker-alt" style="color: var(--danger-color)"></i> Lat: ${report.latitude}, Lng: ${report.longitude}
                    </div>
                </div>
            </div>
        `;
    }
}

/* ==========================================================================
   Authority Dashboard Module
   ========================================================================== */
let authorityReports = [];
let currentFilterStatus = 'All';
let currentFilterSeverity = 'All';
let currentSortOption = 'Newest';
let searchQuery = '';

function initAuthorityDashboard() {
    authorityReports = ReportsDB.getReports();

    // Setup Counter Stats
    updateAuthorityCounters();

    // Render Table list
    renderAuthorityTable();

    // Register Toolbar Handlers
    const searchInput = document.getElementById('auth-search');
    const filterStatus = document.getElementById('filter-status');
    const filterSeverity = document.getElementById('filter-severity');
    const sortSelect = document.getElementById('sort-options');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value.trim().toLowerCase();
            renderAuthorityTable();
        });
    }

    if (filterStatus) {
        filterStatus.addEventListener('change', (e) => {
            currentFilterStatus = e.target.value;
            renderAuthorityTable();
        });
    }

    if (filterSeverity) {
        filterSeverity.addEventListener('change', (e) => {
            currentFilterSeverity = e.target.value;
            renderAuthorityTable();
        });
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentSortOption = e.target.value;
            renderAuthorityTable();
        });
    }

    // Modal Closing Events
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Form Update Submission Handler
    const updateForm = document.getElementById('status-update-form');
    if (updateForm) {
        updateForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('update-report-id').value;
            const status = document.getElementById('update-status-select').value;
            const team = document.getElementById('update-team-input').value.trim();
            const completion = document.getElementById('update-completion-input').value;
            const remarks = document.getElementById('update-remarks-input').value.trim();

            ReportsDB.updateReport(id, {
                status,
                assignedTeam: team,
                estimatedCompletion: completion,
                remarks
            });

            // Hide Modal
            document.getElementById('update-modal').style.display = 'none';

            // Refresh
            authorityReports = ReportsDB.getReports();
            updateAuthorityCounters();
            renderAuthorityTable();

            showToast(`Complaint ${id} updated successfully!`, 'success');
        });
    }
}

function updateAuthorityCounters() {
    const total = authorityReports.length;
    const pending = authorityReports.filter(r => ['Submitted', 'Under Review'].includes(r.status)).length;
    const critical = authorityReports.filter(r => r.severity === 'Critical').length;
    const completed = authorityReports.filter(r => ['Completed', 'Verified', 'Closed'].includes(r.status)).length;

    const authTotal = document.getElementById('auth-total-count');
    const authPending = document.getElementById('auth-pending-count');
    const authCritical = document.getElementById('auth-critical-count');
    const authCompleted = document.getElementById('auth-completed-count');

    if (authTotal) authTotal.textContent = total;
    if (authPending) authPending.textContent = pending;
    if (authCritical) authCritical.textContent = critical;
    if (authCompleted) authCompleted.textContent = completed;
}

function renderAuthorityTable() {
    const tbody = document.getElementById('auth-reports-tbody');
    if (!tbody) return;

    // Filter Logic
    let filtered = [...authorityReports];

    if (searchQuery) {
        filtered = filtered.filter(r => 
            r.id.toLowerCase().includes(searchQuery) ||
            r.citizenName.toLowerCase().includes(searchQuery) ||
            r.roadName.toLowerCase().includes(searchQuery) ||
            r.area.toLowerCase().includes(searchQuery) ||
            r.city.toLowerCase().includes(searchQuery)
        );
    }

    if (currentFilterStatus !== 'All') {
        filtered = filtered.filter(r => r.status === currentFilterStatus);
    }

    if (currentFilterSeverity !== 'All') {
        filtered = filtered.filter(r => r.severity === currentFilterSeverity);
    }

    // Sorting Logic
    if (currentSortOption === 'Newest') {
        filtered.sort((a, b) => b.id.localeCompare(a.id));
    } else if (currentSortOption === 'Oldest') {
        filtered.sort((a, b) => a.id.localeCompare(b.id));
    } else if (currentSortOption === 'Priority') {
        const severityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        filtered.sort((a, b) => (severityWeight[b.severity] || 0) - (severityWeight[a.severity] || 0));
    } else if (currentSortOption === 'Completed') {
        const statusWeight = (status) => ['Completed', 'Verified', 'Closed'].includes(status) ? 1 : 0;
        filtered.sort((a, b) => statusWeight[b.status] - statusWeight[a.status]);
    }

    if (filtered.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7">
                    <div class="empty-state">
                        <i class="fas fa-folder-open"></i>
                        <h3>No Records Found</h3>
                        <p>No complaints match the selected filter/search criteria.</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = filtered.map(r => `
        <tr>
            <td style="font-weight: 700;">${r.id}</td>
            <td style="font-weight: 600;">${r.citizenName}</td>
            <td>${r.roadName}, ${r.area}, ${r.city}</td>
            <td><span class="badge badge-${r.severity.toLowerCase()}">${r.severity}</span></td>
            <td><span class="badge badge-${getBadgeClass(r.status)}">${r.status}</span></td>
            <td>${r.date}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 11px;" onclick="openDetailsModal('${r.id}')">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-primary" style="padding: 5px 10px; font-size: 11px;" onclick="openUpdateModal('${r.id}')">
                        <i class="fas fa-edit"></i> Update
                    </button>
                    <button class="btn btn-danger" style="padding: 5px 10px; font-size: 11px;" onclick="deleteReportRecord('${r.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Global modal actions
window.openDetailsModal = function(id) {
    const report = ReportsDB.getReportById(id);
    if (!report) return;

    const modal = document.getElementById('details-modal');
    const content = document.getElementById('details-modal-content');
    
    if (modal && content) {
        content.innerHTML = `
            <div class="form-row" style="margin-bottom:15px;">
                <div class="detail-item">
                    <div class="detail-label">Complaint ID</div>
                    <div class="detail-value">${report.id}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value">
                        <span class="badge badge-${getBadgeClass(report.status)}">${report.status}</span>
                    </div>
                </div>
            </div>
            <div class="form-row" style="margin-bottom:15px;">
                <div class="detail-item">
                    <div class="detail-label">Reporter Name</div>
                    <div class="detail-value">${report.citizenName}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Reporter Phone / Email</div>
                    <div class="detail-value">${report.citizenPhone} <br> ${report.citizenEmail}</div>
                </div>
            </div>
            <div class="detail-item" style="margin-bottom:15px;">
                <div class="detail-label">Complaint Title</div>
                <div class="detail-value">${report.title}</div>
            </div>
            <div class="detail-item" style="margin-bottom:15px;">
                <div class="detail-label">Description</div>
                <div class="detail-value">${report.description}</div>
            </div>
            <div class="form-row" style="margin-bottom:15px;">
                <div class="detail-item">
                    <div class="detail-label">Location Details</div>
                    <div class="detail-value">${report.roadName}, ${report.area}, ${report.city}, ${report.state} - ${report.pincode}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">GPS Coordinates</div>
                    <div class="detail-value">Lat: ${report.latitude}, Lng: ${report.longitude}</div>
                </div>
            </div>
            <div class="form-row" style="margin-bottom:15px;">
                <div class="detail-item">
                    <div class="detail-label">Severity Level</div>
                    <div class="detail-value">
                        <span class="badge badge-${report.severity.toLowerCase()}">${report.severity}</span>
                    </div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Submission Timestamp</div>
                    <div class="detail-value">${report.date} at ${report.time}</div>
                </div>
            </div>
            <div class="form-row" style="margin-bottom:15px;">
                <div class="detail-item">
                    <div class="detail-label">Assigned Squad</div>
                    <div class="detail-value">${report.assignedTeam || 'None'}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Est. Completion</div>
                    <div class="detail-value">${report.estimatedCompletion || 'N/A'}</div>
                </div>
            </div>
            <div class="detail-item" style="margin-bottom:15px;">
                <div class="detail-label">Remarks</div>
                <div class="detail-value" style="font-style:italic; color:var(--text-muted);">"${report.remarks || 'None'}"</div>
            </div>
            <div class="detail-item">
                <div class="detail-label">Pothole Photograph Preview</div>
                <img src="${report.image}" style="width:100%; border-radius: var(--border-radius-md); object-fit:cover; max-height:220px; border:1px solid var(--border-color);" alt="Photo">
            </div>
        `;
        modal.style.display = 'flex';
    }
};

window.openUpdateModal = function(id) {
    const report = ReportsDB.getReportById(id);
    if (!report) return;

    const modal = document.getElementById('update-modal');
    if (modal) {
        document.getElementById('update-report-id').value = report.id;
        document.getElementById('update-status-select').value = report.status;
        document.getElementById('update-team-input').value = report.assignedTeam || '';
        document.getElementById('update-completion-input').value = report.estimatedCompletion || '';
        document.getElementById('update-remarks-input').value = report.remarks || '';

        modal.style.display = 'flex';
    }
};

window.deleteReportRecord = function(id) {
    showCustomConfirm(`Are you sure you want to permanently delete complaint ${id}?`, () => {
        const deleted = ReportsDB.deleteReport(id);
        if (deleted) {
            authorityReports = ReportsDB.getReports();
            updateAuthorityCounters();
            renderAuthorityTable();
            showToast(`Complaint ${id} has been deleted.`, 'success');
        } else {
            showToast(`Failed to delete complaint ${id}.`, 'danger');
        }
    });
};
