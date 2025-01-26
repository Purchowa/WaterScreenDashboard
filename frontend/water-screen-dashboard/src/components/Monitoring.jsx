import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';


import { useAuth } from '@/context/AuthContext';
import MonitoringTable from './MonitoringTable.jsx';

import appConfig from '../config.js'
import '../styles/App.css';

function Monitoring() {
    const [state, setState] = useState({
        fluidLevel: 0,
        isPresenting: false,
        mode: 0
    });
    const [intervalID, setIntervalID] = useState();

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        let clearSocketConnection = undefined;
        if (isAuthenticated) {
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
    }, [isAuthenticated]);

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

    const modeNames = ["Standard", "Demo", "Service", "BLE realtime"];
    const fluidLevelNames = ["Optimal", "Low"];

    return (
        <div className="admin_content">
            <h2>Current State</h2>
            <p>Fluid Level: <span style={{ fontWeight: 'bold', color: state.fluidLevel == 0 ? "green" : "red" }}>{fluidLevelNames[state.fluidLevel]}</span></p>
            <p>Presenting: <span style={{ fontWeight: 'bold' }}>{state.isPresenting ? 'Yes' : 'No'}</span></p>
            <p>Mode: <span style={{ fontWeight: 'bold' }}>{modeNames[state.mode]}</span></p>
            <MonitoringTable count={100} />
        </div>
    );
}

export default Monitoring;
