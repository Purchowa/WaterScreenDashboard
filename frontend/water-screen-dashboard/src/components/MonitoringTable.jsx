import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { useAuth } from '@/context/AuthContext';
import appConfig from '../config.js'
import { formatUTCDateToLocal } from './common/dateUtils.js';


const MonitoringTable = ({ count }) => {
    const [tableData, setTableData] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const refreshData = () => {
            const token = localStorage.getItem('jwt');
            fetchManyStates(token);
        };

        refreshData();

        const interval = setInterval(refreshData, 1000 * 10);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    const fetchManyStates = (token) => {
        axios.get(`${appConfig.host}/${appConfig.restURI}/dashboard/states`, {
            headers: {
                Authorization: `Bearer ${token}`
            },
            params: {
                limit: count
            }
        })
            .then(response => {
                const states = response.data;
                setTableData(states);
            })
            .catch(error => {
                console.error("There was an error while getting the states", error);
            });
    };

    const modeNames = ["Standard", "Demo", "Service", "BLE realtime"];

    const tableStyle = {
        borderCollapse: 'collapse',
        width: '100%',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const cellStyle = {
        padding: '12px',
        borderBottom: '1px solid #ddd',
        textAlign: 'center',
    };

    const headerCellStyle = {
        ...cellStyle,
        textAlign: 'center',
        backgroundColor: '#e3f2fd',
        color: '#333',
        borderBottom: '2px solid #ddd',
    };

    const rowStyle = (index) => ({
        backgroundColor: index % 2 === 0 ? '#f0f9ff' : '#e8f5e9',
    });

    const fluidLevelStyle = (fluidLevel) => ({
        color: fluidLevel === 0 ? 'green' : 'red',
        fontWeight: 'bold',
    });

    const isRunningStyle = (isRunning) => ({
        color: isRunning ? 'blue' : 'gray',
        fontWeight: 'bold',
    });

    const modeStyle = (modeIndex) => {
        const colors = ['purple', 'orange', 'teal', 'brown'];
        return {
            color: colors[modeIndex],
            fontWeight: 'bold',
        };
    };

    return (
        <div style={{ overflowX: 'auto', padding: '1rem' }}>
            <table style={tableStyle}>
                <thead>
                    <tr>
                        <th style={{ ...headerCellStyle, textAlign: 'left' }}></th>
                        {tableData.map((entry, index) => (
                            <th key={index} style={headerCellStyle}>
                                {formatUTCDateToLocal(entry.date)}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {['Fluid level', 'Presenting', 'Mode'].map((parameter, rowIndex) => (
                        <tr key={rowIndex} style={rowStyle(rowIndex)}>
                            <td style={{ ...cellStyle, fontWeight: 'bold', textAlign: 'left' }}>{parameter}</td>
                            {tableData.map((entry, index) => (
                                <td key={index} style={cellStyle}>
                                    {parameter === 'Fluid level' ? (
                                        <span style={fluidLevelStyle(entry.fluidLevel)}>
                                            {entry.fluidLevel === 0 ? 'Optimal' : 'Low'}
                                        </span>
                                    ) : parameter === 'Presenting' ? (
                                        <span style={isRunningStyle(entry.isPresenting)}>
                                            {entry.isPresenting ? 'Yes' : 'No'}
                                        </span>
                                    ) : (
                                        <span style={modeStyle(entry.mode)}>{modeNames[entry.mode]}</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MonitoringTable;
