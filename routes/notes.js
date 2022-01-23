const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const notesDb = require('../db/db.json');
const fs = require('fs');

// Send the notes in the database to the notes url being requested
notes.get('/', (req, res) => {
    res.json(notesDb)
    console.info(`${req.method} request received to get note`);
})

notes.post('/', (req, res) => {
   
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
        notesDb.push(newNote);

        const noteString = JSON.stringify(notesDb, null, 3);
        
        // Write my updated note list to the 'db.json' file
        fs.writeFile(`./db/db.json`, noteString, (err) =>
        err
        ? console.error(err)
        : console.log(`New note has been written to JSON file`)
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

notes.delete('/:id', (req, res) => {
    if (req.params.id) {
        console.info(`${req.method} request received to delete a note`);
        const noteId = req.params.id;
        let idMatches = false;

        // Find the note in the database that matches the parameter id and take it out of the database array
        for (let i = 0; i < notesDb.length; i++) {
            const currentNote = notesDb[i];
            if (currentNote.id === noteId) {
                notesDb.splice(i, 1);
                idMatches = true;
            }
        }
        if (idMatches) {
            const noteString = JSON.stringify(notesDb, null, 2);
        
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

module.exports = notes;