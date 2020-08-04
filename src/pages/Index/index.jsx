import React, { Component } from "react";
import { Carousel, Flex, Grid } from "antd-mobile";
import axios from "axios";

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
    };
    async getSwipers() {
        const { data } = await axios.get("http://localhost:8080/home/swiper");
        this.setState({ swipers: data.body, isSwiperLoaded: true });
    }
    async getGroups() {
        const { data } = await axios.get("http://localhost:8080/home/groups", {
            params: "AREA%7C88cff55c-aaa4-e2e0",
        });
        this.setState({ groups: data.body });
    }
    componentDidMount() {
        // 获取轮播图
        this.getSwipers();
        // 获取租房小组
        this.getGroups();
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
                    src={`http://localhost:8080${item.imgSrc}`}
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
    render() {
        return (
            <div className="index">
                {/* 轮播图 */}
                <div className="swiper">
                    {this.state.isSwiperLoaded &&
                        <Carousel autoplay infinite>
                            {this.renderSwipers()}
                        </Carousel>}
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
                                    src={`http://localhost:8080${item.imgSrc}`}
                                    alt=""
                                />
                            </Flex>}
                    />
                </div>
            </div>
        );
    }
}
