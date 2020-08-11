import React, { Component } from 'react';
import api from '../api';
import {Link} from 'react-router-dom';

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

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const InputImage = styled.input.attrs({
    className: 'form-img-control',
})`
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

class MultiImageInput extends Component {
    constructor(props) {
        super(props);
        const itemId = Math.random().toString(36).substring(6, 15) + Math.random().toString(36).substring(6,15);
        this.state = {
            fileInputs: {},
            imageInputCount: 0,
            imageInputID: itemId,
            saltLength: itemId.length,
        }
    }
    handleAddImage = async event => {
        const targetFile = event.target.files[0];
        const prev_url = URL.createObjectURL(prev_url);
        const prevInputCount = this.state.imageInputCount;
        // there's probably a more efficent way to do this (dynamically add an entry to teh fileinputs object)
        // TODO: figure this out
        let prevFileInputs = { ...this.state.fileInputs};
        prevFileInputs[`ID#${prevInputCount}`] = {targetFile: targetFile, prev_url: prev_url, id: prevInputCount};
        
        this.setState({
            fileInputs: prevFileInputs,
            imageInputCount: prevInputCount + 1,
        });
    }
    handleRemoveImage = async event => {
        const imageTag = event.target.name;
        const id = imageTag.substring(saltLength);
        let prevFileInputs = { ...this.state.fileInputs}
        delete prevFileInputs[`ID#${id}`];// remove the entry in question, also deleting predifined javascript objects can crash things
        
        this.setState({
            fileInputs: prevFileInputs,
        });
        // note that we are simply deleting an internal state value, we will need another way of removing the object from display
    }
    handleDragImage = async vent => {

    }
    componentDidMount = async () => {

    }

    render() {

    }
}

class ItemInsert extends Component {

    constructor(props) {
        super(props);
        this.fileInput = React.createRef(); // we need a DOM node to handle file access
        this.state = {
            name: '',
            reviews: [],
            description: '',
            thumbnail_img: '',
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
        this.setState({selectedFile: event.target.files[0]});
    }
    handelIncludeItem = async () => {
        const { name, reviews, description, selectedFile } = this.state;
        const payload =  {
            body : {
                name, 
                reviews, 
                description,
            },
            thumbnail: {file: selectedFile,},
        };
        await api.insertItem(payload).then(res => {
            window.alert(`Item Inserted Successfully`);
            this.setState({
                name: '',
                reviews: [],
                description: '',
                thumbnail_img: '',
                selectedFile: null,
            });
        })
    }

    render() {
        const { name, reviews, description, thumbnail_img } = this.state;
        return (
            <Wrapper>
                <Title>Create Item</Title>
                <Label>Name: </Label>
                <InputText
                    type="text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />
                <Label>Description: </Label>
                <InputText
                    type="text"
                    value={description}
                    onChange={this.handleChangeInputDescription}
                />
                <Label>Thumbnail: </Label>
                <InputImage 
                    type="file"
                    onChange = {this.handleFileUpload}
                    ref={this.fileInput}
                />
                <Button onClick={this.handelIncludeItem} >Insert Item</Button>
                <Link to="/items/list">
                <CancelButton>Cancel</CancelButton>
                </Link>
            </Wrapper>
        )
    }
}
export default ItemInsert;