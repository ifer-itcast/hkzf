import React, { Component } from 'react'
import { Route } from 'react-router-dom';
import News from '../News';
export default class Home extends Component {
    render() {
        return (
            <div>
                Home
                <Route path="/home/news" component={News}/>
            </div>
        )
    }
}
