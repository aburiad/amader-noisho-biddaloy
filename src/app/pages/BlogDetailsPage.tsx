import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BlogPostDetailData, fetchPostBySlug } from "../services/api";

export default function BlogDetailsPage() {
  const { slug } = useParams<{ slug: string }>(); // URL theke slug dhora
  const [data, setData] = useState<BlogPostDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPostDetails() {
      if (!slug) return;
      try {
        setLoading(true);
        const postData = await fetchPostBySlug(slug);
        setData(postData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load post details');
      } finally {
        setLoading(false);
      }
    }

    loadPostDetails();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error || "Post not found"}</p>
        <Link to="/blog" className="text-primary hover:underline">Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Navigation Back */}
        <Link to="/blog" className="text-primary font-medium mb-8 inline-block hover:underline">
          ← Back to Blog
        </Link>

        {/* Post Header */}
        <header className="mb-10">
          {/* Featured Image */}
          {data.featured_image && (
            <div className="-mx-4 md:-mx-0 mb-8">
              <img 
                src={data.featured_image} 
                alt={data.post_title}
                className="w-full max-h-[500px] object-cover rounded-lg"
              />
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {data.post_title}
          </h1>
          
          <div className="flex flex-wrap gap-4 border-y py-4 border-gray-100">
            {data.post_meta.map((meta, index) => (
              <div key={index} className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">{meta.label}:</span> {meta.value}
              </div>
            ))}
          </div>
        </header>

        {/* Main Post Content */}
        <article 
          className="prose prose-lg prose-blue max-w-none text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: data.post_content }}
        />

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <Link 
            to="/blog" 
            className="px-8 py-3 bg-primary text-white rounded-lg font-bold hover:bg-opacity-90 transition"
          >
            {data.read_more_text}
          </Link>
        </div>
      </div>
    </div>
  );
}