const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const chatLogPath = './chat.log';

// Home route: Display chat messages
app.get('/', (req, res) => {
    fs.readFile(chatLogPath, 'utf8', (err, data) => {
        if (err) data = ''; // No chat history yet
        const messages = data.trim() ? data.split('\n') : [];
        res.render('chat', { messages });
    });
});

// POST route: Send message
app.post('/send', (req, res) => {
    const { sender, message } = req.body;
    if (sender && message) {
        const logEntry = `${sender}: ${message}`;
        fs.appendFile(chatLogPath, logEntry + '\n', (err) => {
            if (err) console.error('Failed to write message to log file:', err);
        });
    }
    res.redirect('/');
});

app.listen(8000, () => console.log('Chatbox running on http://localhost:8000'));
