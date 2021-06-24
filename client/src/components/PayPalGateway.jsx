import React, {Component} from "react"
import ReactDOM from "react-dom"
import {PayPalScriptProvider, PayPalButtons} from "@paypal/react-paypal-js"

import {paypal_clientid} from "../data"

import styled from "styled-components"

class PayPalGateway extends Component {
    constructor(props) {
        super(props);
    }

    createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
            ],
        });
    }

    onApprove = (data, actions) => {
        return actions.order.capture();
    }

    render() {

        return <PayPalScriptProvider options={{"client-id": paypal_clientid}}><PayPalButtons/></PayPalScriptProvider>
    }
}

export default PayPalGateway;