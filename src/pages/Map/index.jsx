import React, { Component } from "react";
import axios from "axios";
import NavHeader from "../../components/NavHeader";
// import "./index.scss";
import styles from "./index.module.css";

const BMap = window.BMap;

// 覆盖物样式，在房源覆盖物外面，和它一样大
const labelStyle = {
    cursor: "pointer",
    border: "0px solid rgb(255, 0, 0)",
    padding: "0px",
    whiteSpace: "nowrap",
    fontSize: "12px",
    color: "rgb(255, 255, 255)",
    textAlign: "center",
};
export default class Map extends Component {
    componentDidMount() {
        this.initMap();
    }
    initMap = () => {
        const { label, value } = JSON.parse(localStorage.getItem("hkzf_city"));
        const map = new window.BMap.Map("container");
        this.map = map;

        // const point = new window.BMap.Point(116.404, 39.915);
        // map.centerAndZoom(point, 15);

        const myGeo = new window.BMap.Geocoder();
        // 将地址解析结果显示在地图上，并调整地图视野
        myGeo.getPoint(
            label,
            async point => {
                if (point) {
                    // 1. 初始化地图
                    map.centerAndZoom(point, 11);
                    // 2. 添加控件
                    map.addControl(new BMap.NavigationControl()); // 放大缩小
                    map.addControl(new BMap.ScaleControl()); // 比例尺

                    this.renderOverlays(value);
                    /* const { data } = await axios.get(
                        `http://localhost:8080/area/map?id=${value}`
                    );
                    data.body.forEach(item => {
                        // 3. 创建文本覆盖物
                        const {
                            coord: { longitude, latitude },
                            label: areaName,
                            count,
                            value,
                        } = item;
                        const areaPoint = new BMap.Point(longitude, latitude);
                        const opts = {
                            position: areaPoint, // 指定文本标注所在的地理位置
                            offset: new BMap.Size(-35, -35), // 设置文本偏移量
                        };
                        // 设置 setContent 后，第一个参数中设置的文本内容就失效了，直接清空即可
                        const label = new BMap.Label("", opts); // 创建文本标注对象
                        label.id = value;
                        // 4. 创建房源覆盖物
                        label.setContent(`
                            <div class="${styles.bubble}">
                                <p class="${styles.name}">${areaName}</p>
                                <p>${count}套</p>
                            </div>
                        `);
                        label.setStyle(labelStyle);
                        label.addEventListener("click", () => {
                            map.centerAndZoom(areaPoint, 13);
                            setTimeout(() => {
                                map.clearOverlays();
                            });
                        });
                        map.addOverlay(label);
                    }); */
                }
            },
            label
        );
    };

    // #1
    async renderOverlays(id) {
        const { data } = await axios.get(
            `http://localhost:8080/area/map?id=${id}`
        );
        // #2
        const { nextZoom, type } = this.getTypeAndZoom();
        data.body.forEach(item => {
            // #3 创建覆盖物
            this.createOverlays(item, nextZoom, type);
        });
    }
    createOverlays() {}
    getTypeAndZoom() {
        const zoom = this.map.getZoom();
        let nextZoom, type;
        if (zoom >= 10 && zoom < 12) {
            // 区
            nextZoom = 13;
            type = "circle";
        } else if (zoom >= 12 && zoom < 14) {
            // 镇
            nextZoom = 15;
            type = "circle";
        } else if (zoom >= 14 && zoom < 16) {
            type = "rect";
        }
        return { nextZoom, type };
    }
    render() {
        return (
            <div className={styles.map}>
                <NavHeader>地图找房</NavHeader>
                <div id="container" className={styles.container} />
            </div>
        );
    }
}
