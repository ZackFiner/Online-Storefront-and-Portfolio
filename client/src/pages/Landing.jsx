import React, {Component} from 'react';
import styled from 'styled-components';
import Logo from '../logo3.svg';
const Wrapper = styled.div``;

class LandingPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Wrapper>
            <img src={Logo} height="50%" width ="50%"/>
        </Wrapper>;
    }
}

export default LandingPage;