import React, { Component } from 'react';

import styled from 'styled-components';
import StyledComponents from './StyledComponents';
const {ImageSelectorButton} = StyledComponents;


const DeleteButton = styled.button.attrs({
    className: `close`
})`
    position: relative;
    bottom: -20px;
    left: 0px;
    color: gray;
    z-index: 50;
    opacity: 0.7;
    &:hover {
        color: white;
    }
`

const PreviewWrapper = styled.div.attrs({
    className: `draggable-image-preview-wrapper`
})`
    max-width: 225px;
    height: 150px;
    margin-top: -25px;
    
`

const ImagePreview = styled.img.attrs({
    className: `draggable-image-preview`
})`
    width: 225px;
    height: 150px;
    object-fit: contain;
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
                    <PreviewWrapper><StyledComponents.ImageSelectorPreview src={prev_url} /></PreviewWrapper>
                </DraggableImageFrame>
        )
    }
}
class MultiImageInput extends Component {
    constructor(props) {
        super(props);
        const itemId = Math.random().toString(36).substring(6, 15) + Math.random().toString(36).substring(6,15);
        this.appendFileList = props.handleAppendFile;
        this.removeFileList = props.handleRemoveFile;
        this.state = {
            fileInputs: [],
            imageInputCount: 0,
            imageInputID: itemId,
            saltLength: itemId.length,
        }
        if (props.images && props.images.length) {

            this.state.fileInputs = props.images.map((value, index) => ({
                targetFile: null,
                prev_url: value.path,
                id: `${this.state.imageInputID}${index}`,
            }));
            this.state.imageInputCount = props.images.length;
        }
    }
    handleAddImage = async event => {
        try {
            let newFileObjects = [];
            let fileCount = 0;
            for (const targetFile of event.target.files) {
                const prev_url = URL.createObjectURL(targetFile);
                // there's probably a more efficent way to do this (dynamically add an entry to the fileinputs object)
                // TODO: figure this out
                const id = `${this.state.imageInputID}${this.state.imageInputCount}`
                const newFileObject = {targetFile, prev_url, id,};
                newFileObjects.push( newFileObject );
                
                this.appendFileList(event, newFileObject);
                fileCount++;
            }
            this.setState(prevState => ({
                ...prevState,
                fileInputs: [
                    ...prevState.fileInputs,
                    ...newFileObjects,
                ],
                imageInputCount: prevState.imageInputCount + fileCount,
            }));
        } catch (error) {
                console.log(error);
        }
    }
    handleRemoveImage = async event => {
        try {
            const imageTag = event.target.getAttribute('name');
            const targetObject = this.state.fileInputs.find(element => {return element.id === imageTag});
            if (targetObject.targetFile) {
                URL.revokeObjectURL(targetObject.prev_url);
            }

            this.removeFileList(event, targetObject); // notify parent of removal
            
            this.setState(prevState => ({
                fileInputs: prevState.fileInputs.filter((value, _) => {return !(value.id === imageTag)}),
            }));
            // I    HATE    THIS, we are copying everything in fileinputs (including the files possibly) each time we remove an element
        } catch (error) {
            console.log(error);
        }
        // note that we are simply deleting an internal state value, we will need another way of removing the object from display
    }
    handleDragImage = async event => {
    }

    componentDidMount = async () => {

    }

    componentDidUpdate = prevProps => {
        let props = this.props;
        if (props.images != prevProps.images)
        {
            if (props.images && props.images.length) {
                this.setState(prevState => ({
                    ...prevState,
                    fileInputs: props.images.map((value, index) => ({
                        targetFile: null,
                        prev_url: value.path,
                        id: `${this.state.imageInputID}${index}`,
                    })),
                    imageInputCount: props.images.length,
                }))
            }
        }
    }

    render() {
        const outer_this = this;
        const imageElements = this.state.fileInputs.map((value, _) => {
            const imageInfo = {
                prev_url: value.prev_url, 
                id: value.id,
            };
            return (
                <DragableImageListElement>
                    <DragableImage key={value.id} name={value.id} imageInfo={imageInfo} onDelete={outer_this.handleRemoveImage}/>
                </DragableImageListElement>
            );
        });

        return (
            <Wrapper>
            <DragableImageList>
                {imageElements}
                <DragableImageListElement>
                    <ImageSelectorButton type='file' multiple='multiple' onChange={this.handleAddImage} />
                </DragableImageListElement>
            </DragableImageList>
            </Wrapper>
        );
    }
}

export default MultiImageInput;