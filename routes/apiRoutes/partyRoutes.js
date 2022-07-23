const express = require('express');
const router = express.router();
const db = require('../../db/connection');

//get all parties
router.get('/api/parties', (req, res)=>{
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
router.get('/api/party/:id', (req, res)=>{
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
router.delete('/api/party/:id', (req, res)=>{
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

module.exports = router;