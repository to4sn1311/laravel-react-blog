import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, Link } from '@inertiajs/react';
import { FormEvent, useState } from 'react';
import { Post, PageProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Trang chủ',
        href: '/dashboard',
    },
    {
        title: 'Bài viết',
        href: '/posts',
    },
    {
        title: 'Chỉnh sửa',
        href: '/posts/:id/edit',
    },
];

interface EditProps extends PageProps {
    post: Post;
}

export default function EditPost({ post }: EditProps) {
    const { data, setData, put, processing, errors, reset } = useForm<{
        title: string;
        content: string;
        excerpt: string;
        slug: string;
        featured_image: File | null;
        remove_image: boolean;
        published: boolean;
    }>({
        title: post.title || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        slug: post.slug || '',
        featured_image: null,
        remove_image: false,
        published: Boolean(post.published),
    });

    const [imagePreview, setImagePreview] = useState<string | null>(post.featured_image || null);
    const [previewOpen, setPreviewOpen] = useState<boolean>(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('excerpt', data.excerpt);
        formData.append('slug', data.slug);
        formData.append('published', data.published ? '1' : '0');

        // Xử lý ảnh
        if (data.featured_image) {
            formData.append('featured_image', data.featured_image);
        }

        // Nếu người dùng muốn xóa ảnh
        if (data.remove_image) {
            formData.append('remove_image', '1');
        }

        put(route('posts.update', post.id), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                // Reset trạng thái xóa ảnh
                setData('remove_image', false);
                // Reset file input
                setData('featured_image', null);
            },
            onError: (errors) => {
                // Xử lý lỗi nếu cần
                console.error(errors);
            }
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        // Reset flag xóa ảnh nếu người dùng chọn ảnh mới
        if (file) {
            setData('remove_image', false);
        }

        setData('featured_image', file);

        // Tạo preview ảnh
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else if (!data.remove_image) {
            // Nếu không có file mới và không muốn xóa ảnh thì giữ ảnh cũ
            setImagePreview(post.featured_image || null);
        } else {
            // Nếu đã chọn xóa ảnh thì không có preview
            setImagePreview(null);
        }
    };

    const handleRemoveImage = () => {
        // Đặt flag xóa ảnh và xóa preview
        setData('remove_image', true);
        setData('featured_image', null);
        setImagePreview(null);

        // Reset input file bằng cách tạo tham chiếu đến element
        const fileInput = document.getElementById('featured_image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };

    const handleKeepImage = () => {
        // Không xóa ảnh nữa, hiển thị lại ảnh cũ
        setData('remove_image', false);
        setData('featured_image', null);
        setImagePreview(post.featured_image);
    };

    const toggleImagePreview = () => {
        setPreviewOpen(!previewOpen);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chỉnh sửa bài viết" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border flex-1 overflow-hidden rounded-xl border">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">Chỉnh sửa bài viết</h1>
                            <Link
                                href={route('posts.index')}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
                            >
                                Quay lại
                            </Link>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">
                                    Tiêu đề <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                    required
                                />
                                {errors.title && <div className="text-red-500 text-sm mt-1">{errors.title}</div>}
                            </div>

                            <div>
                                <label htmlFor="slug" className="block text-sm font-medium mb-1">
                                    Slug (URL thân thiện)
                                </label>
                                <input
                                    type="text"
                                    id="slug"
                                    value={data.slug}
                                    onChange={e => setData('slug', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                />
                                <p className="text-xs text-gray-500 mt-1">Để trống để tự động tạo từ tiêu đề</p>
                                {errors.slug && <div className="text-red-500 text-sm mt-1">{errors.slug}</div>}
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium mb-1">
                                    Nội dung <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    id="content"
                                    value={data.content}
                                    onChange={e => setData('content', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                    rows={10}
                                    required
                                ></textarea>
                                {errors.content && <div className="text-red-500 text-sm mt-1">{errors.content}</div>}
                            </div>

                            <div>
                                <label htmlFor="excerpt" className="block text-sm font-medium mb-1">
                                    Tóm tắt (không bắt buộc)
                                </label>
                                <textarea
                                    id="excerpt"
                                    value={data.excerpt}
                                    onChange={e => setData('excerpt', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                    rows={3}
                                ></textarea>
                                {errors.excerpt && <div className="text-red-500 text-sm mt-1">{errors.excerpt}</div>}
                            </div>

                            <div>
                                <label htmlFor="featured_image" className="block text-sm font-medium mb-1">
                                    Ảnh bìa (không bắt buộc)
                                </label>
                                <input
                                    type="file"
                                    id="featured_image"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                />

                                {imagePreview ? (
                                    <div className="mt-3 border p-3 rounded-md bg-gray-50">
                                        <div className="flex items-start">
                                            <div>
                                                <p className="text-sm font-medium">Xem trước ảnh bìa:</p>
                                                <div className="mt-2 relative">
                                                    <img
                                                        src={imagePreview}
                                                        alt="Ảnh bìa"
                                                        className="h-24 object-cover rounded cursor-pointer"
                                                        onClick={toggleImagePreview}
                                                    />
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={handleRemoveImage}
                                                className="ml-4 text-red-500 hover:text-red-700 text-sm"
                                            >
                                                Xóa ảnh
                                            </button>
                                        </div>

                                        {/* Modal xem trước ảnh lớn */}
                                        {previewOpen && (
                                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                                                <div className="relative max-w-3xl max-h-[80vh] p-4">
                                                    <button
                                                        type="button"
                                                        onClick={toggleImagePreview}
                                                        className="absolute top-0 right-0 -mt-10 -mr-5 text-white text-3xl"
                                                    >
                                                        &times;
                                                    </button>
                                                    <img
                                                        src={imagePreview}
                                                        alt="Ảnh bìa phóng to"
                                                        className="max-h-[80vh] max-w-full object-contain"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ) : post.featured_image && data.remove_image ? (
                                    <div className="mt-2">
                                        <p className="text-sm text-gray-500">Ảnh bìa sẽ bị xóa sau khi lưu.</p>
                                        <button
                                            type="button"
                                            onClick={handleKeepImage}
                                            className="mt-1 text-blue-500 hover:text-blue-700 text-sm"
                                        >
                                            Giữ lại ảnh cũ
                                        </button>
                                    </div>
                                ) : null}

                                {errors.featured_image && (
                                    <div className="text-red-500 text-sm mt-1">{errors.featured_image}</div>
                                )}
                            </div>

                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="published"
                                    checked={data.published}
                                    onChange={e => setData('published', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="published" className="ml-2 block text-sm">
                                    {post.published_at ? 'Đã xuất bản' : 'Xuất bản ngay'}
                                </label>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <Link
                                    href={route('posts.index')}
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md"
                                >
                                    Hủy
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm disabled:opacity-70"
                                >
                                    {processing ? 'Đang lưu...' : 'Lưu bài viết'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
