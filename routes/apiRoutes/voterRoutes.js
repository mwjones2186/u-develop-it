const express = require('express');
const router = express.Router();
const db = require ('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

//get all voters alphabetically
router.get('/voters', (req, res)=>{
    const sql = `SELECT * FROM voters ORDER BY last_name`;

    db.query(sql, (err, rows)=>{
        if (error) {
            res.status(500).json ({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            data: rows
        });
    });
});

//Get a single voter
router.get('/voter/:id',(req, res)=>{
    const sql = `SELECT * FROM voters WHERE id =?`;
    const params = [req.params.id];

    db.query(sql, params, (err, row)=>{
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

//Create a voterf
router.post('/voter', ({body}, res)=>{
    const errors = inputCheck(body, 'first_name', 'last_name', 'email');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }

    const sql = `INSERT INTO voters (first_name, last_name, email) VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.email];

    db.query(sql, params, (err, results)=>{
        if (error) {
            res.status(400).json({error: err.message});
            return;
        }
        res.json({
            message: 'Success',
            date: body
        });
    });
});

//Update a voters email
router.put('/voter/:id', (req, res)=>{
    const errors = inputCheck(req.body, 'email');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }
    const sql = `UPDATE voters SET email = ? WHERE id = ?`;
    const params = [req.body.email, req.params.id];

    db.query(sql, params, (err, results)=>{
        if (error) {
            res.status(400).json({error: err.message});
        } else if (!results.affectedRows){
            res.json({
                messafe: ' Voter not found'
            });
        } else {
            res.json({
                message: 'Success',
                data: req.body,
                changes: results.affectedRows
            });
        }
    });
});

//Delete a voter
router.delete('/voter/:id', (req, res)=>{
    const sql = `DELETE FROM voters WHERE id =?`;

    db.query(sql, req.params.id, (err, results)=>{
        if (error) {
            res.status(400).json({error: res.message});
        } else if (!results.affectedRows){
            res.json({
                message: 'Voter Not Found'
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

module.export = router;