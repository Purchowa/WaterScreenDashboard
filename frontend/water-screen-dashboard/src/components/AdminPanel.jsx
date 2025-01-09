import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { isExpired } from 'react-jwt'
import { RgbColorPicker } from "react-colorful";

import appConfig from '../config.js'
import '../styles/App.css';

function AdminPanel() {
    const [state, setState] = useState({
        fluidLevel: 0,
        isPresenting: false,
        mode: 0
    });

    const [config, setConfig] = useState({
        mode: 0,
        enableWeekends: false,
        workTime: 1,
        idleTime: 1,
        mailList: [],
        workRange: {
            from: 0,
            to: 0,
        }
    });
    const [picture, setPicture] = useState({ data: "", size: 0 });
    const [pictureColors, setPictureColors] = useState({ main: { r: 0, g: 0, b: 0 }, secondary: { r: 0, g: 0, b: 0 } });

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loginData, setLoginData] = useState({
        username: "",
        password: ""
    });

    const [intervalID, setIntervalID] = useState();
    const [errorText, setErrorText] = useState("");

    const FormStates = Object.freeze({
        WaitingInput: 'btn-primary',
        Error: 'btn-warning',
        Success: 'btn-success'
    });

    const [formState, setFormState] = useState(FormStates.WaitingInput);

    useEffect(() => {
        setFormState(FormStates.WaitingInput);
    }, [picture, config])

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        let clearSocketConnection = undefined;
        if (token && !isExpired(token)) {
            setIsAuthenticated(true);
            fetchConfig(token);
            clearSocketConnection = setupSocket();
        }
        return () => {
            if (intervalID) {
                clearInterval(intervalID);
            }
            if (clearSocketConnection) {
                clearSocketConnection();
            }
        }
    }, []);

    const fetchConfig = (token) => {
        axios.get(`${appConfig.host}/${appConfig.restURI}/dashboard/config`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const dashboardConfig = response.data;
                setConfig(dashboardConfig);
                setPicture({ data: dashboardConfig.picture.data.toString(), size: dashboardConfig.picture.size });
                setPictureColors(dashboardConfig.picture.colors)
            })
            .catch(error => {
                console.error("There was an error fetching the config!", error);
            });
    };

    const setupSocket = () => {
        const socket = io(appConfig.host, {
            path: `/${appConfig.restURI}/socket.io/`
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');

            setIntervalID(setInterval(() => { socket.emit('getState'); }, appConfig.gettingStateIntervalTime_ms));
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

    const handleLogin = (e) => {
        e.preventDefault();
        axios.post(`${appConfig.host}/${appConfig.restURI}/dashboard/login`, loginData)
            .then(response => {
                const token = response.data.token;
                localStorage.setItem('jwt', token);
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

        const pictureDataArray = picture.data.split(',').map(num => parseInt(num.trim(), 10));
        if (pictureDataArray.some(isNaN)) {
            setErrorText("Picutre data must be composed of numbers!");
            setFormState(FormStates.Error);
            return;
        }

        const updatedConfig = { ...config, picture: { data: pictureDataArray, size: picture.size, colors: pictureColors } };

        const token = localStorage.getItem('jwt');
        axios.post(`${appConfig.host}/${appConfig.restURI}/dashboard/config`, updatedConfig, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                console.log('Config updated successfully', response.data);
                setErrorText("");
                setFormState(FormStates.Success);
            })
            .catch(error => {
                console.error("There was an error updating the config!", error);
                const unauthorizedStatus = 401;
                if (error.response.status === unauthorizedStatus)
                    setIsAuthenticated(false);
                else {
                    setErrorText(error.response.data.message);
                    setFormState(FormStates.Error);
                }
            });
    };

    const modeNames = ["Standard", "Demo", "Service", "BLE realtime"];
    const fluidLevelNames = ["Optimal", "Low"];

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

    return (
        <div className="admin_content">
            <button onClick={handleLogout} style={{ backgroundColor: "#f44336", padding: "10px 20px", border: "none", borderRadius: "5px", marginBottom: 8 }}>Logout</button>
            <h2>Current State</h2>
            <p>Fluid Level: <span style={{ fontWeight: 'bold', color: state.fluidLevel == 0 ? "green" : "red" }}>{fluidLevelNames[state.fluidLevel]}</span></p>
            <p>Is running: <span style={{ fontWeight: 'bold' }}>{state.isPresenting ? 'Yes' : 'No'}</span></p>
            <p>Mode: <span style={{ fontWeight: 'bold' }}>{modeNames[state.mode]}</span></p>
            <p></p>
            <h2>Config</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="form-label">
                        Mode:
                        <select
                            name="mode"
                            value={config.mode}
                            onChange={(e) => { setConfig({ ...config, mode: e.target.value }) }}
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
                            onChange={(e) => { setConfig({ ...config, enableWeekends: e.target.checked }) }}
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
                            min={1}
                            onChange={(e) => { setConfig({ ...config, workTime: e.target.value }) }}
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
                            min={1}
                            onChange={(e) => { setConfig({ ...config, idleTime: e.target.value }) }}
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group" >
                    <label className="form-label" >
                        Work range:
                    </label>

                    <label> From
                        <input
                            type="number"
                            name="from"
                            value={config.workRange.from}
                            min={0}
                            onChange={(e) => setConfig({ ...config, workRange: { ...config.workRange, from: e.target.value } })}
                            className="form-input"
                            style={{ marginLeft: 8 }}
                        />
                    </label>
                    <label> To
                        <input
                            type="number"
                            name="to"
                            value={config.workRange.to}
                            min={0}
                            onChange={(e) => setConfig({ ...config, workRange: { ...config.workRange, to: e.target.value } })}
                            className="form-input"
                            style={{ marginLeft: 8 }}
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
                            onChange={(e) => { setConfig({ ...config, mailList: e.target.value.split(',').map(email => email.trim()) }) }}
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
                            onChange={(e) => { setPicture({ ...picture, data: e.target.value }) }}
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
                            min={0}
                            onChange={(e) => { setPicture({ ...picture, size: e.target.value }) }}
                            className="form-input"
                        />
                    </label>
                </div>
                <div className="form-group" style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <label className='form-label'>
                        Main color
                        <RgbColorPicker color={pictureColors.main} onChange={(newColor) => { setPictureColors({ ...pictureColors, main: newColor }) }} />
                    </label>
                    <label className='form-label'>
                        Secondary color
                        <RgbColorPicker color={pictureColors.secondary} onChange={(newColor) => { setPictureColors({ ...pictureColors, secondary: newColor }) }} />
                    </label>
                </div>
                <button type="submit" className={`btn btn-lg ${formState}`}>Submit</button>
            </form>
            <div>
                <p style={{ color: 'red' }}>{errorText}</p>
            </div>
        </div>
    );
}

export default AdminPanel;
