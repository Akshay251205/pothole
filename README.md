# RoadGuard - Smart Road Pothole Reporting and Tracking System

A responsive civic web portal simulated as a Smart India Hackathon (SIH) prototype. It allows citizens to report pothole damages with photographic evidence, location pins, and severity indicators, and grants municipal authorities administrative rights to manage repairs, delegate tasks, track metrics, and run Agile Scrumban sprints.

---

## 📂 Project Directory Structure

```text
SIH_Pothole/
│
├── index.html                   # Homepage (Hero, visual workflows, and counter stats)
├── citizen-login.html           # Citizen login panel (autofill enabled)
├── citizen-register.html        # Citizen registration form with client validation
├── authority-login.html         # Authority portal secure login (autofill enabled)
├── citizen-dashboard.html       # Citizen dashboard (submit list, counters, actions)
├── report-pothole.html          # Reporting form (FileReader previews & coordinates simulator)
├── track-status.html            # Tracking progress nodes & animated timeline
├── authority-dashboard.html     # Authority workspace (sorting, filtering, actions, modals)
├── analytics.html               # Canvas charts (pie, bar, and donut charts)
├── agile-management.html        # Jira board simulation, draggable cards, sprint velocities
├── cicd.html                    # Simulated interactive pipelines, DoD checklists
├── about.html                   # Vision, specifications, technology definitions
├── contact.html                 # Validated contact form and simulated office maps
├── 404.html                     # Error handler ("fallen into a pothole")
│
├── css/
│   └── style.css                # Global stylesheet (Design variables, layouts, theme overlays)
│
└── js/
    ├── app.js                   # Common utilities (Theme toggle, toast alerts, loading spin)
    ├── auth.js                  # Authentication, sessions, and page security guards
    ├── reports.js               # LocalStorage manager & 15 preloaded sample reports
    ├── dashboard.js             # Citizen & Admin actions, file validation, tables
    ├── analytics.js             # Pure Canvas reporting engine (No external plugins)
    ├── agile.js                 # Draggable board controller & Sprint PM metrics
    └── cicd.js                  # Releases interactive pipeline & checklist state manager
```

---

## ⚡ Core Features

1. **Authentication Roles**:
   *   **Citizen**: Can register, log in, submit potholes, and track their reports.
   *   **Municipal Authority**: Can log in as an administrator, view all complaints, assign crews, log estimated dates/remarks, edit statuses, and delete entries.
2. **File Processing (FileReader API)**:
   *   Validates uploaded image formats (`JPEG`, `JPG`, `PNG`) and limits file sizes to under **5MB** with immediate base64-encoded user previews.
3. **HTML5 Geolocation / Simulation**:
   *   Provides a coordinate mapping interface equipped with a mock GPS coordinate simulator button generating realistic latitude/longitude parameters.
4. **Tracking Timeline Progress**:
   *   An animated progress bar mapping reports through 7 stages: `Submitted` ➔ `Under Review` ➔ `Assigned` ➔ `Repair In Progress` ➔ `Completed` ➔ `Verified` ➔ `Closed`.
5. **Admin Search, Sort, and Filter**:
   *   Live keywords search by ID, Citizen, or Location.
   *   Multi-parameter filters (by Status and Severity) and sorting controls (Newest, Oldest, Priority, Completed).
6. **Canvas-Based Data Analytics**:
   *   Zero external dependencies (No Chart.js). Sharp high-DPI canvas charts detailing **Complaint Status Pie Chart**, **Monthly volume Bar Chart**, and **Severity ratios Donut Chart**.
7. **ScrumBan board (HTML5 Drag and Drop)**:
   *   Simulates 28 Jira user stories spread across 5 Sprints. Cards are fully draggable across columns: `Backlog`, `Ready`, `Sprint`, `In Progress`, `Peer Review`, `Testing`, `Done`. State is updated and saved in LocalStorage.
8. **Interactive CI/CD & DoD Checklists**:
   *   Interactive release pipeline diagrams showing developers the flow of code. Includes a Definition of Done checklist that persists checkboxes state in LocalStorage and displays release readiness percentages.
9. **Dark Mode Toggle**:
   *   Comfortable reading in low-light environments. Saves preference locally.

---

## 🔑 Demo Access Credentials

For evaluation and demonstration purposes, use the following logins (autofill buttons are provided on login pages):

### 👤 Citizen Demo Login
*   **Email**: `citizen@gmail.com`
*   **Password**: `123456`

### 🛡️ Municipal Authority Demo Login
*   **Username**: `admin`
*   **Password**: `admin123`

---

## 🚀 Setup & Execution Instructions

Since this is built strictly with **HTML5, CSS3, and Vanilla JavaScript**, no backend setup, Node server, or database server configurations are required.

1.  **Extract / Place Project**: Ensure the directory structure mirrors the layout.
2.  **Launch Web Page**: Open `index.html` directly in any modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari) by double-clicking the file.
3.  **Local Server (Optional)**: If you want to run it via a local development server (e.g. VS Code Live Server or python `http.server`), execute:
    ```bash
    python -m http.server 8000
    ```
    Then visit `http://localhost:8000/index.html` in your browser.

---

## ⚙️ Simulated Agile Backlog & Sprints (Jira Board)

The Agile Board (`agile-management.html`) simulates 28 user stories categorized under 4 Epics:
*   **Epic 1**: Citizen Reporting
*   **Epic 2**: Authority Dashboard
*   **Epic 3**: Status Tracking
*   **Epic 4**: Analytics and Reporting

### Sprints Cycles
*   **Sprint 1**: Setup environment & variables, layout designs, and User Auth pages.
*   **Sprint 2**: Submit modules, File uploads, size checks, and FileReader previews.
*   **Sprint 3**: Admin control queues, modal inspectors, status mappings, and row deletes.
*   **Sprint 4**: Canvas chart rendering (Pie, Bar, and Donut) and search/filter toolbars.
*   **Sprint 5**: Cross-browser tests, CI/CD pipeline guides, and final release.

---

## ⚠️ Technical Limitations & Notes

*   **Mock GPS**: Geolocation coordinates are simulated using random offsets for safety and reliability during testing.
*   **Storage Lifespan**: Data is stored inside the client browser's `localStorage`. Clearing browser data or cache will wipe the mock reports and reset them to the 15 preloaded sample reports.
*   **No Server Backend**: This application is a 100% serverless static web portal prototype. Status alerts and notifications are simulated using custom visual toast notifications on client screens.
