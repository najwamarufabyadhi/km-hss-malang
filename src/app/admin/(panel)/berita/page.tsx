import { connection } from "next/server";
import { PostsManager } from "@/components/admin/PostsManager";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/types/database";

async function getPosts(): Promise<Post[]> {
  await connection();
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as Post[] | null) ?? [];
}

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Berita</h1>
        <p className="mt-1 text-sm text-muted">
          Tulis, simpan draft, terbitkan, pilih kategori, dan tandai berita
          sorotan untuk carousel beranda.
        </p>
      </div>

      <PostsManager posts={posts} />
    </div>
  );
}
