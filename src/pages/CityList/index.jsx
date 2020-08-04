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

// https://github.com/bvaughn/react-virtualized/blob/master/docs/List.md

const formatCityIndex = letter => {
    switch (letter) {
        case "#":
            return "当前定位";
        case "hot":
            return "热门城市";
        default:
            return letter.toUpperCase();
    }
};

const TITLE_HEIGHT = 36;
const NAME_HEIGHT = 50;

export default class CityList extends Component {
    state = {
        cityList: {},
        cityIndex: [],
        activeIndex: 0, // 默认高亮的右侧索引列表索引
    };
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

        this.setState({ cityList, cityIndex });
    }
    rowRenderer = ({
        key, // Unique key within array of rows
        index, // Index of row within collection
        isScrolling, // 当前项是否正在滚动列表
        isVisible, // 当前项在 List 中是否可见
        style, // Style object to be applied to row (to position it)
    }) => {
        const { cityIndex, cityList } = this.state;
        const letter = cityIndex[index];

        // cityList[letter] // 当前索引下对应的城市列表
        return (
            <div key={key} style={style} className="city">
                <div className="title">
                    {formatCityIndex(letter)}
                </div>
                {cityList[letter].map(item =>
                    <div key={item.value} className="name">
                        {item.label}
                    </div>
                )}
            </div>
        );
    };
    getRowHeight = ({ index }) => {
        // 高 = 当前索引标题高度 + 一行城市高度 * 行数
        const { cityList, cityIndex } = this.state;
        return TITLE_HEIGHT + cityList[cityIndex[index]].length * NAME_HEIGHT;
    };
    // 右侧索引列表
    renderCityIndex() {
        const { cityIndex, activeIndex } = this.state;
        return cityIndex.map((item, index) =>
            <li className="city-index-item" key={item}>
                <span className={activeIndex === index ? "index-active" : ""}>
                    {item === "hot" ? "热" : item.toUpperCase()}
                </span>
            </li>
        );
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
                            rowCount={this.state.cityIndex.length}
                            rowHeight={this.getRowHeight}
                            rowRenderer={this.rowRenderer}
                        />}
                </AutoSizer>
                {/* 右侧索引列表 */}
                <ul className="city-index">
                    {this.renderCityIndex()}
                </ul>
            </div>
        );
    }
}
