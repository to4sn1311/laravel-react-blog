import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { Post, PageProps } from '@/types';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import Checkbox from '@/Components/Checkbox';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';

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
        title: 'Edit',
        href: '/posts/:id/edit',
    }
];

interface EditProps extends PageProps {
    post: Post;
}

export default function Edit({ auth, post }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: post.title,
        slug: post.slug,
        content: post.content,
        excerpt: post.excerpt || '',
        featured_image: post.featured_image || '',
        published: post.published,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('posts.update', post.id));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Chỉnh sửa bài viết" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-6">
                        <h1 className="text-3xl font-bold mb-4">Chỉnh sửa bài viết</h1>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <InputLabel htmlFor="title" value="Tiêu đề" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="slug" value="Slug (URL thân thiện)" />
                                <TextInput
                                    id="slug"
                                    type="text"
                                    name="slug"
                                    value={data.slug}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('slug', e.target.value)}
                                />
                                <InputError message={errors.slug} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="content" value="Nội dung" />
                                <textarea
                                    id="content"
                                    name="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows={10}
                                    required
                                />
                                <InputError message={errors.content} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="excerpt" value="Tóm tắt" />
                                <textarea
                                    id="excerpt"
                                    name="excerpt"
                                    value={data.excerpt}
                                    onChange={(e) => setData('excerpt', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                    rows={3}
                                />
                                <InputError message={errors.excerpt} className="mt-2" />
                            </div>

                            <div className="mb-4">
                                <InputLabel htmlFor="featured_image" value="Ảnh bìa (URL)" />
                                <TextInput
                                    id="featured_image"
                                    type="text"
                                    name="featured_image"
                                    value={data.featured_image}
                                    className="mt-1 block w-full"
                                    onChange={(e) => setData('featured_image', e.target.value)}
                                />
                                <InputError message={errors.featured_image} className="mt-2" />
                            </div>

                            <div className="block mb-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="published"
                                        checked={data.published}
                                        onChange={(e) => setData('published', e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-gray-600">Đăng bài</span>
                                </label>
                            </div>

                            <div className="flex items-center gap-4 mt-6">
                                <PrimaryButton disabled={processing}>Lưu bài viết</PrimaryButton>
                                <Link href={route('posts.index')}>
                                    <SecondaryButton type="button">Hủy</SecondaryButton>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
