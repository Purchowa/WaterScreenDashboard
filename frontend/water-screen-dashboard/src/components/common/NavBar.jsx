import React from "react";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';

import admin from '@assets/admin.png'
import home from '@assets/home.png'

const Navbar = () => {
    return (
        <nav className='navBar'>
            <div className="content">
                <a href="https://anstar.edu.pl" title="Strona główna">
                    <img
                        src="https://anstar.edu.pl/wp-content/themes/tarnowp/img/logo-akademia-nauk.svg"
                        alt="Akadamia Tarnowska"
                    />
                </a>
            </div>
            <div className="content">
                <Link to="/home" className="nav-link" id="pills-home-tab" role="tab" aria-controls="pills-home" aria-selected="true"><img src={home} width={'40px'} /></Link>
            </div>
            <div className="content">
                <Link to="/admin" className="nav-link" id="pills-home-tab" role="tab" aria-controls="pills-home" aria-selected="true"><img src={admin} width={'40px'} /></Link>
            </div>
        </nav>
    );
};

export default Navbar;
