import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Post, PageProps } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Posts',
        href: '/posts',
    }
];

interface PostsPageProps extends PageProps {
    posts: {
        data: Post[];
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta: {
            current_page: number;
            from: number;
            last_page: number;
            links: Array<{
                url: string | null;
                label: string;
                active: boolean;
            }>;
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
}

export default function Index({ posts }: PostsPageProps) {
    const handleDelete = (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
            router.delete(route('posts.destroy', id));
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quản lý bài viết" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="absolute top-4 right-4">
                        <Link
                            href="/posts/create"
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow-sm transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            New Post
                        </Link>
                    </div>
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4">Danh sách bài viết</h1>
                        {/* {flash.message && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                                {flash.message}
                            </div>
                        )} */}
                        {posts.data.length === 0 ? (
                            <div className="bg-blue-50 p-4 rounded-md text-blue-700">
                                Không có bài viết nào. Hãy tạo bài viết mới!
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-black text-white border">
                                    <thead>
                                        <tr className="text-white-600 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-left">Tiêu đề</th>
                                            <th className="py-3 px-6 text-left">Trạng thái</th>
                                            <th className="py-3 px-6 text-left">Ngày tạo</th>
                                            <th className="py-3 px-6 text-center">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-white-600 text-sm">
                                        {posts.data.map((post) => (
                                            <tr key={post.id} className="border-b ">
                                                <td className="py-3 px-6 text-left">
                                                    <span className="font-medium">{post.title}</span>
                                                </td>
                                                <td className="py-3 px-6 text-left">
                                                    {post.published ? (
                                                        <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">
                                                            Đã đăng
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-200 bg-gray-800 py-1 px-3 rounded-full text-xs">
                                                            Bản nháp
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="py-3 px-6 text-left">
                                                    {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="py-3 px-6 text-center">
                                                    <div className="flex item-center justify-center gap-2">
                                                        <Link
                                                            href={route('posts.show', post.id)}
                                                            className="text-blue-600 hover:text-blue-900"
                                                            title="Xem"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2 12s3-8 10-8 10 8 10 8-3 8-10 8-10-8-10-8z" />
                                                            </svg>
                                                        </Link>
                                                        <Link
                                                            href={route('posts.edit', post.id)}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                            title="Sửa"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(post.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Xóa"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
