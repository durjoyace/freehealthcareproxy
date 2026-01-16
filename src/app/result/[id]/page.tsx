import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Clock,
  Users,
  FileText,
  TrendingUp,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

const likelihoodColors = {
  high: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-red-100 text-red-800 border-red-200",
};

const likelihoodLabels = {
  high: "High Likelihood of Success",
  medium: "Medium Likelihood of Success",
  low: "Lower Likelihood of Success",
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
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-gray-900">FreeHealthcareProxy</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header Card */}
        <Card className="mb-6 border-teal-200 bg-gradient-to-r from-teal-50 to-white">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-teal-600 text-sm font-medium mb-2">
              <CheckCircle className="w-4 h-4" />
              Your Free Issue Resolution Map
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {issueTypeLabels[issue.issueType] || "Healthcare Issue"}
            </h1>
            <p className="text-gray-600 text-sm">
              Generated based on your description. Review your personalized action plan below.
            </p>
          </CardContent>
        </Card>

        {/* What's Happening */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              What&apos;s Happening
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {resolution.whatIsHappening}
            </p>
          </CardContent>
        </Card>

        {/* Likelihood */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-3 ${
                likelihoodColors[resolution.likelihoodOfSuccess as keyof typeof likelihoodColors]
              }`}
            >
              {likelihoodLabels[resolution.likelihoodOfSuccess as keyof typeof likelihoodLabels]}
            </div>
            <p className="text-gray-600 text-sm">{resolution.likelihoodReason}</p>
          </CardContent>
        </Card>

        {/* Who to Contact */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Users className="w-5 h-5 text-teal-600" />
              Who to Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-4">
              <div className="text-sm font-medium text-teal-800 mb-1">
                Start Here:
              </div>
              <p className="text-teal-700">{whoIsResponsible.primaryContact}</p>
            </div>

            <div className="space-y-3">
              {whoIsResponsible.parties.map(
                (
                  party: { name: string; role: string; contactMethod: string },
                  index: number
                ) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {party.name}
                      </div>
                      <div className="text-sm text-gray-500">{party.role}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {party.contactMethod}
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-teal-600" />
              Your Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {nextSteps.map(
                (
                  step: {
                    order: number;
                    action: string;
                    details: string;
                    deadline?: string;
                  },
                  index: number
                ) => (
                  <AccordionItem key={index} value={`step-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-7 h-7 bg-teal-600 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                          {step.order}
                        </div>
                        <span className="font-medium">{step.action}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pl-10">
                      <p className="text-gray-600 mb-2">{step.details}</p>
                      {step.deadline && (
                        <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md w-fit">
                          <Clock className="w-4 h-4" />
                          <span>{step.deadline}</span>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </CardContent>
        </Card>

        {/* Documents Needed */}
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-teal-600" />
              Documents You&apos;ll Need
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid sm:grid-cols-2 gap-2">
              {documentsNeeded.map((doc: string, index: number) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-700"
                >
                  <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 flex-shrink-0" />
                  {doc}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Estimated Timeframe */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-teal-600" />
              <div>
                <div className="text-sm text-gray-500">Estimated Timeframe</div>
                <div className="font-semibold text-gray-900">
                  {resolution.estimatedTimeframe}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Warnings */}
        {warnings.length > 0 && (
          <Card className="mb-6 border-amber-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg text-amber-800">
                <AlertTriangle className="w-5 h-5" />
                Watch Out For
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {warnings.map((warning: string, index: number) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-amber-800"
                  >
                    <span className="text-amber-500">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* CTA */}
        <Card className="bg-gradient-to-r from-teal-600 to-teal-700 text-white border-0">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-2">What&apos;s Next?</h3>
            <p className="text-teal-100 mb-4">
              You now have everything you need to handle this yourself. Or, if
              you&apos;d prefer, we can take care of it for you.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-teal-700 hover:bg-teal-50"
            >
              <Link href={`/next/${id}`}>
                See Your Options
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
