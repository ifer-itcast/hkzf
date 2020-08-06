import React, { Component } from "react";

import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";

import styles from "./index.module.css";

// 标题高亮状态
// true 表示高亮； false 表示不高亮
const titleSelectedStatus = {
    area: false,
    mode: false,
    price: false,
    more: false,
};

export default class Filter extends Component {
    state = {
        titleSelectedStatus,
        openType: "", // 控制 FilterPicker 或 FilterMore 组件的展示或隐藏
    };

    // 点击标题菜单实现高亮
    // 注意：this指向的问题！！！
    // 说明：要实现完整的功能，需要后续的组件配合完成！
    onTitleClick = type => {
        this.setState(prevState => {
            return {
                titleSelectedStatus: {
                    // 获取当前对象中所有属性的值
                    ...prevState.titleSelectedStatus,
                    [type]: true,
                },
                openType: type // 展示 FilterPicker 和 遮罩
            };
        });
    };
    onCancel = () => {
        this.setState({ openType: "" });
    }
    onSave = () => {
        this.setState({ openType: "" });
    }

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
                    {openType === "area" ||
                    openType === "mode" ||
                    openType === "price"
                        ? <FilterPicker onCancel={this.onCancel} onSave={this.onSave} />
                        : null}
                    {/* 最后一个菜单对应的内容： */} {/* <FilterMore /> */}
                </div>
            </div>
        );
    }
}
