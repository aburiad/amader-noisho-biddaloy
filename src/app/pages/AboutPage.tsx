import { Award, Heart, Target, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { AboutPageData, fetchAboutPage } from "../services/api";

export function AboutPage() {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPageData() {
      try {
        const data = await fetchAboutPage();
        setPageData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load page data');
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
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

  if (error || !pageData) {
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
          <h1 className="text-4xl md:text-5xl mb-4 text-gray-900">{pageData.page_title}</h1>
          <p className="text-xl text-gray-600">
            {pageData.page_subtitle}
          </p>
        </div>
      </section>

      {/* Main About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-6 text-gray-900">
              {pageData.intro_title}
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
            {pageData.intro_paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph.text}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">{pageData.vision_title}</h3>
              <p className="text-gray-700 leading-relaxed">
                {pageData.vision_description}
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl mb-4 text-gray-900">{pageData.mission_title}</h3>
              <p className="text-gray-700 leading-relaxed">
                {pageData.mission_description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who Can Join */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              {pageData.who_can_join_title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              আমাদের বিদ্যালয়ে সবাই স্বাগতম। আমরা বিশেষভাবে সাহায্য করতে চাই:
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pageData.who_can_join_items.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">আমাদের মূল্যবোধ</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {pageData.values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Award className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg mb-2 text-gray-900">{value.title}</h3>
                <p className="text-gray-600 text-sm">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
