import React, { Component } from 'react'
import SearchHeader from '../../components/SearchHeader';

const { label } = JSON.parse(localStorage.getItem('hkzf_city'));

export default class HouseList extends Component {
    render() {
        return (
            <div>
                <SearchHeader cityName={label}/>
            </div>
        )
    }
}
