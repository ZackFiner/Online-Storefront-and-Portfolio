import React, {Component} from 'react';
import styled from 'styled-components';
import {StyledComponents} from '../components';
import {connect} from 'react-redux';
import {isMemberofRole} from '../authorization';
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
    & p {
        width: 100%;
    }

    & img {
        width: 100%;
        object-fit: contain;
    }
`

const EditBtn = styled.a.attrs(props => ({
    ...props,
    className: 'btn btn-primary',
    role: 'button',
    href: `frontpage/post/${props.id}`
}))`
`

const DeleteButton = styled.button.attrs(props => ({
    ...props,
    className: 'btn btn-danger',
}))`
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
    }

    render() {
        const {userdata, loggedin} = this.props;
        const component_this = this;
        const posts = this.state.posts.map((p) => {
            let edit_panel = null;

            function delete_post(event) {
                api.deletePost(p._id).then( () => {
                    component_this.setState({
                        posts: component_this.state.posts.filter(entry => entry._id != p._id),
                    });
                });
            }
            if (loggedin && isMemberofRole(userdata, 'admin'))
                edit_panel = [<EditBtn id={p._id}>Edit</EditBtn>,<DeleteButton onClick={delete_post}>Delete</DeleteButton>];
            return (
            <PostWrapper key={p._id}>
                <PostContainer>
                    <PostHeader>{p.header}</PostHeader>
                    <PostInfo>{new Date(p.createdAt).toLocaleString()}</PostInfo>
                    <PostContent dangerouslySetInnerHTML={{__html: p.content}}/>
                    {edit_panel}
                </PostContainer>
            </PostWrapper>);
        })

        return (<Wrapper>
            {posts}
        </Wrapper>)
    }
}
const mapStateToProps = state => {
    const payload = state.accountRedu;
    return {
        userdata: payload.userdata,
        loggedin: payload.loggedin,
    };
}

export default connect(
    mapStateToProps,
    null
)(FrontPage);