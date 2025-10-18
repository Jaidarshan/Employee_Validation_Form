const express = require('express');
const router = express.Router();
const db = require('../db');
router.post('/add-employee', (req, res) => {
    const { name, employeeId, email, phoneNumber, department, dateOfJoining, role } = req.body;
    const checkQuery = 'select * from employees where email=? or employee_id=?';
    db.query(checkQuery, [email, employeeId], (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to connect to database' });
        if (results.length > 0) {
            return res.status(400).json({ error: 'Email or Employee ID already exists' });
        }
        const insertQuery = 'insert into employees(name,employee_id,email,phone_number,department,date_of_joining,role) values(?,?,?,?,?,?,?)';
        db.query(insertQuery, [name, employeeId, email, phoneNumber, department, dateOfJoining, role], (err, results) => {
            if (err) return res.status(500).json({ error: 'Failed to add new employee' });
            res.status(201).json({ message: "Employee added successfully" });
        })
    })
})
router.get('/employees', (req, res) => {
    const fetchQuery = 'select name,employee_id as employeeId,email,phone_number as phoneNumber,department,date_of_joining as dateOfJoining,role from employees';
    db.query(fetchQuery, (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch from database' });
        res.status(200).json(results);
    })
})

router.put('/update-employee/:employeeId', (req, res) => {
    const { employeeId } = req.params;
    const updateFields = req.body;
    const fields = Object.keys(updateFields).map((field) => `${field} = ?`).join(', ');
    const values = Object.values(updateFields);
    if (!fields.length) {
        return res.status(400).json({ error: 'No fields provided for update' });
    }
    const updateQuery = `UPDATE employees SET ${fields} WHERE employee_id = ?`;
    db.query(updateQuery, [...values, employeeId], (err, result) => {
        if (err) return res.status(500).json({ error: 'Failed to update employee' });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Employee not found' });
        }
        res.status(200).json({ message: 'Employee details updated successfully' });
    });
});


module.exports = router;