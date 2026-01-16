import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FileWarning,
  Receipt,
  Clock,
  FileText,
  HelpCircle,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  Users,
  Sparkles,
} from "lucide-react";

const issueTypes = [
  {
    icon: FileWarning,
    title: "Insurance Denials",
    description: "Understand why your claim was denied and how to appeal effectively.",
    color: "from-red-500 to-orange-500",
    bgColor: "bg-red-50",
  },
  {
    icon: Receipt,
    title: "Confusing Bills",
    description: "Decode medical bills, spot errors, and know your negotiation options.",
    color: "from-amber-500 to-yellow-500",
    bgColor: "bg-amber-50",
  },
  {
    icon: Clock,
    title: "Prior Authorization",
    description: "Navigate approval delays and learn how to expedite urgent requests.",
    color: "from-blue-500 to-cyan-500",
    bgColor: "bg-blue-50",
  },
  {
    icon: FileText,
    title: "Medical Records",
    description: "Know your HIPAA rights and get your records without the runaround.",
    color: "from-purple-500 to-pink-500",
    bgColor: "bg-purple-50",
  },
  {
    icon: HelpCircle,
    title: "Pending Claims",
    description: "Find out what's holding up your claim and how to move it forward.",
    color: "from-teal-500 to-emerald-500",
    bgColor: "bg-teal-50",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe Your Issue",
    description: "Tell us what's happening in plain English. No medical jargon required.",
  },
  {
    number: "02",
    title: "Get Your Resolution Map",
    description: "We analyze your situation and create a personalized action plan—free.",
  },
  {
    number: "03",
    title: "Take Action",
    description: "Follow the steps yourself, or let us handle everything for a fee.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center shadow-glow-teal">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-gray-900 text-lg">
                FreeHealthcareProxy
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors hidden sm:block"
              >
                Terms
              </Link>
              <Button asChild size="sm" className="shadow-glow-teal">
                <Link href="/start">
                  Get Started
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 gradient-mesh relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="animate-fade-in stagger-1">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-100 text-teal-700 text-sm font-medium mb-8">
                <Sparkles className="w-4 h-4" />
                100% free to understand your situation
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-[1.1] mb-6 animate-fade-in stagger-2">
              Healthcare admin nightmare?
              <br />
              <span className="text-gradient">Get clarity in minutes.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto animate-fade-in stagger-3">
              Describe your problem. We&apos;ll tell you exactly what&apos;s happening,
              who to contact, and your step-by-step path to resolution.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in stagger-4">
              <Button asChild size="lg" className="text-base h-14 px-8 shadow-glow-teal">
                <Link href="/start">
                  Start Free — No Sign Up
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-base h-14 px-8">
                <Link href="#how-it-works">
                  See How It Works
                </Link>
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-gray-500 animate-fade-in stagger-5">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
                No account required
              </span>
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                Your data stays private
              </span>
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-600" />
                Real expert guidance
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Free Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity" />
              <div className="relative bg-white border-2 border-teal-200 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-5">
                  <CheckCircle2 className="w-6 h-6 text-teal-600" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-teal-100 text-teal-700 text-sm font-semibold mb-4">
                  Always Free
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Issue Resolution Map
                </h3>
                <ul className="space-y-3">
                  {[
                    "What's actually happening (plain English)",
                    "Who's responsible & how to reach them",
                    "Your likelihood of success",
                    "Step-by-step action plan",
                    "Documents you'll need",
                    "Timeline expectations",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Paid Card */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500 rounded-2xl blur-xl opacity-10 group-hover:opacity-20 transition-opacity" />
              <div className="relative bg-white border border-gray-200 rounded-2xl p-8 h-full">
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-5">
                  <Zap className="w-6 h-6 text-gray-600" />
                </div>
                <div className="inline-block px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-semibold mb-4">
                  Optional Upgrade
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  We Handle It For You
                </h3>
                <ul className="space-y-3">
                  {[
                    "Everything in the free plan",
                    "We make all the phone calls",
                    "Draft & send appeal letters",
                    "Negotiate with billing depts",
                    "Persistent follow-up",
                    "Resolution or your money back",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-600">
                      <CheckCircle2 className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center text-gray-500 mt-8 text-lg">
            <span className="font-medium text-gray-700">Start free.</span> Pay only if you want us to act.
          </p>
        </div>
      </section>

      {/* Issue Types */}
      <section className="py-20 gradient-mesh">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What can we help with?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select your issue type and get a customized resolution map
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {issueTypes.map((issue, index) => (
              <Link
                key={issue.title}
                href="/start"
                className="group relative bg-white rounded-2xl p-6 shadow-soft hover-lift border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-14 h-14 rounded-xl ${issue.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <issue.icon className={`w-7 h-7 bg-gradient-to-r ${issue.color} bg-clip-text`} style={{ color: issue.color.includes('red') ? '#ef4444' : issue.color.includes('amber') ? '#f59e0b' : issue.color.includes('blue') ? '#3b82f6' : issue.color.includes('purple') ? '#a855f7' : '#14b8a6' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {issue.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {issue.description}
                </p>
                <div className="mt-4 flex items-center text-teal-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Get help now
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-600">
              Three simple steps to clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-teal-300 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-24 h-24 rounded-2xl gradient-cta flex items-center justify-center mx-auto mb-6 shadow-glow-teal">
                    <span className="text-3xl font-bold text-white">{step.number}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Button asChild size="lg" className="h-14 px-10 text-base shadow-glow-teal">
              <Link href="/start">
                Get Your Free Resolution Map
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 gradient-cta relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxLTEuNzktNC00LTRzLTQgMS43OS00IDQgMS43OSA0IDQgNCA0LTEuNzkgNC00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Stop struggling with healthcare bureaucracy
          </h2>
          <p className="text-xl text-teal-100 mb-10 max-w-2xl mx-auto">
            Get your free Issue Resolution Map in minutes. No sign-up required.
          </p>
          <Button
            asChild
            size="lg"
            className="h-14 px-10 text-base bg-white text-teal-700 hover:bg-teal-50 shadow-medium"
          >
            <Link href="/start">
              Start Free Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-cta flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-700">FreeHealthcareProxy</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <Link href="/privacy" className="hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <span>&copy; {new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
