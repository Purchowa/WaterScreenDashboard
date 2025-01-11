import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

import appConfig from '../config.js'
import '../styles/App.css';

function AdminPanel() {
    const { isAuthenticated, login } = useAuth();
    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/monitoring");
        }
    }, [])

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`${appConfig.host}/${appConfig.restURI}/dashboard/login`, loginData)
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('jwt', token);
                login();
                navigate("/monitoring");
            })
            .catch(error => {
                console.error("There was an error logging in!", error);
            });
    };

        return (
            <div className="admin_content">
               <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">
                            Username:
                            <input
                                type="text"
                                name="username"
                                value={loginData.username}
                                onChange={(e) => { setLoginData({ ...loginData, username: e.target.value }) }}
                                className="form-input"
                            />
                        </label>
                    </div>
                    <div className="form-group">
                        <label className="form-label">
                            Password:
                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                onChange={(e) => { setLoginData({ ...loginData, password: e.target.value }) }}
                                className="form-input"
                            />
                        </label>
                    </div>
                    <button type="submit" className="submit-button">Login</button>
                </form>
            </div>
        );
}

export default AdminPanel;
