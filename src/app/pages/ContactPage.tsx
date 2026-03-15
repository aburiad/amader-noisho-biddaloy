import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "../context/SettingsContext";
import { ContactPageData, fetchContactPage } from "../services/api";

export function ContactPage() {
  const { settings } = useSettings();
  const [pageData, setPageData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function loadPageData() {
      try {
        const data = await fetchContactPage();
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would send the data to a backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  if (error || !settings || !pageData) {
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

      {/* Contact Info Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg mb-3 text-gray-900">ফোন নম্বর</h3>
              <p className="text-xl mb-1">{settings.phone}</p>
              <p className="text-gray-600 text-sm">সকাল ১০টা - রাত ১০টা</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg mb-3 text-gray-900">হোয়াটসঅ্যাপ</h3>
              <p className="text-xl mb-1">{settings.phone}</p>
              <p className="text-gray-600 text-sm">২৪/৭ মেসেজ করুন</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg mb-3 text-gray-900">ইমেইল</h3>
              <p className="text-lg mb-1">{settings.email}</p>
              <p className="text-gray-600 text-sm">২৪ ঘণ্টার মধ্যে উত্তর</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg mb-3 text-gray-900">ঠিকানা</h3>
              <p className="text-sm text-gray-700">{settings.address}</p>
              <p className="text-gray-600 text-sm mt-2">বাংলাদেশ</p>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid lg:grid-cols-1 gap-12">
            {/* Contact Form */}
            {/* <div>
              <h2 className="text-3xl mb-6 text-gray-900">আমাদের মেসেজ পাঠান</h2>
              <p className="text-gray-600 mb-8">
                আপনার যে কোনো প্রশ্ন বা মন্তব্য আমাদের জানান। আমরা শীঘ্রই আপনার
                সাথে যোগাযোগ করব।
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                  ধন্যবাদ! আপনার বার্তা পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block mb-2 text-gray-700">
                    আপনার নাম *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    placeholder="নাম লিখুন"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block mb-2 text-gray-700">
                    ফোন নম্বর *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    placeholder="০১৭১২-৩৪৫৬৭৮"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block mb-2 text-gray-700">
                    ইমেইল (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 text-gray-700">
                    বিষয় *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white"
                  >
                    <option value="">বিষয় নির্বাচন করুন</option>
                    <option value="admission">ভর্তি সম্পর্কে</option>
                    <option value="academic">একাডেমিক তথ্য</option>
                    <option value="fees">ফি সম্পর্কে</option>
                    <option value="general">সাধারণ জিজ্ঞাসা</option>
                    <option value="other">অন্যান্য</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-gray-700">
                    আপনার বার্তা *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none bg-white"
                    placeholder="আপনার বার্তা লিখুন..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-blue-700 text-white px-8 py-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>বার্তা পাঠান</span>
                </button>
              </form>
            </div> */}

            {/* Additional Info */}
            <div>
              <h2 className="text-3xl mb-6 text-gray-900">আমাদের ঠিকানা</h2>
              
              {/* Map Placeholder */}
              <div className="bg-gray-100 rounded-xl h-64 mb-8 flex items-center justify-center border border-gray-200">
                <div className="text-center text-gray-600">
                  <MapPin className="w-12 h-12 mx-auto mb-3 text-primary" />
                  <p className="text-gray-900">{settings.address}</p>
                  <p className="text-sm mt-2">বাংলাদেশ</p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
                <h3 className="text-2xl mb-4 flex items-center text-gray-900">
                  <Clock className="w-6 h-6 mr-2 text-primary" />
                  অফিস সময়
                </h3>
                <div className="space-y-3">
                  {settings.office_hours.map((hour, index) => (
                    <div key={index} className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-700">{hour.label}</span>
                      <span className="font-semibold text-gray-900">{hour.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Visit Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-xl mb-3 text-blue-900">
                  {pageData.visit_title}
                </h3>
                <p className="text-blue-800 mb-3 leading-relaxed">
                  {pageData.visit_description}
                </p>
                <p className="text-blue-700 text-sm">
                  {pageData.direction_hint}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      {pageData.faqs && pageData.faqs.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4 text-gray-900">সাধারণ প্রশ্ন</h2>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {pageData.faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="text-lg mb-2 text-gray-900">{faq.question}</h3>
                  <p className="text-gray-600">
                    {faq.answer}
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