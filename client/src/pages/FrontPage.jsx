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

function FrontPagePost(edit, 
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
        drag_pane = <DragNDropHanlder
        id={`dropzone_${p.index}`} 
        onDragLeave={handleDragLeave} 
        onDragEnter={handleDragEnter} 
        onDragOver={handleDragOver} 
        onDrop={handleDrop}>
        </DragNDropHanlder>;
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
    constructor(id, index) {
        this.index = index;
        this.id = id;
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
        this.dragNode = null;
        this.index_update_list = [];
    }

    componentDidMount = () => {
        api.getPosts().then(res => {
            const posts = res.data.data;
            let post_list_head = new ListNode(0, posts[0].index);
            let post_cur = post_list_head;

            for(let i = 1; i < posts.length; i++) {
                const new_node = new ListNode(i, posts[i].index);
                new_node.setPrev(post_cur);
                post_cur.setNext(new_node);
                post_cur = post_cur.getNext();
            }
            
            this.setState({
                posts: res.data.data,
                post_list: post_list_head,
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

    updatePostIndexing = (start_node, end_node) => {
        let promise_list = [];
        for(let i = 0; i < this.index_update_list.length; i++) {
            const {_id, index}  = this.index_update_list[i];
            promise_list.push(api.editPost(_id, {index}));
        }
        Promise.all(promise_list).then((values) => {
            this.index_update_list = [];
        });
    }

    printList(list_head) {
        let curr = list_head;
        let a = '';
        while (curr) {
            a += `${curr.id}->`;
            curr = curr.next;
        }
        console.log(a);
    }

    handleDrop = (linked_list_node=null) => (event) => {
        event.preventDefault();
        event.target.classList.remove('expanded');
        let {posts, post_list} = this.state;

        if (this.dragNode != linked_list_node) {
            let current_head = post_list;
            
            if (this.dragNode.getPrev()) { // if this node isn't the head
                this.dragNode.getPrev().setNext(this.dragNode.getNext());// take the current drag node out of it's array
            } else { // we're looking at the head of the list
                current_head = this.dragNode.getNext();
            }
            if (this.dragNode.getNext()) {
                this.dragNode.getNext().setPrev(this.dragNode.getPrev());
            }
            
            // put the node where th target node used to be
            if (!linked_list_node.getPrev()) {// if this is the head

                current_head = this.dragNode;
                current_head.setPrev(null);
                linked_list_node.setPrev(current_head);
                current_head.setNext(linked_list_node);
                
            } else if(!linked_list_node.getNext()) { // if this is the end of the list
                
                this.dragNode.setPrev(linked_list_node);
                linked_list_node.setNext(this.dragNode);
                this.dragNode.setNext(null);

            } else { // if the linked list node is somewhere in the body
                if (linked_list_node.getNext() == this.dragNode) { // neighbor case #1
                    const old_prev = linked_list_node.getPrev();
                    this.dragNode.setNext(linked_list_node);
                    this.dragNode.setPrev(old_prev);
                    old_prev.setNext(this.dragNode);
                    linked_list_node.setNext(this.dragNode);

                } else if (linked_list_node.getPrev() == this.dragNode) { // neighbor case #2
                    const old_next = linked_list_node.getNext();
                    linked_list_node.setNext(this.dragNode);
                    this.dragNode.setPrev(linked_list_node);
                    this.dragNode.setNext(old_next);
                    old_next.setPrev(this.dragNode);
                } else { // general case
                    this.dragNode.setPrev(linked_list_node);
                    this.dragNode.setNext(linked_list_node.getNext());
                    this.dragNode.getNext().setPrev(this.dragNode);
                    this.dragNode.getPrev().setNext(this.dragNode);
                }
            }
            this.setState({posts:posts, post_list: current_head});
            ///const start_node = this.dragNode;
            //this.updatePostIndexing(start_node, linked_list_node);
        }
        this.dragedIndex = -1;
        this.draggedId = null;
        this.dragNode = null;
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

            const post_element = FrontPagePost(
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
        console.log("called");
        const {userdata, loggedin} = this.props;
        const component_this = this;
        const edit = loggedin && isMemberofRole(userdata, 'admin');
        // should probably be more effient
        // i don't want to sort this every render
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
)(FrontPage);