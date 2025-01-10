import React from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';

import monitor from '@assets/monitor.png'
import settings from '@assets/settings.png'
import picture from '@assets/picture.png'

import { useAuth } from '@/context/AuthContext';

const AdminNavbar = () => {
    const { logout } = useAuth();

    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate("home");
    }

    return (
        <nav className='navBar' style={{ alignItems: 'center', borderTop: "groove 3px gray", boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}>
            <div className="content">
                <Link to="/monitoring" className="nav-link" id="pills-home-tab" role="tab" aria-controls="pills-home" aria-selected="true"><img src={monitor} width={'40px'} style={{ margin: 12 }} /></Link>
            </div>
            <div className="content">
                <Link to="/configuration" className="nav-link" id="pills-home-tab" role="tab" aria-controls="pills-home" aria-selected="true"><img src={settings} width={'40px'} style={{ margin: 12 }} /></Link>
            </div>
            <div className="content">
                <Link to="/image" className="nav-link" id="pills-home-tab" role="tab" aria-controls="pills-home" aria-selected="true"><img src={picture} width={'40px'} style={{ margin: 12 }} /></Link>
            </div>
            <div style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', marginRight: 16 }}>
                <button onClick={handleLogout} style={{ backgroundColor: "#f44336", padding: "10px 20px", border: "none", borderRadius: "5px", marginBottom: 8, fontWeight: 'bold' }}>Logout</button>
            </div>
        </nav>
    );
};

export default AdminNavbar;
