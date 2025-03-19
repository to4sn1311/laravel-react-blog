<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PostController extends Controller
{
    /**
     * Hiển thị danh sách bài viết
     */
    public function index()
    {
        $posts = Post::with('user')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('posts/index', [
            'posts' => $posts
        ]);
    }

    /**
     * Hiển thị form tạo bài viết
     */
    public function create()
    {
        return Inertia::render('posts/create');
    }

    /**
     * Lưu bài viết mới
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'published' => 'nullable|boolean',
        ]);

        $post = new Post($validated);
        $post->user_id = Auth::id();
        $post->slug = Str::slug($request->title);

        if ($request->published && !$post->published_at) {
            $post->published_at = now();
        }

        $post->save();

        return redirect()->route('posts.index')
            ->with('message', 'Bài viết đã được tạo thành công!');
    }

    /**
     * Hiển thị bài viết cụ thể
     */
    public function show(Post $post)
    {
        $post->load('user');

        return Inertia::render('posts/show', [
            'post' => $post
        ]);
    }

    /**
     * Hiển thị form chỉnh sửa bài viết
     */
    public function edit(Post $post)
    {
        return Inertia::render('posts/edit', [
            'post' => $post
        ]);
    }

    /**
     * Cập nhật bài viết
     */
    public function update(Request $request, Post $post)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|string',
            'published' => 'nullable|boolean',
            'slug' => [
                'nullable',
                'string',
                Rule::unique('posts')->ignore($post->id)
            ],
        ]);

        if ($request->has('title') && (!$request->has('slug') || empty($request->slug))) {
            $validated['slug'] = Str::slug($request->title);
        }

        if ($request->published && !$post->published_at) {
            $validated['published_at'] = now();
        }

        $post->update($validated);

        return redirect()->route('posts.index')
            ->with('message', 'Bài viết đã được cập nhật thành công!');
    }

    /**
     * Xóa bài viết
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return redirect()->route('posts.index')
            ->with('message', 'Bài viết đã được xóa thành công!');
    }
}
