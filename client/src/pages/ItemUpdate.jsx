import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import api from '../api';

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


class ItemUpdate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: this.props.match.params.id, //see, thats why we needed the :id for the page path in app/index.js
            name: '',
            reviews: [],
            description: '',
            thumbnail_img: null,
            gallery_images: [],
        };
        this.galleryImages = [];
        this.updatePacket = {};
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
        const thumbnail_img = event.target.files[0];
        this.setState({ thumbnail_img: thumbnail_img });
    }

    handleAddGalleryImage = async (event, file) => {
        if (file) {
            
           
        }
    }

    handleRemoveGallary = async (event, file) => {
        if (file) {
            this.galleryImages.splice(this.galleryImages.indexOf(file), 1);
        } else {
            this.updatePacket['gallery_images'] = event
        }
    }

    handleUpdateItem = async () => {
        const { id, name, reviews, description } = this.state;
        const payload = { name, reviews, description };

        await api.updateItemById(id, payload).then( res => {
            window.alert(`Item Successfully Updated`);
            this.setState({
                name: '',
                reviews: '',
                description: '',
                thumbnail_img: '',
            })
        })
    }

    componentDidMount = async () => {
        const { id } = this.state;
        const item = await api.getItemById(id);

        this.setState({
            name: item.data.data.name,
            reviews: item.data.data.reviews,
            description: item.data.data.description,
            thumbnail_img: item.data.data.thumbnail_img,
        });
        
    }

    render() {

        const {name, description, thumbnail_img} = this.state;

        return(
            <Wrapper>
                <Title>Update Item</Title>
                <Label>Name: </Label>
                <InputText 
                    type = "text"
                    value={name}
                    onChange={this.handleChangeInputName}
                />
                <Label>Description: </Label>
                <InputText 
                    type = "text"
                    value={description}
                    onChange={this.handleChangeInputDescription}
                />
                <Label>Thumbnail: </Label>
                <InputText
                    type="text"
                    value={thumbnail_img}
                    onChange={this.handleChangeThumbnail}
                />
                <Button onChange={this.handleUpdateItem}>Update</Button>
                <Link to="/items/list">
                <CancelButton>Cancel</CancelButton>
                </Link>
            </Wrapper>
        );
    }
}

export default ItemUpdate;