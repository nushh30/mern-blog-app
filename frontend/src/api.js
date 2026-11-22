import axios from 'axios';

// Base API configuration (configurable for local Docker, Vite dev proxy, or Cloud Run URL)
const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// TanStack Query Query & Mutation Fetcher Functions
export const fetchPosts = async ({ category, search }) => {
  const params = {};
  if (category && category !== 'All') params.category = category;
  if (search) params.search = search;
  
  const { data } = await apiClient.get('/posts', { params });
  return data.data;
};

export const fetchPostById = async (id) => {
  const { data } = await apiClient.get(`/posts/${id}`);
  return data.data;
};

export const createPost = async (newPost) => {
  const { data } = await apiClient.post('/posts', newPost);
  return data.data;
};

export const updatePost = async ({ id, ...updatedPost }) => {
  const { data } = await apiClient.put(`/posts/${id}`, updatedPost);
  return data.data;
};

export const deletePost = async (id) => {
  const { data } = await apiClient.delete(`/posts/${id}`);
  return data;
};
