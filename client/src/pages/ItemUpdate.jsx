import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import api from '../api';

import styled from 'styled-components';
import { MultiImageInput, ImageSelector, StyledComponents } from '../components';
import { connect } from 'mongoose';

import {Editor} from '@tinymce/tinymce-react';

const Title = styled.h1.attrs({
    className: 'h1',
})``

const FormWrapper = styled.form.attrs({

})`
`

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
            id: props?.match?.params?.id, //see, thats why we needed the :id for the page path in app/index.js
            name: '',
            reviews: [],
            description: '',
            keywords: '',
            price: null,
            thumbnail_img: '',
            gallery_images: [],
            dataLoaded: false,
            edit: false,
        };
        this.thumbnailImg = null;
        this.galleryImages = [];
        this.updatePacket = {};
    }

    componentDidMount = async () => {
        const { id } = this.state;
        if (id) {
            const item = await api.getItemById(id);
            this.setState({
                name: item.data.data.name,
                reviews: item.data.data.reviews,
                description: item.data.data.description,
                price: item.data.data.price,
                keywords: item.data.data.keywords.join(', '),
                thumbnail_img: item.data.data.thumbnail_img,
                gallery_images: item.data.data.gallery_images,
                edit: true,
            });
            this.dataLoaded = true;
        }
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
                this.updatePacket['gallery_images'] = this.state.gallery_images.map( val => { return val._id });
            }
            const id_of_removed = this.state.gallery_images.find(val => { return val.path == fileObject.prev_url; })._id;
            this.updatePacket['gallery_images'] = this.updatePacket['gallery_images'].filter(val => {return val != id_of_removed});
        }
    }

    handleUpdateState = async (event) => {
        this.setState({
            [event.target.name]: event.target.value,
        });
        this.updatePacket[event.target.name] = event.target.value;
    }

    handleUpdateKeywords = async (event) => {
        const keywords = event.target.value;
        this.setState({
            keywords,
        });
        const valid_keyword_list = keywords.split(',').filter(x => x).map(x => x.trim());
        this.updatePacket.keywords = valid_keyword_list;
    }

    handleEditorChange = (value, editor) => {
        this.setState({
            description: value,
        });
        this.updatePacket.description = value;
    }


    handleUpdateItem = async (event) => {
        event.preventDefault();
        const {id, edit} = this.state;
        if (edit) {
            const payload = {
                body: {... this.updatePacket},
                galleryImages: {files: this.galleryImages},
                thumbnailImg: {file: this.thumbnailImg},
            };
            

            await api.updateItemById(id, payload).then( res => {
                const id = res.data.id;
                this.props.history.push(`/items/update/${id}`);
            })
        } else {
            const {name, reviews, description, keywords, price} = this.state;
            const payload = {
                body: {
                    name,
                    reviews,
                    description: description.toString('html'),
                    keywords: this.updatePacket.keywords,
                    price
                },
                galleryImages: {files: this.galleryImages},
                thumbnailImg: {file: this.thumbnailImg},
            }
            await api.insertItem(payload).then(res => {
                const id = res.data.id;
                this.setState({
                    id: id,
                    edit: true,
                }, () => {
                    this.props.history.push(`/items/update/${id}`);
                })
            });
        }
    }

    render() {
        const {name, description, thumbnail_img, gallery_images, keywords, price, dataLoaded} = this.state;
        return(
        <Wrapper>
                <Title>Edit Item</Title>
                <FormWrapper onSubmit={this.handleUpdateItem}>
                    <StyledComponents.TextInputSection>
                        <Label>Name</Label>
                        <InputText 
                            type = "text"
                            value={name}
                            name={`name`}
                            onChange={this.handleUpdateState}
                        />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Description</Label>
                        <Editor
                            name={`description`}
                            onEditorChange={this.handleEditorChange}
                            value={description}
                        />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Keywords</Label>
                        <InputText
                            type="text"
                            value={keywords}
                            name={`keywords`}
                            placeholder="Keyword1, Keyword2, ..."
                            onChange={this.handleUpdateKeywords}
                        />
                    </StyledComponents.TextInputSection>
                    <StyledComponents.TextInputSection>
                        <Label>Price</Label>
                        <StyledComponents.CashInput
                            name={`price`}
                            onChange={this.handleUpdateState}
                            value={price ? price.$numberDecimal : ''}
                        />
                    </StyledComponents.TextInputSection>
                    <Label>Thumbnail</Label>
                    {/*<InputImage 
                    type="file"
                    onChange = {this.handleFileUpload}
                    ref={this.fileInput}
                />*/}
                    <ImageSelector prevUrl={thumbnail_img ? thumbnail_img.path : ''} onChange={this.handleChangeThumbnail}/>
                    <Label>Gallery Input</Label>
                    <MultiImageInput images={gallery_images} handleAppendFile={this.handleAddGalleryImage} handleRemoveFile={this.handleRemoveGallary} />
                    <StyledComponents.Submit value='Save Changes' />
                </FormWrapper>
            </Wrapper>);
    }
}

export default ItemUpdate;