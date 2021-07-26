import React, { Component } from "react";
import styled from "styled-components";
import {connect} from "react-redux";
import api from '../api';
import { StyledComponents } from "../components";

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
            street_address: undefined,
            city: undefined,
            state_code: undefined,
            zip: undefined,
        }
    }

    updateField = async (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    } 

    submit = async (event) => {
        event.preventDefault();
        // TODO: make sure data is valid, and proceed to paypal checkout
    }

    render() {
        return <Wrapper>
            <FormWrapper onSubmit={this.submit}>
                <FormInputField {...{
                    label_text: "Street Address & Apt. Number",
                    input: {
                        id: "inp-checkout-street-address",
                        type: "text",
                        placeholder: "Ex: 2401 Jones Blvd., Building A, Apartment 3",
                        name: "street_address",
                        onChnage: this.updateField
                    }
                }}/>
                <FormInputField {...{
                    label_text: "City",
                    input: {
                        id: "inp-checkout-city",
                        type: "text",
                        placeholder: "Ex: New York",
                        name: "city",
                        onChnage: this.updateField
                    }
                }}/>
                <FormInputField {...{
                    label_text: "State Code",
                    input: {
                        id: "inp-checkout-state-code",
                        type: "text",
                        placeholder: "Ex: NY",
                        name: "state_code",
                        maxlength: 2,
                        onChnage: this.updateField
                    }
                }}/>
                <FormInputField {...{
                    label_text: "Zip Code",
                    input: {
                        id: "inp-checkout-zip-code",
                        type: "text",
                        placeholder: "Ex: 45017",
                        name: "zip",
                        onChnage: this.updateField
                    }
                }}/>
                <StyledComponents.Submit value="Next"/>
            </FormWrapper>
        </Wrapper>;
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