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


export default {Submit, TextInputSection, BigTextArea, CashInput};