import { Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchGallery, GalleryItem } from "../services/api";

export function GalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadGallery() {
      try {
        const data = await fetchGallery();
        setGallery(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gallery');
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">ডেটা লোড করতে সমস্যা হয়েছে</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4 text-gray-900">গ্যালারি</h1>
          <p className="text-xl text-gray-600">
            আমাদের বিদ্যালয়ের কিছু মুহূর্ত
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">ছবির সংগ্রহ</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              আমাদের শিক্ষার্থী, শিক্ষক ও বিদ্যালয়ের বিভিন্ন কার্যক্রমের ছবি
            </p>
          </div>

          {gallery.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.map((item) => (
                <div
                  key={item.id}
                  className="self-start group relative overflow-hidden rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-full h-72 object-cover"
                    />
                  ) : (
                    <div className="w-full h-72 bg-gray-100 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="p-6 bg-white">
                    <h3 className="text-lg mb-2 text-gray-900">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    )}
                    <p className="text-gray-500 text-xs mt-2">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">কোনো ছবি নেই</p>
            </div>
          )}
        </div>
      </section>

      {/* Activities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">আমাদের কার্যক্রম</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-lg mb-2 text-gray-900">নিয়মিত ক্লাস</h3>
              <p className="text-gray-600 text-sm">
                প্রতিদিন সন্ধ্যায় পাঠদান
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-4">✏️</div>
              <h3 className="text-lg mb-2 text-gray-900">পরীক্ষা</h3>
              <p className="text-gray-600 text-sm">
                মাসিক ও বার্ষিক মূল্যায়ন
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-lg mb-2 text-gray-900">পুরস্কার বিতরণ</h3>
              <p className="text-gray-600 text-sm">
                মেধাবী শিক্ষার্থীদের সম্মাননা
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-lg mb-2 text-gray-900">সাংস্কৃতিক অনুষ্ঠান</h3>
              <p className="text-gray-600 text-sm">
                বিভিন্ন উৎসব ও অনুষ্ঠান
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Student Life */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">শিক্ষার্থীদের জীবন</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              আমাদের বিদ্যালয়ে শিক্ষার্থীরা শুধু পড়াশোনাই নয়, জীবনের নতুন
              দিগন্ত খুঁজে পায়
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl mb-3 text-gray-900">শেখার পরিবেশ</h3>
              <p className="text-gray-700 leading-relaxed">
                আমাদের বিদ্যালয়ে একটি বন্ধুত্বপূর্ণ ও সহায়ক পরিবেশ রয়েছে।
                সব বয়সের শিক্ষার্থীরা এক সাথে শিখে ও বেড়ে ওঠে।
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl mb-3 text-gray-900">সামাজিক বন্ধন</h3>
              <p className="text-gray-700 leading-relaxed">
                এখানে শিক্ষার্থীরা একে অপরকে সাহায্য করে। কর্মজীবী মানুষদের মধ্যে
                একটি সুন্দর সম্প্রদায় গড়ে উঠেছে।
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-xl mb-3 text-gray-900">নতুন স্বপ্ন</h3>
              <p className="text-gray-700 leading-relaxed">
                অনেকে এখানে এসে তাদের জীবনে নতুন আশা ও স্বপ্ন খুঁজে পেয়েছেন।
                শিক্ষা তাদের দিয়েছে নতুন সম্ভাবনা।
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
