"use client";

import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    issueType: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would send to an API endpoint
    console.log("Form submitted:", formData);
    setIsSubmitted(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-16 md:py-24 bg-teal-50">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Message Received!</h3>
            <p className="text-gray-600 mb-6">
              Thank you for reaching out. We&apos;ll review your situation and get back to you within 24-48 hours with a free explanation of what&apos;s happening and your options.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: "", email: "", issueType: "", message: "" });
              }}
              className="text-teal-600 font-medium hover:text-teal-700"
            >
              Submit another request
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-16 md:py-24 bg-teal-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Get Free Help Now
          </h2>
          <p className="text-xl text-gray-600">
            Tell us what&apos;s happening. We&apos;ll explain your situation and options — no cost, no obligation.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="Jane Smith"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
                  placeholder="jane@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="issueType" className="block text-sm font-medium text-gray-700 mb-2">
                What type of issue is this?
              </label>
              <select
                id="issueType"
                name="issueType"
                required
                value={formData.issueType}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors bg-white"
              >
                <option value="">Select an issue type</option>
                <option value="medical-bill">Medical Bill Question</option>
                <option value="insurance-denial">Insurance Denial</option>
                <option value="prior-auth">Prior Authorization</option>
                <option value="medical-records">Medical Records</option>
                <option value="other">Other Healthcare Admin Issue</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Tell us what&apos;s happening
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors resize-none"
                placeholder="Describe your situation. Include any details you think might be helpful — dates, amounts, what you've tried so far, etc."
              />
            </div>

            <div className="bg-teal-50 rounded-xl p-4 flex items-start gap-3">
              <svg className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-teal-700">
                If you have documents (bills, denial letters, EOBs), you can mention them here. We&apos;ll follow up with secure upload instructions if needed.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-teal-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-teal-700 transition-colors shadow-lg shadow-teal-600/30"
            >
              Get Free Help
            </button>

            <p className="text-center text-sm text-gray-500">
              Your information is kept strictly confidential. We&apos;ll respond within 24-48 hours.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
