import React, { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Search, Edit2, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { DeleteConfirmationModal } from "../components/blog/DeleteConfirmationModal";
import toast from "react-hot-toast";
import axios from "axios";
import { Blog } from "../types";

export const loader = async (): Promise<{ blogs: Blog }> => {
  const response = await axios({
    baseURL: "https://kuri-backend-ub77.onrender.com",
    url: "/blogs",
    method: "GET",
  });
  console.log(response);
  const blogs = response.data.blogs;
  console.log(blogs);

  return { blogs };
};
export function BlogListPage() {
  const navigate = useNavigate();
  const { blogs } = useLoaderData();
  console.log(blogs);

  const handleEdit = (id: string) => {
    navigate(`/edit-blog/${id}`);
  };
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const handleDelete = (id: any, title: any) => {
    setSelectedBlog({ id, title });
    setIsDeleteModalOpen(true);

    // In a real app, this would delete from your backend
  };
  const handleDeleteModal = (id: any) => {
    toast.success("Blog deleted successfully!");
    setIsDeleteModalOpen(false);
  };
  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Blogs</h1>
        <Button
          size='sm'
          onClick={() => navigate("/blogs/new")}>
          Create New Blog
        </Button>
      </div>
      <div className='bg-white rounded-lg shadow-sm'>
        <div className='p-4 border-b'>
          <div className='relative'>
            <Search className='absolute left-3 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              placeholder='Search blogs...'
              className='pl-9'
            />
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b bg-gray-50'>
                <th className='text-left p-4 font-medium'>Title</th>
                <th className='text-left p-4 font-medium'>Author</th>
                {/* <th className="text-left p-4 font-medium">Category</th> */}
                <th className='text-left p-4 font-medium'>Status</th>
                <th className='text-right p-4 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog: Blog) => (
                <tr
                  key={blog._id}
                  className='border-b last:border-0'>
                  <td className='p-4'>{blog.title}</td>
                  <td className='p-4'>{blog.author.email}</td>
                  {/* <td className="p-4">Health</td> */}
                  <td className='p-4'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-600"
                      }`}>
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className='p-4 text-right'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='mr-2'
                      onClick={() => handleEdit(blog._id)}>
                      <Edit2 className='h-4 w-4' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => handleDelete(blog._id, blog.title)}>
                      <Trash2 className='h-4 w-4 text-red-500' />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='p-4 border-t'>
          <div className='flex items-center justify-between'>
            <p className='text-sm text-gray-500'>Showing 1 to 3 of 3 results</p>
            <div className='flex items-center space-x-2'>
              <Button
                variant='outline'
                size='sm'
                disabled>
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                disabled>
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => handleDeleteModal(selectedBlog?.id)}
        blogTitle={selectedBlog?.title || ""}
      />
    </div>
  );
}
