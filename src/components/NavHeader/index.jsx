import React from "react";
import { NavBar } from "antd-mobile";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

// import "./index.scss";
import styles from "./index.module.css";

function NavHeader({
    children,
    history,
    onLeftClick,
    className,
    rightContent,
}) {
    const defaultHandler = () => history.go(-1);
    return (
        <NavBar
            className={[styles.navbar, className || ""].join(" ")}
            mode="light"
            icon={<i className="iconfont icon-back" />}
            onLeftClick={onLeftClick || defaultHandler}
            rightContent={rightContent}
        >
            {children}
        </NavBar>
    );
}

NavHeader.propTypes = {
    children: PropTypes.string.isRequired,
    onLeftClick: PropTypes.func,
};

export default withRouter(NavHeader);
