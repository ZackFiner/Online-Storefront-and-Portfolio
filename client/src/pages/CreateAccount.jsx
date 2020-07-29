import React, {Component} from 'react'
import styled from 'styled-components'
import api from '../api'

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

class CreateAccountPage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: '',
            password: '',
            verfPassword: '',
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

    handleChangePasswordVerifyText = async event => {
        const verfPassword = event.target.value;
        this.setState({verfPassword : verfPassword});
    }

    handleSubmit = async () => {
        const {email, password, verfPassword} = this.state;
        if (password === verfPassword) {
            const payload = {email, password};
            api.createUserAccount(payload).then( (res) => {
                this.setState({
                    password: '',
                    email: '',
                    verfPassword: '',
                })
                this.props.history.push('/login');
            });
            // direct the user to login using there account details
        }
    }

    render() {
        return (
            <Wrapper>
                <TextInputSection>
                    <Label>Account Email</Label><InputText onChange={this.handleChangeEmailText} />
                    <Label>Password</Label><InputText onChange={this.handleChangePasswordText} />
                    <Label>Repeat Password</Label><InputText onChange={this.handleChangePasswordVerifyText} />
                </TextInputSection>
                <Button onClick = {this.handleSubmit}>Submit</Button>
                <CancelButton>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default CreateAccountPage;