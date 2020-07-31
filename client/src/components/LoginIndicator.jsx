import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import { freeAccount } from '../redux/actions/accountAct'
import { connect } from 'react-redux';


const Wrapper = styled.div.attrs({
    className: 'login-indicator-wrp',
})`
`

class LoginIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {/**/};
    }

    render() {
        const {loggedin, userdata} = this.props;
        console.log(this.props);
        if (!loggedin) {
            return (
                <Wrapper>
                    <Link to={'/login'} className='nav-link'>Login</Link>
                    <Link to={'/createAccount'} className='nav-link'>Create Account</Link>
                </Wrapper>
            )
        } else {
            return <Wrapper>{'test'}</Wrapper>
        }
    }
}

const mapStateToProps = state => {
    const payload = state.accountRedu;
    return {
    userdata: payload.userdata,
    loggedin: payload.loggedin,
    };
}

export default connect(
    mapStateToProps,
    { freeAccount }
)(LoginIndicator);