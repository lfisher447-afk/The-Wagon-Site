const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;

// 1. GLOBAL SETTINGS
app.disable('x-powered-by'); // Security: Hides that you use Express

// 2. SECURITY MIDDLEWARE
app.use((req, res, next) => {
    // Block sensitive system files
    const blockList = ['/.git', '/node_modules', '/package.json', '/.env', '/server.js'];
    
    // Check if the URL starts with any blocked paths
    const isBlocked = blockList.some(item => req.path.startsWith(item));

    if (isBlocked) {
        return res.status(403).send('Forbidden: Access Denied');
    }
    next();
});

// 3. STATIC FILES
// Serves images/css/js from the root folder
app.use(express.static(__dirname));

// 4. ROUTE: HOME PAGE
app.get('/', (req, res) => {
    // Serves home.html when user visits the site root
    res.sendFile(path.join(__dirname, 'home.html'), (err) => {
        if (err) {
            console.error("File not found: home.html");
            res.status(404).send("Error: home.html not found.");
        }
    });
});

// 5. 404 HANDLER
// This Redirects any unknown paths back to home
app.use((req, res) => {
    res.redirect('/');
});

// 6. START SERVER
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
