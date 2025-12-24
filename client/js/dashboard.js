const API_URL = 'http://localhost:3000/api/jobs';
const token = localStorage.getItem('token');

if (!token) {
    window.location.href = 'index.html';
}

let currentJobId = null;

document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    loadJobs();

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Modal handling
    const modal = document.getElementById('jobModal');
    const addBtn = document.getElementById('addJobBtn');
    const closeBtn = document.querySelector('.close');

    addBtn.onclick = () => {
        currentJobId = null;
        document.getElementById('modalTitle').textContent = 'Add New Job';
        document.getElementById('jobForm').reset();
        modal.style.display = 'block';
    };

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (e) => {
        if (e.target == modal) modal.style.display = 'none';
    };

    // Form Submit
    document.getElementById('jobForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = {
            company_name: document.getElementById('company_name').value,
            job_title: document.getElementById('job_title').value,
            job_type: document.getElementById('job_type').value,
            application_source: document.getElementById('application_source').value,
            location: document.getElementById('location').value,
            status: document.getElementById('status').value,
            notes: document.getElementById('notes').value
        };

        const method = currentJobId ? 'PUT' : 'POST';
        const url = currentJobId ? `${API_URL}/${currentJobId}` : API_URL;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                modal.style.display = 'none';
                loadJobs();
                loadStats();
            } else {
                alert('Failed to save job');
            }
        } catch (error) {
            console.error(error);
        }
    });

    // Filter
    document.getElementById('statusFilter').addEventListener('change', (e) => {
        loadJobs(e.target.value);
    });
});

async function loadStats() {
    try {
        const res = await fetch(`${API_URL}/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        document.getElementById('totalApps').textContent = data.total;
        
        const statusCounts = {
            'Applied': 0, 'Interview': 0, 'Offer': 0, 'Rejected': 0
        };
        
        data.byStatus.forEach(s => {
            statusCounts[s.status] = s.count;
        });

        const statsHtml = Object.entries(statusCounts).map(([status, count]) => `
            <div class="stat-card">
                <h3>${status}</h3>
                <div class="stat-number">${count}</div>
            </div>
        `).join('');
        
        document.getElementById('statusStats').innerHTML = statsHtml;
    } catch (error) {
        console.error(error);
    }
}

async function loadJobs(status = '') {
    try {
        let url = API_URL;
        if (status) url += `?status=${status}`;

        const res = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const jobs = await res.json();

        const container = document.getElementById('jobsContainer');
        container.innerHTML = jobs.map(job => `
            <div class="job-card">
                <div class="job-header">
                    <h3>${job.job_title} at ${job.company_name}</h3>
                    <span class="job-status status-${job.status}">${job.status}</span>
                </div>
                <p><strong>Location:</strong> ${job.location || 'N/A'}</p>
                <p><strong>Type:</strong> ${job.job_type || 'N/A'}</p>
                <p><strong>Applied:</strong> ${new Date(job.applied_date).toLocaleDateString()}</p>
                <div class="job-actions">
                    <button class="btn-edit" onclick="editJob(${job.id})">Edit</button>
                    <button class="btn-delete" onclick="deleteJob(${job.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error(error);
    }
}

window.editJob = async (id) => {
    // Fetch single job details would be better, but for now we can find it from the list if we stored it, 
    // or just fetch all again. Let's fetch all and find.
    // Ideally we should have a GET /jobs/:id endpoint.
    // For simplicity, I'll just populate from the DOM or fetch list again.
    // Let's add GET /jobs/:id to backend? No, I didn't add it.
    // I'll just filter from the current list in memory if I had it, but I don't.
    // I'll just fetch the list again and find it.
    
    try {
        const res = await fetch(API_URL, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const jobs = await res.json();
        const job = jobs.find(j => j.id === id);
        
        if (job) {
            currentJobId = job.id;
            document.getElementById('modalTitle').textContent = 'Edit Job';
            document.getElementById('company_name').value = job.company_name;
            document.getElementById('job_title').value = job.job_title;
            document.getElementById('job_type').value = job.job_type;
            document.getElementById('application_source').value = job.application_source;
            document.getElementById('location').value = job.location;
            document.getElementById('status').value = job.status;
            document.getElementById('notes').value = job.notes;
            
            document.getElementById('jobModal').style.display = 'block';
        }
    } catch (error) {
        console.error(error);
    }
};

window.deleteJob = async (id) => {
    if (confirm('Are you sure you want to delete this application?')) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (res.ok) {
                loadJobs();
                loadStats();
            }
        } catch (error) {
            console.error(error);
        }
    }
};
