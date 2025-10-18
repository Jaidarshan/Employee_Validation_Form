import React from 'react';
import { ToastContainer } from 'react-toastify';
import EmployeeForm from './components/EmployeeForm.js';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import './styles/theme.css';

function App() {
    return (
        <div className="app-bg min-vh-100">
            <header className="py-4 mb-3 border-bottom bg-white">
                <div className="container">
                    <h1 className="h3 m-0">Employee Validation Form</h1>
                </div>
            </header>
            <main>
                <EmployeeForm />
            </main>
            <ToastContainer position="top-right" autoClose={2500} hideProgressBar theme="colored" />
        </div>
    );
}

export default App;
