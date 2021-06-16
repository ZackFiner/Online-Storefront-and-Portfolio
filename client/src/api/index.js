import axios from 'axios';

const user_api = axios.create({
    baseURL: 'http://localhost:3000/',
});

const store_api = axios.create({
    baseURL: 'http://localhost:3001/',
});

const post_api = axios.create({
    baseURL: 'http://localhost:3002/',
});

export const insertItem = payload => {
    /* Because this request is handled using the multer middleware
     * we need to repackage the contents into a multipart form
     */
    const {thumbnailImg, galleryImages, body} = payload;
    const formData = new FormData();
    formData.append('selectedThumbnail', thumbnailImg.file);
    
    galleryImages.files.forEach(file => {
        formData.append('galleryImages', file);
    });
    
    formData.append('body', JSON.stringify(body));
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
        withCredentials: true
    }
    return store_api.post(`/`, formData, config);
}
export const getAllItems = () => store_api.get(`/`);
export const searchItems = payload => store_api.post(`/search`, payload);
export const updateItemById = (id, payload) => {
    const {thumbnailImg, galleryImages, body} = payload;
    const formData = new FormData();
    formData.append('selectedThumbnail', thumbnailImg.file);
    
    galleryImages.files.forEach(file => {
        formData.append('galleryImages', file);
    });
    
    formData.append('body', JSON.stringify(body));
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
        withCredentials: true
    }

    return store_api.put(`/${id}`, formData, config);
}
export const deleteItemById = id => store_api.delete(`/${id}`, {withCredentials: true});
export const getItemById = id => store_api.get(`/${id}`);

export const getReviewById = (item_id, id) => store_api.get(`/${item_id}/reviews/${id}`);
export const insertReview = (item_id, payload) => store_api.post(`/${item_id}/reviews`, payload, {withCredentials: true});
export const deleteReviewById = (item_id, id) => store_api.delete(`/${item_id}/reviews/${id}`, {withCredentials: true});

export const createUserAccount = payload => user_api.post(`/`, payload);
export const getUserData = (/*userID and Email should be attached during authentication*/) => user_api.get(`/`, {withCredentials: true});
export const authUser = payload => user_api.post(`/authenticate`, payload, {withCredentials: true});
export const logUserOut = () => user_api.delete(`/authenticate`, {withCredentials: true});
export const refreshUserToken = () => user_api.put(`/authenticate`, {/*The payload is the credentials*/}, {withCredentials: true});

export const createPost = payload => post_api.post(`/`, payload, {withCredentials: true});
export const editPost = (id, payload) => post_api.put(`/${id}`, payload, {withCredentials: true});
export const deletePost = id => post_api.delete(`/${id}`, {withCredentials: true});
export const getPostById = id => post_api.get(`/${id}`);
export const getPosts = () => post_api.get(`/`);
export const createPostImage = payload => {
    const {selectedFile} = payload;
    const formData = new FormData();
    formData.append('selectedImage', selectedFile);
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        },
        withCredentials: true,
    }

    return post_api.post(`/media`, formData, config);
}

const apis = {
    insertItem,
    getAllItems,
    updateItemById,
    updateItemById,
    deleteItemById,
    getItemById,
    searchItems,

    getReviewById,
    insertReview,
    deleteReviewById,

    createUserAccount,
    getUserData,
    authUser,
    logUserOut,
    refreshUserToken,

    createPost,
    editPost,
    deletePost,
    getPostById,
    getPosts,
    createPostImage,
}

export default apis;