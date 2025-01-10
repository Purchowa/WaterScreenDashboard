import './styles/App.css'

import NavBar from "./components/common/NavBar.jsx";
import AdminNavbar from './components/common/AdminNavBar.jsx';
import Footer from "./components/common/Footer.jsx";

import { Outlet } from "react-router-dom";
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { isExpired } from 'react-jwt';

function App() {
    const { isAuthenticated, login, logout } = useAuth();

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        if (token && !isExpired(token)) {
            login();
            console.log("login")
        }
        else {
            logout();
        }
    }, []);

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'white' }}>
            <NavBar />
            {isAuthenticated && (<AdminNavbar />)}
            <div style={{ flexGrow: 1 }}>
                <Outlet />
            </div>
            <Footer/>
        </div>
    );
}

export default App;
