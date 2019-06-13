import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'next/link';
import { withRouter } from 'next/router';

import actions from '../lib/actions';

import logo from '../assets/img/logo-vertical.png';
import ProfileSVG from '../assets/svg/profile.svg';
import CampaignsSVG from '../assets/svg/campaigns.svg';
import BellSVG from '../assets/svg/bell.svg';
import DocumentationSVG from '../assets/svg/documentation.svg';

const { logout } = actions;

function openInNewTab(url) {
  const sideMenu = document.getElementById('sideMenu');
  const a = document.createElement('a');
  sideMenu.appendChild(a);
  a.target = '_blank';
  a.href = url;
  a.click();
  sideMenu.removeChild(a);
}

const sections = [
  {
    icon: <CampaignsSVG />,
    title: 'My campaigns',
    pathname: '/campaigns',
  },
  {
    icon: <DocumentationSVG />,
    title: 'Documentation',
    pathname: 'https://docs.admix.in/',
  },
  // {
  //   icon: <DocumentationSVG />,
  //   title: "Notifications",
  //   pathname: "/",
  // },
  {
    icon: <ProfileSVG />,
    title: 'My profile',
    pathname: '/',
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
    if (pathname.indexOf('http') >= 0) {
      openInNewTab(pathname);
    }
  }

  renderSections() {
    const pathname = '/';

    let isSelected;

    return (
      <div id="sideMenu-body">
        {sections.map(section => {
          isSelected = section.pathname === pathname ? 'selectedSection' : '';
          return (
            <div className="sidebarItem" key={section.title}>
              <Link prefetch href={section.pathname} key={section.title}>
                <a target={section.title === 'Documentation' ? '__blank' : null}>
                  <div>{section.icon}</div>
                  {section.title}
                </a>
              </Link>
            </div>
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
