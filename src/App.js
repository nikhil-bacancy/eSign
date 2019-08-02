import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import routes from './routes';
// import App22 from './App22';

const App = () => {
    return (
        <Router>
            {routes}
        </Router>
        // <App22 />
    );
};

export default App;
