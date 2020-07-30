import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import { loadAccount } from '../redux/actions/accountAct'
import { connect } from 'mongoose';


const Wrapper = styled.div.attrs({
    className: 'login-indicator-wrp',
})`
`

class LoginIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <Wrapper>
                <Link to={'/login'} className='nav-link'>Login</Link>
                <Link to={'/createAccount'} className='nav-link'>Create Account</Link>
            </Wrapper>
        )
    }
}


export default connect(
    null,
    { loadAccount }
)(LoginIndicator);