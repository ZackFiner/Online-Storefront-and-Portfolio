import React, {Component} from 'react';
import styled from 'styled-components';
import api from '../api';

import {loadAccount} from '../redux/actions/accountAct'
import {connect} from 'react-redux';

const Wrapper = styled.div.attrs({
})`
    padding-top: 5rem;
`
const InputWrapper = styled.div.attrs({
    className: 'form-group',
})`
`

const FormWrapper = styled.form.attrs({
})`
    background-color: #f0f0f0;
    max-width: 20rem;
    max-height: 70rem;
    padding: 1rem;
    margin: auto;
    border-radius: 10px;
    border-color: #efefef;
    border-style: solid;
    border-width: 2px;

`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
    placeholder: 'example@email.com',
})`
`

const PasswordInput = styled.input.attrs({
    className: 'form-control',
    type: 'password',
    placeholder: 'Password'
})`
`

const SubmitButton = styled.input.attrs({
    className: `btn btn-primary`,
    type: 'submit',
    value: 'Login',
})`
    margin: 15px 15px 15px 15px;
`

const CancelButton = styled.button.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 15px;
`

class LoginPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        }
    }

    handleChangeEmailText = async event => {
        const email = event.target.value;
        this.setState({email : email});
    }

    handleChangePasswordText = async event => {
        const password = event.target.value;
        this.setState({password: password});
    }

    handleSubmit = async (event) => {
        const { email, password, } = this.state;
        const payload = {email, password};
        event.preventDefault();
        this.props.loadAccount(payload, this.props.history);
    }

    render() {
        return (
            <Wrapper>
                
                <FormWrapper onSubmit={this.handleSubmit}>
                    <h2>Login</h2>
                    <InputWrapper>
                        <Label>Email</Label>
                        <InputText onChange={this.handleChangeEmailText} />
                    </InputWrapper>
                    <InputWrapper>
                        <Label>Password</Label>
                        <PasswordInput onChange={this.handleChangePasswordText} />
                    </InputWrapper>
                    <SubmitButton />
                </FormWrapper>
            </Wrapper>
        )
    }
}

export default connect( null, { loadAccount } )(LoginPage);