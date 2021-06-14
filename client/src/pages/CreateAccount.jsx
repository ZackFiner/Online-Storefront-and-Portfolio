import React, {Component} from 'react'
import styled from 'styled-components'
import {StyledComponents} from '../components'
import api from '../api'

const Wrapper = styled.div.attrs({
    
})`
`
const Label = styled.label`
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
`

const FormWrapper = styled.form.attrs({

})`
    padding: 1rem;
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

    handleSubmit = async (event) => {
        event.preventDefault();
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
                <FormWrapper onSubmit={this.handleSubmit}>
                    <StyledComponents.TextInputSection>
                        <Label>Account Email</Label>
                        <InputText placeholder="example@mail.com" onChange={this.handleChangeEmailText} />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Password</Label>
                        <InputText type="password" placeholder="Password" onChange={this.handleChangePasswordText} />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Repeat Password</Label>
                        <InputText type="password" placeholder="Re-type Password" onChange={this.handleChangePasswordVerifyText} />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.Submit value="Create Account"/>
                </FormWrapper>      
            </Wrapper>
        )
    }
}

export default CreateAccountPage;