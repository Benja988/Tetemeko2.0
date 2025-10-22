'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import Color from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import CharacterCount from '@tiptap/extension-character-count';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import { useEffect, useState, useCallback } from 'react';
import EditorToolbar from './EditorToolbar';
import { getCategories } from '@/services/categories/categoryService';
import { Category } from '@/interfaces/Category';
import { createNews, updateNewsById } from '@/services/news/newsService';
import { toBase64 } from '@/utils/toBase64';
import { News } from '@/interfaces/News';
import { Loader2, Save, Eye, Upload, ImageIcon, VideoIcon, Moon, Sun } from 'lucide-react';
import { Author } from '@/types/author';
import { getAuthors } from '@/services/authors';
import NextImage from 'next/image';
import { toast } from 'sonner';

interface NewsArticleFormProps {
  onSuccess?: () => void;
  existingNews?: News;
}

export default function NewsArticleForm({ onSuccess, existingNews }: NewsArticleFormProps) {
  const [title, setTitle] = useState(existingNews?.title || '');
  const [summary, setSummary] = useState(existingNews?.summary || '');
  const [seoTitle, setSeoTitle] = useState(existingNews?.seoTitle || '');
  const [seoDescription, setSeoDescription] = useState(existingNews?.seoDescription || '');
  const [tags, setTags] = useState(existingNews?.tags?.join(', ') || '');
  const [category, setCategory] = useState<string>(
    typeof existingNews?.category === 'string' ? existingNews.category : existingNews?.category?._id || ''
  );
  const [author, setAuthor] = useState<string>(
    typeof existingNews?.author === 'string' ? existingNews.author : existingNews?.author?._id || ''
  );
  const [publishedAt, setPublishedAt] = useState(existingNews?.publishedAt ? new Date(existingNews.publishedAt).toISOString().slice(0, 16) : '');
  const [videoUrl, setVideoUrl] = useState(existingNews?.videoUrl || '');
  const [readingTime, setReadingTime] = useState(existingNews?.readingTime || 0);
  const [isPublished, setIsPublished] = useState(existingNews?.isPublished || false);
  const [isFeatured, setIsFeatured] = useState(existingNews?.isFeatured || false);
  const [isBreaking, setIsBreaking] = useState(existingNews?.isBreaking || false);
  const [featuredImage, setFeaturedImage] = useState(existingNews?.featuredImage || '');
  const [thumbnail, setThumbnail] = useState(existingNews?.thumbnail || '');
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string | undefined }>({});
  const [content, setContent] = useState(existingNews?.content || '');
  const [showToolbar, setShowToolbar] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const [wordCount, setWordCount] = useState(0);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        strike: false,
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      Strike,
      CodeBlock,
      Highlight.configure({ multicolor: true }),
      Placeholder.configure({
        placeholder: 'Start writing your article here...',
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-300 dark:border-gray-600 p-2',
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Youtube.configure({
        width: 640,
        height: 480,
        controls: true,
      }),
      Link.configure({
        openOnClick: true,
        HTMLAttributes: {
          class: 'text-blue-500 dark:text-blue-400 underline',
        },
      }),
      TaskList.configure({
        HTMLAttributes: {
          class: 'pl-0 list-none',
        },
      }),
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start my-1',
        },
      }),
      CharacterCount.configure(),
    ],
    content: existingNews?.content || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose-lg max-w-full min-h-[500px] bg-white dark:bg-gray-800 p-6 rounded-lg text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400',
        spellCheck: 'true',
        role: 'textbox',
        'aria-multiline': 'true',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setContent(html);

      // Calculate word count
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
      setWordCount(words.length);

      handleAutoSave();
    },
  });

  // Auto-save functionality
  const handleAutoSave = useCallback(() => {
    const now = new Date().toLocaleTimeString();
    setLastSaved(now);
    localStorage.setItem(
      'newsDraft',
      JSON.stringify({ title, content, summary, category, author, publishedAt, videoUrl, readingTime })
    );
  }, [title, content, summary, category, author, publishedAt, videoUrl, readingTime]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newsCategories, activeAuthors] = await Promise.all([getCategories('news'), getAuthors()]);
        setCategories(newsCategories);
        setAuthors(activeAuthors);
      } catch (err) {
        setErrors((prev) => ({ ...prev, fetch: 'Failed to load categories or authors' }));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let lastScrollTop = 0;
    const onScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setShowToolbar(scrollTop < lastScrollTop || scrollTop < 100);
      lastScrollTop = Math.max(scrollTop, 0);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const getId = (item: string | { _id: string } | undefined): string => {
    if (!item) return '';
    return typeof item === 'string' ? item : item._id;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setUploading(true);

    const normalizedCategory = getId(category);
    const normalizedAuthor = getId(author);

    // Prepare payload
    const payload = {
      title,
      summary,
      content,
      author: normalizedAuthor,
      category: normalizedCategory,
      tags: tags.split(',').map((tag) => tag.trim()).filter(Boolean),
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      isPublished,
      thumbnail,
      featuredImage,
      videoUrl,
      seoTitle,
      seoDescription,
      readingTime: Number(readingTime),
      isFeatured,
      isBreaking,
    };

    try {
      let result;
      if (existingNews) {
        result = await updateNewsById(existingNews._id, payload);
        toast.success('News article updated successfully!');
      } else {
        result = await createNews(payload);
        toast.success('News article created successfully!');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error saving news:', err);
      toast.error(err.message || 'Failed to save news article. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === 'Escape') {
        setCollapsed(!collapsed);
      }
      if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        document.getElementById('author-select')?.focus();
      }
      if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [collapsed, title, content, author]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Title is required';
    if (!content.trim() || content.trim() === '<p></p>') newErrors.content = 'Content is required';
    if (!category) newErrors.category = 'Category is required';
    if (!author) newErrors.author = 'Author is required';
    if (readingTime < 0) newErrors.readingTime = 'Reading time cannot be negative';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        setUploading(true);
        try {
          const base64 = await toBase64(file);
          editor?.chain().focus().setImage({ src: base64, alt: 'Uploaded image' }).run();
        } catch {
          setErrors((prev) => ({ ...prev, image: 'Failed to upload image' }));
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match(/^image\/(png|jpeg|jpg|gif)$/)) {
        setErrors((prev) => ({ ...prev, thumbnail: 'Only PNG, JPEG, or GIF images are allowed' }));
        return;
      }
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, thumbnail: 'Image size must be less than 5MB' }));
        return;
      }
      setUploading(true);
      try {
        // Optional: Compress image before converting to Base64
        const img = document.createElement('img');
        img.src = URL.createObjectURL(file);
        await img.decode();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const maxWidth = 800; // Adjust as needed
        const maxHeight = 600;
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        canvas.width = width;
        canvas.height = height;
        ctx?.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL(file.type, 0.8); // Compress with 80% quality
        if (!base64.startsWith('data:image/')) {
          throw new Error('Invalid image format');
        }
        setThumbnail(base64);
        setErrors((prev) => ({ ...prev, thumbnail: undefined }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, thumbnail: 'Failed to process thumbnail image' }));
        toast.error('Failed to process thumbnail image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^image\/(png|jpeg|jpg|gif)$/)) {
        setErrors((prev) => ({ ...prev, featuredImage: 'Only PNG, JPEG, or GIF images are allowed' }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, featuredImage: 'Image size must be less than 5MB' }));
        return;
      }
      setUploading(true);
      try {
        const base64 = await toBase64(file);
        if (!base64.startsWith('data:image/')) {
          throw new Error('Invalid image format');
        }
        setFeaturedImage(base64);
        setErrors((prev) => ({ ...prev, featuredImage: undefined }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, featuredImage: 'Failed to process featured image' }));
        toast.error('Failed to process featured image');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match(/^video\/(mp4|webm|ogg)$/)) {
        setErrors((prev) => ({ ...prev, videoUrl: 'Only MP4, WebM, or OGG videos are allowed' }));
        return;
      }
      if (file.size > 50 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, videoUrl: 'Video size must be less than 50MB' }));
        return;
      }
      setUploading(true);
      try {
        const base64 = await toBase64(file);
        if (!base64.startsWith('data:video/')) {
          throw new Error('Invalid video format');
        }
        setVideoUrl(base64);
        setErrors((prev) => ({ ...prev, videoUrl: undefined }));
      } catch (err) {
        setErrors((prev) => ({ ...prev, videoUrl: 'Failed to process video' }));
        toast.error('Failed to process video');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddLink = () => {
    const url = window.prompt('URL');
    if (url) {
      editor?.chain().focus().setLink({ href: url }).run();
    }
  };

  const handleSetHighlight = () => {
    const color = window.prompt('Enter a color (e.g., #ffcc00, yellow)', '#ffcc00');
    if (color) {
      editor?.chain().focus().setMark('highlight', { color }).run();
    }
  };

  return (
    <div className="p-4 md:p-6 mx-auto space-y-6 bg-gray-50 dark:bg-gray-900 rounded-xl shadow-lg max-w-6xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
          {existingNews ? 'Edit News Article' : 'Create News Article'}
        </h1>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            title="Toggle dark mode (Ctrl+D)"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <Eye size={18} />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading}
            className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            <span className="hidden sm:inline">{uploading ? 'Saving...' : 'Save (Ctrl+S)'}</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
        <nav className="flex space-x-2 md:space-x-8 min-w-max">
          <button
            onClick={() => setActiveTab('content')}
            className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-sm ${
              activeTab === 'content'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Content
          </button>
          <button
            onClick={() => setActiveTab('media')}
            className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-sm ${
              activeTab === 'media'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Media
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-sm ${
              activeTab === 'seo'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`py-3 md:py-4 px-2 md:px-1 border-b-2 font-medium text-sm ${
              activeTab === 'settings'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
          >
            Settings
          </button>
        </nav>
      </div>

      {/* Main Form Content */}
      <div className="space-y-6">
        {/* Content Tab */}
        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title *</label>
                <input
                  type="text"
                  placeholder="Enter article title"
                  className={`w-full p-3 rounded-lg border ${
                    errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Author * (Ctrl+A)
                </label>
                <select
                  id="author-select"
                  className={`w-full p-3 rounded-lg border ${
                    errors.author ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                >
                  <option value="">Select an author</option>
                  {authors.map((auth) => (
                    <option key={auth._id} value={auth._id}>
                      {auth.name}
                    </option>
                  ))}
                </select>
                {errors.author && <p className="text-red-500 text-sm">{errors.author}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category *</label>
                <select
                  className={`w-full p-3 rounded-lg border ${
                    errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Reading Time (minutes)
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="e.g., 5"
                  className={`w-full p-3 rounded-lg border ${
                    errors.readingTime ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                  value={readingTime}
                  onChange={(e) => setReadingTime(Number(e.target.value))}
                />
                {errors.readingTime && <p className="text-red-500 text-sm">{errors.readingTime}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Summary</label>
              <textarea
                placeholder="Enter a short summary"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                rows={3}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content *</label>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {wordCount} words • {editor?.storage.characterCount.characters() || 0} characters
                </div>
              </div>

              <div className="relative border rounded-lg bg-white dark:bg-gray-800 shadow-sm overflow-y-auto">
                {editor && (
                  <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    {showToolbar && !collapsed ? (
                      <EditorToolbar
                        editor={editor}
                        handleImageUpload={handleImageUpload}
                        handleAddLink={handleAddLink}
                        handleSetHighlight={handleSetHighlight}
                        uploading={uploading}
                        onCollapse={() => setCollapsed(true)}
                      />
                    ) : (
                      <button
                        onClick={() => setCollapsed(false)}
                        className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 m-2 text-gray-700 dark:text-gray-300"
                      >
                        Expand Toolbar
                      </button>
                    )}
                  </div>
                )}
                <div className="pt-[64px]">
                  <EditorContent editor={editor} />
                </div>
                {errors.content && <p className="text-red-500 text-sm p-2">{errors.content}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Media Tab */}
        {activeTab === 'media' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thumbnail Image</label>
                <div className="flex items-center gap-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Click to upload thumbnail (PNG, JPEG, GIF, max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {thumbnail && (
                  <div className="mt-2">
                    <NextImage
                      src={thumbnail}
                      alt="Thumbnail preview"
                      width={160}
                      height={90}
                      className="w-40 rounded-lg shadow-sm object-cover"
                    />
                    <button
                      onClick={() => setThumbnail('')}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Thumbnail
                    </button>
                  </div>
                )}
                {errors.thumbnail && <p className="text-red-500 text-sm">{errors.thumbnail}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Featured Image</label>
                <div className="flex items-center gap-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Click to upload featured image (PNG, JPEG, GIF, max 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/gif"
                      onChange={handleFeaturedImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {featuredImage && (
                  <div className="mt-2">
                    <NextImage
                      src={featuredImage}
                      alt="Featured preview"
                      width={160}
                      height={90}
                      className="w-40 rounded-lg shadow-sm object-cover"
                    />
                    <button
                      onClick={() => setFeaturedImage('')}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Featured Image
                    </button>
                  </div>
                )}
                {errors.featuredImage && <p className="text-red-500 text-sm">{errors.featuredImage}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Video URL or Upload</label>
                <input
                  type="text"
                  placeholder="Enter YouTube URL or upload video (MP4, WebM, OGG, max 50MB)"
                  className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <VideoIcon className="w-8 h-8 mb-3 text-gray-400 dark:text-gray-500" />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        Click to upload video (MP4, WebM, OGG, max 50MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/ogg"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {videoUrl && !videoUrl.startsWith('data:video/') && (
                  <div className="mt-2">
                    <iframe
                      src={videoUrl}
                      title="Video preview"
                      className="w-full h-40 rounded-lg"
                      allowFullScreen
                    />
                    <button
                      onClick={() => setVideoUrl('')}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Video
                    </button>
                  </div>
                )}
                {videoUrl.startsWith('data:video/') && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Video uploaded (base64)</p>
                    <button
                      onClick={() => setVideoUrl('')}
                      className="mt-2 text-sm text-red-500 hover:text-red-700"
                    >
                      Remove Video
                    </button>
                  </div>
                )}
                {errors.videoUrl && <p className="text-red-500 text-sm">{errors.videoUrl}</p>}
              </div>
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SEO Title (Optional)</label>
              <input
                type="text"
                placeholder="Enter SEO title"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                SEO Description (Optional)
              </label>
              <textarea
                placeholder="Enter SEO description"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                rows={3}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Tags (comma-separated) (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g., news, politics, tech"
                className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Publication Date</label>
              <input
                type="datetime-local"
                className={`w-full p-3 rounded-lg border ${
                  errors.publishedAt ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800`}
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
              {errors.publishedAt && <p className="text-red-500 text-sm">{errors.publishedAt}</p>}
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Article Status
              </label>
              <div className="flex flex-wrap gap-4 md:gap-6">
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={() => setIsPublished(!isPublished)}
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800"
                  />
                  Publish Now
                </label>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={() => setIsFeatured(!isFeatured)}
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800"
                  />
                  Featured
                </label>
                <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={() => setIsBreaking(!isBreaking)}
                    className="h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800"
                  />
                  Breaking News
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {lastSaved && <span className="text-green-600 dark:text-green-400">Last saved: {lastSaved}</span>}
        </div>

        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 bg-blue-600 text-white font-semibold rounded-lg transition hover:bg-blue-700 disabled:opacity-50 w-full sm:w-auto justify-center"
        >
          {uploading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              {existingNews ? 'Update Article' : 'Publish Article'} (Ctrl+S)
            </>
          )}
        </button>
      </div>
    </div>
  );
}