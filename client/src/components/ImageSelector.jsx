import React, {Component} from 'react';
import styled from 'styled-components';
import StyledComponents from './StyledComponents';
const {ImageSelectorPreview, ImageSelectorButton} = StyledComponents;

class ImageSelector extends Component {
    constructor(props) {
        super(props);
        this.state = {
            prevUrl: '',
            imageFile: null,
        };
        this.onChange = props.onChange;
    }

    componentDidUpdate = (prevProps) => {
        let props = this.props;
        if (prevProps.prevUrl !=  props.prevUrl) {
            this.setState({
                prevUrl: props.prevUrl,
            });
        }

    }

    handleImageSelect = async (event) => {
        const {imageFile, prevUrl} = this.state;
        const newFile = event.target.files[0];
        const newUrl = URL.createObjectURL(newFile);
        
        if (imageFile && prevUrl) {// if something was already selected
            URL.revokeObjectURL(prevUrl);
        }
        this.setState({
            imageFile: newFile,
            prevUrl: newUrl,
        })
        this.onChange(event);
    }

    render() {
        const {prevUrl} = this.state;
        let previewFiller;
        if (prevUrl) {
            previewFiller = <ImageSelectorPreview src={prevUrl} />;
        } else {
            previewFiller = <span/>;
        }
        return (<div>
            {previewFiller}
            <ImageSelectorButton onChange={this.handleImageSelect} /></div>)
    }
}

export default ImageSelector;