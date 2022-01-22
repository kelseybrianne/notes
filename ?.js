// app.post('/api/notes', (req, res) => {
//     // Create (persist) data
    
//     // Access the new note data from 'req
//     const {title, text} = req.body;

//     if (title && text) {

//         const newNote = {
//             title,
//             text,
//             // note_id: uuidv4()
//         };

//         fs.readFile('./db/db.json', 'utf8', (err, data) => {
//             if (err) {
//                 console.error(err);
//             } else {
//                 // Convert string into JSON object
//                 const parsedNotes = JSON.parse(data);
        
//                 // Add a new note
//                 parsedNotes.push(newNote);

//                 // const noteString = JSON.stringify(parsedNotes, null, 2);
//                 fs.writeFile(`./db/db.json`, JSON.stringify(parsedNotes, null, 2), (err) =>
//                     err
//                         ? console.error(err)
//                         : console.log(
//                             `New note has been written to JSON file`
//                         )
//                 );
//             }
//         });

//         // Push it to my existing list of notes

        
//         // Write my updates note list to the 'db.json' file

//         const response = {
//             status: 'success',
//             body: newNote,
//         };

//         console.log(response);
//         res.status(201).json(response); 
//     } else {
//         res.status(500).json('Error in posting note');
//     }
// })