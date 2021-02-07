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
    margin-left:0;
    margin-right:0;
    width: 100%;

`

const PostPos = styled.div.attrs({
    className: 'row'
})`
    margin-left:0;
    margin-right:0;
    width: 100%;
`

const PostContainer = styled.div.attrs({
    className: 'container'
})`
    position: relative;
    width: 100%;
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
    possition: absolute;
    z-index: 251;
`

const DeleteButton = styled.button.attrs(props => ({
    ...props,
    className: 'btn btn-danger',
}))`
    possition: absolute;
    z-index: 251;
`

const DragNDropHanlder = styled.div.attrs({

})`
    width: 100%;
    height: 100%;
    position: absolute;
    top:0;
    left:0;
    z-index: 250;

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

    handleDrag = (event) => {
        const id = event.target.id;
        event.target.classList.add("dragging");
        event.dataTransfer.setData('post_id', id);
    }

    handleDragOver = (event) => {
        event.preventDefault();
    }

    handleDragStop = (event) => {
        event.target.classList.remove("dragging");
    }

    handleDrop = (event) => {
        event.preventDefault();
        const post_id = event.dataTransfer.getData('post_id');
        const id = parseInt(event.target.id.substr(9));
        let {posts} = this.state;
        const source_indx = posts.findIndex(p => p._id==post_id);
        const target_indx = posts.findIndex(p => p.index==id);
        if (source_indx != target_indx && source_indx > -1  && target_indx > -1) {
            const old_idx = posts[source_indx].index;
            posts[source_indx].index = posts[target_indx].index;
            posts[target_indx].index = old_idx;
            // save changes to ordering
            this.setState({posts:posts});
        }
        
    }

    render() {
        const {userdata, loggedin} = this.props;
        const component_this = this;
        // should probably be more effient
        // i don't want to sort this every render
        const posts = this.state.posts.sort((a,b) => b.index-a.index).map((p) => { 
            let edit_panel = null;
            let drag_pane = null;
            function delete_post(event) {
                api.deletePost(p._id).then( () => {
                    component_this.setState({
                        posts: component_this.state.posts.filter(entry => entry._id != p._id),
                    });
                });
            }
            let edit = false;
            if (loggedin && isMemberofRole(userdata, 'admin')) {
                edit = true;
                edit_panel = [
                    <EditBtn id={p._id}>Edit</EditBtn>,
                    <DeleteButton onClick={delete_post}>Delete</DeleteButton>
                ];
                drag_pane = <DragNDropHanlder id={`dropzone_${p.index}`} onDragOver={this.handleDragOver} onDrop={this.handleDrop}></DragNDropHanlder>;
            }
            return (
                <PostPos id={`postc_${p.index}`} key={p.index}>
                    <PostWrapper id={p._id} key={p._id} draggable={edit} onDragEnd={this.handleDragStop} onDragStart={this.handleDrag}>
                        <PostContainer>
                            <PostHeader>{p.header}</PostHeader>
                            <PostInfo>{new Date(p.createdAt).toLocaleString()}</PostInfo>
                            <PostContent dangerouslySetInnerHTML={{__html: p.content}}/>
                            {drag_pane}
                        </PostContainer>
                    </PostWrapper>
                    {edit_panel}
                </PostPos>);
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