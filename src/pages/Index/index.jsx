import React, { Component } from "react";
import { Carousel, Flex } from "antd-mobile";
import axios from "axios";

import nav1 from "../../assets/images/nav-1.png";
import nav2 from "../../assets/images/nav-2.png";
import nav3 from "../../assets/images/nav-3.png";
import nav4 from "../../assets/images/nav-4.png";

import "./index.css";

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
    };
    async getSwipers() {
        const { data } = await axios.get("http://localhost:8080/home/swiper");
        this.setState({ swipers: data.body, isSwiperLoaded: true });
    }
    componentDidMount() {
        this.getSwipers();
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
                <div className="swiper">
                    {this.state.isSwiperLoaded &&
                        <Carousel autoplay infinite>
                            {this.renderSwipers()}
                        </Carousel>}
                </div>
                <Flex className="nav">
                    {this.renderNavs()}
                </Flex>
            </div>
        );
    }
}
