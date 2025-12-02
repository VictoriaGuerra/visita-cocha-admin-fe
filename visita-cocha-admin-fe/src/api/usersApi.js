// API para usuarios
import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

export const getUsers = async () => {
  const res = await axios.get(`${API_URL}/user`);
  return res.data;
};

export const getUser = async (id) => {
  const res = await axios.get(`${API_URL}/user/${id}`);
  return res.data;
};

export const createUser = async (user) => {
  const res = await axios.post(`${API_URL}/user`, user);
  return res.data;
};

export const updateUser = async (id, user) => {
  const res = await axios.put(`${API_URL}/user/${id}`, user);
  return res.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${API_URL}/user/${id}`);
};
