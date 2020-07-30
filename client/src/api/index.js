import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const insertItem = payload => api.post(`/item`, payload);
export const getAllItems = () => api.get(`/items`);
export const updateItemById = (id, payload) => api.put(`/item/${id}`, payload);
export const deleteItemById = id => api.delete(`/item/${id}`);
export const getItemById = id => api.get(`/item/${id}`);

export const getReviewById = id => api.get(`/review/${id}`);
export const insertReview = payload => api.post(`/review`, payload);
export const deleteReviewById = id => api.delete(`/review/${id}`);

export const createUserAccount = payload => api.post(`/users`, payload);
export const getUserData = (/*userID and Email should be attached during authentication*/) => api.get(`/users`);
export const authUser = payload => api.post(`/authenticate`, payload);


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
}

export default apis;