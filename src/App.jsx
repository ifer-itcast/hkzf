import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Home from './pages/Home';
import CityList from './pages/CityList';

class App extends Component {
    render() {
        return (
            <Router>
                <div className="app">
                    <ul>
                        <li>
                            <Link to="/home">首页</Link>
                        </li>
                        <li>
                            <Link to="/citylist">城市</Link>
                        </li>
                    </ul>
                    <Route path="/home" component={Home}/>
                    <Route path="/citylist" component={CityList}/>
                </div>
            </Router>
        );
    }
}

export default App;
