const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Create and connect to the SQLite database
const db = new sqlite3.Database('employee.db');

// Create the 'employees' table if it doesn't exist
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS employees (id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, age INTEGER, department TEXT)");
});

// Get all employees
app.get('/employees', (req, res) => {
    const query = "SELECT * FROM employees";
    db.all(query, [], (err, employees) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.json(employees);
    });
});

/**
 * 
 * http://localhost:3000/employees
 * {
  "firstName": "Subhransu",
  "lastName": "mohanty",
  "age": 28,
  "department": "software developer"
}
 */
// Create an employee
app.post('/employees', (req, res) => {
    const newEmployee = req.body;

    const query = "INSERT INTO employees (firstName, lastName, age, department) VALUES (?, ?, ?, ?)";
    db.run(query, [newEmployee.firstName, newEmployee.lastName, newEmployee.age, newEmployee.department], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(201).json({ message: 'Employee created successfully' });
    });
});

// Update an employee by ID
app.put('/employees/:id', (req, res) => {
    const employeeId = parseInt(req.params.id);
    const updatedEmployee = req.body;

    const query = "UPDATE employees SET firstName = ?, lastName = ?, age = ?, department = ? WHERE id = ?";
    db.run(query, [updatedEmployee.firstName, updatedEmployee.lastName, updatedEmployee.age, updatedEmployee.department, employeeId], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: 'Employee updated successfully' });
    });
});

// Delete an employee by ID
app.delete('/employees/:id', (req, res) => {
    const employeeId = parseInt(req.params.id);

    const query = "DELETE FROM employees WHERE id = ?";
    db.run(query, [employeeId], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: 'Employee deleted successfully' });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
