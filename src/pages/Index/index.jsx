import React, { Component } from "react";
import { Carousel } from "antd-mobile";
import axios from "axios";

export default class Index extends Component {
    state = {
        swipers: [],
    };
    async getSwipers() {
        const { data } = await axios.get("http://localhost:8080/home/swiper");
        this.setState({ swipers: data.body });
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
    render() {
        return (
            <div className="index">
                <Carousel autoplay infinite>
                    {this.renderSwipers()}
                </Carousel>
            </div>
        );
    }
}
