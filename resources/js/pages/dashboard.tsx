import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
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
                        <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
                        <div className="about-section">
                            <h2 className="text-xl font-semibold mb-3">About</h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                This is your personal dashboard where you can manage your content and settings.
                                Feel free to explore the various features available to you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
