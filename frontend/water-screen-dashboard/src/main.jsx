import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Home.jsx'
import './styles/index.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import App from "./App.jsx";
import AdminPanel from "./components/AdminPanel.jsx";

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App/>}>
                    <Route path="home" element={<Home/>}/>
                    <Route path="admin" element={<AdminPanel/>}/>
                    <Route
                        path="*"
                        element={
                            <Home/>
                        }
                    />
                </Route>
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
)
