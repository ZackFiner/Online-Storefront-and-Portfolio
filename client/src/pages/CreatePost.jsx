import React, {Component} from 'react';
import api, { createPost } from '../api';

import styled from 'styled-components';
import {StyledComponents, ImageSelector} from '../components';
import {Editor} from '@tinymce/tinymce-react';
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
            content: '',
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
                    content: value.data.data.content,
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

    handleEditorChange = (value, editor) => {
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
                <Editor
                    value={this.state.content}
                    onEditorChange={this.handleEditorChange}
                />
                <StyledComponents.Submit value='Save'/>
            </FormWrapper>
        </Wrapper>);
    }
}

class ImagePost extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedFile: null,
        };
    }

    handleFileUpload = (event) => {
        const file = event.target.files[0]
        this.setState({
            selectedFile: file,
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        const payload = this.state;
        if (payload.selectedFile)
            api.createPostImage(payload);
            window.alert("Image posted");
    }

    render() {
        return (<Wrapper>
            <FormWrapper onSubmit={this.handleSubmit}>
                <Label>Select Image To Upload</Label>
                <ImageSelector onChange={this.handleFileUpload}/>
                <StyledComponents.Submit value='Save' />
            </FormWrapper>
        </Wrapper>);
    }

}


export {PostEditor, ImagePost};