const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) =>
    res.sendFile(path.join(_dirname, 'public/index.html'))
);

app.get('/notes', (req, res) =>
    // Send the file notes.html
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {

    res.json(db)
    console.info(`${req.method} request received to get note`);
})

app.post('/api/notes', (req, res) => {
    // Create (persist) data

    // Access the new note data from 'req
    const {title, text} = req.body;
    let id = `id: ${uuidv4()}`

    if (title && text) {
        const newNote = {
            title,
            text,
            id 
        };
        
        // Push it to my existing list of notes
        db.push(newNote);

        const noteString = JSON.stringify(db, null, 2);
        
        // Write my updates note list to the 'db.json' file
        fs.writeFile(`./db/db.json`, noteString, (err) =>
        err
        ? console.error(err)
        : console.log(
            `New note has been written to JSON file`
          )
        );

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.status(201).json(response); 
    } else {
        res.status(500).json('Error in posting note');
    }
})

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);