import React, {Component} from 'react'
import styled from 'styled-components'
import {StyledComponents} from '../components'

import api from '../api';

const Wrapper = styled.div.attrs({
    className: 'container'
})`
`

const PostWrapper = styled.div.attrs({
    className: 'row'
})`
`
const PostContainer = styled.div.attrs({
    className: 'container'
})`
`

const PostHeader = styled.h1.attrs({
    className: 'row'
})`
`
const PostInfo = styled.h6.attrs({
    className: 'row'
})`
    color: #afafaf;
`

const PostContent = styled.div.attrs({
    className: 'row'
})`
`

class FrontPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
        }
    }

    componentDidMount = () => {
        api.getPosts().then(res => {
            this.setState({
                posts: res.data.data,
            });
        })
        // api calls here
    }

    render() {
        const posts = this.state.posts.map((p) => {
            return (
            <PostWrapper key={p._id}>
                <PostContainer>
                    <PostHeader>{p.header}</PostHeader>
                    <PostInfo>{new Date(p.createdAt).toLocaleString()}</PostInfo>
                    <PostContent dangerouslySetInnerHTML={{__html: p.content}}/>
                </PostContainer>
            </PostWrapper>);
        })

        return (<Wrapper>
            {posts}
        </Wrapper>)
    }
}

export default FrontPage;