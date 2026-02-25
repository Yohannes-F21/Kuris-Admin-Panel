import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Save } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";
import { useAppDispatch } from "../features/hooks";
import { CreateBlog } from "../features/blogActions";
import { Dropdown } from "../components/Dropdown";

export function BlogCreatorPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    lang: {
      english: { title: "", content: "" },
      amharic: { title: "", content: "" },
    },
    category: "",
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");

  const contentType = [
    { value: "news", label: "News" },
    { value: "blog", label: "Blog" },
  ];

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => setThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDropdownValue = (value: string) => {
    setCurrentCategory(value);
    console.log(value);
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSave = async (isDraft: boolean) => {
    const englishTitle = formData.lang.english.title.trim();
    const englishContent = formData.lang.english.content.trim();
    const amharicTitle = formData.lang.amharic.title.trim();
    const amharicContent = formData.lang.amharic.content.trim();
    const category = formData.category.trim();

    if (!category) {
      toast.error("Please select a category.");
      return;
    }
    if (!englishTitle || !englishContent || !amharicTitle || !amharicContent) {
      toast.error("Please fill in all title and content fields.");
      return;
    }
    if (!thumbnail) {
      toast.error("Please upload a featured image.");
      return;
    }

    setLoading(true);
    const blogData = new FormData();
    blogData.append("lang[english][title]", englishTitle);
    blogData.append("lang[english][content]", englishContent);
    blogData.append("lang[amharic][title]", amharicTitle);
    blogData.append("lang[amharic][content]", amharicContent);
    blogData.append("category", category);
    blogData.append("isPublished", (!isDraft).toString());
    blogData.append("thumbnail", thumbnail);

    try {
      const response = await dispatch(CreateBlog(blogData));
      if (response.meta.requestStatus === "fulfilled") {
        setLoading(false);
        toast.success(
          `${currentCategory === "blog" ? "Blog" : "News"} ${
            isDraft ? "saved as draft" : "published"
          } successfully!`,
        );
        navigate("/blogs");
      } else {
        setLoading(false);
        toast.error(
          `Failed to save ${currentCategory === "blog" ? "Blog" : "News"}`,
        );
      }
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="space-y-6 h-screen">
      <div className="flex-row gap-5 md:flex justify-end items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/blogs")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg md:text-2xl font-bold">
            Create New Blog/News
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleSave(true)}
          >
            Save as Draft
          </Button>
          <Button disabled={loading} onClick={() => handleSave(false)}>
            <Save className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
      <Dropdown
        dropdownValue={handleDropdownValue}
        dropdownContent={contentType}
      ></Dropdown>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Input
            placeholder="Blog Title (English)"
            value={formData.lang.english.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                lang: {
                  ...formData.lang,
                  english: { ...formData.lang.english, title: e.target.value },
                },
              })
            }
            className="text-2xl font-semibold"
          />
          <ReactQuill
            value={formData.lang.english.content}
            onChange={(content) =>
              setFormData({
                ...formData,
                lang: {
                  ...formData.lang,
                  english: { ...formData.lang.english, content },
                },
              })
            }
            theme="snow"
          />
          <Input
            placeholder="Blog Title (Amharic)"
            value={formData.lang.amharic.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                lang: {
                  ...formData.lang,
                  amharic: { ...formData.lang.amharic, title: e.target.value },
                },
              })
            }
            className="text-2xl font-semibold mt-10"
          />
          <div className="prose max-w-none">
            <ReactQuill
              value={formData.lang.amharic.content}
              onChange={(content) =>
                setFormData({
                  ...formData,
                  lang: {
                    ...formData.lang,
                    amharic: { ...formData.lang.amharic, content },
                  },
                })
              }
              theme="snow"
            />
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <h3 className="text-lg font-semibold mb-4">Blog Settings</h3>
            <div>
              <label className="block text-sm font-medium mb-2">
                Featured Image
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                {thumbnailPreview ? (
                  <div className="relative">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setThumbnail(null);
                        setThumbnailPreview("");
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleThumbnailChange}
                    />
                    <div className="space-y-2">
                      <Image className="mx-auto h-12 w-12 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload image
                      </span>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
