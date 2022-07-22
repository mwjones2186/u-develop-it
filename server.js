const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const mysql = require('mysql2');
const inputCheck = require('./utils/inputCheck');

// Express Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',      
      user: 'root',
      password: 'ArthrexRep2011*',
      database: 'election'
    },
    console.log('Connected to the election database.')
  );

  //get all candidates
  app.get('/api/candidates', (req, res)=>{
    const sql = `SELECT * FROM candidates`;
  
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
    const sql = `SELECT * FROM candidates WHERE id = ?`;
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

//Create a candidate
app.post('/api/candidate', ({body}, res)=>{
    const errors = inputCheck(body, 'first_name', 'industry_connected');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected)
        VALUES (?,?,?)`;
    const params = [bode.first_name, body.last_name, body.industry_connected];

    db.query(sql, params, (err, results)=>{
        if (error) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            data: body
        });
    });
    
});
//default response for any other request (not found)

app.use((req, res)=>{
    res.status(404).end();
});

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
});

