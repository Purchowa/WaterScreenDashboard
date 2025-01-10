import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './components/Home.jsx';
import './styles/index.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import App from "./App.jsx";
import AdminPanel from "./components/AdminPanel.jsx";
import ImageToBinary from './components/ImageToBinary.jsx';
import Monitoring from './components/Monitoring.jsx';
import Configuration from './components/Configuration.jsx';
import PrivateRoute from './components/common/PrivateRoute.jsx';

import { AuthProvider } from './context/AuthContext.jsx';


ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<App />}>
                        <Route index element={<Navigate to="home" />} />
                        <Route path="home" element={<Home />} />
                        <Route path="admin" element={<AdminPanel />} />
                        <Route path="image" element={<PrivateRoute> <ImageToBinary /> </PrivateRoute>} />
                        <Route path="monitoring" element={<PrivateRoute> <Monitoring /> </PrivateRoute>} />
                        <Route path="configuration" element={<PrivateRoute> <Configuration /> </PrivateRoute>} />
                        <Route
                            path="*"
                            element={<Home />}
                        />
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </React.StrictMode>
);
