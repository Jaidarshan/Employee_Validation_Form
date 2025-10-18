require('dotenv').config(); 
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoute = require('./routes/employeeRoutes');
const app = express();
const port = process.env.SERVER_PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use('/', employeeRoute);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
