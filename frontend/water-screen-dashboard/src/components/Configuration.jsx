import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';

import appConfig from '../config.js'
import { formatUTCDateToLocal } from './common/dateUtils.js';
import '../styles/App.css';

function Configuration() {
    const [config, setConfig] = useState({
        mode: 0,
        enableWeekends: false,
        workTime: 1,
        idleTime: 1,
        mailList: [],
        workRange: {
            from: 0,
            to: 0,
        },
        lastUpdate: ""
    });

    const { isAuthenticated, logout } = useAuth();
    const [errorText, setErrorText] = useState("");

    const FormStates = Object.freeze({
        WaitingInput: 'btn-primary',
        Error: 'btn-warning',
        Success: 'btn-success'
    });

    const [formState, setFormState] = useState(FormStates.WaitingInput);

    useEffect(() => {
        setFormState(FormStates.WaitingInput);
    }, [config])

    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('jwt');
            fetchConfig(token);
        }
    }, [isAuthenticated]);

    const fetchConfig = (token) => {
        axios.get(`${appConfig.host}/${appConfig.restURI}/dashboard/config`, {
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

    const handleSubmit = (e) => {
        e.preventDefault();

        const token = localStorage.getItem('jwt');
        axios.post(`${appConfig.host}/${appConfig.restURI}/dashboard/config`, config, {
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
                    logout();
                else {
                    setErrorText(error.response.data.message);
                    setFormState(FormStates.Error);
                }
            });
    };

    return (
        <div className="admin_content">
            <h2>Configuration</h2>
            <h5 style={{ color: 'gray' }}>Last update: {formatUTCDateToLocal(config.lastUpdate)}</h5>
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
                <button type="submit" className={`btn btn-lg ${formState}`}>Submit</button>
            </form>
            <div>
                <p style={{ color: 'red' }}>{errorText}</p>
            </div>
        </div>
    );
}

export default Configuration;
