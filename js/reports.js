/* ==========================================================================
   RoadGuard - Pothole Reports Data Manager (js/reports.js)
   ========================================================================== */

const REPORTS_STORAGE_KEY = 'roadguard_reports';

// Default mock image (simple base64 grey pothole svg placeholder to ensure functional rendering)
const MOCK_POTHOLE_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"><rect width="100%" height="100%" fill="%23b0bec5"/><ellipse cx="150" cy="100" rx="90" ry="50" fill="%2337474f"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" fill="%23eceff1" font-family="sans-serif" font-size="16">Pothole Photograph</text></svg>';

const sampleReports = [
    {
        id: 'RG1001',
        title: 'Deep Crater near Metro Station',
        description: 'Large pothole on the main road right outside the entry gate. Dangerous for two-wheelers during peak hours.',
        severity: 'Critical',
        roadName: 'Outer Ring Road',
        area: 'Hebbal Metro',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560024',
        latitude: '13.0354',
        longitude: '77.5988',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Submitted',
        assignedTeam: '',
        estimatedCompletion: '',
        remarks: 'Report received. Inspection team will visit shortly.',
        date: '2026-07-16',
        time: '09:30',
        citizenName: 'Aarav Mehta',
        citizenEmail: 'aarav.mehta@gmail.com',
        citizenPhone: '9876543210'
    },
    {
        id: 'RG1002',
        title: 'Series of Potholes on Highway flyover',
        description: 'Multiple potholes causing traffic slowdowns and sudden braking on the flyover. High speed risk.',
        severity: 'High',
        roadName: 'Western Express Highway',
        area: 'Andheri East Flyover',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400069',
        latitude: '19.1136',
        longitude: '72.8697',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Under Review',
        assignedTeam: '',
        estimatedCompletion: '',
        remarks: 'Case assigned for technical assessment of flyover structure.',
        date: '2026-07-15',
        time: '14:20',
        citizenName: 'Priya Sharma',
        citizenEmail: 'priya.sharma@yahoo.com',
        citizenPhone: '9812345678'
    },
    {
        id: 'RG1003',
        title: 'Waterlogged Pothole near School',
        description: 'Pothole gets filled with muddy water making it invisible to pedestrians and cyclists. Dangerous for children.',
        severity: 'Critical',
        roadName: 'Guru Gobind Singh Marg',
        area: 'Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        latitude: '28.6304',
        longitude: '77.2177',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Assigned',
        assignedTeam: 'North Delhi Road Division-4',
        estimatedCompletion: '2026-07-22',
        remarks: 'Assigned team dispatched to drain water and patch with cold mix.',
        date: '2026-07-14',
        time: '11:15',
        citizenName: 'Rohan Gupta',
        citizenEmail: 'rohan.g@gmail.com',
        citizenPhone: '8887776665'
    },
    {
        id: 'RG1004',
        title: 'Sunken Road Patch near Market',
        description: 'The asphalt layer has sunken by nearly 4 inches. Vehicles trip and wobble when passing over it.',
        severity: 'Medium',
        roadName: 'Commercial Street',
        area: 'Tasker Town',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        latitude: '12.9822',
        longitude: '77.6083',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Repair In Progress',
        assignedTeam: 'East Zone Road Maintenance Team B',
        estimatedCompletion: '2026-07-18',
        remarks: 'Excavation of loose layers completed. Resurfacing in progress today.',
        date: '2026-07-12',
        time: '17:45',
        citizenName: 'Ananya Rao',
        citizenEmail: 'ananya.rao@outlook.com',
        citizenPhone: '7776665554'
    },
    {
        id: 'RG1005',
        title: 'Pothole Fixed near Temple Road',
        description: 'A medium pothole near the temple entrance has been fixed successfully. Thanks for rapid tracking!',
        severity: 'Medium',
        roadName: 'Kapaleeshwarar Sannidhi Street',
        area: 'Mylapore',
        city: 'Chennai',
        state: 'Tamil Nadu',
        pincode: '600004',
        latitude: '13.0331',
        longitude: '80.2696',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Completed',
        assignedTeam: 'Chennai Corporation Zone 9',
        estimatedCompletion: '2026-07-14',
        remarks: 'Pothole filled with asphalt mixture. Compaction check done.',
        date: '2026-07-10',
        time: '08:00',
        citizenName: 'Suresh Kumar',
        citizenEmail: 'suresh.k@gmail.com',
        citizenPhone: '9444012345'
    },
    {
        id: 'RG1006',
        title: 'Edge Collapse on River Road',
        description: 'Edge of the paved road is breaking down into the stormwater drain. Narrowing the driving lane.',
        severity: 'High',
        roadName: 'Bypass Canal Road',
        area: 'Lake Town',
        city: 'Kolkata',
        state: 'West Bengal',
        pincode: '700089',
        latitude: '22.6012',
        longitude: '88.4014',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Verified',
        assignedTeam: 'PWD Road Wing Team C',
        estimatedCompletion: '2026-07-12',
        remarks: 'Retaining brick wall built and edge paved. Citizen verified repair quality.',
        date: '2026-07-08',
        time: '10:30',
        citizenName: 'Debarati Roy',
        citizenEmail: 'debarati.roy@gmail.com',
        citizenPhone: '9830012345'
    },
    {
        id: 'RG1007',
        title: 'Minor cracks turning to pothole',
        description: 'Developing alligator cracks on the road. Water is seeping and forming small cavities.',
        severity: 'Low',
        roadName: 'Sardar Patel Marg',
        area: 'Chanakyapuri',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110021',
        latitude: '28.5992',
        longitude: '77.1856',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Closed',
        assignedTeam: 'NDMC Maintenance Team',
        estimatedCompletion: '2026-07-06',
        remarks: 'Sealing of cracks done using liquid bitumen to prevent pothole formation.',
        date: '2026-07-03',
        time: '15:10',
        citizenName: 'Vikram Singh',
        citizenEmail: 'vikram.singh@gmail.com',
        citizenPhone: '9910099100'
    },
    {
        id: 'RG1008',
        title: 'Dangerous Pothole on Curve',
        description: 'Pothole lies right on a sharp blind curve. Vehicles attempting to bypass it end up going head-on with oncoming traffic.',
        severity: 'Critical',
        roadName: 'SGS Ashram Road',
        area: 'Navlakha',
        city: 'Indore',
        state: 'Madhya Pradesh',
        pincode: '452001',
        latitude: '22.7001',
        longitude: '75.8790',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Submitted',
        assignedTeam: '',
        estimatedCompletion: '',
        remarks: 'Pothole marked as Critical. Immediate barrier placing initiated.',
        date: '2026-07-16',
        time: '16:40',
        citizenName: 'Manish Verma',
        citizenEmail: 'manish.v@gmail.com',
        citizenPhone: '9826098260'
    },
    {
        id: 'RG1009',
        title: 'Deep Pit opposite Mall Entrance',
        description: 'A square-cut pothole left incomplete after utility pipe repairs. Dangerous edge.',
        severity: 'High',
        roadName: 'Gachibowli Main Road',
        area: 'Hitech City',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500081',
        latitude: '17.4483',
        longitude: '78.3741',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Under Review',
        assignedTeam: '',
        estimatedCompletion: '',
        remarks: 'Notified water supply department to finish excavation paving.',
        date: '2026-07-16',
        time: '11:00',
        citizenName: 'Sai Kiran',
        citizenEmail: 'sai.kiran@gmail.com',
        citizenPhone: '9000190001'
    },
    {
        id: 'RG1010',
        title: 'Multiple small holes in lane',
        description: 'Road surface is breaking down with several small potholes spread across 20 meters.',
        severity: 'Low',
        roadName: 'JLN Road',
        area: 'Malviya Nagar',
        city: 'Jaipur',
        state: 'Rajasthan',
        pincode: '302017',
        latitude: '26.8529',
        longitude: '75.8050',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Assigned',
        assignedTeam: 'Jaipur Nagar Nigam Zone 4',
        estimatedCompletion: '2026-07-25',
        remarks: 'Slurry seal treatment scheduled for next week.',
        date: '2026-07-14',
        time: '10:00',
        citizenName: 'Amit Sharma',
        citizenEmail: 'amit.jaipur@gmail.com',
        citizenPhone: '9414094140'
    },
    {
        id: 'RG1011',
        title: 'Big Hole on Bridge Entry',
        description: 'Iron rod exposed inside a deep pothole at the bridge connection joint. Serious tire-burst hazard.',
        severity: 'Critical',
        roadName: 'Mahatma Gandhi Setu',
        area: 'Gulzarbagh',
        city: 'Patna',
        state: 'Bihar',
        pincode: '800007',
        latitude: '25.6025',
        longitude: '85.1874',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Repair In Progress',
        assignedTeam: 'State Highways Bridge Division',
        estimatedCompletion: '2026-07-19',
        remarks: 'Joint concrete repair underway. Temporary plate overlay provided.',
        date: '2026-07-13',
        time: '18:30',
        citizenName: 'Rahul Kumar',
        citizenEmail: 'rahul.patna@gmail.com',
        citizenPhone: '9334093340'
    },
    {
        id: 'RG1012',
        title: 'Potholes after heavy monsoon rain',
        description: 'Entire stretch of VIP road got washed away forming several potholes of medium size.',
        severity: 'High',
        roadName: 'VIP Road',
        area: 'Vesu',
        city: 'Surat',
        state: 'Gujarat',
        pincode: '395007',
        latitude: '21.1416',
        longitude: '72.7797',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Completed',
        assignedTeam: 'SMC Ward 12 Patch Team',
        estimatedCompletion: '2026-07-15',
        remarks: 'Milling and micro-surfacing of potholes completed successfully.',
        date: '2026-07-11',
        time: '12:00',
        citizenName: 'Hardik Patel',
        citizenEmail: 'hardik.patel@gmail.com',
        citizenPhone: '9898098980'
    },
    {
        id: 'RG1013',
        title: 'Pothole near Airport Exit Gate',
        description: 'Disturbing traffic exit route from Airport. Taxis get stuck. Causes traffic gridlocks.',
        severity: 'Medium',
        roadName: 'Airport Road',
        area: 'Lohegaon',
        city: 'Pune',
        state: 'Maharashtra',
        pincode: '411032',
        latitude: '18.5793',
        longitude: '73.9089',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Verified',
        assignedTeam: 'PMC Road Maintenance Squad 2',
        estimatedCompletion: '2026-07-12',
        remarks: 'Quick-setting concrete mix used. Restored and verified on site.',
        date: '2026-07-09',
        time: '14:00',
        citizenName: 'Nikhil Kulkarni',
        citizenEmail: 'nikhil.k@gmail.com',
        citizenPhone: '9552095520'
    },
    {
        id: 'RG1014',
        title: 'Pothole in residential narrow alley',
        description: 'Small pothole causing water stagnation and mosquito breeding in the residential lane.',
        severity: 'Low',
        roadName: 'Subhash Lane',
        area: 'Sadar Bazar',
        city: 'Nagpur',
        state: 'Maharashtra',
        pincode: '440001',
        latitude: '21.1610',
        longitude: '79.0882',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Closed',
        assignedTeam: 'Nagpur Municipal Zone 3',
        estimatedCompletion: '2026-07-05',
        remarks: 'Filled with gravel and asphalt. Satisfactorily closed.',
        date: '2026-07-01',
        time: '16:00',
        citizenName: 'Vinay Deshmukh',
        citizenEmail: 'vinay.d@gmail.com',
        citizenPhone: '9011090110'
    },
    {
        id: 'RG1015',
        title: 'Massive Pothole near Overbridge Ring',
        description: 'A deep pothole of dangerous dimensions at the base of the overbridge. Damaged a car tire yesterday.',
        severity: 'Critical',
        roadName: 'Grand Trunk Road',
        area: 'Salkia',
        city: 'Howrah',
        state: 'West Bengal',
        pincode: '711106',
        latitude: '22.6025',
        longitude: '88.3475',
        image: MOCK_POTHOLE_IMAGE,
        status: 'Submitted',
        assignedTeam: '',
        estimatedCompletion: '',
        remarks: 'Flagged for emergency crew dispatch.',
        date: '2026-07-16',
        time: '10:45',
        citizenName: 'Rahul Chatterjee',
        citizenEmail: 'rahul.c@gmail.com',
        citizenPhone: '9836098360'
    }
];

