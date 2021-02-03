import React, { Component } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { MultiImageInput, ImageSelector, StyledComponents } from '../components';
import {Editor} from '@tinymce/tinymce-react';
import styled from 'styled-components';

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const FormWrapper = styled.form.attrs({

})`
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

class ItemInsert extends Component {

    constructor(props) {
        super(props);
        this.fileInput = React.createRef(); // we need a DOM node to handle file access
        this.galleryImages = [];
        this.state = {
            name: '',
            reviews: [],
            description: '',
            thumbnail_img: '',
            keywords: '',
            price: null,
            selectedFile: null,
        }
    }

    handleChangeInputName = async event => {
        const name = event.target.value;
        this.setState({ name: name });//same as this.setState({ name })
    }

    handleChangeInputDescription = async event => {
        const description = event.target.value;
        this.setState({ description: description });
    }

    handleChangeThumbnail = async event => {
        const thumbnail_img = event.target.value;
        this.setState({ thumbnail_img: thumbnail_img });
    }
    handleFileUpload = async event => {
        this.setState({ selectedFile: event.target.files[0] });
    }
    handelIncludeItem = async () => {
        const { name, reviews, description, selectedFile, keywords, price } = this.state;
        const payload = {
            body: {
                name,
                reviews,
                description,
                price,
                keywords: keywords.split(',').filter(x => x).map(x => x.trim()),
            },
            thumbnail: { file: selectedFile, },
            galleryImages: { files: this.galleryImages },
        };
        console.log(payload);
        await api.insertItem(payload).then(res => {
            window.alert(`Item Inserted Successfully`);
            this.setState({
                name: '',
                reviews: [],
                description: '',
                thumbnail_img: '',
                keywords: '',
                price: null,
                selectedFile: null,
            });
            this.galleryImages = [];
        })
    }

    handleAppendGallery = async (event, fileObject) => {
        this.galleryImages.push(fileObject.targetFile);
    }

    handleRemoveGallery = async (event, fileObject) => {
        this.galleryImages.splice(this.galleryImages.indexOf(fileObject.targetFile), 1);
    }

    handleKeywordChange = async (event) => {
        const keywords = event.target.value;
        this.setState({ keywords: keywords });
    }

    handlePriceChange = async (event) => {
        const price = event.target.value;
        this.setState({ price: price });
    }

    handleEditorChange = (value, editor) => {
        this.setState({
            description: value,
        });
        this.updatePacket.description = value;
    }

    render() {
        const { name, reviews, description, keywords, price, thumbnail_img } = this.state;
        return (
            <Wrapper>
                <Title>Create Item</Title>
                <FormWrapper onSubmit={this.handelIncludeItem}>
                    <StyledComponents.TextInputSection>
                        <Label>Name</Label>
                        <InputText
                            type="text"
                            value={name}
                            onChange={this.handleChangeInputName}
                        />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Description</Label>
                        <Editor
                            onEditorChange={this.handleEditorChange}
                            value={description}
                        />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Keywords</Label>
                        <InputText
                            type="text"
                            value={keywords}
                            placeholder="Keyword1, Keyword2, ..."
                            onChange={this.handleKeywordChange}
                        />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Price</Label>
                        <StyledComponents.CashInput
                            onChange={this.handlePriceChange}
                        />
                    </StyledComponents.TextInputSection>
                    <Label>Thumbnail</Label>
                    {/*<InputImage 
                    type="file"
                    onChange = {this.handleFileUpload}
                    ref={this.fileInput}
                />*/}
                    <ImageSelector onChange={this.handleFileUpload} />
                    <Label>Gallery Input</Label>
                    <MultiImageInput handleAppendFile={this.handleAppendGallery} handleRemoveFile={this.handleRemoveGallery} />
                    <StyledComponents.Submit value='Insert Item' />
                </FormWrapper>
            </Wrapper>
        )
    }
}
export default ItemInsert;