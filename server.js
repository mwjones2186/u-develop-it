const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/connection');
const inputCheck = require('./utils/inputCheck');
const apiRoutes = require('./routes/apiRoutes')

// Express Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use('/api', apiRoutes)

// Connect to database


  //get all candidates
  app.get('/api/candidates', (req, res)=>{
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candadates
                LEFT JOIN parties
                ON candadates.party_id = parties.id`;
  
  db.query(sql, (err, rows)=>{
    if (error) {
       res.status(500).json({error: err.message});
       return;
    }
    res.json({
        message: 'Success',
        data: rows
     });
    });
});

//Get a single candidate
app.get('/api/candidate/:id', (req, res)=>{
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id
                WHERE candidates.id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err,row)=>{
        if (error) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            data: row
        });
    });
});


//Create a candidate
app.post('/api/candidate', ({body}, res)=>{
    const errors = inputCheck(
        body,
        'first_name',
        'last_name',
        'industry_connected'
    );
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [
        body.first_name, 
        body.last_name, 
        body.industry_connected,
        body.party_id
    ];

    db.query(sql, params, (err, results)=>{
        if (error) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            data: body,
            changes: results.affectedRows
        });
    });    
});

//Update a candidates party

//Delete a candidate
app.delete('/api/candidate/:id', (req, res)=>{
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];

    db.query(sql, params, (err, results)=>{
        if (error) {
            res.statusMessage(400).json({error: res.message});
        } else if (!results.affectedRows){
            res.json({
                message: 'Candidate not found'
            });
        } else {
            res.json ({
                message: 'Deleted',
                changes: results.affectedRows,
                id: req.params.id
            });
        }
    });
});

//Get all parties
app.get('/api/parties', (req, res)=>{
    const sql =    `SELECT * FROM parties`;
    db.query(sql, (err, rows)=>{
        if (error) {
            res.status(500).json({error: err.message});
        }
        res.json({
            message: 'Success',
            data: rows
        });
    });
});

//Get a single party
app.get('/api/party/:id', (req, res)=>{
    const sql = `SELECT * FROM parties WHERE id = ?`;
    const params = [req.perams.id];
db.query(sql, params, (err, row)=>{
    if (error) {
        res.status(400).json({error: err.message});
        return;
    }
    res.json({
        message: 'Success',
        data: rows
        });
    });
});

//Delete a party
app.delete('/api/party/:id', (req, res)=>{
    const sql = `DELETE FROM parties WHERE id = ?`;
    const params = [req.params.id];
db.query(sql, params, (err, results)=>{
    if (error) {
        res.status(400).json({error: err.message});
    } else if(!results.affectedRows){
        res.json({
            message: 'Party Not Found'
        });
    } else {
        res.json({
            message: 'Deleted',
            changes: results.affectedRows,
            id: req.params.id
        });
    }
});
});


//default response for any other request (not found)

app.use((req, res)=>{
    res.status(404).end();
});

//Start server after connection
db.connect(err=> {
    if (error)throw error;
    console.log('Database Connected.');
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});
});

