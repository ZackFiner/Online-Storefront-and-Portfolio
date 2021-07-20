import React, {Component} from "react"
import ReactDOM from "react-dom"
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js"
import {connect} from 'react-redux';

import {paypal_clientid} from "../data"
import { order_api_str, payment_api_Str } from "../api"
import styled from "styled-components"

class PayPalGateway extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item_id: props.item_id,
        }
    }

    payment = (data, actions) => {
        return actions.request.post(`${order_api_str}users/${this.props.userdata._id}/orders`, {
            address: {},
            item: {_id: this.state.item_id},
            payment: data,
        },  {withCredentials: true})
        .then(res => {
            return res.id;
        });
    }

    onAuthorize = (data, actions) => {
        return actions.payment.post(`${payment_api_Str}users/${this.props.userdata._id}/payments/0/execute`, {
            payment_id: data.paymentID,
            payer_id: data.payerID
        }).then((res) => {
            return res;
        })
    }

    render() {

        return <PayPalScriptProvider options={{"client-id": paypal_clientid}}><PayPalButtons payment={this.payment} onAuthorize={this.onAuthorize}/></PayPalScriptProvider>
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