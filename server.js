const express = require('express');
const path = require('path');
const fs = require('fs');
const notes = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

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

    // Send the notes in the database to the notes url being requested
    res.json(notes)
    console.info(`${req.method} request received to get note`);
})

app.post('/api/notes', (req, res) => {
   
    // Access the new note data from req.body
    const {title, text} = req.body;
    let id = uuidv4()

    if (title && text) {
        const newNote = {
            title,
            text,
            id 
        };
        
        // Push the new note to my existing list of notes in the database
        notes.push(newNote);

        const noteString = JSON.stringify(notes, null, 2);
        
        // Write my updated note list to the 'db.json' file
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
  
        res.status(201).json(response); 
    } else {
        res.status(500).json('Error in posting note');
    }
})

app.delete('/api/notes/:id', (req, res) => {
    if (req.params.id) {
        console.info(`${req.method} request received to delete a note`);
        const noteId = req.params.id;
        let idMatches = false;

        // Find the note in the database that matches the parameter id and take it out of the database array
        for (let i = 0; i < notes.length; i++) {
            const currentNote = notes[i];
            if (currentNote.id === noteId) {
                notes.splice(i, 1);
                idMatches = true;
            }
        }
        if (idMatches) {
            const noteString = JSON.stringify(notes, null, 2);
        
            // Write my updated note list to the 'db.json' file
            fs.writeFile(`./db/db.json`, noteString, (err) =>
            err
            ? console.error(err)
            : console.log(
                `New note has been written to JSON file`
                )
            ); 
            return;
        }
        res.send('Note not found');
    } else {
        res.send('Note ID not provided');
    }
});

// Listen from port 3001
app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);