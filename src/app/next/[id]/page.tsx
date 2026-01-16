"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Phone,
  Mail,
  FileEdit,
  Clock,
  Loader2,
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
    // Fetch issue type for context
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
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
        {/* Back Link */}
        <Link
          href={`/result/${id}`}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Resolution Map
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Your Path
        </h1>
        <p className="text-gray-600 mb-8">
          You have the information you need. Now decide how you want to proceed.
        </p>

        {!isSubmitted ? (
          <>
            {/* Choice Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* DIY Option */}
              <Card
                className={`cursor-pointer transition-all ${
                  choice === "diy"
                    ? "border-teal-500 ring-2 ring-teal-200"
                    : "hover:border-gray-300"
                }`}
                onClick={() => setChoice("diy")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-teal-600" />
                    </div>
                    {choice === "diy" && (
                      <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    I&apos;ll Handle It Myself
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Use your Resolution Map to take action on your own.
                  </p>
                  <div className="text-2xl font-bold text-teal-600">Free</div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      Step-by-step guide provided
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      All documents listed
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-teal-600" />
                      Contact info included
                    </li>
                  </ul>
                </CardContent>
              </Card>

              {/* Paid Option */}
              <Card
                className={`cursor-pointer transition-all ${
                  choice === "paid"
                    ? "border-teal-500 ring-2 ring-teal-200"
                    : "hover:border-gray-300"
                }`}
                onClick={() => setChoice("paid")}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-gray-600" />
                    </div>
                    {choice === "paid" && (
                      <div className="w-6 h-6 bg-teal-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Have Us Handle It
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    We take over and resolve your{" "}
                    {issueTypeLabels[issueType]?.toLowerCase() || "issue"} for you.
                  </p>
                  <div className="text-2xl font-bold text-gray-900">
                    Custom Quote
                  </div>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      We make all phone calls
                    </li>
                    <li className="flex items-center gap-2">
                      <FileEdit className="w-4 h-4 text-gray-500" />
                      We draft appeal letters
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      We follow up until resolved
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* DIY Confirmation */}
            {choice === "diy" && (
              <Card className="border-teal-200 bg-teal-50">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    You&apos;re All Set!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your Resolution Map has everything you need. Good luck!
                  </p>
                  <Button asChild>
                    <Link href={`/result/${id}`}>
                      View My Resolution Map
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Paid Lead Capture Form */}
            {choice === "paid" && (
              <Card>
                <CardHeader>
                  <CardTitle>Request a Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    We&apos;ll review your case and send you a custom quote within 24
                    hours.
                  </p>

                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={leadForm.email}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, email: e.target.value })
                      }
                      placeholder="you@example.com"
                      className="mt-1.5"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={leadForm.phone}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, phone: e.target.value })
                      }
                      placeholder="(555) 123-4567"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Preferred Contact Method</Label>
                    <RadioGroup
                      value={leadForm.preferredContact}
                      onValueChange={(value) =>
                        setLeadForm({ ...leadForm, preferredContact: value })
                      }
                      className="flex gap-4 mt-2"
                    >
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="email" />
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Email</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <RadioGroupItem value="phone" />
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">Phone</span>
                      </label>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={handleSubmitLead}
                    disabled={!leadForm.email || isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Request Quote
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-gray-500 text-center">
                    By submitting, you agree to our{" "}
                    <Link href="/terms" className="underline">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          /* Success State */
          <Card className="border-teal-200 bg-teal-50">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Quote Request Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                We&apos;ll review your case and get back to you within 24 hours with
                a custom quote for handling your{" "}
                {issueTypeLabels[issueType]?.toLowerCase() || "issue"}.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="outline">
                  <Link href={`/result/${id}`}>View Resolution Map</Link>
                </Button>
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
