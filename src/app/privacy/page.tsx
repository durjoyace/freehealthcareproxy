import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">FreeHealthcareProxy</span>
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-6">Privacy Policy</h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Information We Collect
            </h2>
            <p className="text-gray-600 mb-4">
              When you use FreeHealthcareProxy, we collect:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                Information you provide about your healthcare admin issue
                (descriptions, insurance company names, provider names, amounts,
                dates)
              </li>
              <li>
                Contact information if you request paid services (email, phone
                number)
              </li>
              <li>
                Anonymous session data to provide continuity during your visit
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              How We Use Your Information
            </h2>
            <p className="text-gray-600 mb-4">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                Generate your personalized Issue Resolution Map
              </li>
              <li>
                Contact you if you request a quote for paid services
              </li>
              <li>
                Improve our service and resolution algorithms
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Information Sharing
            </h2>
            <p className="text-gray-600">
              We do not sell, trade, or share your personal information with
              third parties except as required by law or as necessary to provide
              our services. Your healthcare information is treated with strict
              confidentiality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Data Security
            </h2>
            <p className="text-gray-600">
              We implement appropriate security measures to protect your
              information. However, no method of transmission over the internet
              is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Your Rights
            </h2>
            <p className="text-gray-600">
              You may request to access, correct, or delete your personal
              information by contacting us. We will respond to your request
              within 30 days.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Contact Us
            </h2>
            <p className="text-gray-600">
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <a
                href="mailto:privacy@freehealthcareproxy.com"
                className="text-teal-600 hover:underline"
              >
                privacy@freehealthcareproxy.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
