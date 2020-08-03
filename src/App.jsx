import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from './pages/Home';
import CityList from './pages/CityList';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="app">
                    <Route path="/home" component={Home}/>
                    <Route path="/citylist" component={CityList}/>
                </div>
            </Router>
        );
    }
}

export default App;
