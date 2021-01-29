import React, {Component} from 'react';
import api from '../api';

import styled from 'styled-components';
import {StyledComponents} from '../components'

const Wrapper = styled.div.attrs({

})`
`

const FormWrapper = styled.form.attrs({

})`
`

class PostEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props?.match?.params?.id,
            header: '',
            content: '',
            index: null,
            isLoading: false,
        };
    }

    componentDidMount = () => {
        this.setState({
            isLoading: true,
        })
        if (this.state.id) {
            api.getPostById(this.state.id).then(value => {
                this.setState({
                    header: value.data.data.header,
                    content: value.data.data.content,
                    index: value.data.data.index,
                    isLoading: false,
                });
            });
        }
    }

    handleValueChange = event => {
        const name = event.target.name;
        const value = event.target.value;
        this.setState({
            [name]: value,
        })
    }

    handleSubmit = () => {
        const {header, content} = this.state;
        const payload = {header, content};

        api.insertItem(payload).then(res => {
            console.log(res);
            // re-route to
            //this.props.history.push();
        });
    }

    render() {
        return (<Wrapper>
            <FormWrapper onSubmit={this.handleSubmit}>
                <StyledComponents.TextInputSection>
                    
                </StyledComponents.TextInputSection>
                <StyledComponents.Submit value='Post'/>
            </FormWrapper>
        </Wrapper>);
    }
}