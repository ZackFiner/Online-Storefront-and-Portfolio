import React, { Component } from 'react';
import styled from 'styled-components';

import Logo from './Logo';
import Links from './Links';
import LoginIndicator from './LoginIndicator';

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

const Nav = styled.nav.attrs({
    className: 'navbar navbar-expand-lg navbar-dark bg-dark',
})`
`

class NavBar extends Component {
    render() {
        return (
            <Container>
                <Nav>
                    <Logo />
                    <Links />
                    <LoginIndicator />
                </Nav>
            </Container>
        );
    }
}

export default NavBar;