import React, { Component } from "react";
import { NavBar } from "antd-mobile";
import axios from "axios";

import "./index.scss";

const formatCityData = list => {
    const cityList = {};
    list.forEach(item => {
        const first = item.short.substr(0, 1);
        if (cityList[first]) {
            cityList[first].push(item);
        } else {
            cityList[first] = [item];
        }
    });
    const cityIndex = Object.keys(cityList).sort();
    return { cityList, cityIndex };
};

export default class CityList extends Component {
    componentDidMount() {
        // 获取城市列表数据
        this.getCityList();
    }
    async getCityList() {
        const { data } = await axios.get(
            "http://localhost:8080/area/city?level=1"
        );
        const { cityList, cityIndex } = formatCityData(data.body);
        console.log(cityList, cityIndex);
    }
    render() {
        return (
            <div className="citylist">
                <NavBar
                    className="navbar"
                    mode="light"
                    icon={<i className="iconfont icon-back" />}
                    onLeftClick={() => this.props.history.go(-1)}
                >
                    城市选择
                </NavBar>
            </div>
        );
    }
}
