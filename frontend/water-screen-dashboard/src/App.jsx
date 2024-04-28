import './styles/App.css'

import { Outlet } from "react-router-dom";
import NavBar from "./components/common/NavBar.jsx";
import Footer from "./components/common/Footer.jsx";

function App() {

    return (
        <div>
            <NavBar />
            <div className="container">
                <Outlet />
            </div>
            <Footer/>
        </div>
    );
}

export default App;
