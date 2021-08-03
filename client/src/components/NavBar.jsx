import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Links from './Links';
import LoginIndicator from './LoginIndicator';
import LogoSVG from '../logo3small.svg';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

const Collapse = styled.div.attrs({
    className: 'collapse navbar-collapse',
})``


const LogoLink = styled.a.attrs({
    href: '/',
    className:'nav-bar-logo',
})`
    color: white;
    font-size: 20px;
    text-align: top;
    &:hover {
        text-decoration: none;
        color: white;
    }
`
const LogoIcon = styled.img.attrs({
    src:LogoSVG,
})`
    height: 100%;
    width: 3rem;
    margin: 0.25rem 0.75rem 0.25rem 0.75rem;
    .nav-bar-logo:hover>& {
        width: 3.5rem;
        margin: 0 0.5rem 0 0.5rem;
        transition: 0.3s;
    }
`

const Logo = <LogoLink><LogoIcon />Studio Finer</LogoLink>

const Container = styled.div.attrs({ // make the navbar occupy all the space at the top
    className: 'container',
})`
    max-width: 100%;
    width: 100%;
    padding-left: 0px;
    padding-right: 0px;
    margin-left: 0px;
    margin-right: 0px;
`

const Sidebar = styled.div.attrs({
    className: 'sidebarCollapse collapse bg-dark'
})`
    position: fixed;
    
    height: 100%;
    width: 20rem;
    z-index: 1000;

    &.collapse.show,
    &.collapse.show + .col {
        left:0rem;
        transition: left 0.2s;
    }

    &.collapse,
    &.collapsing,
    &.collapsing + .col {
        left:-20rem;
        transition: left 0.2s;
    }

    & > ul {
        list-style: none;
        margin: 0;
        padding: 0;
    }
    & > ul > li {
        padding-left: 15px;
    }
    & > ul > li:hover {
        background-color: #1f1f1f;
    }
    & a{
        width: 100%;
        color: white;
    }
`
const SidebarBumper = styled.button.attrs({
    className: "sidebarCollapse collapse"
})`
    background-color: #000000;
    border-style: none;
    position:fixed;
    z-index: 999;
    width: 100%;
    height: 100%;

    &.collapse.show,
    &.collapsing.show {
        opacity: 25%;
        transition: opacity 0.5s;
    }

    &.collapsing {
        opacity: 0;
        transition: opacity 0.5s;
    }

`

const SidebarToggle = styled.button.attrs({

})`
    background-color: inherit;
    border-style: solid;
    border-radius: 4px;
    border-width: 1px;
    padding: 4px;
    padding-left: 15px;
    padding-right: 15px;
    
    transition: background 0.2s;
    &:hover {
        background-color: #8f8f8f;
        transition: background 0.2s;
    }

`

const Nav = styled.nav.attrs({
    className: 'navbar sticky-top navbar-expand-lg navbar-dark bg-dark',
})`
`

class NavBar extends Component {
    render() {
        return (
                [<Nav>
                    <SidebarToggle
                            data-toggle="collapse" 
                            data-target=".sidebarCollapse">
                        <span className="navbar-toggler-icon"></span>
                    </SidebarToggle>
                    {Logo}
                    <Collapse>
                    </Collapse>
                    <LoginIndicator/>
                    <Link to="/storefront/cart"><FontAwesomeIcon icon={faShoppingCart} color="lightgray" size="2x"/></Link>
                </Nav>,
                <Sidebar>
                    <ul>
                    <li><Link to="/storefront" className="navbar-brand">
                        Shop
                    </Link></li>
                    <li><Link to="/blog" className="navbar-brand">
                        Blog
                    </Link></li>
                    </ul>
                </Sidebar>,<SidebarBumper 
                    data-toggle="collapse" 
                    data-target=".sidebarCollapse" />]
        );
    }
}

export default NavBar;