// Helper Functions
const ReportsDB = {
    getReports: function() {
        const stored = localStorage.getItem(REPORTS_STORAGE_KEY);
        if (!stored) {
            this.saveReports(sampleReports);
            return sampleReports;
        }
        return JSON.parse(stored);
    },

    saveReports: function(reports) {
        localStorage.setItem(REPORTS_STORAGE_KEY, JSON.stringify(reports));
    },

    getReportById: function(id) {
        const reports = this.getReports();
        return reports.find(r => r.id === id);
    },

    addReport: function(report) {
        const reports = this.getReports();
        reports.unshift(report); // Add to the beginning of the list
        this.saveReports(reports);
        return report;
    },

    updateReport: function(id, updatedFields) {
        const reports = this.getReports();
        const index = reports.findIndex(r => r.id === id);
        if (index !== -1) {
            reports[index] = { ...reports[index], ...updatedFields };
            this.saveReports(reports);
            return reports[index];
        }
        return null;
    },

    deleteReport: function(id) {
        let reports = this.getReports();
        const initialLength = reports.length;
        reports = reports.filter(r => r.id !== id);
        if (reports.length !== initialLength) {
            this.saveReports(reports);
            return true;
        }
        return false;
    },

    generateId: function() {
        const reports = this.getReports();
        if (reports.length === 0) return 'RG1001';
        
        // Find maximum numerical ID
        let maxIdNum = 1000;
        reports.forEach(r => {
            const numPart = parseInt(r.id.replace('RG', ''), 10);
            if (!isNaN(numPart) && numPart > maxIdNum) {
                maxIdNum = numPart;
            }
        });
        return 'RG' + (maxIdNum + 1);
    },

    initializeSampleData: function() {
        if (!localStorage.getItem(REPORTS_STORAGE_KEY)) {
            this.saveReports(sampleReports);
        }
    }
};

// Auto-initialize sample data immediately on load
ReportsDB.initializeSampleData();
window.ReportsDB = ReportsDB;
