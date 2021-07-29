import React, {Component} from "react"
import ReactDOM from "react-dom"
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js"
import {connect} from 'react-redux';

import {paypal_clientid} from "../data"
import api from "../api"
import styled from "styled-components"
class PayPalGateway extends Component {
    constructor(props) {
        super(props);
        this.state = {
            order_info: props.order_info,
        }
    }

    createOrder = (data, actions) => {
        const {order_info: {address, items}} = this.state;
        return api.postOrder(this.props.userdata._id, {
            address/*{
                user_id: this.props.userdata._id,
                street_address: "9999 Street Ave.",
                city: "City",
                state_code: "CA",
                zip: 44444
            }*/,
            items,
            payment: data,
        })
        .then(res => {
            return res.data.data.paypal_order_id;
        });
    }

    onApprove = (data, actions) => {
        return api.approvePayment(this.props.userdata._id, data.orderID, {
            order_id: data.orderID,
            payer_id: data.payerID
        }).then((res) => {
            return res;
        })
    }

    render() {

        return <PayPalScriptProvider options={{"client-id": paypal_clientid}}><PayPalButtons createOrder={this.createOrder} onApprove={this.onApprove}/></PayPalScriptProvider>
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
)(PayPalGateway);