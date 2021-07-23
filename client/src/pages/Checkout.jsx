import React, { Component } from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import api from '../api';

//TODO
class Checkout extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div/>;
    }
}

const mapStateToProps = state => {
    const payload = state.accountRedu;
    return {
        userdata: payload.userdata,
        loggedin: payload.loggedin
    };
}

export default connect(
    mapStateToProps,
    {}
)(Checkout);