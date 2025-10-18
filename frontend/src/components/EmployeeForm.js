import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import '../styles/Form.css';

const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        employeeId: '',
        email: '',
        phoneNumber: '',
        department: 'HR',
        dateOfJoining: '',
        role: '',
    });
    const [employees, setEmployees] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [errors, setErrors] = useState({});
    const departments = ['HR', 'Engineering', 'Sales', 'Marketing'];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        let tempError = {};
        if (!formData.name) tempError.name = 'Name is not filled';
        if (!formData.employeeId || formData.employeeId.length > 10)
            tempError.employeeId = 'Employee ID must have a maximum of 10 characters';
        if (!/\S+@\S+\.\S+/.test(formData.email)) tempError.email = 'Email is not valid';
        if (!/^\d{10}$/.test(formData.phoneNumber)) tempError.phoneNumber = 'Phone number must be 10 digits';
        if (
            !formData.dateOfJoining ||
            new Date(formData.dateOfJoining) > new Date() ||
            isNaN(new Date(formData.dateOfJoining).getTime())
        )
            tempError.dateOfJoining = 'Date of joining must be valid';
        if (!formData.role) tempError.role = 'Role must be filled';
        setErrors(tempError);
        return Object.keys(tempError).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            const response = await axios.post('http://localhost:5000/add-employee', formData);
            toast.success(response.data.message);
            setFormData({
                name: '',
                employeeId: '',
                email: '',
                phoneNumber: '',
                department: 'HR',
                dateOfJoining: '',
                role: '',
            });
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to submit form');
        }
    };

    const handleReset = () => {
        setFormData({
            name: '',
            employeeId: '',
            email: '',
            phoneNumber: '',
            department: 'HR',
            dateOfJoining: '',
            role: '',
        });
        setErrors({});
    };

    const handleDisplay = async () => {
        try {
            const response = await axios.get('http://localhost:5000/employees');
            setEmployees(response.data);
            setShowTable(true);
            toast.success("Employee data fetched successfully");

            const formattedEmployees = response.data.map(employee => ({
                ...employee,
                dateOfJoining: employee.dateOfJoining.slice(0, 10) 
            }));
            setEmployees(formattedEmployees);
        } catch (error) {
            toast.error(error.response.data.error || 'Failed to fetch data');
        }
    };


    const handleModify = async (e) => {
        e.preventDefault();

        if (!formData.employeeId) {
            toast.error('Employee ID is required to modify data');
            return;
        }

        const updatedFields = {};
        if (formData.name) updatedFields.name = formData.name;
        if (formData.email) updatedFields.email = formData.email;
        if (formData.phoneNumber) updatedFields.phone_number = formData.phoneNumber;
        if (formData.department) updatedFields.department = formData.department;

        if (formData.dateOfJoining) updatedFields.date_of_joining = formData.dateOfJoining.slice(0, 10);

        if (formData.role) updatedFields.role = formData.role;

        try {
            await axios.put(`http://localhost:5000/update-employee/${formData.employeeId}`, updatedFields);
            toast.success('Employee data updated successfully');
            setFormData({
                name: '',
                employeeId: '',
                email: '',
                phoneNumber: '',
                department: 'HR',
                dateOfJoining: '',
                role: '',
            });
            handleDisplay();
        } catch (error) {
            toast.error(error.response?.data?.error || 'Failed to update employee');
        }
    };


    return (
        <div className="container py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="h4 mb-4 text-center">Employee Details</h2>
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label className="form-label" htmlFor="name">Name</label>
                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="employeeId">Employee ID</label>
                                    <input
                                        id="employeeId"
                                        type="text"
                                        name="employeeId"
                                        className={`form-control ${errors.employeeId ? 'is-invalid' : ''}`}
                                        placeholder="e.g. EMP12345"
                                        value={formData.employeeId}
                                        onChange={handleChange}
                                    />
                                    {errors.employeeId && <div className="invalid-feedback">{errors.employeeId}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="name@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="phoneNumber">Phone Number</label>
                                    <input
                                        id="phoneNumber"
                                        type="text"
                                        name="phoneNumber"
                                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                        placeholder="10-digit number"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                    />
                                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="department">Department</label>
                                    <select
                                        id="department"
                                        name="department"
                                        className="form-select"
                                        value={formData.department}
                                        onChange={handleChange}
                                    >
                                        {departments.map((dept) => (
                                            <option key={dept} value={dept}>
                                                {dept}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label" htmlFor="dateOfJoining">Date Of Joining</label>
                                    <input
                                        id="dateOfJoining"
                                        type="date"
                                        name="dateOfJoining"
                                        className={`form-control ${errors.dateOfJoining ? 'is-invalid' : ''}`}
                                        value={formData.dateOfJoining}
                                        onChange={handleChange}
                                    />
                                    {errors.dateOfJoining && <div className="invalid-feedback">{errors.dateOfJoining}</div>}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label" htmlFor="role">Role</label>
                                    <input
                                        id="role"
                                        type="text"
                                        name="role"
                                        className={`form-control ${errors.role ? 'is-invalid' : ''}`}
                                        placeholder="e.g. Software Engineer"
                                        value={formData.role}
                                        onChange={handleChange}
                                    />
                                    {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                                </div>

                                <div className="d-flex flex-wrap gap-2">
                                    <button className="btn btn-primary" type="submit">Submit</button>
                                    <button className="btn btn-outline-secondary" type="button" onClick={handleReset}>Reset</button>
                                    <button className="btn btn-warning" type="button" onClick={handleModify}>Modify</button>
                                    <button className="btn btn-info ms-auto" type="button" onClick={handleDisplay}>Display</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {showTable && employees.length > 0 && (
                <div className="row justify-content-center mt-4">
                    <div className="col-12">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="h5 mb-3">Employee Data</h3>
                                <div className="table-responsive">
                                    <table className="table table-striped table-bordered align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th>Name</th>
                                                <th>Employee ID</th>
                                                <th>Email</th>
                                                <th>Phone Number</th>
                                                <th>Department</th>
                                                <th>Date Of Joining</th>
                                                <th>Role</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.map((employee, index) => (
                                                <tr key={index}>
                                                    <td>{employee.name}</td>
                                                    <td>{employee.employeeId}</td>
                                                    <td>{employee.email}</td>
                                                    <td>{employee.phoneNumber}</td>
                                                    <td>{employee.department}</td>
                                                    <td>{(employee.dateOfJoining || '').slice(0, 10)}</td>
                                                    <td>{employee.role}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeeForm;
