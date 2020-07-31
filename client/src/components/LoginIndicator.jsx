import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import { freeAccount } from '../redux/actions/accountAct'
import { connect } from 'react-redux';


const Wrapper = styled.div.attrs({
    className: 'login-indicator-wrp',
})`
`

const NavButton = styled.button.attrs({
    className: 'logout-btn'
})`
`

class LoginIndicator extends Component {
    constructor(props) {
        super(props);
        this.state = {/**/};
    }

    handleLogout = (event) => {
        //TODO this may not be the place to do it, but you need to delete that auth cookie when you logout
        this.props.freeAccount();
        this.props.history.push('/');
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
            return (
                <Wrapper>
                    <Link to={'/'} className='nav-link'>{userdata.email}</Link>
                    <NavButton onClick={this.handleLogout}>Logout</NavButton>
                </Wrapper>
            )
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