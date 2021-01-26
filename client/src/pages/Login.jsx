import React, {Component} from 'react';
import styled from 'styled-components';
import api from '../api';
import {StyledComponents} from '../components'
import {loadAccount} from '../redux/actions/accountAct'
import {connect} from 'react-redux';

const Wrapper = styled.div.attrs({
})`
    padding-top: 5rem;
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
                    <StyledComponents.TextInputSection>
                        <Label>Email</Label>
                        <InputText onChange={this.handleChangeEmailText} />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Password</Label>
                        <PasswordInput onChange={this.handleChangePasswordText} />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.Submit value="Login" />
                </FormWrapper>
            </Wrapper>
        )
    }
}

export default connect( null, { loadAccount } )(LoginPage);