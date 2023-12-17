const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite')

const app = express();
const port = 8080 || process.env.PORT;

var corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// open sqlite database connection
const dbPromise = open({
    filename: './mycontacts.db',
    driver: sqlite3.Database
});

/*
Create the 'contacts' table */
// async function createTable() {
//     const db = await dbPromise;
//     await db.exec(`
//         CREATE TABLE IF NOT EXISTS contacts (
//             id INTEGER PRIMARY KEY,
//             name TEXT,
//             email TEXT,
//             message TEXT
//         )
//     `);
// }

// createTable();

// middleware that lifts the cors restrictions for routing from a different url (localhost:3000)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

//middleware that logs the request method and url
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

/* Routes */
app.get('/', (req, res) => {
    res.send('Hello User Welcome to the TravelMate Task API!');
});

app.get('/api', (req, res) => {
    res.send(`API is running!, Please use the following endpoint: /api/contact - POST, /api/view-contacts - GET`);
});

// post endpoint to collect data (name, email, message) from contact form
app.post('/api/contact', async(req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ status: 400, msg: 'Please enter all fields' });
    }

    try {
        const db = await dbPromise;
        await db.run('INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)', [name, email, message]);

        return res.status(200).json({ status: 200, msg: 'Message sent successfully' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500, msg: 'Something went wrong. Please try again later.' });

    }

});


// view all contacts
app.get('/api/view-contacts', async(req, res) => {
    try {
        const db = await dbPromise;
        const contacts = await db.all('SELECT * FROM contacts');

        return res.status(200).json({ status: 200, data: contacts });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ status: 500, msg: 'Something went wrong. Please try again later.' });

    }
});

/* Start server */
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});