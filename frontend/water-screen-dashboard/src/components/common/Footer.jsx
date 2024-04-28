import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import './navbar.css';
import fb_logo from '../../assets/facebook_logo.png'

const Footer = () => {
    return (
        <footer>
            <a href="https://www.facebook.com/KatedraInformatykiAT" target="_blank">
                <img src={fb_logo} alt="Logo"/>
            </a>

        </footer>
    );
};

export default Footer;
