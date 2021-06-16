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

const DragNDropHanlder = styled.div.attrs(props => ({
    ...props,
    className: `${props.top ? 'insert_up' : 'insert_down'}`

}))`
    width: 100%;
    height: 50%;
    position: absolute;
    left:0;
    z-index: 250;

    &.insert_up {
        top: 0;
    }
    &.insert_down {
        top: 50%;
    }

    &.expanded.top ~ div.expander.top {
        //height:  300px;
    }
    &.expanded.bottom ~ div.expander.bottom {
        //height: 300px;
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

function BlogPost(edit, 
                        p, 
                        handleDrag, 
                        handleDragStop, 
                        handleDragOver, 
                        handleDragLeave, 
                        handleDragEnter, 
                        handleDrop, 
                        deletePost,
                        key) {
    let edit_panel = null;
    let drag_pane = null;
    if (edit) {
        edit_panel = [
            <EditBtn id={p._id}>Edit</EditBtn>,
            <DeleteButton onClick={deletePost}>Delete</DeleteButton>
        ];
        drag_pane = [
        <DragNDropHanlder top={true}
        id={`${key}`} 
        onDragLeave={handleDragLeave} 
        onDragEnter={handleDragEnter} 
        onDragOver={handleDragOver} 
        onDrop={handleDrop(true)}>
        </DragNDropHanlder>,
        <DragNDropHanlder
        id={`${key}`} 
        onDragLeave={handleDragLeave} 
        onDragEnter={handleDragEnter} 
        onDragOver={handleDragOver} 
        onDrop={handleDrop(false)}>
        </DragNDropHanlder>];
    }
    return (
        <PostPos id={`postc_${p.index}`} key={key}>
            <PostWrapper 
            id={p._id} 
            name={p.index} 
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

class ListNode {
    constructor(id, index, _id) {
        this.index = index;
        this.id = id;
        this._id = _id;
        this.prev = null;
        this.next = null;
    }

    setNext(next) {
        this.next = next;
    }

    setPrev(prev) {
        this.prev = prev;
    }

    getNext() {
        return this.next;
    }

    getPrev() {
        return this.prev;
    }

    insertBefore(target) {
        if (target != this.getPrev()) {
            const prev = this.getPrev();
            this.setPrev(target);
            target.setNext(this);
            target.setPrev(prev);
            if (prev) {
                prev.setNext(target);
            }
        }
        return target;
    }

    insertAfter(target) {
        if (target != this.getNext()) {
            const next = this.getNext();
            this.setNext(target);
            target.setPrev(this);
            target.setNext(next);
            if (next) {
                next.setPrev(target);
            }
        }
        return target;
    }

    removeAndMend() {
        const prev = this.getPrev();
        const next = this.getNext();

        if (prev) {
            prev.setNext(next);
        }
        if (next) {
            next.setPrev(prev);
        }

        return next ? next : prev;
    }
}

class BlogPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            post_list: null,
            posts_length: null,
        }
        this.dragedIndex = -1;
        this.draggedId = null;
        this.dragNode = null;
        this.index_update_list = [];
    }

    componentDidMount = () => {
        api.getPosts().then(res => {
            const posts = res.data.data;
            let post_list_head = new ListNode(0, posts[0].index, posts[0]._id);
            let post_cur = post_list_head;

            for(let i = 1; i < posts.length; i++) {
                const new_node = new ListNode(i, posts[i].index, posts[i]._id);
                new_node.setPrev(post_cur);
                post_cur.setNext(new_node);
                post_cur = post_cur.getNext();
            }
            
            this.setState({
                posts: res.data.data,
                post_list: post_list_head,
                posts_length: res.data.data.length,
            });
        })
    }

    handleDrag = (linked_list_node=null) => (event) => {
        const id = event.target.id;
        const index = event.target.getAttribute('name');
        
        event.target.classList.add("dragging");
        event.dataTransfer.setData('post_index', index);

        this.dragNode = linked_list_node;
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

    updatePostIndexing = (start_node, end_node, direction) => {
        let promise_list = [];
        let curr = start_node;
        // if direction is negative, then the start node is above the end node,
        // otherwise, the start node is below the end node
        let index;
        console.log(direction);
        if (direction < 0) {
            index = start_node.getPrev() ? start_node.getPrev().index+1 : 1;

        } else {
            index = start_node.getNext() ? start_node.getNext().index - 1 : this.state.posts_length;
        }
        let stop_point = direction < 0 ? end_node.getNext() : end_node.getPrev();

        while (curr && curr != stop_point) {
            curr.index = index;
            promise_list.push(api.editPost(curr._id, {index: curr.index}));
            index = index + (direction < 0 ? 1 : -1);
            curr = direction < 0 ? curr.getNext() : curr.getPrev();
        }
        Promise.all(promise_list).then((values) => {
            this.index_update_list = [];
        });
    }

    printList(list_head) {
        let curr = list_head;
        let a = '';
        while (curr) {
            a += `${curr.index}->`;
            curr = curr.next;
        }
        console.log(a);
    }

    handleDrop = (linked_list_node=null) => (top) => (event) => {
        event.preventDefault();
        event.target.classList.remove('expanded');
        let {posts, post_list} = this.state;
        
        if (this.dragNode != linked_list_node) {
            let current_head = post_list;
            if (!this.dragNode.getPrev()) {
                current_head = this.dragNode.getNext();
            }

            let start_node = this.dragNode.removeAndMend();
            if (top) {// insert above
                if (!linked_list_node.getPrev()) {
                    // replace the head with the next node
                    current_head = this.dragNode;
                }
                linked_list_node.insertBefore(this.dragNode);

            } else {
                linked_list_node.insertAfter(this.dragNode);
            }
            
            this.setState({posts:posts, post_list: current_head}, () => {
                
                let direction = this.dragNode.index - linked_list_node.index;
                this.updatePostIndexing(start_node, this.dragNode, direction);

                this.dragedIndex = -1;
                this.draggedId = null;
                this.dragNode = null;
            });
        }

        //
    }

    getPostsFromList(edit) {
        const {post_list, posts} = this.state;
        let post_element_list = [];
        let curr = post_list;
        const component_this = this;
        let key = 0;
        while (curr) {
            const p = posts[curr.id];

            function delete_post(event) {
                api.deletePost(p._id).then( () => {
                    component_this.setState({
                        posts: component_this.state.posts.filter(entry => entry._id != p._id),
                    });
                });
            }

            const post_element = BlogPost(
                edit, 
                p, 
                this.handleDrag(curr), 
                this.handleDragStop, 
                this.handleDragOver, 
                this.handleDragLeave, 
                this.handleDragEnter, 
                this.handleDrop(curr), 
                delete_post,
                key);
                key += 1;
                post_element_list.push(post_element);
            curr = curr.next;
        }
        return post_element_list;
    }

    render() {
        const {userdata, loggedin} = this.props;
        const component_this = this;
        const edit = loggedin && isMemberofRole(userdata, 'ROLE_ADMIN');
        const posts = component_this.getPostsFromList(edit);

        let post_buttons = null;
        if (edit)
            post_buttons = [<EditBtn key='0'>Write Post</EditBtn>,
                            <ImagePostBtn key='1'>Post Image</ImagePostBtn>];
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
)(BlogPage);