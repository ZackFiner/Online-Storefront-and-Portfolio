import React, {Component} from 'react'
import styled from 'styled-components'

import {DragGrid, DragContainer} from '../components';

const Wrapper = styled.div.attrs({
})`
`

class SlidePageExample extends Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {
        return <Wrapper>
            <DragGrid num_cols={4}>
                <DragContainer>
                    <div>1</div>
                </DragContainer>
                <DragContainer>
                    <div>2</div>
                </DragContainer>
                <DragContainer>
                    <div>3</div>
                </DragContainer>
                <DragContainer>
                    <div>4</div>
                </DragContainer>
                <DragContainer>
                    <div>5</div>
                </DragContainer>
            </DragGrid>
        </Wrapper>
    }

}

export default SlidePageExample;