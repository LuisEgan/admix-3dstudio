import React, { Component } from "react";
import { connect } from "react-redux";
import Link from "next/link";
import { withRouter } from "next/router";

import actions from "../lib/actions";

import logo from "../assets/img/logo.png";

const { logout } = actions;

function openInNewTab(url) {
  const sideMenu = document.getElementById("sideMenu");
  const a = document.createElement("a");
  sideMenu.appendChild(a);
  a.target = "_blank";
  a.href = url;
  a.click();
  sideMenu.removeChild(a);
}

const sections = [
  {
    icon: "Camps",
    title: "My campaigns",
    pathname: "/campaigns",
  },
  {
    icon: "Docs",
    title: "Documentation",
    pathname: "https://docs.admix.in/",
  },
  {
    icon: "Bell",
    title: "Notifications",
    pathname: "/",
  },
  {
    icon: "Prof",
    title: "My profile",
    pathname: "/",
  },
];

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.renderSections = this.renderSections.bind(this);
    this.redirectTo = this.redirectTo.bind(this);
  }

  redirectTo(pathname) {
    if (pathname.indexOf("http") >= 0) {
      openInNewTab(pathname);
    }
    // this.props.history.push(pathname);
  }

  renderSections() {
    const pathname = "/";

    let isSelected;

    return (
      <div id="sideMenu-body">
        {sections.map(section => {
          isSelected = section.pathname === pathname ? "selectedSection" : "";
          return (
            <React.Fragment key={section.title}>
              <div>{section.icon}</div>
              <Link prefetch href={section.pathname} key={section.title}>
                <a>{section.title}</a>
              </Link>
            </React.Fragment>
          );
        })}
      </div>
    );
  }

  render() {
    const { logout, isLoggedIn } = this.props;

    if (!isLoggedIn) return null;

    return (
      <div id="sideMenu">
        <div id="sideMenu-header">
          <img src={logo} alt="logo" onClick={logout} />
        </div>
        {this.renderSections()}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { auth } = state;

  return {
    ...auth,
  };
};

const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(logout()),
});

SideMenu = withRouter(SideMenu);
SideMenu = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SideMenu);

export default SideMenu;
