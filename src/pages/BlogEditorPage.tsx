import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image, Save } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";
import { useAppDispatch } from "../features/hooks";
import { UpdateBlog, GetBlog } from "../features/blogActions";
import { Dropdown } from "../components/Dropdown";

export function BlogEditorPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();

  // Unified state structure
  const [formData, setFormData] = useState({
    lang: {
      english: { title: "", content: "" },
      amharic: { title: "", content: "" },
    },
    category: "",
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [picturePreview, setPicturePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string>("");
  const contentType = [
    { value: "news", label: "News" },
    { value: "blog", label: "Blog" },
  ];

  // Fetch blog data on component mount
  useEffect(() => {
    if (id) {
      dispatch(GetBlog({ _id: id })).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          const { blog } = response.payload;
          setFormData({
            lang: {
              english: {
                title: blog.lang?.english?.title || "",
                content: blog.lang?.english?.content || "",
              },
              amharic: {
                title: blog.lang?.amharic?.title || "",
                content: blog.lang?.amharic?.content || "",
              },
            },
            category: blog.category || "",
          });
          setPicturePreview(
            blog.thumbnail || "https://placehold.co/600x400?text=Cover+Image"
          );
        } else {
          toast.error(
            `Failed to fetch ${
              currentCategory === "blog" ? "Blog" : "News"
            } data`
          );
        }
      });
    }
  }, [id, dispatch]);
  const handleDropdownValue = (value: string) => {
    setCurrentCategory(value);
    console.log(value);
    setFormData({ ...formData, category: value });
  };

  // Handle thumbnail upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPicturePreview(""); // Clear existing thumbnail
      setThumbnail(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string); // Set the new preview URL
      };
      reader.onerror = () => {
        console.error("Error reading file");
        toast.error("Failed to load image preview.");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplaceImage = () => {
    setPicturePreview(""); // Clear existing thumbnail
    setThumbnailPreview(""); // Clear any existing preview
    fileInputRef.current?.click(); // Trigger the file input
  };

  // Save draft or publish blog
  const handleSave = async (isDraft: boolean) => {
    setLoading(true);

    const formDataToSend = new FormData();
    formDataToSend.append("lang[english][title]", formData.lang.english.title);
    formDataToSend.append(
      "lang[english][content]",
      formData.lang.english.content
    );
    formDataToSend.append("lang[amharic][title]", formData.lang.amharic.title);
    formDataToSend.append(
      "lang[amharic][content]",
      formData.lang.amharic.content
    );
    formDataToSend.append("category", formData.category);
    formDataToSend.append("isPublished", (!isDraft).toString());
    if (thumbnail) formDataToSend.append("thumbnail", thumbnail);

    try {
      if (id) {
        const response = await dispatch(
          UpdateBlog({ formData: formDataToSend, _id: id })
        );
        if (response.meta.requestStatus === "fulfilled") {
          toast.success(
            `${currentCategory === "blog" ? "Blog" : "News"} ${
              isDraft ? "saved as draft" : "published"
            } successfully!`
          );
          navigate("/blogs");
        } else {
          toast.error(
            `Failed to save ${currentCategory === "blog" ? "Blog" : "News"}`
          );
        }
      } else {
        toast.error(
          `${currentCategory === "blog" ? "Blog" : "News"} ID is missing.`
        );
      }
    } catch (error) {
      console.error(
        `Error saving ${currentCategory === "blog" ? "Blog" : "News"}:`,
        error
      );
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 h-screen">
      {/* Header */}
      <div className="flex-row gap-5 md:flex justify-end items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/blogs")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg md:text-2xl font-bold">Edit Blog</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            disabled={loading}
            onClick={() => handleSave(true)}
          >
            {loading ? "Saving Draft..." : "Save as Draft"}
          </Button>
          <Button disabled={loading} onClick={() => handleSave(false)}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>
      <Dropdown
        dropdownValue={handleDropdownValue}
        dropdownContent={contentType}
      ></Dropdown>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Editor Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* English Title */}
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

          {/* English Content */}
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

          {/* Amharic Title */}
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
            className="text-2xl font-semibold"
          />

          {/* Amharic Content */}
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

        {/* Thumbnail Section */}
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
                ) : picturePreview ? (
                  <div className="space-y-2">
                    <img
                      src={picturePreview}
                      alt="Existing thumbnail"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleReplaceImage} // Trigger the file input
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      ref={fileInputRef} // Attach the ref here
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
