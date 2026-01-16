import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FileWarning,
  Receipt,
  Clock,
  FileText,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const issueTypes = [
  {
    icon: FileWarning,
    title: "Insurance Denial",
    description: "Claim denied? We'll explain why and your appeal options.",
  },
  {
    icon: Receipt,
    title: "Confusing Bill / EOB",
    description: "Don't understand the charges? We'll break it down.",
  },
  {
    icon: Clock,
    title: "Prior Auth Stuck",
    description: "Waiting on approval? We'll show you how to expedite.",
  },
  {
    icon: FileText,
    title: "Records Request",
    description: "Need your records? We'll guide you through HIPAA rights.",
  },
  {
    icon: HelpCircle,
    title: "Claim Pending",
    description: "Claim in limbo? We'll help you find out what's holding it up.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">FreeHealthcareProxy</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-gray-900">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-gray-900">
              Terms
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium mb-6">
            <CheckCircle className="w-4 h-4" />
            100% free to understand your situation
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Healthcare admin problem?
            <br />
            <span className="text-teal-600">Get clarity in minutes.</span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Tell us what&apos;s happening. We&apos;ll give you a free{" "}
            <strong>Issue Resolution Map</strong>—what&apos;s going on, who to
            contact, and your exact next steps.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="text-base">
              <Link href="/start">
                Start Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Free/Paid Line */}
          <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-xl p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="text-left">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Free</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Full issue analysis</li>
                  <li>• Step-by-step action plan</li>
                  <li>• Documents checklist</li>
                  <li>• Timeline estimate</li>
                </ul>
              </div>
              <div className="text-left border-t md:border-t-0 md:border-l border-gray-200 pt-6 md:pt-0 md:pl-6">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Optional Paid</span>
                </div>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• We handle it for you</li>
                  <li>• Phone calls on your behalf</li>
                  <li>• Appeal letter drafting</li>
                  <li>• Follow-up until resolved</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center text-sm text-gray-500">
              Start free. Pay only if you want us to act.
            </div>
          </div>
        </div>
      </section>

      {/* Issue Types */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            What can we help with?
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {issueTypes.map((issue) => (
              <Card
                key={issue.title}
                className="hover:border-teal-300 transition-colors"
              >
                <CardContent className="p-5">
                  <issue.icon className="w-8 h-8 text-teal-600 mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {issue.title}
                  </h3>
                  <p className="text-sm text-gray-600">{issue.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/start">
                Get Your Free Resolution Map
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
            How it works
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Describe Your Issue
              </h3>
              <p className="text-sm text-gray-600">
                Select your issue type and tell us what&apos;s happening in your
                own words.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Get Your Resolution Map
              </h3>
              <p className="text-sm text-gray-600">
                We analyze your situation and give you a clear action plan—free.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-teal-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Act (DIY or We Handle It)
              </h3>
              <p className="text-sm text-gray-600">
                Follow the steps yourself, or let us take over for a fee.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-5xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div>&copy; {new Date().getFullYear()} FreeHealthcareProxy</div>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-gray-900">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-gray-900">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
