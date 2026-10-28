let currentSessionEmail = "";

document.getElementById('session-btn').addEventListener('click', async () => {
    const emailInput = document.getElementById('user-session-email');
    const email = emailInput.value.trim();

    if (!email || !validateEmail(email)) {
        alert('Please output a valid structure email address to authenticate workspace parameters.');
        return;
    }

    currentSessionEmail = email;
    emailInput.disabled = true;
    document.getElementById('session-btn').style.display = 'none';
    
    // Toggle application workspace structures view states
    document.getElementById('welcome-card-display').style.display = 'none';
    document.getElementById('main-workspace').style.display = 'grid';

    // Fetch existing details if present in persistent store mapping
    await fetchUserResume();
});

// Input dynamic updating monitoring loops linking input controls directly with layout nodes
const bindings = [
    { inputId: 'form-fullname', targetId: 'view-name', defaultText: 'Your Full Name' },
    { inputId: 'form-title', targetId: 'view-title', defaultText: 'Professional Target Role' },
    { inputId: 'form-phone', targetId: 'view-phone', defaultText: 'Phone Fields' },
    { inputId: 'form-website', targetId: 'view-web', defaultText: 'Website Portfolios' },
    { inputId: 'form-summary', targetId: 'view-summary', defaultText: 'Executive overview...' },
    { inputId: 'form-skills', targetId: 'view-skills', defaultText: 'Item list configurations' },
    { inputId: 'form-education', targetId: 'view-education', defaultText: 'Academic listings' },
    { inputId: 'form-experience', targetId: 'view-experience', defaultText: 'Project items workflows' }
];

bindings.forEach(binding => {
    document.getElementById(binding.inputId).addEventListener('input', (e) => {
        const value = e.target.value.trim();
        document.getElementById(binding.targetId).innerText = value || binding.defaultText;
    });
});

async function fetchUserResume() {
    try {
        const response = await fetch(`/api/resume/${encodeURIComponent(currentSessionEmail)}`);
        const result = await response.json();
        
        if (result.data) {
            const profile = result.data;
            document.getElementById('form-fullname').value = profile.full_name || '';
            document.getElementById('form-title').value = profile.job_title || '';
            document.getElementById('form-phone').value = profile.phone || '';
            document.getElementById('form-website').value = profile.website || '';
            document.getElementById('form-summary').value = profile.summary || '';
            document.getElementById('form-skills').value = profile.skills || '';
            document.getElementById('form-education').value = profile.education || '';
            document.getElementById('form-experience').value = profile.experience || '';

            // Run direct layout sync updates
            bindings.forEach(b => {
                const val = document.getElementById(b.inputId).value;
                document.getElementById(b.targetId).innerText = val || b.defaultText;
            });
            document.getElementById('view-email').innerText = currentSessionEmail;
        } else {
            document.getElementById('view-email').innerText = currentSessionEmail;
        }
    } catch (err) {
        console.error('Error fetching persistent record set states:', err);
    }
}

document.getElementById('resume-builder-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const payload = {
        user_email: currentSessionEmail,
        full_name: document.getElementById('form-fullname').value.trim(),
        job_title: document.getElementById('form-title').value.trim(),
        phone: document.getElementById('form-phone').value.trim(),
        website: document.getElementById('form-website').value.trim(),
        summary: document.getElementById('form-summary').value.trim(),
        skills: document.getElementById('form-skills').value.trim(),
        education: document.getElementById('form-education').value.trim(),
        experience: document.getElementById('form-experience').value.trim()
    };

    try {
        const response = await fetch('/api/resume', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok) {
            alert('Resume data successfully written to cloud data layer!');
        } else {
            alert('Error updating data values: ' + result.error);
        }
    } catch (err) {
        alert('Failed execution channel routes initialization checks.');
    }
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
