import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Post, PageProps } from '@/types';
// import Button from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Posts',
        href: '/posts',
    },
    {
        title: 'Show',
        href: '/posts/:id',
    }
];

interface ShowProps extends PageProps {
    post: Post;
}

export default function Show({ post }: ShowProps) {
    const handleDelete = () => {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            router.delete(route('posts.destroy', post.id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={post.title} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-bold">{post.title}</h1>
                            <div className="flex gap-3">
                                <Link
                                    href={route('posts.index')}
                                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
                                >
                                    Quay lại
                                </Link>
                                <Link
                                    href={route('posts.edit', post.id)}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md transition-colors"
                                >
                                    Chỉnh sửa
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>

                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-1 rounded-full text-xs ${
                                        post.published
                                            ? 'bg-green-200 text-green-800'
                                            : 'bg-gray-200 text-gray-800'
                                    }`}>
                                        {post.published ? 'Đã đăng' : 'Bản nháp'}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        Ngày tạo: {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                    </span>
                                </div>
                                {post.user && (
                                    <p className="text-gray-500 text-sm">Tác giả: {post.user.name}</p>
                                )}
                            </div>

                            {post.featured_image && (
                                <div className="mb-6">
                                    <img
                                        src={post.featured_image}
                                        alt={post.title}
                                        className="rounded-lg max-h-96 w-full object-cover"
                                    />
                                </div>
                            )}

                            {post.excerpt && (
                                <div className="mb-6">
                                    <h3 className="text-xl font-semibold mb-2">Tóm tắt</h3>
                                    <p className="text-white italic">{post.excerpt}</p>
                                </div>
                            )}

                            <div className="prose max-w-full">
                                <h3 className="text-xl font-semibold mb-2">Nội dung</h3>
                                <div className="whitespace-pre-wrap text-white">{post.content}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
