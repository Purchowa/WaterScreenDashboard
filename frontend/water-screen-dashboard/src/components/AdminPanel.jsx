import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import '../styles/App.css';

function AdminPanel() {
    const [config, setConfig] = useState({
        mode: 0,
        enableWeekends: false,
        workTime: 0,
        idleTime: 0,
        mailList: []
    });
    const [picture, setPicture] = useState({ data: "", size: 0 });
    const [state, setState] = useState({
        fluidLevel: 0,
        isPresenting: false,
        mode: 0
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginData, setLoginData] = useState({
        username: "at_admin",
        password: "hF7Ya8yEPLXdzGMv4swC9Ue6fb3m5c"
    });

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token) {
            setIsAuthenticated(true);
            fetchConfig(token);
            setupSocket(token);
        }
    }, []);

    const fetchConfig = (token) => {
        axios.get('http://127.0.0.1:3100/dashboard/config', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const dashboardConfig = response.data;
                setConfig(dashboardConfig);
            })
            .catch(error => {
                console.error("There was an error fetching the config!", error);
            });
    };

    const setupSocket = (token) => {
        const socket = io('http://127.0.0.1:3100', {
            extraHeaders: {
                Authorization: `Bearer ${token}`
            }
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
            socket.emit('getState');
        });

        socket.on('state', (recState) => {
            setState(recState);
        });

        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });

        return () => {
            socket.disconnect();
        };
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'data' || name === 'size') {
            setPicture(prevPicture => ({
                ...prevPicture,
                [name]: type === 'checkbox' ? checked : value
            }));
        } else if (name === 'username' || name === 'password') {
            setLoginData(prevLoginData => ({
                ...prevLoginData,
                [name]: value
            }));
        } else {
            setConfig(prevConfig => ({
                ...prevConfig,
                [name]: type === 'checkbox' ? checked : (name === 'mailList' ? value.split(',').map(email => email.trim()) : value)
            }));
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post('http://127.0.0.1:3100/dashboard/login', loginData)
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('jwt', token);
                console.log(token)
                setIsAuthenticated(true);
                fetchConfig(token);
                setupSocket(token);
            })
            .catch(error => {
                console.error("There was an error logging in!", error);
            });
    };

    const handleLogout = () => {
        localStorage.clear();
        setIsAuthenticated(false);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwt');
        const pictureDataArray = picture.data.split(',').map(num => parseInt(num.trim(), 10));
        const updatedConfig = {
            ...config,
            picture: {
                data: pictureDataArray,
                size: picture.size
            }
        };
        axios.post('http://127.0.0.1:3100/dashboard/config', updatedConfig, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Config updated successfully', response.data);
            })
            .catch(error => {
                console.error("There was an error updating the config!", error);
            });
    };

    if (!isAuthenticated) {
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
                                onChange={handleChange}
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
                                onChange={handleChange}
                                className="form-input"
                            />
                        </label>
                    </div>
                    <button type="submit" className="submit-button">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div className="admin_content">
            <button onClick={handleLogout} style={{backgroundColor: "#f44336", padding: "10px 20px", border: "none", borderRadius: "5px"}}>Logout</button>
            <h2>Current State</h2>
            <p>Fluid Level: {state.fluidLevel}</p>
            <p>Is running: {state.isPresenting ? 'Yes' : 'No'}</p>
            <p>Mode: {state.mode}</p>
            <p></p>
            <h2>Config</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">
                        Mode:
                        <select
                            name="mode"
                            value={config.mode}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value={0}>Standard</option>
                            <option value={1}>Demo</option>
                            <option value={2}>Service</option>
                        </select>
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Enable Weekends:
                        <input
                            type="checkbox"
                            name="enableWeekends"
                            checked={config.enableWeekends}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Work Time:
                        <input
                            type="number"
                            name="workTime"
                            value={config.workTime}
                            min="0"
                            onChange={handleChange}
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Idle Time:
                        <input
                            type="number"
                            name="idleTime"
                            value={config.idleTime}
                            min="0"
                            onChange={handleChange}
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Mail List:
                        <input
                            type="text"
                            name="mailList"
                            value={config.mailList.join(', ')}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Picture Data:
                        <textarea
                            name="data"
                            value={picture.data}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group">
                    <label className="form-label">
                        Picture Size:
                        <input
                            type="number"
                            name="size"
                            value={picture.size}
                            min="0"
                            onChange={handleChange}
                            className="form-input"
                        />
                    </label>
                </div>
                <button type="submit" className="submit-button">Submit</button>
            </form>
        </div>
    );
}

export default AdminPanel;
