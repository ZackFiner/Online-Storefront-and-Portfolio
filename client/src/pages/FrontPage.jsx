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
    href: `frontpage/post${props.id ?`/${props.id}`:''}`
}))`
    possition: absolute;
    z-index: 251;
`

const ImagePostBtn = styled.a.attrs({
    className: 'btn btn-primary',
    role: 'button',
    href: `frontpage/media/post`
})`
    position: absolute;
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

    &.expanded.top ~ div.expander.top {
        height:  300px;
    }
    &.expanded.bottom ~ div.expander.bottom {
        height: 300px;
    }
`
const Expander = styled.div.attrs(props => ({
    className: `expander ${props.dir}`
}))`
    width: 100%;
    height: 0;
    
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

function FrontPagePost(edit, p, handleDrag, handleDragStop, handleDragOver, handleDragLeave, handleDragEnter, handleDrop, deletePost) {
    let edit_panel = null;
    let drag_pane = null;
    if (edit) {
        edit_panel = [
            <EditBtn id={p._id}>Edit</EditBtn>,
            <DeleteButton onClick={deletePost}>Delete</DeleteButton>
        ];
        drag_pane = <DragNDropHanlder 
        id={`dropzone_${p.index}`} 
        onDragLeave={handleDragLeave} 
        onDragEnter={handleDragEnter} 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}>
        </DragNDropHanlder>;
    }
    return (
        <PostPos id={`postc_${p.index}`} key={p.index}>
            <PostWrapper 
            id={p._id} 
            name={p.index} 
            key={p._id} 
            draggable={edit} 
            onDragEnd={handleDragStop} 
            onDragStart={handleDrag}>
                <PostContainer>
                    {drag_pane}
                    <Expander dir="top"></Expander>
                    <PostHeader>{p.header}</PostHeader>
                    <PostInfo>{new Date(p.createdAt).toLocaleString()}</PostInfo>
                    <PostContent dangerouslySetInnerHTML={{__html: p.content}}/>
                    <Expander dir="bottom"></Expander>
                </PostContainer>
            </PostWrapper>
            {edit_panel}
        </PostPos>);
}


class FrontPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            post_list: null,
        }
        this.dragedIndex = -1;
        this.draggedId = null;
        this.index_update_list = [];
    }

    componentDidMount = () => {
        api.getPosts().then(res => {
            const posts = res.data.data;
            let post_list_head = {prev:null, id: 0, index: posts[0].index, next: null};
            let post_cur = post_list_head;

            for(let i = 1; i < posts.length; i++) {
                post_cur.next = {prev: post_cur, id: i, index: posts[i].index, next: null};
                post_cur = post_cur.next;
            }
            
            this.setState({
                posts: res.data.data,
                post_list: post_list_head,
            });
        })
    }

    handleDrag = (event) => {
        const id = event.target.id;
        const index = event.target.getAttribute('name');
        
        event.target.classList.add("dragging");
        event.dataTransfer.setData('post_index', index);
        
        this.draggedId = id;
        this.dragedIndex = index;
    }

    handleDragOver = (event) => {
        event.preventDefault();

    }

    handleDragEnter = (event) => {
        const post_index = this.dragedIndex;
        const id = parseInt(event.target.id.substr(9));

        if (post_index != id) 
            event.target.classList.add('expanded');
            if (post_index < id)
                event.target.classList.add('top');
            else
                event.target.classList.add('bottom');
    }

    handleDragLeave = (event) => {
        const post_index = this.dragedIndex;
        const id = parseInt(event.target.id.substr(9));

        if (post_index != id) 
            event.target.classList.remove('expanded');
            if (post_index < id)
                event.target.classList.remove('top');
            else
                event.target.classList.remove('bottom');
    }

    handleDragStop = (event) => {
        event.target.classList.remove("dragging");
    }

    updatePostIndexing = () => {
        let promise_list = [];
        for(let i = 0; i < this.index_update_list.length; i++) {
            const {_id, index}  = this.index_update_list[i];
            promise_list.push(api.editPost(_id, {index}));
        }
        Promise.all(promise_list).then((values) => {
            this.index_update_list = [];
        });
    }

    handleDrop = (event) => {
        event.preventDefault();

        event.target.classList.remove('expanded');

        const post_id = this.draggedId;
        const id = parseInt(event.target.id.substr(9));
        let {posts} = this.state;

        const source_indx = posts.findIndex(p => p._id==post_id);
        const target_indx = posts.findIndex(p => p.index==id);

        if (source_indx != target_indx && source_indx > -1  && target_indx > -1) {
            posts[source_indx].index = posts[target_indx].index;
            this.index_update_list.push({_id: posts[source_indx]._id, index: posts[source_indx].index}); // queue this post for an update request
            
            const bottom_idx = Math.min(source_indx, target_indx);
            const top_idx = Math.max(source_indx, target_indx);
            const iter = source_indx > target_indx ? -1 : 1;
            const off = source_indx == bottom_idx;
            for(let i = bottom_idx; i < top_idx; i++) 
            {
                posts[i+off].index += iter;
                this.index_update_list.push({_id: posts[i+off]._id, index: posts[i+off].index}); // queue this post for an update request
            }

            this.setState({posts:posts});
        }
        this.dragedIndex = -1;
        this.draggedId = null;
        this.updatePostIndexing();
    }

    render() {
        const {userdata, loggedin} = this.props;
        const component_this = this;
        const edit = loggedin && isMemberofRole(userdata, 'admin');
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
            return FrontPagePost(
                edit, 
                p, 
                component_this.handleDrag, 
                component_this.handleDragStop, 
                component_this.handleDragOver, 
                component_this.handleDragLeave, 
                component_this.handleDragEnter, 
                component_this.handleDrop, 
                delete_post);
        })
        let post_buttons = null;
        if (edit)
            post_buttons = [<EditBtn>Write Post</EditBtn>,
                            <ImagePostBtn>Post Image</ImagePostBtn>];
        return (<Wrapper>
            {post_buttons}
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