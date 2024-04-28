import './styles/App.css'

import { Outlet } from "react-router-dom";
import NavBar from "./components/common/NavBar.jsx";

function App() {

    return (
        <div>
            <NavBar />
            <div className="container">
                <Outlet />
            </div>
        </div>
    );
}

export default App;
