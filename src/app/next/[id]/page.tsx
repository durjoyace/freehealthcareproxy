"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Phone,
  Mail,
  FileEdit,
  Clock,
  Loader2,
  Sparkles,
  Shield,
  Users,
  HeartHandshake,
} from "lucide-react";

export default function NextStepsPage() {
  const params = useParams();
  const id = params.id as string;
  const [choice, setChoice] = useState<"diy" | "paid" | "">("");
  const [leadForm, setLeadForm] = useState({
    email: "",
    phone: "",
    preferredContact: "email",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [issueType, setIssueType] = useState("");

  useEffect(() => {
    fetch(`/api/issues?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.issueType) {
          setIssueType(data.issueType);
        }
      })
      .catch(console.error);
  }, [id]);

  const handleSubmitLead = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId: id,
          ...leadForm,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting lead:", error);
    }
    setIsSubmitting(false);
  };

  const issueTypeLabels: Record<string, string> = {
    denial: "Insurance Denial",
    bill: "Medical Bill / EOB",
    prior_auth: "Prior Authorization",
    records: "Medical Records Request",
    claim_pending: "Pending Claim",
  };

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Header */}
      <header className="glass border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center shadow-glow-teal">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg hidden sm:block">
              FreeHealthcareProxy
            </span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href={`/result/${id}`} className="text-gray-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Map
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {!isSubmitted ? (
          <div className="animate-fade-in">
            {/* Hero Section */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-gray-200 shadow-soft mb-6">
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-gray-700">
                  Choose What Works Best for You
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                How Would You Like to{" "}
                <span className="text-gradient">Proceed?</span>
              </h1>
              <p className="text-gray-600 text-lg max-w-lg mx-auto">
                You have your Resolution Map. Now decide: take action yourself, or let us handle everything.
              </p>
            </div>

            {/* Choice Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* DIY Option */}
              <button
                onClick={() => setChoice("diy")}
                className={`relative text-left p-6 rounded-2xl border-2 transition-all hover-lift bg-white ${
                  choice === "diy"
                    ? "border-teal-400 shadow-glow-teal"
                    : "border-gray-200 hover:border-gray-300 shadow-soft"
                }`}
              >
                {choice === "diy" && (
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full gradient-cta flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 flex items-center justify-center mb-5">
                  <Shield className="w-7 h-7 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  I&apos;ll Handle It Myself
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  Use your personalized Resolution Map to take action on your own terms.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-100 mb-5">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span className="text-lg font-bold text-teal-700">Free Forever</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    Complete step-by-step action plan
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    All required documents listed
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-teal-500 flex-shrink-0" />
                    Contact info & deadlines included
                  </li>
                </ul>
              </button>

              {/* Paid Option */}
              <button
                onClick={() => setChoice("paid")}
                className={`relative text-left p-6 rounded-2xl border-2 transition-all hover-lift bg-white ${
                  choice === "paid"
                    ? "border-purple-400 shadow-medium"
                    : "border-gray-200 hover:border-gray-300 shadow-soft"
                }`}
              >
                {choice === "paid" && (
                  <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute -top-3 left-6">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-semibold shadow-medium">
                    <Sparkles className="w-3 h-3" />
                    Save Time
                  </span>
                </div>
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 flex items-center justify-center mb-5">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Have Us Handle It
                </h3>
                <p className="text-gray-600 text-sm mb-5">
                  We take over completely and resolve your{" "}
                  {issueTypeLabels[issueType]?.toLowerCase() || "issue"} for you.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 mb-5">
                  <span className="text-lg font-bold text-purple-700">Custom Quote</span>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <Phone className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    We make all the phone calls
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <FileEdit className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    We draft appeal letters for you
                  </li>
                  <li className="flex items-center gap-3 text-sm text-gray-600">
                    <Clock className="w-5 h-5 text-purple-500 flex-shrink-0" />
                    We follow up until it&apos;s resolved
                  </li>
                </ul>
              </button>
            </div>

            {/* DIY Confirmation */}
            {choice === "diy" && (
              <div className="animate-fade-in rounded-2xl border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-cyan-50 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  You&apos;re All Set!
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Your Resolution Map has everything you need to resolve this yourself. You&apos;ve got this!
                </p>
                <Button asChild size="lg" className="shadow-glow-teal">
                  <Link href={`/result/${id}`}>
                    View My Resolution Map
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Paid Lead Capture Form */}
            {choice === "paid" && (
              <div className="animate-fade-in bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Request Your Custom Quote
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    We&apos;ll review your case and send you a personalized quote within 24 hours.
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={leadForm.email}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="mt-2"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      Phone Number <span className="text-gray-400">(optional)</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, phone: e.target.value })
                      }
                      placeholder="(555) 123-4567"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Preferred Contact Method</Label>
                    <RadioGroup
                      value={leadForm.preferredContact}
                      onValueChange={(value) =>
                        setLeadForm({ ...leadForm, preferredContact: value })
                      }
                      className="flex gap-6 mt-3"
                    >
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex-1">
                        <RadioGroupItem value="email" />
                        <Mail className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium">Email</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex-1">
                        <RadioGroupItem value="phone" />
                        <Phone className="w-5 h-5 text-gray-500" />
                        <span className="text-sm font-medium">Phone</span>
                      </label>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={handleSubmitLead}
                    disabled={!leadForm.email || isSubmitting}
                    size="lg"
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-medium"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request My Quote
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center pt-2">
                    By submitting, you agree to our{" "}
                    <Link href="/terms" className="text-teal-600 hover:underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-teal-600 hover:underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Success State */
          <div className="animate-fade-in">
            <div className="relative overflow-hidden rounded-2xl gradient-cta p-8 sm:p-10 text-center">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  Quote Request Submitted!
                </h3>
                <p className="text-teal-100 text-lg mb-8 max-w-md mx-auto">
                  We&apos;ll review your case and get back to you within 24 hours with a custom quote for handling your{" "}
                  {issueTypeLabels[issueType]?.toLowerCase() || "issue"}.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                    <Link href={`/result/${id}`}>
                      View Resolution Map
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50">
                    <Link href="/">
                      Back to Home
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* What Happens Next */}
            <div className="mt-8 bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
              <h4 className="font-semibold text-gray-900 mb-4">What Happens Next?</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700 font-bold text-sm">
                    1
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Case Review</div>
                    <p className="text-sm text-gray-600">Our team reviews your issue and Resolution Map</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700 font-bold text-sm">
                    2
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Custom Quote</div>
                    <p className="text-sm text-gray-600">We email you a personalized quote within 24 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 text-teal-700 font-bold text-sm">
                    3
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Your Decision</div>
                    <p className="text-sm text-gray-600">Review the quote and decide if you want us to proceed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
