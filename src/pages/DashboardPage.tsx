import { useEffect } from "react";
import { FileText, Edit, Archive, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../features/store";
import { SearchFilterBlogs } from "../features/blogActions";
import { Link } from "react-router-dom";

export function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, totalBlogs } = useSelector((state: RootState) => state.blog);

  useEffect(() => {
    const searchParams = {
      search: "",
      limit: 10,
      page: 1,
      startDate: "",
      endDate: "",
      sort: "createdAt",
    };
    dispatch(SearchFilterBlogs(searchParams));
  }, [dispatch]);

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1">Here`s what`s happening with your content today.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm w-fit">
          <Calendar className="w-4 h-4 text-primary-600" />
          <span className="font-medium">{new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Content Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-blue-400 to-blue-600 rounded-r-2xl opacity-80"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Content</p>
              <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{totalBlogs}</h3>
              <p className="text-xs text-blue-600 mt-2 font-medium flex items-center gap-1 bg-blue-50 w-fit px-2 py-1 rounded-md">
                <TrendingUp className="w-3 h-3" /> All time
              </p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-blue-100">
              <FileText className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>

        {/* Drafts Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-r-2xl opacity-80"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Drafts</p>
              <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{draftBlogs}</h3>
              <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1 bg-amber-50 w-fit px-2 py-1 rounded-md">
                Pending review
              </p>
            </div>
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-amber-100">
              <Edit className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-amber-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>

        {/* Published Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group relative overflow-hidden">
          <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-primary-400 to-primary-600 rounded-r-2xl opacity-80"></div>
          <div className="flex items-start justify-between relative z-10">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Published</p>
              <h3 className="text-4xl font-extrabold text-gray-900 tracking-tight">{publishedBlogs}</h3>
              <p className="text-xs text-primary-600 mt-2 font-medium flex items-center gap-1 bg-primary-50 w-fit px-2 py-1 rounded-md">
                Live content
              </p>
            </div>
            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm group-hover:shadow-primary-100">
              <Archive className="h-6 w-6" />
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Recent Updates</h2>
            <p className="text-sm text-gray-500">Latest activity on your blogs and news</p>
          </div>
          <Link to="/blogs" className="group flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-4 py-2 rounded-lg transition-all">
            View All <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="divide-y divide-gray-100">
          {recentBlogs.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">No recent activity</h3>
              <p className="text-gray-500 mt-1">Get started by creating your first blog post.</p>
            </div>
          ) : (
            recentBlogs.map((blog) => (
              <div
                key={blog._id}
                className="p-4 hover:bg-gray-50/50 transition-colors grid grid-cols-1 md:grid-cols-12 gap-4 items-center group"
              >
                <div className="md:col-span-6">
                  <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-primary-700 transition-colors cursor-pointer">
                    {blog.lang.english.title || "Untitled Blog"}
                  </h3>
                  <div className="flex items-center gap-3 mt-1.5">
                     <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-0.5 rounded-full">
                        <Calendar className="w-3 h-3" />
                        {formatDate(blog.created)}
                     </span>
                     <span className="text-xs text-gray-400">By {blog.author?.email || "Unknown"}</span>
                  </div>
                </div>
                
                <div className="md:col-span-3">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 uppercase tracking-wide">
                    {blog.category}
                  </span>
                </div>
                
                <div className="md:col-span-3 text-right">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      blog.isPublished
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${blog.isPublished ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
                    {blog.isPublished ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
