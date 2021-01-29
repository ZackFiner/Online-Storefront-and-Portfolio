import React, {Component} from 'react';
import api, { createPost } from '../api';

import styled from 'styled-components';
import {StyledComponents} from '../components'
import RichTextEditor from 'react-rte'
import {withRouter} from 'react-router-dom'

const Wrapper = styled.div.attrs({
    className:'form-group'
})`
    margin: 0 30px;
`

const FormWrapper = styled.form.attrs({

})`
`
const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`
class PostEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: props?.match?.params?.id,
            header: '',
            content: RichTextEditor.createEmptyValue(),
            index: null,
            isLoading: false,
            edit: false,
        };
    }

    componentDidMount = () => {
        this.setState({
            isLoading: true,
        })
        if (this.state.id) {
            api.getPostById(this.state.id).then(value => {
                this.setState({
                    id: value.data.data._id,
                    header: value.data.data.header,
                    content: RichTextEditor.createValueFromString(value.data.data.content, 'html'),
                    index: value.data.data.index,
                    isLoading: false,
                    edit: true,
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

    handleEditorChange = value => {
        this.setState({
            content: value,
        });
    }
    
    handleSubmit = async (event) => {
        event.preventDefault();
        const {header, content} = this.state;
        const payload = {header, content: content.toString('html')};
        if (this.state.edit) {
            api.editPost(this.state.id, payload).then(res => {
                const id = res.data.id;
                this.props.history.push(`/frontpage/post/${id}`);
            });
        } else {
            api.createPost(payload).then(res => {
                const id = res.data.id;
                this.props.history.push(`/frontpage/post/${id}`);
                this.setState({
                    id: id,
                    edit:true,
                });
            });
        }
    }

    render() {
        return (<Wrapper>
            <FormWrapper onSubmit={this.handleSubmit}>
                <StyledComponents.TextInputSection>
                    <Label>Header</Label>
                    <InputText name='header' onChange={this.handleValueChange} value={this.state.header}/>
                </StyledComponents.TextInputSection>
                <RichTextEditor
                    name='content'
                    value={this.state.content}
                    onChange={this.handleEditorChange}
                />
                <StyledComponents.Submit value='Save'/>
            </FormWrapper>
        </Wrapper>);
    }
}

export default PostEditor;