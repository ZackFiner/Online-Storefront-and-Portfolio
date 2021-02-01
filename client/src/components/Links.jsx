import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {connect} from 'react-redux';
import {isMemberofRole} from '../authorization';

const List = styled.div.attrs({
    className:  'navbar-nav mr-auto',
})``

const Item = styled.div.attrs({
    className: 'collpase navbar-collapse'
})``

class Links extends Component {
    render() {
        const {userdata, loggedin} = this.props;
        let link_items = null;
        return (
            <React.Fragment>
                <Link to="/storefront" className="navbar-brand">
                    Storefront
                </Link>
                <Link to="/" className="navbar-brand">
                    FrontPage
                </Link>
            </React.Fragment>
        );
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
    null
)(Links)