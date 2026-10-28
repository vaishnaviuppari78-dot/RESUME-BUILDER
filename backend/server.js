const express = require('express');
const cors = require('cors');
const path = require('path');
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware configuration
app.use(cors());
app.use(express.json());

// Serve static frontend assets cleanly
app.use(express.static(path.join(__dirname, '../frontend')));

// Health Check API Route
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// Fetch Resume Record by User Email Route
app.get('/api/resume/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { data, error } = await supabase
            .from('resumes')
            .select('*')
            .eq('user_email', email)
            .single();

        if (error && error.code !== 'PGRST116') {
            return res.status(400).json({ error: error.message });
        }
        
        return res.status(200).json({ data: data || null });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Save or Update Resume Data Route
app.post('/api/resume', async (req, res) => {
    try {
        const { user_email, full_name, job_title, phone, website, summary, skills, education, experience } = req.body;

        if (!user_email || !full_name) {
            return res.status(400).json({ error: 'Email and Full Name parameters are required.' });
        }

        const { data, error } = await supabase
            .from('resumes')
            .upsert({
                user_email,
                full_name,
                job_title,
                phone,
                website,
                summary,
                skills,
                education,
                experience,
                updated_at: new Date()
            }, { onConflict: 'user_email' })
            .select();

        if (error) return res.status(400).json({ error: error.message });
        return res.status(200).json({ message: 'Resume profile saved successfully', data: data[0] });
    } catch (err) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Fallback path route routing all unmatched routes to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server executing seamlessly on port ${PORT}`);
});
