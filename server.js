const express = require('express');
const path = require('path');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// Send the file index.html
app.get('/', (req, res) =>
    res.sendFile(path.join(_dirname, 'public/index.html'))
);

// Send the file notes.html
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.use('/api', routes);

// Listen from port 3001
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);