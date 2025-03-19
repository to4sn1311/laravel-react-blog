import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { FormEvent } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'New Post',
        href: '/posts/create',
    },
];

export default function CreatePost() {
    const { data, setData, post, processing, errors } = useForm<{
        title: string;
        content: string;
        excerpt: string;
        author: string;
        featured_image: File | null;
        published: boolean;
    }>({
        title: '',
        content: '',
        excerpt: '',
        author: '',
        featured_image: null,
        published: false
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/posts');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Post" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border flex-1 overflow-hidden rounded-xl border">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-6">Create New Post</h1>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium mb-1">
                                    Title
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
                                <label htmlFor="author" className="block text-sm font-medium mb-1">
                                    Author
                                </label>
                                <input
                                    type="text"
                                    id="author"
                                    value={data.author}
                                    onChange={e => setData('author', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                />
                                {errors.author && <div className="text-red-500 text-sm mt-1">{errors.author}</div>}
                            </div>

                            <div>
                                <label htmlFor="content" className="block text-sm font-medium mb-1">
                                    Content
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
                                    Excerpt (optional)
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
                                    Featured Image (optional)
                                </label>
                                <input
                                    type="file"
                                    id="featured_image"
                                    onChange={e => setData('featured_image', e.target.files?.[0] || null)}
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
                                />
                                {errors.featured_image && <div className="text-red-500 text-sm mt-1">{errors.featured_image}</div>}
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
                                    Publish immediately
                                </label>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md shadow-sm disabled:opacity-70"
                                >
                                    {processing ? 'Creating...' : 'Create Post'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
