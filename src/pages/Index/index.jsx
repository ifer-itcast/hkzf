import React, { Component } from "react";
import { Carousel, Flex, Grid, WingBlank } from "antd-mobile";
import axios from "axios";

import { getCurrentCity } from '../../utils';
import { BASE_URL } from '../../utils/url';

import nav1 from "../../assets/images/nav-1.png";
import nav2 from "../../assets/images/nav-2.png";
import nav3 from "../../assets/images/nav-3.png";
import nav4 from "../../assets/images/nav-4.png";

import "./index.scss";

const navs = [
    {
        id: 0,
        img: nav1,
        title: "整租",
        path: "/home/list",
    },
    {
        id: 1,
        img: nav2,
        title: "合租",
        path: "/home/list",
    },
    {
        id: 2,
        img: nav3,
        title: "地图找房",
        path: "/home/map",
    },
    {
        id: 3,
        img: nav4,
        title: "去出租",
        path: "/home/list",
    },
];

export default class Index extends Component {
    state = {
        swipers: [],
        isSwiperLoaded: false,
        groups: [],
        news: [],
        currentCityName: '上海' // 当前城市名称
    };
    async getSwipers() {
        const { data } = await axios.get(`${BASE_URL}/home/swiper`);
        this.setState({ swipers: data.body, isSwiperLoaded: true });
    }
    async getGroups() {
        const { data } = await axios.get(`${BASE_URL}/home/groups`, {
            params: "AREA%7C88cff55c-aaa4-e2e0",
        });
        this.setState({ groups: data.body });
    }
    async getNews() {
        const { data } = await axios.get(`${BASE_URL}/home/news`, {
            params: {
                area: "AREA%7C88cff55c-aaa4-e2e0",
            },
        });
        this.setState({ news: data.body });
    }
    async componentDidMount() {
        // 获取轮播图
        this.getSwipers();
        // 获取租房小组
        this.getGroups();
        // 最新资讯
        this.getNews();

        // 展示顶部导航城市信息
        /* const myCity = new window.BMap.LocalCity();
        myCity.get(async res => {
            const { data } = await axios.get(`${BASE_URL}/area/info?name=${res.name}`);
            this.setState({ currentCityName: data.body.label });
        }); */
        const curCity = await getCurrentCity();
        this.setState({ currentCityName: curCity.label });
    }
    renderSwipers() {
        return this.state.swipers.map(item =>
            <a
                key={item.id}
                href="http://itcast.cn"
                style={{
                    display: "inline-block",
                    width: "100%",
                    height: 212,
                }}
            >
                <img
                    src={`${BASE_URL}${item.imgSrc}`}
                    alt=""
                    style={{
                        width: "100%",
                        verticalAlign: "top",
                    }}
                />
            </a>
        );
    }
    renderNavs = () => {
        return navs.map(item =>
            <Flex.Item
                key={item.id}
                onClick={() => this.props.history.push(item.path)}
            >
                <img src={item.img} alt="" />
                <h2>
                    {item.title}
                </h2>
            </Flex.Item>
        );
    };
    renderNews() {
        return this.state.news.map(item =>
            <div className="news-item" key={item.id}>
                <div className="imgwrap">
                    <img
                        className="img"
                        src={`${BASE_URL}${item.imgSrc}`}
                        alt=""
                    />
                </div>
                <Flex className="content" direction="column" justify="between">
                    <h3 className="title">
                        {item.title}
                    </h3>
                    <Flex className="info" justify="between">
                        <span>
                            {item.from}
                        </span>
                        <span>
                            {item.date}
                        </span>
                    </Flex>
                </Flex>
            </div>
        );
    }
    render() {
        return (
            <div className="index">
                {/* 轮播图 */}
                <div className="swiper">
                    {this.state.isSwiperLoaded &&
                        <Carousel autoplay infinite>
                            {this.renderSwipers()}
                        </Carousel>}

                    {/* Index 组件中轮播图中的顶部导航 */}
                    <Flex className="search-box">
                        {/* 左 */}
                        <Flex className="search">
                            {/* 左 -> 左 */}
                            <div
                                className="location"
                                onClick={() =>
                                    this.props.history.push("/citylist")}
                            >
                                <span className="name">{this.state.currentCityName}</span>
                                <i className="iconfont icon-arrow" />
                            </div>

                            {/* 左 -> 右 */}
                            <div
                                className="form"
                                onClick={() =>
                                    this.props.history.push("/search")}
                            >
                                <i className="iconfont icon-seach" />
                                <span className="text">请输入小区或地址</span>
                            </div>
                        </Flex>
                        {/* 右 */}
                        <i
                            className="iconfont icon-map"
                            onClick={() => this.props.history.push("/map")}
                        />
                    </Flex>
                </div>

                {/* 导航 */}
                <Flex className="nav">
                    {this.renderNavs()}
                </Flex>

                {/* 租房小组 */}
                <div className="group">
                    <h3 className="group-title">
                        租房小组 <span className="more">更多</span>
                    </h3>
                    <Grid
                        data={this.state.groups}
                        columnNum={2}
                        square={false}
                        hasLine={false}
                        renderItem={item =>
                            <Flex
                                className="group-item"
                                justify="around"
                                key={item.id}
                            >
                                <div className="desc">
                                    <p className="title">
                                        {item.title}
                                    </p>
                                    <span className="info">
                                        {item.desc}
                                    </span>
                                </div>
                                <img
                                    src={`${BASE_URL}${item.imgSrc}`}
                                    alt=""
                                />
                            </Flex>}
                    />
                </div>

                {/* 最新资讯 */}
                <div className="news">
                    <h3 className="group-title">最新资讯</h3>
                    <WingBlank size="md">
                        {this.renderNews()}
                    </WingBlank>
                </div>
            </div>
        );
    }
}
