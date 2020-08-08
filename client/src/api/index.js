import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const insertItem = payload => {
    /* Because this request is handled using the multer middleware
     * we need to repackage the contents into a multipart form
     */
    const formData = new FormData();
    formData.append('selectedThumbnail', payload.file);
    formData.append('body', JSON.stringify(payload.body));
    const config = {
        headers: {
            'content-type': 'multipart/form-data',
        }
    }
    return api.post(`/item`, formData, config);
}
export const getAllItems = () => api.get(`/items`);
export const updateItemById = (id, payload) => api.put(`/item/${id}`, payload);
export const deleteItemById = id => api.delete(`/item/${id}`);
export const getItemById = id => api.get(`/item/${id}`);

export const getReviewById = id => api.get(`/review/${id}`);
export const insertReview = payload => api.post(`/review`, payload);
export const deleteReviewById = id => api.delete(`/review/${id}`);

export const createUserAccount = payload => api.post(`/users`, payload);
export const getUserData = (/*userID and Email should be attached during authentication*/) => api.get(`/users`, {withCredentials: true});
export const authUser = payload => api.post(`/authenticate`, payload, {withCredentials: true});
export const logUserOut = () => api.delete(`/authenticate`);

export const getMediaById = id => api.get(`/media/${id}`);

const apis = {
    insertItem,
    getAllItems,
    updateItemById,
    updateItemById,
    deleteItemById,
    getItemById,

    getReviewById,
    insertReview,
    deleteReviewById,

    createUserAccount,
    getUserData,
    authUser,
    logUserOut,

    getMediaById,
}

export default apis;