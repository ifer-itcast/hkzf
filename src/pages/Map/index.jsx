import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Toast } from 'antd-mobile';
import { BASE_URL } from '../../utils/url';
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
    state = {
        housesList: [], // 小区下的房源列表
        isShowList: false, // 表示是否展示房源列表
    };
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
        map.addEventListener('movestart', () => {
            if (this.state.isShowList) {
                this.setState({ isShowList: false });
            }
        });
    };

    // #1
    async renderOverlays(id) {
        try {
            Toast.loading('加载中...', 0, null, false);
            const { data } = await axios.get(
                `${BASE_URL}/area/map?id=${id}`
            );
            Toast.hide();
            // #2
            const { nextZoom, type } = this.getTypeAndZoom();
            data.body.forEach(item => {
                // #3 创建覆盖物
                this.createOverlays(item, nextZoom, type);
            });
        } catch(e) {
            Toast.hide();
        }
    }
    createOverlays(data, nextZoom, type) {
        const {
            coord: { longitude, latitude },
            label: areaName,
            count,
            value,
        } = data;
        const areaPoint = new BMap.Point(longitude, latitude);
        if (type === "circle") {
            // 区、镇
            this.createCircle(areaPoint, areaName, count, value, nextZoom);
        } else {
            // 小区
            this.createRect(areaPoint, areaName, count, value);
        }
    }
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
    createCircle(point, name, count, id, zoom) {
        const opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-35, -35), // 设置文本偏移量
        };
        // 设置 setContent 后，第一个参数中设置的文本内容就失效了，直接清空即可
        const label = new BMap.Label("", opts); // 创建文本标注对象
        label.id = id;
        // 4. 创建房源覆盖物
        label.setContent(`
            <div class="${styles.bubble}">
                <p class="${styles.name}">${name}</p>
                <p>${count}套</p>
            </div>
        `);
        label.setStyle(labelStyle);
        label.addEventListener("click", () => {
            // # mark
            this.renderOverlays(id);

            this.map.centerAndZoom(point, zoom);
            setTimeout(() => {
                this.map.clearOverlays();
            });
        });
        this.map.addOverlay(label);
    }
    createRect(point, name, count, id) {
        const opts = {
            position: point, // 指定文本标注所在的地理位置
            offset: new BMap.Size(-50, -28), // 设置文本偏移量
        };
        // 设置 setContent 后，第一个参数中设置的文本内容就失效了，直接清空即可
        const label = new BMap.Label("", opts); // 创建文本标注对象
        label.id = id;
        // 4. 创建房源覆盖物
        label.setContent(`
            <div class="${styles.rect}">
                <span class="${styles.housename}">${name}</span>
                <span class="${styles.housenum}">${count}套</span>
                <i class="${styles.arrow}"></i>
            </div>
        `);
        label.setStyle(labelStyle);
        label.addEventListener("click", e => {
            this.getHouseList(id);
            const target = e.changedTouches[0];
            this.map.panBy(
                window.innerWidth / 2 - target.clientX,
                (window.innerHeight - 330) / 2 - target.clientY
            );
        });
        this.map.addOverlay(label);
    }
    getHouseList = async id => {
        try {
            Toast.loading('加载中...', 0, null, false);
            const { data } = await axios.get(
                `${BASE_URL}/houses?cityId=${id}`
            );
            Toast.hide();
            this.setState({ housesList: data.body.list, isShowList: true });
        } catch(e) {
            Toast.hide();
        }
    };
    renderHouseList = () => {
        return this.state.housesList.map(item =>
            <div className={styles.house} key={item.houseCode}>
                <div className={styles.imgWrap}>
                    <img
                        className={styles.img}
                        src={BASE_URL+item.houseImg}
                        alt=""
                    />
                </div>
                <div className={styles.content}>
                    <h3 className={styles.title}>
                        {item.title}
                    </h3>
                    <div className={styles.desc}>
                        {item.desc}
                    </div>
                    <div>
                        {item.tags.map((tag, index) => {
                            const tagClass = "tag" + (index + 1);
                            return (
                                <span
                                    className={[
                                        styles.tag,
                                        styles[tagClass],
                                    ].join(" ")}
                                    key={tag}
                                >
                                    {tag}
                                </span>
                            );
                        })}
                    </div>
                    <div className={styles.price}>
                        <span className={styles.priceNum}>
                            {item.price}
                        </span>{" "}
                        元/月
                    </div>
                </div>
            </div>
        );
    };
    render() {
        return (
            <div className={styles.map}>
                <NavHeader>地图找房</NavHeader>
                <div id="container" className={styles.container} />
                {/* 房源列表 */}
                <div
                    className={[
                        styles.houseList,
                        this.state.isShowList ? styles.show : "",
                    ].join(" ")}
                >
                    <div className={styles.titleWrap}>
                        <h1 className={styles.listTitle}>房屋列表</h1>
                        <Link className={styles.titleMore} to="/home/list">
                            更多房源
                        </Link>
                    </div>

                    <div className={styles.houseItems}>
                        {/* 房屋结构 */}
                        {this.renderHouseList()}
                    </div>
                </div>
            </div>
        );
    }
}
