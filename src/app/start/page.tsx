"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  FileWarning,
  Receipt,
  Clock,
  FileText,
  HelpCircle,
  Loader2,
} from "lucide-react";

const issueTypes = [
  {
    value: "denial",
    label: "Insurance Denial",
    icon: FileWarning,
    description: "My insurance denied a claim or coverage",
  },
  {
    value: "bill",
    label: "Confusing Bill / EOB",
    icon: Receipt,
    description: "I don't understand a medical bill or explanation of benefits",
  },
  {
    value: "prior_auth",
    label: "Prior Authorization",
    icon: Clock,
    description: "Prior auth is pending, denied, or I need to expedite",
  },
  {
    value: "records",
    label: "Medical Records",
    icon: FileText,
    description: "I need help getting my medical records",
  },
  {
    value: "claim_pending",
    label: "Claim Pending",
    icon: HelpCircle,
    description: "My insurance claim has been pending too long",
  },
];

export default function StartPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    issueType: "",
    description: "",
    insurerName: "",
    providerName: "",
    amountInvolved: "",
    dateOfService: "",
  });

  const progress = (step / 3) * 100;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amountInvolved: formData.amountInvolved
            ? parseFloat(formData.amountInvolved)
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit issue");
      }

      const { issueId } = await response.json();
      router.push(`/result/${issueId}`);
    } catch (error) {
      console.error("Error submitting issue:", error);
      setIsSubmitting(false);
    }
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

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span>Step {step} of 3</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Form */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>What type of issue are you dealing with?</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.issueType}
                onValueChange={(value) =>
                  setFormData({ ...formData, issueType: value })
                }
                className="grid gap-3"
              >
                {issueTypes.map((type) => (
                  <label
                    key={type.value}
                    className={`flex items-start gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                      formData.issueType === type.value
                        ? "border-teal-500 bg-teal-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <RadioGroupItem value={type.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <type.icon className="w-5 h-5 text-teal-600" />
                        <span className="font-medium text-gray-900">
                          {type.label}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              <div className="flex justify-between mt-6">
                <Button variant="ghost" asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Link>
                </Button>
                <Button
                  onClick={() => setStep(2)}
                  disabled={!formData.issueType}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Tell us what&apos;s happening</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">
                  Describe your situation in your own words *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Tell us what happened, what you've tried, and what outcome you're hoping for..."
                  className="mt-1.5 min-h-[120px]"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insurerName">Insurance Company (optional)</Label>
                  <Input
                    id="insurerName"
                    value={formData.insurerName}
                    onChange={(e) =>
                      setFormData({ ...formData, insurerName: e.target.value })
                    }
                    placeholder="e.g., Blue Cross, Aetna"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="providerName">
                    Healthcare Provider (optional)
                  </Label>
                  <Input
                    id="providerName"
                    value={formData.providerName}
                    onChange={(e) =>
                      setFormData({ ...formData, providerName: e.target.value })
                    }
                    placeholder="e.g., Hospital name, doctor's office"
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.description.trim()}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional details (optional)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amountInvolved">Amount Involved ($)</Label>
                  <Input
                    id="amountInvolved"
                    type="number"
                    value={formData.amountInvolved}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        amountInvolved: e.target.value,
                      })
                    }
                    placeholder="e.g., 500"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfService">Date of Service</Label>
                  <Input
                    id="dateOfService"
                    type="date"
                    value={formData.dateOfService}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        dateOfService: e.target.value,
                      })
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>

              <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 text-sm text-teal-800">
                <strong>What happens next:</strong> We&apos;ll analyze your situation
                and generate a free Issue Resolution Map with exactly what&apos;s
                happening, who to contact, and your next steps.
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      Get My Free Resolution Map
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
