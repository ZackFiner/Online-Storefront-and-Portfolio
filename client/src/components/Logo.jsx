import React, { Component } from 'react';
import styled from 'styled-components';

import logo from '../logo.svg';

const Wrapper = styled.a.attrs({
    className: 'navbar-brand',
})``
// The SVG logo seems to be creating an issue because it cannot be treated as a child component
class Logo extends Component {
    render() {
        return (
            <Wrapper href ="https://www.google.com">
                {/*<img src={logo} width="50" height="50" alt='www.google.com' />*/}
            </Wrapper>
        );
    }
}

export default Logo;