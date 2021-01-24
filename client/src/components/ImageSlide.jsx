import React, {Component} from 'react';
import styled from 'styled-components';

// there should be a small set of images in a container at the bottom.
// users can press these images to preview them
// above this will be a main canvas that displays the image that the user pressed

// the most challenging part of this component will be formating the images so they fit on screen

const Wrapper = styled.div.attrs({

})`
`

const ImageSlideButton = styled.button.attrs({
    className: 'img-slide-btn'
})`
    display: inline-block;
    background-image: url('${props=>props.img_url}');
    background-repeat: no-repeat;
    background-color: black;
    background-size: contain;
    background-position: center center;
    width: 10rem;
    height: 7rem;
    border-style: none;
`

const SlideButtonPanel = styled.div.attrs({
    className: 'img-btn-panel'
})`
    display: inline-block;
    white-space: nowrap;
`

const SlideButtonArea = styled.div.attrs({
    className: 'img-btn-area'
})`
    overflow-x: auto;
    max-width: 50rem;
`

const ImageSlideCanvas = styled.div.attrs({
    className: 'img-slide-canvas'
})`
    background-image: url('${props=>props.img_url}');
    background-repeat: no-repeat;
    background-color: black;
    background-size: contain;
    background-position: center center;
    width: 50rem;
    height: 30rem;
`

class ImageSlide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images : [], // images should be links to media
            image_index : 0,
        };
    }

    componentDidMount = async () => {

    }

    handleSelectEvent = async (event) => {
        
        const new_index = event.target.value;
        this.setState({
            image_index: new_index
        });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.items != prevState.images) {
            return { images: nextProps.items};
        }
        return null;
    }

    render() {
        const {images, image_index} = this.state;
        if (images.length) {
            const image_buttons = images.map((img, index) => {
                const url = img.original;
                return <ImageSlideButton id={`img-btn-${index}`} value={index} onClick={this.handleSelectEvent} img_url={url}/>;
            })

            const canvas_img = images.length ? images[image_index].original : '';
            return (<Wrapper>
                <ImageSlideCanvas img_url={canvas_img}></ImageSlideCanvas>
                <SlideButtonArea>
                    <SlideButtonPanel>
                    {image_buttons}</SlideButtonPanel>
                </SlideButtonArea>
            </Wrapper>)
        } else {
            return (<Wrapper>
                <ImageSlideCanvas img_url=''><span style={{color:"white"}}>No Images Available</span></ImageSlideCanvas>
            </Wrapper>)
        }
    }
}

export default ImageSlide;