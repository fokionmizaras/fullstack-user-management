import { useState,useEffect } from "react";
import axios from "axios";
import "./UserComponent.css"

const dataObject = {
    firstName: "",
    lastName: "",
    email: "",
    password: ""
}

function User() {
    const [users, setUsers] = useState([]);
    const [formData, setFormData] = useState(dataObject);
    const [errors, setErrors] = useState({});
    const API_URL = "http://localhost:8080/api/users";
    //state variable to check if user id exists or not for update
    const [editUserId, setEditUserId] = useState(null);
    //temporal state variable to save the changes made to the form after clicking the edit button
    const [editFormData, setEditFormData] = useState(dataObject);
    const [isModalOpen, setIsModalOpen] = useState(false);

    //Run the effect by calling the fetchUsers function only once when the app loads
    useEffect(() => {
        fetchUsers();
    },[]);

    //fetching the users by making an axios call to our API
    async function fetchUsers() {
        try{
            const response = await axios.get(API_URL);
            setUsers(response.data);
        }
       catch(error) {
        console.error("Error fetching users");
       } 
    }
    //Handling the changes on user input fields
    function handleInputChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    async function handleSubmit(e) {
        e.preventDefault();
        try{
            await axios.post(API_URL, formData);
            setFormData({firstName: "", lastName: "", email: "", password: ""});
            setErrors({});
            fetchUsers();
        }
        catch(error) {
            if(error.response && error.response.data) {
                //we show the errors from the GlobalExceptionHandler in Spring
                setErrors(error.response.data);
            }
        }
    }
    async function handleDelete(id) {
        if(window.confirm("Do you want to delete this user?")) {
            try{
                await axios.delete(`${API_URL}/${id}`);
                fetchUsers();
            }
            catch(error) {
                console.error("Error deleting user", error);
            }
        }
    }
    function handleEditClick(user) {
        setEditUserId(user.id);
        setEditFormData({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: ""
        });
        setIsModalOpen(true);
    }
    function handleCancel() {
        setEditUserId(null);
        setEditFormData({firstName: "", lastName: "", email: "", password: ""});
        setIsModalOpen(false);
    }

    async function handleSave(id) {
        try{
            setErrors({});
            if(editFormData.password.length > 0 && editFormData.password.length < 8) {
                setErrors({password: "Password must be at least 8 characters long"});
                return;
            }
            const dataToSend = {...editFormData};
            if(!dataToSend.password || dataToSend.password.trim() === "") {
                delete dataToSend.password;
            }
            await axios.put(`${API_URL}/${id}`, dataToSend);
            setEditUserId(null);
            fetchUsers();
            handleCancel();
        }
        catch(error) {
            console.error("Error updating user with id: " + id, error);
        }
    }
    return(
        <div className="container">
            <header>
                <h1>User Management System</h1>
            </header>
            <section className="form-card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input type="text"
                        value={formData.firstName}
                        name="firstName"
                        placeholder="First Name"
                        onChange={handleInputChange}
                        />
                        {errors.firstName && <div className="error-text">{errors.firstName}</div>}
                    </div>
                    <div className="form-group">
                        <input type="text"
                        value={formData.lastName}
                        name="lastName"
                        placeholder="Last Name"
                        onChange={handleInputChange}
                        />
                        {errors.lastName && <div className="error-text">{errors.lastName}</div>}
                    </div>
                    <div className="form-group">
                        <input type="text" 
                        value={formData.email}
                        name="email"
                        placeholder="Email Address"
                        onChange={handleInputChange}
                        />
                        {errors.email && <div className="error-text">{errors.email}</div>}
                        {errors.message && <div className="error-text">{errors.message}</div>}
                    </div>
                    <div className="form-group">
                        <input
                        type="password"
                        value={formData.password}
                        placeholder="Enter password"
                        name="password"
                        onChange={handleInputChange}
                        />
                        {errors.password && <div className="error-text">{errors.password}</div>}
                    </div>
                    <button type="submit" className="submit-btn">Create User</button>
                </form>
            </section>
            <section>
                <h3>Registered users</h3>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}>
                                        <>
                                            <td>{user.id}</td>
                                            <td>{user.firstName}</td>
                                            <td>{user.lastName}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                                                <button onClick={() => handleEditClick(user)}>Edit</button>
                                            </td>
                                        </>
                                    
                                </tr>
                            
                            ))) : 
                            <tr>
                                <td colSpan={4} className="empty-msg">No users registered yet</td>
                            </tr>
                        }
                    </tbody>
                </table>
            </section>
            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit User Profile</h3>
                        <hr />
                        <div className="form-group">
                            <label>First Name: </label>
                            <input className="form-input"
                            type="text" 
                            value={editFormData.firstName}
                            onChange={(e) => setEditFormData({...editFormData, firstName: e.target.value})}
                            />
                        </div>
                         <div className="form-group">
                            <label>Last Name: </label>
                            <input className="form-input"
                            type="text" 
                            value={editFormData.lastName}
                            onChange={(e) => setEditFormData({...editFormData, lastName: e.target.value})}
                            />
                        </div>
                         <div className="form-group">
                            <label>Email: </label>
                            <input className="form-input"
                            type="text" 
                            value={editFormData.email}
                            onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                            />
                        </div>
                         <div className="form-group">
                            <label>New Password (Optional): </label>
                            <input className="form-input"
                            type="password" 
                            placeholder="Leave it blank if you want the current password"
                            value={editFormData.password}
                            onChange={(e) => setEditFormData({...editFormData, password: e.target.value})}
                            />
                            {errors.password && <div className="error-text">{errors.password}</div>}
                        </div>
                        <div className="modal-actions">
                            <button className="submit-btn" onClick={() => handleSave(editUserId)}>
                                Save Changes
                            </button>
                            <button className="cancel-btn" onClick={() => handleCancel()}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
export default User;