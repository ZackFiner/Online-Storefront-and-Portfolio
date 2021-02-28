import React from 'react';
import styled from 'styled-components';

const Submit = styled.input.attrs(props=>({
    ...props,
    className: `btn btn-primary`,
    type:`submit`,
    value:props.value,
}))``

const TextInputSection = styled.div.attrs({
    className: 'form-group'
})`
`

const BigTextArea = styled.textarea.attrs({
    className: 'form-control',
})`
`

const CashInput = styled.input.attrs({
    type: "number",
    step: "0.01"
})`
`

const ImageSelectorInput = styled.input.attrs(({key, name, onChange}) => ({
    className: `image-selector-input`,
    type: 'file',
    onChange: onChange,
    key: key,
    name: name,
}))`
    display: none;
`
const ImageSelectorPreview = styled.img.attrs({
    className: `image-selector-preview`
})`
    width: 225px;
    height: 150px;
    object-fit: contain;
    background-color: black;
`
const ImageSelectorLabel = styled.label.attrs({

})`
    display: block;
    cursor: pointer;
    border-style: dashed;
    border-radius: 5px;
    border-width: 1px;
    width: 225px;
    height: 150px;
    text-align: center;
    font-family: "segoe ui symbol";
    margin-bottom: 0;
`

const ImageSelectorButton = (props) => (<ImageSelectorLabel><ImageSelectorInput {...props}></ImageSelectorInput><font size="+4">&#128247;</font><br/>Choose an Image</ImageSelectorLabel>);


export default {Submit, TextInputSection, BigTextArea, CashInput, ImageSelectorInput, ImageSelectorPreview, ImageSelectorButton};