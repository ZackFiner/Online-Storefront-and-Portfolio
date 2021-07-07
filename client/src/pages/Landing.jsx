import React, {Component} from 'react';
import styled from 'styled-components';
import Logo from '../logo3.svg';
const Wrapper = styled.div`
    height: 100%;
    background: rgb(255,226,0);
    background: radial-gradient(circle, rgba(255,226,0,1) 0%, rgba(232,156,42,1) 52%, rgba(198,161,134,1) 100%);
`;

const FlexWrap = styled.div`
    display: flex;
    height: 100%;
    justify-content: center;
    align-items: center;
    z-index: 100;
`
const CenterLogo = styled.img.attrs({
    src:Logo,
})`
    height: 250px;
    width: 250px;
    animation: fadein 2s;
    @keyframes fadein {
        from {opacity: 0;}
        to {opacity: 1;}
    }
`
class LandingPage extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Wrapper>
            <FlexWrap><CenterLogo/></FlexWrap>
        </Wrapper>;
    }
}

export default LandingPage;