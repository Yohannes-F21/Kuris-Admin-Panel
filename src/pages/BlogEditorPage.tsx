import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Image, Save } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import toast from "react-hot-toast";
const categories = [
  "Pregnancy",
  "Postpartum",
  "Baby Health",
  "Mental Health",
  "Nutrition",
  "Exercise",
];
export function BlogEditorPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
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
  const handleSave = (isDraft: boolean) => {
    // In a real app, this would save to your backend
    toast.success(
      `Blog ${isDraft ? "saved as draft" : "published"} successfully!`
    );
    navigate("/blogs");
  };
  return (
    <div className="space-y-6">
      <div className="flex-row gap-5 md:flex justify-end items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/blogs")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-lg md:text-2xl font-bold">Create New Blog</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => handleSave(true)}>
            Save as Draft
          </Button>
          <Button onClick={() => handleSave(false)}>
            <Save className="w-4 h-4 mr-2" />
            {isEditing ? "Update" : "Publish"}
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
          <div className="prose max-w-none">
            <ReactQuill
              value={content}
              onChange={setContent}
              className="h-[500px] mb-12"
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
                  ["link", "image", "blockquote", "code-block"],
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
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Blog Settings</h3>
              <Select
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Select>
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
