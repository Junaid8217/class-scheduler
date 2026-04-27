import axios from 'axios';

const API = axios.create({
  baseURL: 'https://class-scheduler-backend.vercel.app/api'
});

export const getSlots    = ()     => API.get('/slots');
export const createSlot  = (data) => API.post('/slots', data);
export const bookSlot    = (data) => API.post('/bookings', data);
export const getBookings = ()     => API.get('/bookings');
export const deleteSlot  = (id)   => API.delete(`/slots/${id}`);

