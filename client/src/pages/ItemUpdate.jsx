import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import api from '../api';

import styled from 'styled-components';
import { MultiImageInput } from '../components';

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
            thumbnail_img: '',
            gallery_images: [],
        };
        this.thumbnailImg = null;
        this.galleryImages = [];
        this.updatePacket = {};
    }

    handleChangeThumbnail = async event => {
        const thumbnailImg = event.target.files[0];
        if (this.thumbnailImg) {
            URL.revokeObjectURL(this.state.thumbnail_img);
            const thumbnail_path = URL.createObjectURL(this.thumbnailImg);
            this.setState({thumbnail_img:thumbnail_path});
        }
        this.thumbnailImg = thumbnailImg;
    }

    handleAddGalleryImage = async (event, fileObject) => {
        const file = fileObject.targetFile; 
        if (file) {
            this.galleryImages.push(file)
        }
    }

    handleRemoveGallary = async (event, fileObject) => {
        const file = fileObject.targetFile;
        if (file) {
            this.galleryImages.splice(this.galleryImages.indexOf(file), 1);
        } else {
            if (!(this.updatePacket['gallery_images'])) {
                this.updatePacket['gallery_images'] = this.gallery_images.map( val => { return val._id });
            }
            const id_of_removed = this.gallery_images.find(val => { return val.path == fileObject.prev_url; })._id;
            this.updatePacket['gallery_images'] = this.updatePacket['gallery_images'].filter(val => {return val != id_of_removed});
        }
    }

    handleUpdateState = async (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
        this.updatePacket[event.target.name] = event.target.value;
    }

    handleUpdateItem = async () => {
        const payload = {
            body: this.updatePacket,
            galleryImages: {files: this.galleryImages},
            thumbnailImg: {file: this.thumbnailImg},
        };
        

        await api.updateItemById(id, payload).then( res => {
            window.alert(`Item Successfully Updated`);
            this.setState({
                id: this.props.match.params.id,
                name: '',
                reviews: [],
                description: '',
                thumbnail_img: '',
                gallery_images: [],
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
            gallery_images = item.data.data.gallery_images
        });
        
    }

    render() {

        const {name, description, thumbnail_img, gallery_images} = this.state;

        return(
            <Wrapper>
                <Title>Update Item</Title>
                <Label>Name: </Label>
                <InputText 
                    type = "text"
                    value={name}
                    name={`name`}
                    onChange={this.handleUpdateState}
                />
                <Label>Description: </Label>
                <InputText 
                    type = "text"
                    value={description}
                    name={`description`}
                    onChange={this.handleUpdateState}
                />
                <Label>Thumbnail: </Label>
                <input
                    type="file"
                    name={`thumbnail_img`}
                    onChange={this.handleChangeThumbnail}
                />
                <MultiImageInput images={gallery_images} handleAppendFile={this.handleAddGalleryImage} handleRemoveFile={this.handleRemoveGallary} />
                <Button onChange={this.handleUpdateItem}>Update</Button>
                <Link to="/items/list">
                <CancelButton>Cancel</CancelButton>
                </Link>
            </Wrapper>
        );
    }
}

export default ItemUpdate;