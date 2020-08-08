import React, {Component} from 'react';
import styled from 'styled-components';
import api from '../api';

import {loadAccount} from '../redux/actions/accountAct'
import {connect} from 'react-redux';

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
`

const TextInputSection = styled.div.attrs({
    className: 'form-text-input-area'
})`
    display: grid-inline;
    grid-template-columns: auto auto;
`
const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`
const Button = styled.button.attrs({
    className: `btn btn-primary`,
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
                <TextInputSection>
                    <Label>Email</Label><InputText onChange={this.handleChangeEmailText} />
                    <Label>Password</Label><InputText onChange={this.handleChangePasswordText} />
                </TextInputSection>
                <Button onClick = {this.handleSubmit}>Submit</Button>
                <CancelButton>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default connect( null, { loadAccount } )(LoginPage);