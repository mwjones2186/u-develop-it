const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');


// Express Middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/api', apiRoutes);

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

