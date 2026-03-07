// import axios from "axios";
import api from "../axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getErrorMessage = (error: any) => {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  return error?.message ?? "Request failed";
};

const toRejectedPayload = (error: any) => ({
  message: getErrorMessage(error),
  raw: error?.response?.data,
});

// Define types for the data being passed in each thunk
// interface CreateBlogData {
//   title: string;
//   content: string;
//   thumbnail?: string;
//   isPublished?: boolean;
// }

interface SearchFilterParams {
  search: string;
  limit: number;
  page: number;
  startDate?: string;
  endDate?: string;
  sort?: string;
  isPublished?: boolean;
  category?: string;
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// Search & Filter Blogs
export const SearchFilterBlogs = createAsyncThunk(
  "blog/searchFilter",
  async (params: SearchFilterParams, { rejectWithValue }) => {
    try {
      const {
        search,
        limit,
        page,
        startDate,
        endDate,
        sort,
        isPublished,
        category,
      } = params;
      const response = await api.get(`/blogs`, {
        params: {
          search,
          limit,
          page,
          startDate,
          endDate,
          sort,
          isPublished,
          category,
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// Update blog
export const UpdateBlog = createAsyncThunk(
  "blog/update",
  async ({ formData, _id }: UpdateBlogData, { rejectWithValue }) => {
    try {
      const response = await api.put(`/blogs/${_id}`, formData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// Get Single Blog
export const GetBlog = createAsyncThunk(
  "blog/get",
  async (data: GetBlogData, { rejectWithValue }) => {
    try {
      const response = await api.get(`/blogs/${data._id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);

// Delete Blog
export const DeleteBlog = createAsyncThunk(
  "blog/delete",
  async (data: GetBlogData, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/blogs/${data._id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(toRejectedPayload(error));
    }
  },
);
