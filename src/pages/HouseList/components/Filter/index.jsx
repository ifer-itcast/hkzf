import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import { API } from "../../../../utils/api";

import styles from "./index.module.css";

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
    area: false,
    mode: false,
    price: false,
    more: false,
};

const selectedValues = {
    area: ["area", "null"],
    mode: ["null"],
    price: ["null"],
    more: [],
};

export default class Filter extends Component {
    state = {
        titleSelectedStatus,
        openType: "", // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
        filtersData: {},
        selectedValues,
    };
    componentDidMount() {
        this.getFiltersData();
    }
    async getFiltersData() {
        // 获取当前定位城市 ID
        const { value } = JSON.parse(localStorage.getItem("hkzf_city"));
        const { data } = await API.get(`/houses/condition?id=${value}`);
        this.setState({ filtersData: data.body });
    }
    renderFilterPicker() {
        /* const { openType } = this.state;
        return openType === "area" ||
        openType === "mode" ||
        openType === "price"
            ? <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
            : null; */
        const {
            openType,
            filtersData: { area, subway, rentType, price },
            selectedValues,
        } = this.state;
        if (
            openType !== "area" &&
            openType !== "mode" &&
            openType !== "price"
        ) {
            return null;
        }
        let data = [];
        let cols = 3;
        let defaultValue = selectedValues[openType];
        switch (openType) {
            case "area":
                data = [area, subway];
                cols = 3;
                break;
            case "mode":
                data = rentType;
                cols = 1;
                break;
            case "price":
                data = price;
                cols = 1;
                break;
        }
        return (
            <FilterPicker
                key={openType}
                onCancel={this.onCancel}
                onSave={this.onSave}
                data={data}
                cols={cols}
                type={openType}
                defaultValue={defaultValue}
            />
        );
    }

    // 点击标题菜单实现高亮
    // 注意：this指向的问题！！！
    // 说明：要实现完整的功能，需要后续的组件配合完成！
    onTitleClick = type => {
        const { titleSelectedStatus, selectedValues } = this.state;
        const newTitleSelectedStatus = { ...titleSelectedStatus };

        // ['area', 'mode', 'price', 'more']
        Object.keys(titleSelectedStatus).forEach(key => {
            // 当前标题
            if (key === type) {
                newTitleSelectedStatus[type] = true;
                return;
            }
            // 其他标题
            const selectedVal = selectedValues[key];
            if (
                key === "area" &&
                (selectedVal.length !== 2 || selectedVal[0] !== "area")
            ) {
                newTitleSelectedStatus[key] = true;
            } else if (key === "mode" && selectedVal[0] !== "null") {
                newTitleSelectedStatus[key] = true;
            } else if (key === "price" && selectedVal[0] !== "null") {
                newTitleSelectedStatus[key] = true;
            } else if (key === "more" && selectedVal.length !== 0) {
                newTitleSelectedStatus[key] = true;
            } else {
                newTitleSelectedStatus[key] = false;
            }
        });
        this.setState({
            openType: type,
            titleSelectedStatus: newTitleSelectedStatus,
        });
        /* this.setState(prevState => {
            return {
                titleSelectedStatus: {
                    // 获取当前对象中所有属性的值
                    ...prevState.titleSelectedStatus,
                    [type]: true,
                },
                openType: type, // 展示 FilterPicker 和 遮罩
            };
        }); */
    };
    onCancel = () => {
        this.setState({ openType: "" });
    };
    onSave = (type, value) => {
        // console.log(this.state.openType === type); // true
        const { titleSelectedStatus } = this.state;
        const newTitleSelectedStatus = { ...titleSelectedStatus };
        if (type === "area" && (value.length !== 2 || value[0] !== "area")) {
            newTitleSelectedStatus[type] = true;
        } else if (type === "mode" && value[0] !== "null") {
            newTitleSelectedStatus[type] = true;
        } else if (type === "price" && value[0] !== "null") {
            newTitleSelectedStatus[type] = true;
        } else if (type === "more" && value.length !== 0) {
            newTitleSelectedStatus[type] = true;
        } else {
            newTitleSelectedStatus[type] = false;
        }

        this.setState({
            openType: "",
            selectedValues: {
                ...this.state.selectedValues,
                [type]: value,
            },
            titleSelectedStatus: newTitleSelectedStatus
        });
    };
    onCancel = () => {
        this.setState({ openType: "" });
    };
    renderFilterMore = () => {
        const {
            openType,
            filtersData: { roomType, oriented, floor, characteristic },
            selectedValues,
        } = this.state;
        if (openType !== "more") {
            return null;
        }
        const data = { roomType, oriented, floor, characteristic };
        const defaultValue = selectedValues.more;
        return (
            <FilterMore
                data={data}
                type={openType}
                onSave={this.onSave}
                defaultValue={defaultValue}
                onCancel={this.onCancel}
            />
        );
    };
    render() {
        const { titleSelectedStatus, openType } = this.state;

        return (
            <div className={styles.root}>
                {/* 前三个菜单的遮罩层 */}
                {openType === "area" ||
                openType === "mode" ||
                openType === "price"
                    ? <div className={styles.mask} onClick={this.onCancel} />
                    : null}
                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle
                        titleSelectedStatus={titleSelectedStatus}
                        onClick={this.onTitleClick}
                    />
                    {/* 前三个菜单对应的内容： */}
                    {/* {openType === "area" ||
                    openType === "mode" ||
                    openType === "price"
                        ? <FilterPicker
                              onCancel={this.onCancel}
                              onSave={this.onSave}
                          />
                        : null} */}
                    {this.renderFilterPicker()}
                    {/* 最后一个菜单对应的内容： */}
                    {this.renderFilterMore()}
                </div>
            </div>
        );
    }
}
