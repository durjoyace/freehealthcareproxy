"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  FileWarning,
  Receipt,
  Clock,
  FileText,
  HelpCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const issueTypes = [
  {
    value: "denial",
    label: "Insurance Denial",
    icon: FileWarning,
    description: "My insurance denied a claim or coverage",
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    selectedBg: "bg-red-50",
  },
  {
    value: "bill",
    label: "Confusing Bill / EOB",
    icon: Receipt,
    description: "I don't understand a medical bill or explanation of benefits",
    color: "text-amber-500",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    selectedBg: "bg-amber-50",
  },
  {
    value: "prior_auth",
    label: "Prior Authorization",
    icon: Clock,
    description: "Prior auth is pending, denied, or I need to expedite",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    selectedBg: "bg-blue-50",
  },
  {
    value: "records",
    label: "Medical Records",
    icon: FileText,
    description: "I need help getting my medical records",
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    selectedBg: "bg-purple-50",
  },
  {
    value: "claim_pending",
    label: "Claim Pending",
    icon: HelpCircle,
    description: "My insurance claim has been pending too long",
    color: "text-teal-500",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
    selectedBg: "bg-teal-50",
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
  const selectedType = issueTypes.find((t) => t.value === formData.issueType);

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

      if (!response.ok) throw new Error("Failed to submit issue");

      const { issueId } = await response.json();
      router.push(`/result/${issueId}`);
    } catch (error) {
      console.error("Error submitting issue:", error);
      setIsSubmitting(false);
    }
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
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="hidden sm:block">Step {step} of 3</span>
            <div className="w-32 sm:w-40">
              <Progress value={progress} className="h-2" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Step 1: Issue Type Selection */}
        {step === 1 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                What type of issue are you dealing with?
              </h1>
              <p className="text-gray-600">
                Select the option that best describes your situation
              </p>
            </div>

            <RadioGroup
              value={formData.issueType}
              onValueChange={(value) =>
                setFormData({ ...formData, issueType: value })
              }
              className="grid gap-3"
            >
              {issueTypes.map((type) => {
                const isSelected = formData.issueType === type.value;
                return (
                  <label
                    key={type.value}
                    className={`relative flex items-start gap-4 p-5 rounded-xl cursor-pointer transition-all hover-lift bg-white border-2 ${
                      isSelected
                        ? `${type.borderColor} ${type.selectedBg}`
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <RadioGroupItem value={type.value} className="mt-1" />
                    <div
                      className={`w-12 h-12 rounded-xl ${type.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <type.icon className={`w-6 h-6 ${type.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-gray-900 block mb-1">
                        {type.label}
                      </span>
                      <p className="text-sm text-gray-500">{type.description}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className={`w-5 h-5 ${type.color} flex-shrink-0`} />
                    )}
                  </label>
                );
              })}
            </RadioGroup>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" asChild>
                <Link href="/" className="text-gray-600">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <Button
                onClick={() => setStep(2)}
                disabled={!formData.issueType}
                className="shadow-glow-teal"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Description */}
        {step === 2 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div
                className={`w-14 h-14 rounded-xl ${selectedType?.bgColor} flex items-center justify-center mx-auto mb-4`}
              >
                {selectedType && (
                  <selectedType.icon className={`w-7 h-7 ${selectedType.color}`} />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Tell us what&apos;s happening
              </h1>
              <p className="text-gray-600">
                The more details you share, the better we can help
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 sm:p-8 space-y-6">
              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  Describe your situation *
                </Label>
                <p className="text-sm text-gray-500 mt-1 mb-3">
                  What happened? What have you tried? What outcome are you hoping for?
                </p>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Example: I received a bill for $2,500 from City Hospital for an ER visit last month. My insurance should have covered this but they only paid $200. I don't understand why..."
                  className="min-h-[140px] text-base"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="insurerName">Insurance Company</Label>
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
                  <Label htmlFor="providerName">Healthcare Provider</Label>
                  <Input
                    id="providerName"
                    value={formData.providerName}
                    onChange={(e) =>
                      setFormData({ ...formData, providerName: e.target.value })
                    }
                    placeholder="e.g., City Hospital"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => setStep(3)}
                disabled={!formData.description.trim()}
                className="shadow-glow-teal"
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Additional Details & Submit */}
        {step === 3 && (
          <div className="animate-fade-in">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-xl bg-teal-100 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-7 h-7 text-teal-600" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                Almost there!
              </h1>
              <p className="text-gray-600">
                Add any final details to help us give you the best guidance
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6 sm:p-8 space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="amountInvolved">Amount Involved ($)</Label>
                  <Input
                    id="amountInvolved"
                    type="number"
                    value={formData.amountInvolved}
                    onChange={(e) =>
                      setFormData({ ...formData, amountInvolved: e.target.value })
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
                      setFormData({ ...formData, dateOfService: e.target.value })
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className="rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      What happens next
                    </h3>
                    <p className="text-sm text-gray-600">
                      We&apos;ll analyze your situation and generate a personalized
                      Issue Resolution Map with exactly what&apos;s happening, who to
                      contact, your likelihood of success, and step-by-step next
                      actions—<strong>completely free</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="ghost" onClick={() => setStep(2)} className="text-gray-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                size="lg"
                className="shadow-glow-teal px-8"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    Get My Free Resolution Map
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
