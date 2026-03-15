import { Award, BookOpen, Calendar, CheckCircle, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { AcademicPageData, fetchAcademicPage } from "../services/api";

export function AcademicPage() {
  const [pageData, setPageData] = useState<AcademicPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPageData() {
      try {
        const data = await fetchAcademicPage();
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

      {/* Curriculum Overview */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">পাঠ্যক্রম</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              আমরা জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) এর অনুমোদিত ঢাকা
              বোর্ডের পাঠ্যক্রম অনুসরণ করি
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {pageData.class_schedule.map((item, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-lg flex items-center justify-center">
                    {index === 0 ? <Clock className="w-7 h-7 text-primary" /> : 
                     index === 1 ? <Calendar className="w-7 h-7 text-primary" /> :
                     <BookOpen className="w-7 h-7 text-primary" />}
                  </div>
                </div>
                <h3 className="text-xl mb-2 text-gray-900">{item.label}</h3>
                <p className="text-2xl mb-2">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Class List */}
          {pageData.classes && pageData.classes.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-8 border border-gray-200">
              <h3 className="text-2xl mb-6 text-center text-gray-900">শ্রেণীভিত্তিক বিষয়সমূহ</h3>
              <div className="space-y-3">
                {pageData.classes.map((item, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="font-semibold text-lg">
                        {item.grade}
                      </span>
                      <span className="text-gray-700">{item.subjects}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Highlights */}
      {pageData.highlights && pageData.highlights.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">বৈশিষ্ট্যসমূহ</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageData.highlights.map((highlight, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg mb-2 text-gray-900">{highlight.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {highlight.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Examination System - Static fallback */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">পরীক্ষা ব্যবস্থা</h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-8 mb-8 border border-gray-200">
              <h3 className="text-2xl mb-6 text-gray-900">নিয়মিত পরীক্ষা</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">সাপ্তাহিক পরীক্ষা</h4>
                    <p className="text-gray-600 text-sm">
                      প্রতি সপ্তাহে ছোট পরীক্ষা নেওয়া হয়
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">মাসিক পরীক্ষা</h4>
                    <p className="text-gray-600 text-sm">
                      প্রতি মাসে একটি বড় পরীক্ষা হয়
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">অর্ধ-বার্ষিক পরীক্ষা</h4>
                    <p className="text-gray-600 text-sm">
                      বছরে দুইবার বড় পরীক্ষা
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-1 text-gray-900">বার্ষিক পরীক্ষা</h4>
                    <p className="text-gray-600 text-sm">
                      বছরের শেষে চূড়ান্ত পরীক্ষা
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-primary rounded-xl p-8 text-white">
              <h3 className="text-2xl mb-4">বোর্ড পরীক্ষা</h3>
              <p className="text-lg mb-4 text-blue-100">
                শ্রেণী ৫, ৮ ও ১০ এর শিক্ষার্থীরা ঢাকা বোর্ডের অধীনে পাবলিক
                পরীক্ষায় অংশগ্রহণ করতে পারবেন।
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>প্রাথমিক সমাপনী (শ্রেণী ৫)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>জুনিয়র স্কুল সার্টিফিকেট - JSC (শ্রেণী ৮)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5" />
                  <span>মাধ্যমিক স্কুল সার্টিফিকেট - SSC (শ্রেণী ১০)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">অতিরিক্ত সুবিধা</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900">বিনামূল্যে বই</h3>
              <p className="text-gray-600 text-sm">
                সরকারি বই বিনামূল্যে প্রদান
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900">মেধাবী পুরস্কার</h3>
              <p className="text-gray-600 text-sm">
                ভালো ফলাফলের জন্য পুরস্কার
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900">ছোট ক্লাস</h3>
              <p className="text-gray-600 text-sm">
                প্রতি ক্লাসে সীমিত শিক্ষার্থী
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg mb-2 text-gray-900">অভিজ্ঞ শিক্ষক</h3>
              <p className="text-gray-600 text-sm">
                দক্ষ ও যোগ্য শিক্ষকমণ্ডলী
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
