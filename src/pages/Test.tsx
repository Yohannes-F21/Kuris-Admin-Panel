import React, { useEffect, useState } from "react";
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
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const contentType = [
    { value: "news", label: "News" },
    { value: "blog", label: "Blog" },
  ];

  const contentLanguage = [
    { value: "en", label: "English" },
    { value: "am", label: "አማርኛ" },
  ];

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    const savedContent = localStorage.getItem("blogContent");
    if (savedContent) {
      const { title, content, thumbnailPreview } = JSON.parse(savedContent);
      setTitle(title);
      setContent(content);
      setThumbnailPreview(thumbnailPreview);
    }
    return () => {
      localStorage.removeItem("blogContent");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      localStorage.setItem(
        "blogContent",
        JSON.stringify({ title, content, thumbnailPreview })
      );
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [title, content, thumbnailPreview]);

  const handleSave = async (isDraft: boolean) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("isPublished", (!isDraft).toString());
    console.log(formData.get("thumbnail"), "formData");

    try {
      const response = await dispatch(CreateBlog(formData));
      if (response.meta.requestStatus === "fulfilled") {
        setLoading(false);
        toast.success(
          `Blog ${isDraft ? "saved as draft" : "published"} successfully!`
        );
        navigate("/blogs");
      } else {
        setLoading(false);
        toast.error("Failed to save blog");
      }
    } catch (error) {
      setLoading(false);
      toast.error("An unexpected error occurred.");
    }
  };
  const handleDropdownValue = (data: string) => {
    console.log(data);
  };

  return (
    <div className="space-y-6 h-screen">
      <div className="flex-row gap-5 md:flex justify-end items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/blogs")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg md:text-2xl font-bold">Create New Blog</h1>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Input
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-2xl font-semibold"
          />
          <div className="flex gap-4">
            <Dropdown
              dropdownValue={handleDropdownValue}
              dropdownContent={contentType}
            ></Dropdown>
            <Dropdown
              dropdownValue={handleDropdownValue}
              dropdownContent={contentLanguage}
            ></Dropdown>
          </div>
          <div className="prose max-w-none ">
            <div className="h-[500px] mb-12">
              <div style={{ height: "500px" }}>
                <ReactQuill
                  value={content}
                  onChange={setContent}
                  // style={{ height: "500px" }}
                  theme="snow"
                  modules={{
                    toolbar: [
                      [
                        {
                          header: [1, 2, 3, false],
                        },
                      ],
                      ["bold", "italic", "underline", "strike"],
                      [
                        {
                          list: "ordered",
                        },
                        {
                          list: "bullet",
                        },
                      ],
                      ["link", "blockquote", "code-block"],
                      [
                        {
                          color: [],
                        },
                        {
                          background: [],
                        },
                      ],
                      ["clean"],
                    ],
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Blog Settings</h3>
            </div>
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
