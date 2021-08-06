import React, { Component } from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import api from '../api';
import { StyledComponents, OrderBreakout, PayPalGateway } from "../components";

const Wrapper = styled.div`
`;

const FormWrapper = styled.form.attrs((props) => ({
    ...props,
}))`
    margin: 30px;
`

const FormGroup = styled.div.attrs((props) => ({
    ...props,
    className: "form-group"
}))`
`
const FormInput = styled.input.attrs((props) => ({
    ...props,
    className: "form-control"
}))`
`

const FormInputField = (props) => (<FormGroup>
    <label for={props.input.id}>{props.label_text}</label>
    <FormInput {...props.input}/>
</FormGroup>)

class Checkout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart_items: this.props.cartItems,/*[{_id: "321", name: "Test Item", price: "1.25", qty: 1},
                         {_id: "123", name: "Test Item2", price: "2.75", qty: 1}],*/
            shipping: {
                street_address: undefined,
                city: undefined,
                state_code: undefined,
                zip: undefined,
            },
            error_messages: {/* Field Input errors go here */}
        }
    }

    updateField = async (event) => {
        const field = event.target.name.split(".");
        this.setState( field.length > 1 ? {
            [field[0]]: {
                ...this.state[field[0]],
                [field[1]]: event.target.value
            }
        } : {
            [field[0]]: event.target.value
        }, () => {
            console.log(this.state);
        });
    } 

    submit = async (event) => {
        event.preventDefault();
        // TODO: make sure data is valid, and proceed to paypal checkout
        const {cart_items, street_address, city, state_code, zip} = this.state;
        const {userdata: {_id}} = this.props; 


        /*api.postOrder(_id, {
            address: {
                street_address,
                city,
                state_code,
                zip
            },
            items: [...cart_items],
            payment: {}
        });*/
    }

    componentDidMount = async () => {
        //
    }

    render() {
        const {cart_items} = this.state;
        if (cart_items.length < 1)
            return <Wrapper><h1>No Items Selected</h1></Wrapper>
        return <Wrapper>
            <OrderBreakout items = {cart_items} />
            <FormWrapper onSubmit={this.submit}>
                <FormGroup>
                    <h2>Shipping Information</h2>
                    <FormInputField {...{
                        label_text: "Street Address & Apt. Number",
                        input: {
                            id: "inp-checkout-street-address",
                            type: "text",
                            placeholder: "Ex: 2401 Jones Blvd., Building A, Apartment 3",
                            name: "shipping.street_address",
                            onChange: this.updateField
                        }
                    }}/>
                    <FormInputField {...{
                        label_text: "City",
                        input: {
                            id: "inp-checkout-city",
                            type: "text",
                            placeholder: "Ex: New York",
                            name: "shipping.city",
                            onChange: this.updateField
                        }
                    }}/>
                    <FormInputField {...{
                        label_text: "State Code",
                        input: {
                            id: "inp-checkout-state-code",
                            type: "text",
                            placeholder: "Ex: NY",
                            name: "shipping.state_code",
                            maxlength: 2,
                            onChange: this.updateField
                        }
                    }}/>
                    <FormInputField {...{
                        label_text: "Zip Code",
                        input: {
                            id: "inp-checkout-zip-code",
                            type: "text",
                            placeholder: "Ex: 45017",
                            name: "shipping.zip",
                            onChange: this.updateField
                        }
                    }}/>
                </FormGroup>
                <PayPalGateway order_info={{items: this.state.cart_items, address: this.state.shipping}}/>
                <StyledComponents.Submit value="Finish Checkout with Paypal"/>
            </FormWrapper>
        </Wrapper>;
    }
}

const mapStateToProps = state => {
    const {accountRedu, cartRedu} = state;
    return {
        userdata: accountRedu.userdata,
        loggedin: accountRedu.loggedin,
        cartItems: cartRedu.cartItems
    };
}

export default connect(
    mapStateToProps,
    {}
)(Checkout);