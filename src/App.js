import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import routes from './routes';
import 'react-toastify/dist/ReactToastify.css';
// import App22 from './App22';

const App = () => {
    return (
        <Router>
            <ToastContainer />
            {routes}
        </Router>
        // <App22 />
    );
};

export default App;
