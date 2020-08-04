import React, { Component } from "react";
import { NavBar } from "antd-mobile";
import axios from "axios";

import { List, AutoSizer } from "react-virtualized";

import { getCurrentCity } from "../../utils";

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

const list = Array(100).fill("r");

// https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md

function rowRenderer({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // 当前项是否正在滚动列表
    isVisible, // 当前项在 List 中是否可见
    style, // Style object to be applied to row (to position it)
}) {
    return (
        <div key={key} style={style}>
            {list[index]}
        </div>
    );
}

export default class CityList extends Component {
    componentDidMount() {
        // 获取城市列表数据
        this.getCityList();
    }
    async getCityList() {
        // 1. 城市列表数据
        const { data: cityListRes } = await axios.get(
            "http://localhost:8080/area/city?level=1"
        );
        const { cityList, cityIndex } = formatCityData(cityListRes.body);
        // 2. 热门城市数据
        const { data: hotListRes } = await axios.get(
            "http://localhost:8080/area/hot"
        );
        // 将数据添加到 cityList 中
        cityList["hot"] = hotListRes.body;
        // 将索引添加到 cityIndex 中
        cityIndex.unshift("hot");

        // 3. 获取当前定位城市
        const curCity = await getCurrentCity();
        cityList["#"] = [curCity];
        cityIndex.unshift("#");

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
                <AutoSizer>
                    {({ width, height }) =>
                        <List
                            width={width}
                            height={height}
                            rowCount={list.length}
                            rowHeight={20}
                            rowRenderer={rowRenderer}
                        />}
                </AutoSizer>
            </div>
        );
    }
}
