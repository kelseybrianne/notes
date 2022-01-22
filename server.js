const express = require('express');
const path = require('path');
const fs = require('fs');
const db = require('./db/db.json');
const { v4: uuidv4 } = require('uuid');
const { arrayBuffer } = require('stream/consumers');

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
    let id = uuidv4()

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

app.delete('/api/notes/:id', (req, res) => {

    res.send("inside delete request");

    if (req.params.id) {
        console.info(`${req.method} request received to delete a note`);
        const noteId = req.params.id;
        let idMatches = false;
        for (let i = 0; i < db.length; i++) {
            const currentNote = db[i];
            if (currentNote.id === noteId) {
                // res.status(200).json(currentNote);
                db.splice(i, 1);
                idMatches = true;
            }
        }
        if (idMatches) {
            const noteString = JSON.stringify(db, null, 2);
        
            // Write my updates note list to the 'db.json' file
            fs.writeFile(`./db/db.json`, noteString, (err) =>
            err
            ? console.error(err)
            : console.log(
                `New note has been written to JSON file`
                )
            ); 
            return;
        }
        
        // res.status(404).send('Note not found');
    } else {
        // res.status(400).send('Note ID not provided');
      }
    // fs.readFile('./db/db.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.error(err);
    //       } else {
    //         // Convert string into JSON object
    //         const parsedDb = JSON.parse(data);

    //         for(var i = 0; i < parsedDb.length; i++) {
    //             if (parsedDb[i].id === idSelectedForDeleting) {
    //                 parsedDb.splice(i, 1);
    //             }
    //         }
    
    //         // Add a new review
    //         parsedReviews.push(newReview);
    
    //         // Write updated reviews back to the file
    //         fs.writeFile(
    //           './db/reviews.json',
    //           JSON.stringify(parsedReviews, null, 4),
    //           (writeErr) =>
    //             writeErr
    //               ? console.error(writeErr)
    //               : console.info('Successfully updated reviews!')
    //         );
    //     }
    // });
});

app.listen(PORT, () =>
    console.log(`Example app listening at http://localhost:${PORT}`)
);