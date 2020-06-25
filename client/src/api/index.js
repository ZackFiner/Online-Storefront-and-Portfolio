import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
});

export const insertItem = payload => api.post(`/item`, payload);
export const getAllItems = () => api.get(`/items`);
export const updateItemById = (id, payload) => api.put(`/item/${id}`, payload);
export const deleteItemById = id => api.delete(`/item/${id}`);
export const getItemById = id => api.get(`/item/${id}`);

const apis = {
    insertItem,
    getAllItems,
    updateItemById,
    updateItemById,
    deleteItemById,
    getItemById,
}

export default apis;