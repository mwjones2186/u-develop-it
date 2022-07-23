const express = require('express');
const router = express.routher();
const db = require('../../db/connection');
const inputCheck = require('../../utils/inputCheck');

router.get('/votes', (req, res)=>{
    const sql = `SELECT candidates.*, parties.name AS party_name,
                COUNT(candidate_id)
                AS count FROM votes
                LEFT JOIN candadates ON votes.candidate_id = candidate.id
                LEFT JOIN parties ON candidates.party_id = parties.id
                GROUP BY candidate_id
                ORDER BY count DESC`;

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

router.post('/vote', ({body}, res)=>{
    const errors = inputCheck(body, 'voter_id', 'candidate_id');
    if (errors) {
        res.status(400).json({error: errors});
        return;
    }

    const sql = `INSERT INTO votes (viter_id, candidate_id) VALUES (?,?)`;
    const params = [body.voter_id, body.candidate_id];

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

module.exports = router;