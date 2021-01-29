import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const insertItem = payload => {
    /* Because this request is handled using the multer middleware
     * we need to repackage the contents into a multipart form
     */
    const {thumbnail, galleryImages, body} = payload;
    const formData = new FormData();
    formData.append('selectedThumbnail', thumbnail.file);
    
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
    return api.post(`/item`, formData, config);
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

    return api.put(`/item/${id}`, formData, config);
}
export const deleteItemById = id => api.delete(`/item/${id}`, {withCredentials: true});
export const getItemById = id => api.get(`/item/${id}`);

export const getReviewById = id => api.get(`/review/${id}`);
export const insertReview = payload => api.post(`/review`, payload, {withCredentials: true});
export const deleteReviewById = id => api.delete(`/review/${id}`, {withCredentials: true});

export const createUserAccount = payload => api.post(`/users`, payload);
export const getUserData = (/*userID and Email should be attached during authentication*/) => api.get(`/users`, {withCredentials: true});
export const authUser = payload => api.post(`/authenticate`, payload, {withCredentials: true});
export const logUserOut = () => api.delete(`/authenticate`, {withCredentials: true});
export const refreshUserToken = () => api.put(`/authenticate`, {/*The payload is the credentials*/}, {withCredentials: true});

export const getMediaById = id => api.get(`/media/${id}`);

export const createPost = payload => api.post(`/posts`, payload, {withCredentials: true});
export const editPost = (id, payload) => api.put(`/posts/${id}`, payload, {withCredentials: true});
export const deletePost = id => api.delete(`/posts/${id}`, {withCredentials: true});
export const getPostById = id => api.get(`/posts/${id}`);
export const getPosts = () => api.get(`/posts`);

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

    getMediaById,

    createPost,
    editPost,
    deletePost,
    getPostById,
    getPosts,
}

export default apis;