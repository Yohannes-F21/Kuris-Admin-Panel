import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { DeleteConfirmationModal } from "../components/blog/DeleteConfirmationModal";
import toast from "react-hot-toast";
import { DeleteBlog, SearchFilterBlogs } from "../features/blogActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../features/store";

// export const loader = async (): Promise<{ blogs: Blog }> => {
//   const response = await axios({
//     baseURL: "https://kuri-backend-ub77.onrender.com",
//     url: "/blogs",
//     method: "GET",
//   });
//   // console.log(response);
//   const blogs = response.data.blogs;
//   console.log(blogs);

//   return { blogs };
// };

// interface SearchFilterParams {
//   search: string;
//   limit: number;
//   page: number;
//   isPublished?: boolean;
//   sort?: string;
//   startDate?: string;
//   endDate?: string;
// }

export function BlogListPage() {
  const navigate = useNavigate();
  // const { blogs } = useLoaderData();
  // console.log(blogs);
  // const dispatch = useAppDispatch();
  const dispatch = useDispatch<AppDispatch>();
  // const { blogs, loading, error, totalBlogs, currentPage } = useSelector(
  //   (state: RootState) => state.blog
  // );
  const { blogs, totalBlogs, currentPage } = useSelector(
    (state: RootState) => state.blog
  );
  console.log(blogs);

  // const fetchBlogs = async ({
  //   search,
  //   limit,
  //   page,
  //   isPublished,
  //   sort,
  //   startDate,
  //   endDate,
  // }: SearchFilterParams) => {
  //   dispatch(
  //     SearchFilterBlogs({
  //       search,
  //       limit,
  //       page,
  //       isPublished,
  //       sort,
  //       startDate,
  //       endDate,
  //     })
  //   ).then((response) => {
  //     console.log(response);
  //   });
  // };
  const [searchParams, setSearchParams] = useState({
    search: "",
    limit: 10,
    page: 1,
    startDate: "",
    endDate: "",
    sort: "createdAt", // Default sorting by creation date
    isPublished: false,
    // Default to published blogs
  });

  //Fetch all blogs on component mount
  // Fetch all blogs on component mount
  useEffect(() => {
    dispatch(SearchFilterBlogs(searchParams));
  }, [dispatch, searchParams]); // Add `searchParams` as a dependency

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({ ...prev, [name]: value }));
  };

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
    dispatch(DeleteBlog({ _id: id })).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Blog deleted successfully!");
        setSearchParams((prev) => ({ ...prev, page: 1 })); // Reset to page 1 after deletion
      } else {
        toast.error("Failed to delete blog");
      }
    });

    setIsDeleteModalOpen(false);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button size="sm" onClick={() => navigate("/new-blog")}>
          Create New Blog
        </Button>
      </div>
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-4  mb-5 ">
          <div className="relative">
            <div className="mb-4  flex flex-col md:flex-row md:items-center md:justify-between md:space-x-4">
              <input
                type="text"
                name="search"
                placeholder="Search blogs..."
                value={searchParams.search}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded-md w-full"
              />
              <select
                name="sort"
                value={searchParams.sort}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded-md w-full"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="title">Sort by Title</option>
              </select>
              <select
                name="isPublished"
                value={searchParams.isPublished.toString()}
                onChange={handleChange}
                className="border border-gray-300 px-3 py-2 rounded-md w-full"
              >
                <option value="true">Published</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-4 font-medium">Title</th>
                <th className="text-left p-4 font-medium">Author</th>
                {/* <th className="text-left p-4 font-medium">Category</th> */}
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-right p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-b last:border-0">
                  <td className="p-4">{blog.title}</td>
                  <td className="p-4">{blog.author.email}</td>
                  {/* <td className="p-4">Health</td> */}
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        blog.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-600"
                      }`}
                    >
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mr-2"
                      onClick={() => handleEdit(blog._id)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(blog._id, blog.title)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Page {currentPage} of {Math.ceil(totalBlogs / searchParams.limit)}
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSearchParams((prev) => ({
                    ...prev,
                    page: Math.max(prev.page - 1, 1), // Ensure page doesn't go below 1
                  }))
                }
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSearchParams((prev) => ({
                    ...prev,
                    page: prev.page + 1,
                  }))
                }
                disabled={
                  currentPage >= Math.ceil(totalBlogs / searchParams.limit)
                }
              >
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
