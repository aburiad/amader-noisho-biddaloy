import { BookOpen, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AboutPageData, fetchAboutPage, fetchHomePage, HomePageData } from "../services/api";
const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "clock":
      return Clock;
    case "users":
      return Users;
    case "book-open":
      return BookOpen;
    default:
      return BookOpen;
  }
};

export function HomePage() {
  const [pageData, setPageData] = useState<HomePageData | null>(null);
   const [aboutData, setAboutData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPageData() {
      try {
        const data = await fetchHomePage();
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

    useEffect(() => {
    async function loadAboutData() {
      try {
        const data = await fetchAboutPage();
        setAboutData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "ডেটা লোড করতে সমস্যা হয়েছে");
      } finally {
        setLoading(false);
      }
    }

    loadAboutData();
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
      {/* Hero Section - Clean and Minimal */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl mb-6 text-gray-900">
            {pageData.hero_title}
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-gray-700">
            {pageData.hero_subtitle}
          </p>
          <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
            {pageData.hero_description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={pageData.hero_primary_cta_link}
              className="inline-block bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-colors shadow-sm leading-[1.8rem]"
            >
              {pageData.hero_primary_cta_text}
            </Link>
            <Link
              to={pageData.hero_secondary_cta_link}
              className="inline-block bg-white hover:bg-gray-50 text-primary border-2 border-primary px-8 py-4 rounded-lg transition-colors"
            >
              {pageData.hero_secondary_cta_text}
            </Link>
          </div>
        </div>
      </section>

      {/* Key Features - 3 Simple Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {pageData.features.map((feature, index) => {
              const IconComponent = getIconComponent(feature.icon);
              return (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-xl p-8 text-center hover:shadow-md transition-shadow"
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <IconComponent className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6 text-gray-900">বিদ্যালয় সম্পর্কে</h2>
            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6 mb-8">
              {aboutData?.intro_paragraphs.map((paragraph, index) => (
                <p key={index}>{paragraph.text}</p>
              ))}
            </div>
          <Link
            to="/about"
            className="inline-block bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
          >
            আরও জানুন
          </Link>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">
              {pageData.mission_title}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {pageData.mission_subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pageData.mission_items.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200"
              >
                <h3 className="text-lg mb-3 text-gray-900">{item.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Info Section */}
      {/* <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">একাডেমিক তথ্য</h2>
            <p className="text-lg text-gray-600">
              ঢাকা বোর্ডের পাঠ্যক্রম অনুসরণ করে আমরা মানসম্মত শিক্ষা প্রদান করি
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-10">
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <h3 className="text-xl mb-2 text-gray-900">শ্রেণী</h3>
              <p className="text-3xl text-primary mb-2">১ - ১০</p>
              <p className="text-gray-600 text-sm">ঢাকা বোর্ড পাঠ্যক্রম</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <h3 className="text-xl mb-2 text-gray-900">ক্লাসের সময়</h3>
              <p className="text-3xl text-primary mb-2">৮টা  - ১০টা</p>
              <p className="text-gray-600 text-sm">রবিবার – বৃহস্পতিবার</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <h3 className="text-xl mb-2 text-gray-900">মাসিক বেতন</h3>
              <p className="text-3xl text-primary mb-2">২০০ টাকা</p>
              <p className="text-gray-600 text-sm">অত্যন্ত সাশ্রয়ী</p>
            </div>
          </div>

          <div className="text-center">
            <Link
              to="/academic"
              className="inline-block bg-primary hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors"
            >
              বিস্তারিত দেখুন
            </Link>
          </div>
        </div>
      </section> */}

      {/* Call to Action */}
      {/* <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl mb-6">
            {pageData.cta_title}
          </h2>
          <p className="text-xl mb-8 ">
            {pageData.cta_description}
          </p>
          <Link
            to={pageData.cta_button_link}
            className="inline-block bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-colors shadow-sm"
          >
            {pageData.cta_button_text}
          </Link>
        </div>
      </section> */}
    </div>
  );
}
