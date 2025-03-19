<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
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
            'featured_image' => 'nullable|image|max:2048', // Thay đổi thành file ảnh, giới hạn 2MB
            'published' => 'nullable|boolean',
        ]);

        // Xử lý slug
        $validated['slug'] = Str::slug($request->title);

        // Xử lý file upload nếu có
        if ($request->hasFile('featured_image')) {
            $path = $request->file('featured_image')->store('post-images', 'public');
            $validated['featured_image'] = Storage::url($path);
        }

        // Xử lý ngày đăng
        if ($request->published) {
            $validated['published_at'] = now();
        }

        // Thêm user_id
        $validated['user_id'] = Auth::id();

        // Lưu bài viết
        Post::create($validated);

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
            'title' => 'string|max:255',
            'content' => 'string',
            'excerpt' => 'nullable|string',
            'featured_image' => 'nullable|image|max:2048', // Thay đổi thành file ảnh, giới hạn 2MB
            'published' => 'nullable|boolean',
            'slug' => [
                'nullable',
                'string',
                Rule::unique('posts')->ignore($post->id)
            ],
        ]);

        // Xử lý slug nếu không được cung cấp
        // if (empty($validated['slug'])) {
        //     $validated['slug'] = Str::slug($validated['title']);
        // }

        // Xử lý file upload nếu có
        if ($request->hasFile('featured_image')) {
            // Xóa ảnh cũ nếu tồn tại
            if ($post->featured_image) {
                $oldPath = str_replace('/storage/', '', $post->featured_image);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            // Lưu ảnh mới
            $path = $request->file('featured_image')->store('post-images', 'public');
            $validated['featured_image'] = Storage::url($path);
        } else {
            // Giữ nguyên ảnh cũ (loại bỏ khỏi dữ liệu được xác thực)
            unset($validated['featured_image']);
        }

        // Xử lý ngày đăng
        if ($request->published && !$post->published_at) {
            $validated['published_at'] = now();
        }

        // Cập nhật bài viết
        $post->update($validated);

        return redirect()->route('posts.index')
            ->with('message', 'Bài viết đã được cập nhật thành công!');
    }

    /**
     * Xóa bài viết
     */
    public function destroy(Post $post)
    {
        // Xóa ảnh liên kết nếu có
        if ($post->featured_image) {
            $imagePath = str_replace('/storage/', '', $post->featured_image);
            if (Storage::disk('public')->exists($imagePath)) {
                Storage::disk('public')->delete($imagePath);
            }
        }

        // Xóa bài viết
        $post->delete();

        return redirect()->route('posts.index')
            ->with('message', 'Bài viết đã được xóa thành công!');
    }
}
