import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  TrendingUp,
  Phone,
  Sparkles,
  Target,
  Calendar,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const likelihoodConfig = {
  high: {
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    icon: "text-emerald-500",
    label: "High Likelihood of Success",
  },
  medium: {
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    icon: "text-amber-500",
    label: "Medium Likelihood of Success",
  },
  low: {
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    icon: "text-red-500",
    label: "May Require Extra Effort",
  },
};

const issueTypeLabels: Record<string, string> = {
  denial: "Insurance Denial",
  bill: "Medical Bill / EOB",
  prior_auth: "Prior Authorization",
  records: "Medical Records Request",
  claim_pending: "Pending Claim",
};

export default async function ResultPage({ params }: PageProps) {
  const { id } = await params;

  const issue = await prisma.issue.findUnique({
    where: { id },
    include: { resolution: true },
  });

  if (!issue || !issue.resolution) {
    notFound();
  }

  const resolution = issue.resolution;
  const whoIsResponsible = JSON.parse(resolution.whoIsResponsible);
  const nextSteps = JSON.parse(resolution.nextSteps);
  const documentsNeeded = JSON.parse(resolution.documentsNeeded);
  const warnings = resolution.warnings ? JSON.parse(resolution.warnings) : [];
  const likelihood = likelihoodConfig[resolution.likelihoodOfSuccess as keyof typeof likelihoodConfig];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="glass border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-cta flex items-center justify-center shadow-glow-teal">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-gray-900 text-lg hidden sm:block">
              FreeHealthcareProxy
            </span>
          </Link>
          <Button asChild className="shadow-glow-teal">
            <Link href={`/next/${id}`}>
              Next Steps
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-2xl gradient-cta p-8 mb-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-center gap-2 text-teal-100 text-sm font-medium mb-3">
              <Sparkles className="w-4 h-4" />
              Your Free Issue Resolution Map
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              {issueTypeLabels[issue.issueType] || "Healthcare Issue"}
            </h1>
            <p className="text-teal-100 max-w-xl">
              Personalized guidance based on your situation. Review your action plan below.
            </p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="space-y-6">
          {/* What's Happening */}
          <section className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">What&apos;s Happening</h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                {resolution.whatIsHappening}
              </p>
            </div>
          </section>

          {/* Likelihood + Timeframe Row */}
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Likelihood */}
            <div className={`rounded-2xl border-2 ${likelihood.borderColor} ${likelihood.bgColor} p-6`}>
              <div className="flex items-center gap-3 mb-3">
                <Target className={`w-6 h-6 ${likelihood.icon}`} />
                <span className={`font-semibold ${likelihood.color}`}>
                  {likelihood.label}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{resolution.likelihoodReason}</p>
            </div>

            {/* Timeframe */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-gray-500" />
                <span className="font-semibold text-gray-900">Estimated Timeline</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {resolution.estimatedTimeframe}
              </p>
            </div>
          </div>

          {/* Who to Contact */}
          <section className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Who to Contact</h2>
            </div>
            <div className="p-6">
              {/* Primary Contact */}
              <div className="rounded-xl bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-100 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-teal-700 mb-1">Start Here</div>
                    <p className="text-gray-800 font-medium">{whoIsResponsible.primaryContact}</p>
                  </div>
                </div>
              </div>

              {/* All Parties */}
              <div className="space-y-3">
                {whoIsResponsible.parties.map(
                  (party: { name: string; role: string; contactMethod: string }, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900">{party.name}</div>
                        <div className="text-sm text-gray-500 mb-1">{party.role}</div>
                        <div className="text-sm text-gray-600">{party.contactMethod}</div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>

          {/* Next Steps */}
          <section className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-teal-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Your Action Plan</h2>
            </div>
            <div className="p-6">
              <Accordion type="single" collapsible defaultValue="step-0" className="space-y-3">
                {nextSteps.map(
                  (step: { order: number; action: string; details: string; deadline?: string }, index: number) => (
                    <AccordionItem
                      key={index}
                      value={`step-${index}`}
                      className="border border-gray-200 rounded-xl px-4 data-[state=open]:bg-gray-50"
                    >
                      <AccordionTrigger className="hover:no-underline py-4">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-9 h-9 rounded-lg gradient-cta flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {step.order}
                          </div>
                          <span className="font-semibold text-gray-900">{step.action}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 pl-[52px]">
                        <p className="text-gray-600 mb-3">{step.details}</p>
                        {step.deadline && (
                          <div className="inline-flex items-center gap-2 text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                            <Clock className="w-4 h-4" />
                            {step.deadline}
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>
            </div>
          </section>

          {/* Documents Needed */}
          <section className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Documents You&apos;ll Need</h2>
            </div>
            <div className="p-6">
              <div className="grid sm:grid-cols-2 gap-3">
                {documentsNeeded.map((doc: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-gray-50"
                  >
                    <CheckCircle2 className="w-5 h-5 text-teal-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{doc}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Warnings */}
          {warnings.length > 0 && (
            <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 overflow-hidden">
              <div className="px-6 py-4 border-b border-amber-200 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <h2 className="text-lg font-semibold text-amber-900">Watch Out For</h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {warnings.map((warning: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-amber-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Bottom CTA */}
          <section className="relative overflow-hidden rounded-2xl gradient-cta p-8 text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
            <div className="relative">
              <h3 className="text-2xl font-bold text-white mb-3">What&apos;s Next?</h3>
              <p className="text-teal-100 mb-6 max-w-lg mx-auto">
                You have everything you need to handle this yourself. Or, let us take care of it for you.
              </p>
              <Button asChild size="lg" className="bg-white text-teal-700 hover:bg-teal-50 shadow-medium">
                <Link href={`/next/${id}`}>
                  See Your Options
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
