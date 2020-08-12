import React, { Component } from 'react';

import styled from 'styled-components';


const DeleteButton = styled.button.attrs({
    className: `close`
})`
`

const PreviewWrapper = styled.div.attrs({
    className: `draggable-image-preview-wrapper`
})`
    max-width: 200px;
    
`

const ImagePreview = styled.img.attrs({
    className: `draggable-image-preview`
})`
    max-width: 100%;
`
const DraggableImageFrame = styled.div.attrs({
    className: `draggable-image-frame`
})`
`
const DragableImageList = styled.ul.attrs({
    className: `multiimageinput-list`
})`
    list-style-type: none;
    display: inline-flex;
`
const Wrapper = styled.div.attrs({
})`
    overflow-x: auto;
`

const DragableImageListElement = styled.li.attrs({
    className: `multiimageinput-element`
})`
`

const AddImageButton = styled.input.attrs({
    className: `image-input-frame`
})`
`

class DragableImage extends Component {
    constructor(props) {
        super(props);
        const {prev_url, id} = props.imageInfo;
        this.state = {
            prev_url:prev_url,
            id:id,
            name: props.name,
            onDelete: props.onDelete,
        };
    }

    render() {
        const {name, prev_url, id} = this.state;
        return (
            
                <DraggableImageFrame name={`frm-${name}`}>
                    <DeleteButton name={name} onClick={this.state.onDelete}>
                        <span name={name} aria-hidden="true">&times;</span>
                    </DeleteButton>
                    <PreviewWrapper><ImagePreview src={prev_url} /></PreviewWrapper>
                </DraggableImageFrame>
        )
    }
}
class MultiImageInput extends Component {
    constructor(props) {
        super(props);
        const itemId = Math.random().toString(36).substring(6, 15) + Math.random().toString(36).substring(6,15);
        this.state = {
            fileInputs: [],
            imageInputCount: 0,
            imageInputID: itemId,
            saltLength: itemId.length,
        }
    }
    handleAddImage = async event => {
        try {
            const targetFile = event.target.files[0];
            const prev_url = URL.createObjectURL(targetFile);
            const prevInputCount = this.state.imageInputCount;
            // there's probably a more efficent way to do this (dynamically add an entry to the fileinputs object)
            // TODO: figure this out
            
            this.setState(prevState => ({
                fileInputs: [
                    ...prevState.fileInputs,
                    {targetFile: targetFile, prev_url: prev_url, id: `${prevState.imageInputID}${prevInputCount+1}`,}
                ],
                imageInputCount: prevState.imageInputCount + 1,
            }));
        } catch (error) {
                console.log(error);
        }
    }
    handleRemoveImage = async event => {
        const imageTag = event.target.getAttribute('name');
        URL.revokeObjectURL(this.state.fileInputs.find(element => {return element.id === imageTag}).prev_url); // O(n) :(
        this.setState(prevState => ({
            fileInputs: prevState.fileInputs.filter((value, _) => {return !(value.id === imageTag)}),
        }));
        // I    HATE    THIS, we are copying everything in fileinputs (including the files possibly) each time we remove an element
        
        // note that we are simply deleting an internal state value, we will need another way of removing the object from display
    }
    handleDragImage = async event => {
    }

    componentDidMount = async () => {

    }

    render() {
        const outer_this = this;
        console.log(this.state);
        const imageElements = this.state.fileInputs.map((value, _) => {
            const {prev_url, id} = value;
            const imageInfo = {prev_url, id};
            return (
                <DragableImageListElement><DragableImage name={id} imageInfo={imageInfo} onDelete={outer_this.handleRemoveImage}/></DragableImageListElement>
            );
        });

        return (
            <Wrapper>
            <DragableImageList>
                {imageElements}
                <DragableImageListElement><AddImageButton type='file' onChange={this.handleAddImage} /></DragableImageListElement>
            </DragableImageList>
            </Wrapper>
        );
    }
}

export default MultiImageInput;