import { Calendar, CheckCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { AdmissionPageData, fetchAdmissionPage } from "../services/api";

export function AdmissionPage() {
  const [pageData, setPageData] = useState<AdmissionPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPageData() {
      try {
        const data = await fetchAdmissionPage();
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

      {/* Requirements */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">কারা ভর্তি হতে পারবেন?</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              আমাদের বিদ্যালয়ে ভর্তির জন্য কোনো বয়স বা পূর্ব শিক্ষাগত যোগ্যতার
              বাধ্যবাধকতা নেই
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {pageData.requirements.map((req, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="text-lg mb-3 flex items-center text-gray-900">
                  <CheckCircle className="w-5 h-5 text-primary mr-2" />
                  {req.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {req.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admission Fee */}
      {pageData.fees && pageData.fees.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">ভর্তি ও বেতনের তথ্য</h2>
              <p className="text-lg text-gray-600">
                অত্যন্ত সাশ্রয়ী মূল্যে মানসম্মত শিক্ষা
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-10">
              {pageData.fees.map((fee, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <h3 className="text-xl mb-4 text-gray-900">{fee.label}</h3>
                  <p className="text-4xl font-bold mb-2">{fee.value}</p>
                </div>
              ))}
            </div>

            <div className="max-w-3xl mx-auto bg-green-50 border border-green-200 rounded-xl p-6">
              <h4 className="text-xl mb-3 text-green-900 flex items-center">
                <CheckCircle className="w-6 h-6 mr-2" />
                বিনামূল্যে পাবেন
              </h4>
              <ul className="space-y-2 text-green-800">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  সরকারি পাঠ্যপুস্তক
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  খাতা ও লেখার উপকরণ
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-green-600 rounded-full mr-3"></span>
                  শিক্ষার্থী আইডি কার্ড
                </li>
              </ul>
            </div>
          </div>
        </section>
      )}

      {/* Admission Process */}
      {pageData.steps && pageData.steps.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">ভর্তি প্রক্রিয়া</h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="space-y-6">
                {pageData.steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-4 bg-white rounded-xl p-6 border border-gray-200">
                    <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center flex-shrink-0 text-xl font-bold">
                      {step.step}
                    </div>
                    <div>
                      <h3 className="text-xl mb-2 text-gray-900">{step.title}</h3>
                      <p className="text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card-foreground text-white rounded-xl p-12">
            <Calendar className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-3xl mb-4 text-white">ভর্তি চলছে</h2>
            <p className="text-xl mb-6 text-white">
              সারা বছরই ভর্তি চলমান থাকে
            </p>
            <p className="text-lg mb-8 text-white">
              যে কোনো সময় এসে ভর্তি হতে পারবেন। আমরা সবসময় প্রস্তুত আপনাকে
              সাহায্য করতে।
            </p>
            <Link
              to="/contact"
              className="inline-block bg-white hover:bg-gray-100 text-primary px-8 py-3 rounded-lg transition-colors"
            >
              যোগাযোগ করুন
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
