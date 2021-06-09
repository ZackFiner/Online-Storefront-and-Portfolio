import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
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
    return api.post(`/items`, formData, config);
}
export const getAllItems = () => api.get(`/items`);
export const searchItems = payload => api.post(`/items/search`, payload);
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

    return api.put(`/items/${id}`, formData, config);
}
export const deleteItemById = id => api.delete(`/items/${id}`, {withCredentials: true});
export const getItemById = id => api.get(`/items/${id}`);

export const getReviewById = (item_id, id) => api.get(`/items/${item_id}/reviews/${id}`);
export const insertReview = (item_id, payload) => api.post(`/items/${item_id}/reviews`, payload, {withCredentials: true});
export const deleteReviewById = (item_id, id) => api.delete(`/items/${item_id}/reviews/${id}`, {withCredentials: true});

export const createUserAccount = payload => api.post(`/users`, payload);
export const getUserData = (/*userID and Email should be attached during authentication*/) => api.get(`/users`, {withCredentials: true});
export const authUser = payload => api.post(`/users/authenticate`, payload, {withCredentials: true});
export const logUserOut = () => api.delete(`/users/authenticate`, {withCredentials: true});
export const refreshUserToken = () => api.put(`/users/authenticate`, {/*The payload is the credentials*/}, {withCredentials: true});

export const createPost = payload => api.post(`/frontpage`, payload, {withCredentials: true});
export const editPost = (id, payload) => api.put(`/frontpage/${id}`, payload, {withCredentials: true});
export const deletePost = id => api.delete(`/frontpage/${id}`, {withCredentials: true});
export const getPostById = id => api.get(`/frontpage/${id}`);
export const getPosts = () => api.get(`/frontpage`);
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

    return api.post(`/frontpage/media`, formData, config);
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