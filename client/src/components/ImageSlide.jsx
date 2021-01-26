import React, {Component} from 'react';
import styled from 'styled-components';

// there should be a small set of images in a container at the bottom.
// users can press these images to preview them
// above this will be a main canvas that displays the image that the user pressed

// the most challenging part of this component will be formating the images so they fit on screen

const Wrapper = styled.div.attrs({

})`
    color: #7f7f7f;
    max-width: 52rem;
    padding: 1rem;
`

const ImageSlideButton = styled.input.attrs(props => ({
    className: `img-slide-btn${props.isSelected ? ' selected' : ''}`,
    type:"button"
}))`
    display: inline-block;
    background-image: url('${props=>props.img_url}');
    background-repeat: no-repeat;
    background-color: black;
    background-size: contain;
    background-position: center center;
    width: 10rem;
    height: 7rem;
    border-style: none;
    border-width: 0px;
    border-radius: 0;
    font-size: 0pt;
    margin-top:2px;
    margin-bottom:2px;
    margin-right: 5px;
    &:hover {
        cursor: pointer;
    }
    &:focus {
        border-style: none;
        border-width: 0px;
        border-radius: 0;
        outline: none;
    }

    &.selected {
        border-style: solid;
        border-width: 3px;
        border-color:#ffffff;
        border-radius: 0;
        transition: border-width 0.2s;
    }
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
    text-align: center;
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
    transition: background 0.5s linear;
    max-width: 50rem;
    height: 30rem;
`

class ImageSlide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            images : [], // images should be links to media
            image_count : 0,
            image_index : 0,
            cycle_timer : -1,
            timeout_timer: -1,
        };
    }

    componentDidMount = async () => {
        this.cycleNextImage();
    }

    componentDidUpdate = async () => {
    }

    handleSelectEvent = async (event) => {
        clearTimeout(this.state.cycle_timer);
        clearTimeout(this.state.timeout_timer);
        const new_index = event.target.value;


        
        const timeout_timer = setTimeout(this.cycleNextImage, 1000*15);
        this.setState({
            image_index: new_index,
            timeout_timer
        });
    }

    cycleNextImage = async () => {
        const {image_index, image_count} = this.state;
        let new_index = 0;

        if (image_count) {
            new_index = (image_index + 1) % image_count;
        }
        const cycle_timer = setTimeout(this.cycleNextImage, 1000*8);
        this.setState({image_index: new_index, cycle_timer });
        
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.items != prevState.images) {
            return {
                images: nextProps.items,
                image_count: nextProps.items.length,
            };
        }
        return null;
    }

    render() {
        const {images, image_index} = this.state;
        if (images.length) {
            const image_buttons = images.map((img, index) => {
                const url = img.original;
                return <ImageSlideButton isSelected={image_index==index} key={`img-btn-${index}`} id={`img-btn-${index}`} value={index} onClick={this.handleSelectEvent} img_url={url}/>;
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