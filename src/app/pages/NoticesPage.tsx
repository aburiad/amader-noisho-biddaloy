import { Bell, Calendar, FileText, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchNoticesPage, fetchNotices, NoticesPageData, Notice } from "../services/api";

const getTypeInfo = (type: string) => {
  switch (type) {
    case "admission":
      return { label: "ভর্তি বিজ্ঞপ্তি", color: "bg-primary text-white" };
    case "exam":
      return { label: "পরীক্ষা", color: "bg-primary text-white" };
    case "result":
      return { label: "ফলাফল", color: "bg-primary text-white" };
    case "holiday":
      return { label: "ছুটি", color: "bg-gray-600 text-white" };
    default:
      return { label: "ঘোষণা", color: "bg-primary text-white" };
  }
};

const getPriorityIcon = (priority: string) => {
  if (priority === "high") {
    return <AlertCircle className="w-5 h-5 text-red-500" />;
  }
  return null;
};

export function NoticesPage() {
  const [pageData, setPageData] = useState<NoticesPageData | null>(null);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPageData() {
      try {
        const [page, noticesList] = await Promise.all([
          fetchNoticesPage(),
          fetchNotices()
        ]);
        setPageData(page);
        setNotices(noticesList);
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
      <section className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl mb-4 text-gray-900">{pageData.page_title}</h1>
          <p className="text-xl text-gray-600">
            {pageData.page_subtitle}
          </p>
        </div>
      </section>

      {/* Important Notice Banner */}
      <section className="py-8 bg-red-50 border-b border-red-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start space-x-4">
            <Bell className="w-8 h-8 text-red-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl text-red-900 mb-2">{pageData.important_notice_title}</h2>
              <p className="text-red-800 text-lg">
                {pageData.important_notice_text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notices List */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {notices.length > 0 ? (
            <div className="grid gap-6">
              {notices.map((notice) => {
                const typeInfo = getTypeInfo(notice.type);
                const priorityIcon = getPriorityIcon(notice.priority);

                return (
                  <div
                    key={notice.id}
                    className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex items-start space-x-3">
                        {priorityIcon}
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-3 mb-2">
                            <span
                              className={`${typeInfo.color} px-3 py-1 rounded-lg text-sm`}
                            >
                              {typeInfo.label}
                            </span>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {notice.title}
                            </h3>
                          </div>
                          <div className="flex items-center text-gray-500 text-sm">
                            <Calendar className="w-4 h-4 mr-2" />
                            {notice.date}
                          </div>
                        </div>
                      </div>
                    </div>
                    {notice.description && (
                      <p className="text-gray-700 leading-relaxed">
                        {notice.description}
                      </p>
                    )}
                    {notice.content && !notice.description && (
                      <div 
                        className="text-gray-700 leading-relaxed prose max-w-none"
                        dangerouslySetInnerHTML={{ __html: notice.content }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">কোনো নোটিশ নেই</p>
            </div>
          )}
        </div>
      </section>

      {/* Notice Categories */}
      {pageData.categories && pageData.categories.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">নোটিশের ধরন</h2>
              <p className="text-lg text-gray-600">
                বিভিন্ন ধরনের বিজ্ঞপ্তি সম্পর্কে জানুন
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pageData.categories.map((category, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 text-center">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-lg mb-2 text-gray-900">{category.title}</h3>
                  <p className="text-gray-600 text-sm">
                    {category.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
