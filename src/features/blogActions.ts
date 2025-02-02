// import axios from "axios";
import api from "../axios";
import { createAsyncThunk, createAction } from "@reduxjs/toolkit";

const url = "https://kuri-backend-ub77.onrender.com";

// Define types for the data being passed in each thunk
interface CreateBlogData {
  title: string;
  content: string;
  thumbnail?: string;
  isPublished?: boolean;
}

interface SearchFilterParams {
  search: string;
  limit: number;
  page: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
  isPublished?: boolean;
}

interface UpdateBlogData {
  _id: string;
  formData: FormData;
}

interface GetBlogData {
  _id: string;
}

// Create Blog
export const CreateBlog = createAsyncThunk(
  "blog/create",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/blogs`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log(response, "response from redux");
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(error.response?.data);
    }
  }
);

// Search & Filter Blogs
export const SearchFilterBlogs = createAsyncThunk(
  "blog/searchFilter",
  async (params: SearchFilterParams, { rejectWithValue }) => {
    try {
      const { search, limit, page, startDate, endDate, sort, isPublished } =
        params;
      const response = await api.get(`/blogs`, {
        params: {
          search,
          limit,
          page,
          startDate,
          endDate,
          sort,
          isPublished,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Update blog
export const UpdateBlog = createAsyncThunk(
  "blog/update",
  async ({ formData, _id }: UpdateBlogData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/blogs/${_id}`, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Get Single Blog
export const GetBlog = createAsyncThunk(
  "blog/get",
  async (data: GetBlogData, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blogs/${data._id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);

// Delete Blog
export const DeleteBlog = createAsyncThunk(
  "blog/delete",
  async (data: GetBlogData, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/blogs/${data._id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data);
    }
  }
);
