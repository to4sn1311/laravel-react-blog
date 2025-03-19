import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

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
        title: 'Tạo mới',
        href: '/posts/create',
    },
];

export default function CreatePost() {
    const { data, setData, post, processing, errors, progress } = useForm<{
        title: string;
        content: string;
        excerpt: string;
        featured_image: File | null;
        published: boolean;
    }>({
        title: '',
        content: '',
        excerpt: '',
        featured_image: null,
        published: false
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/posts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tạo bài viết mới" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border flex-1 overflow-hidden rounded-xl border">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-6">Tạo bài viết mới</h1>

                        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">
                                    Tiêu đề
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
                                <label htmlFor="content" className="block text-sm font-medium mb-1">
                                    Nội dung
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
                                    onChange={e => setData('featured_image', e.target.files?.[0] || null)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                    accept="image/*"
                                />
                                {errors.featured_image && <div className="text-red-500 text-sm mt-1">{errors.featured_image}</div>}

                                {/* Hiển thị thanh tiến trình khi upload file */}
                                {progress && (
                                    <progress value={progress.percentage} max="100" className="w-full h-2 mt-2">
                                        {progress.percentage}%
                                    </progress>
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
                                    Xuất bản ngay
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm disabled:opacity-70"
                                >
                                    {processing ? 'Đang tạo...' : 'Tạo bài viết'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
