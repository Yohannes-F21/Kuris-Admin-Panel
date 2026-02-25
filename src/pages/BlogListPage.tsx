import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Trash2, Search, Filter, Plus, FileText } from "lucide-react";
import { Button } from "../components/ui/Button";
import { DeleteConfirmationModal } from "../components/blog/DeleteConfirmationModal";
import toast from "react-hot-toast";
import { DeleteBlog, SearchFilterBlogs } from "../features/blogActions";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../features/store";
import { Input } from "../components/ui/Input";

export function BlogListPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, totalBlogs } = useSelector((state: RootState) => state.blog);

  const [searchParams, setSearchParams] = useState({
    search: "",
    limit: 10,
    page: 1,
    startDate: "",
    endDate: "",
    sort: "createdAt",
    isPublished: undefined as boolean | undefined,
    category: "",
  });

  useEffect(() => {
    dispatch(SearchFilterBlogs(searchParams));
  }, [dispatch, searchParams]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]:
        name === "isPublished"
          ? value === "all"
            ? undefined
            : value === "true"
          : name === "category"
            ? value === "all"
              ? ""
              : value
            : value,
    }));
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-blog/${id}`);
  };

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<{
    id: string;
    title: string;
    category: string;
  } | null>(null);

  const handleDelete = (id: any, title: any, category: any) => {
    setSelectedBlog({ id, title, category });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteModal = (id: any) => {
    const currentCategory = selectedBlog?.category;
    dispatch(DeleteBlog({ _id: id })).then((response) => {
      if (response.meta.requestStatus === "fulfilled") {
        toast.success(
          `${currentCategory === "blog" ? "Blog" : "News"} deleted successfully!`,
        );
        setSearchParams((prev) => ({ ...prev, page: 1 }));
      } else {
        toast.error(
          `Failed to delete ${currentCategory === "blog" ? "Blog" : "News"}`,
        );
      }
    });

    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Content Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage, edit, and publish your blogs and news.
          </p>
        </div>
        <Button
          size="lg"
          onClick={() => navigate("/new-blog")}
          className="shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus className="w-5 h-5 mr-2" /> Create New
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters Section */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/30">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative group">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
              <Input
                name="search"
                placeholder="Search by title..."
                value={searchParams.search}
                onChange={handleChange}
                className="pl-10 h-11 bg-white"
              />
            </div>

            <div className="relative">
              <select
                name="category"
                value={
                  searchParams.category === "" ? "all" : searchParams.category
                }
                onChange={handleChange}
                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer appearance-none"
              >
                <option value="all">All Categories</option>
                <option value="blog">Blogs</option>
                <option value="news">News</option>
              </select>
              <Filter className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                name="isPublished"
                value={
                  searchParams.isPublished === undefined
                    ? "all"
                    : searchParams.isPublished.toString()
                }
                onChange={handleChange}
                className="w-full h-11 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all cursor-pointer appearance-none"
              >
                <option value="all">All Status</option>
                <option value="true">Published</option>
                <option value="false">Drafts</option>
              </select>
              <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-gray-300 pointer-events-none"></div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-right py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p>No content found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="group hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="max-w-xs md:max-w-md">
                          <p className="font-medium text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors">
                            {blog.lang.english.title || "Untitled"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-xs font-bold text-primary-700 uppercase">
                          {blog.author?.email?.[0] || "U"}
                        </div>
                        <span className="text-sm text-gray-500 truncate max-w-[150px]">
                          {blog.author?.email || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wide">
                        {blog.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          blog.isPublished
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${blog.isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                        ></span>
                        {blog.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2 ">
                        <Button
                          variant="ghost"
                          size="sm"
                          className=" p-0 text-gray-400 hover:text-blue-600 hover:bg-blue-50"
                          onClick={() => handleEdit(blog._id)}
                          title="Edit"
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className=" p-0 text-gray-400 hover:text-red-600 hover:bg-red-50"
                          onClick={() =>
                            handleDelete(
                              blog._id,
                              blog.lang.english.title,
                              blog.category,
                            )
                          }
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination could go here */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30 text-xs text-gray-400 text-center">
          Showing {blogs.length} of {totalBlogs} results
        </div>
      </div>

      {isDeleteModalOpen && selectedBlog && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => handleDeleteModal(selectedBlog.id)}
          title={selectedBlog.title}
          category={selectedBlog.category}
        />
      )}
    </div>
  );
}
