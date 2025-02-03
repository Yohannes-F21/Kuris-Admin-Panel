import { useEffect } from "react";
import { FileText, Edit, Archive } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../features/store";
import { SearchFilterBlogs } from "../features/blogActions";
export function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, totalBlogs } = useSelector((state: RootState) => state.blog);
  // const [searchParams, setSearchParams] = useState({
  //   search: "",
  //   limit: 10,
  //   page: 1,
  //   startDate: "",
  //   endDate: "",
  //   sort: "createdAt", // Default sorting by creation date

  //   // Default to published blogs
  // });

  const searchParams = {
    search: "",
    limit: 10,
    page: 1,
    startDate: "",
    endDate: "",
    sort: "createdAt",
  };

  //Fetch all blogs on component mount

  useEffect(() => {
    dispatch(SearchFilterBlogs(searchParams));
  }, [dispatch, searchParams]); // Add `searchParams` as a dependency

  console.log(blogs);

  const draftBlogs = blogs.filter((blog) => !blog.isPublished).length;
  const publishedBlogs = blogs.filter((blog) => blog.isPublished).length;

  const recentBlogs = [...blogs]
    .sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    )
    .slice(0, 5);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold">{totalBlogs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <Edit className="h-8 w-8 text-yellow-500" />
            <div>
              <p className="text-sm text-gray-600">Draft Blogs</p>
              <p className="text-2xl font-bold">{draftBlogs}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <Archive className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm text-gray-600">Published Blogs</p>
              <p className="text-2xl font-bold">{publishedBlogs}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Blogs</h2>
        <div className="space-y-4">
          <div>
            {recentBlogs.length === 0 ? (
              <p className="text-gray-500 text-center">
                No recent blogs available.
              </p>
            ) : (
              recentBlogs.map((blog) => (
                <div
                  key={blog._id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div>
                    <h3 className="font-medium">{blog.title}</h3>
                    <p className="text-sm text-gray-500">
                      <span>{blog.isPublished ? "Published" : "Draft"}</span>{" "}
                      {formatDate(blog.created)}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      blog.isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
