import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Image, Save } from "lucide-react";
import ReactQuill from "react-quill";

import "react-quill/dist/quill.snow.css";
// import "~/react-quill/dist/quill.snow.css";
// import "react-quill/dist/quill.snow.css";
// import "quill/dist/quill.snow.css";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import toast from "react-hot-toast";
import { useAppDispatch } from "../features/hooks";
import { UpdateBlog, GetBlog } from "../features/blogActions";
import moment from "moment";

export function BlogEditorPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [picturePreview, setPicturePreview] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [changeImage, setChangeImage] = useState(false);
  const url = "https://kuri-backend-ub77.onrender.com";
  const [time, setTime] = useState("");

  useEffect(() => {
    const savedContent = localStorage.getItem("blogContent");
    const parsedContent = savedContent ? JSON.parse(savedContent) : null;
    console.log(savedContent);
    if (id) {
      setIsEditing(true);
      dispatch(GetBlog({ _id: id })).then((response) => {
        if (response.meta.requestStatus === "fulfilled") {
          const { blog } = response.payload;
          console.log(blog, "the blog");
          console.log(blog.title, blog.content, "blog");
          if (parsedContent?.id === id) {
            const { title, content } = parsedContent;
            setTitle(title || "");
            setContent(content || "");
            setPicturePreview(
              blog.thumbnail
                ? url + "/" + blog.thumbnail
                : "https://placehold.co/600x400?text=Cover+Image"
            );
          } else {
            setTitle(blog.title || "");
            setContent(blog.content || "");
            setPicturePreview(
              blog.thumbnail
                ? url + "/" + blog.thumbnail
                : "https://placehold.co/600x400?text=Cover+Image"
            );
          }
        } else {
          toast.error("Failed to fetch blog data");
        }
      });
    }

    return () => {
      localStorage.removeItem("blogContent");
    };
  }, [id, dispatch]);

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
    const interval = setInterval(() => {
      localStorage.setItem(
        "blogContent",
        JSON.stringify({ title, content, id })
      );
      setTime(moment().format("HH:mm:ss"));
    }, 5000); // Save every 5 seconds

    return () => clearInterval(interval);
  }, [title, content]);

  const handleSave = async (isDraft: boolean) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }
    formData.append("isPublished", (!isDraft).toString());

    try {
      if (id) {
        const response = await dispatch(UpdateBlog({ formData, _id: id }));
        if (response.meta.requestStatus === "fulfilled") {
          toast.success(
            `Blog ${isDraft ? "saved as draft" : "published"} successfully!`
          );
          // navigate("/blogs");
        } else {
          toast.error("Failed to save blog");
        }
      } else {
        toast.error("Blog ID is missing.");
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className='space-y-6'>
      <div className='flex-row gap-5 md:flex justify-end items-center md:justify-between'>
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => navigate("/blogs")}>
            <ArrowLeft size={20} />
          </Button>
          <h1 className='text-lg md:text-2xl font-bold'>Edit Blog</h1>
        </div>
        <div className='flex items-center space-x-3'>
          {/* <span>Last saved checkpoint: {time}</span> */}

          <Button
            variant='outline'
            onClick={() => handleSave(true)}>
            Save as Draft
          </Button>
          <Button onClick={() => handleSave(false)}>
            <Save className='w-4 h-4 mr-2' />
            {isEditing ? "Update" : "Publish"}
          </Button>
        </div>
      </div>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2 space-y-6'>
          <Input
            placeholder='Blog Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className='text-2xl font-semibold'
          />
          <div className='prose max-w-none '>
            <div className='h-[500px] mb-12'>
              <ReactQuill
                value={content}
                onChange={setContent}
                style={{ height: "500px" }}
                theme='snow'
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
        <div className='space-y-6'>
          <div className='bg-white rounded-lg shadow-sm p-6 space-y-6'>
            <div>
              <h3 className='text-lg font-semibold mb-4'>Blog Settings</h3>
            </div>
            <div>
              <label className='block text-sm font-medium mb-2'>
                Featured Image
              </label>
              <div className='border-2 border-dashed border-gray-200 rounded-lg p-4 text-center'>
                {changeImage ? (
                  thumbnailPreview ? (
                    <div className='relative'>
                      <img
                        src={thumbnailPreview}
                        alt='Thumbnail preview'
                        className='w-full h-48 object-cover rounded-lg'
                      />
                      <Button
                        variant='destructive'
                        size='sm'
                        className='absolute top-2 right-2'
                        onClick={() => {
                          setThumbnail(null);
                          setThumbnailPreview("");
                        }}>
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <label className='cursor-pointer block'>
                      <Input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        onChange={handleThumbnailChange}
                      />
                      <div className='space-y-2'>
                        <Image className='mx-auto h-12 w-12 text-gray-400' />
                        <span className='text-sm text-gray-600'>
                          Click to upload image
                        </span>
                      </div>
                    </label>
                  )
                ) : (
                  <div className='space-y-2'>
                    <img
                      src={picturePreview}
                      alt='Thumbnail preview'
                    />
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setChangeImage(true)}>
                      Change Image
                    </Button>
                  </div>
                )}
                {}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
