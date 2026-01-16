import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export default function TermsPage() {
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

        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Terms of Service
        </h1>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-6">
            Last updated: {new Date().toLocaleDateString()}
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Service Description
            </h2>
            <p className="text-gray-600">
              FreeHealthcareProxy provides informational guidance to help users
              understand and navigate healthcare administrative issues. Our free
              service generates Issue Resolution Maps based on information you
              provide. We also offer optional paid services where we handle
              issues on your behalf.
            </p>
          </section>

          <section className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
            <h2 className="text-xl font-semibold text-amber-900 mb-3">
              Important Disclaimer
            </h2>
            <p className="text-amber-800 font-medium">
              FreeHealthcareProxy provides administrative assistance only. We do
              not provide medical advice, legal advice, or mental health
              services. Our guidance is for informational purposes and should
              not replace professional medical, legal, or financial counsel.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Free Services
            </h2>
            <p className="text-gray-600 mb-4">
              Our free Issue Resolution Map service is provided &quot;as is&quot; without
              warranties of any kind. While we strive to provide accurate and
              helpful information, we cannot guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>
                Specific outcomes or success in resolving your healthcare
                administrative issues
              </li>
              <li>
                Accuracy of information for your specific insurance plan or
                situation
              </li>
              <li>
                Timeliness of information, as healthcare policies and procedures
                change
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Paid Services
            </h2>
            <p className="text-gray-600">
              If you opt for our paid services, separate terms and pricing will
              be provided before any work begins. Payment is required before we
              take action on your behalf. Refund policies will be outlined in
              your service agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Your Responsibilities
            </h2>
            <p className="text-gray-600 mb-4">You agree to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Provide accurate and complete information about your issue</li>
              <li>
                Review and verify any information before taking action based on
                our guidance
              </li>
              <li>
                Meet any deadlines for appeals or actions, as we cannot be
                responsible for missed deadlines
              </li>
              <li>
                Keep copies of all documents and communications related to your
                issue
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Limitation of Liability
            </h2>
            <p className="text-gray-600">
              FreeHealthcareProxy and its operators shall not be liable for any
              direct, indirect, incidental, consequential, or punitive damages
              arising from your use of our services or reliance on information
              provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Changes to Terms
            </h2>
            <p className="text-gray-600">
              We may update these terms from time to time. Continued use of our
              services after changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Contact Us
            </h2>
            <p className="text-gray-600">
              If you have questions about these Terms, please contact us at{" "}
              <a
                href="mailto:legal@freehealthcareproxy.com"
                className="text-teal-600 hover:underline"
              >
                legal@freehealthcareproxy.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
