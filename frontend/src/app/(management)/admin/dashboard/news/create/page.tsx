// src/app/(management)/admin/dashboard/news/create/page.tsx

import NewsArticleForm from "@/components/admin/news/create/NewsArticleForm";

export default function CreateNewsPage() {
  return (
    <div className="p-4 mx-auto">
      {/* <h1 className="text-2xl font-bold mb-6">Create News Article</h1> */}
      <NewsArticleForm />
    </div>
  );
}
