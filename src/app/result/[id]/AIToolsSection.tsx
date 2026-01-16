"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/ChatInterface";
import {
  MessageSquare,
  FileEdit,
  PhoneCall,
  X,
  Loader2,
  Copy,
  Check,
  Sparkles,
} from "lucide-react";

interface AIToolsSectionProps {
  issueId: string;
  issueType: string;
}

export function AIToolsSection({ issueId, issueType }: AIToolsSectionProps) {
  const [showChat, setShowChat] = useState(false);
  const [showDocument, setShowDocument] = useState<"appeal" | "script" | null>(null);
  const [generatedDocument, setGeneratedDocument] = useState<{
    title: string;
    content: string;
    instructions: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateDocument = async (type: "appeal" | "script") => {
    setIsGenerating(true);
    setShowDocument(type);
    setGeneratedDocument(null);

    try {
      const endpoint =
        type === "appeal"
          ? "/api/generate/appeal-letter"
          : "/api/generate/phone-script";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId }),
      });

      if (!response.ok) throw new Error("Failed to generate document");

      const data = await response.json();
      setGeneratedDocument(data.document);
    } catch (error) {
      console.error("Error generating document:", error);
      setGeneratedDocument({
        title: "Error",
        content: "Sorry, we couldn't generate the document. Please try again.",
        instructions: "",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedDocument) {
      await navigator.clipboard.writeText(generatedDocument.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const showsAppealButton = ["denial", "bill", "prior_auth"].includes(issueType);

  return (
    <>
      {/* AI Tools Section */}
      <section className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">AI-Powered Tools</h2>
            <p className="text-sm text-gray-500">Get personalized help with your issue</p>
          </div>
        </div>
        <div className="p-6">
          <div className="grid sm:grid-cols-3 gap-4">
            {/* Chat Button */}
            <button
              onClick={() => setShowChat(true)}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">Ask Questions</div>
                <div className="text-sm text-gray-500">Chat with AI</div>
              </div>
            </button>

            {/* Appeal Letter Button */}
            {showsAppealButton && (
              <button
                onClick={() => generateDocument("appeal")}
                className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileEdit className="w-6 h-6 text-teal-600" />
                </div>
                <div className="text-center">
                  <div className="font-semibold text-gray-900">Appeal Letter</div>
                  <div className="text-sm text-gray-500">Generate draft</div>
                </div>
              </button>
            )}

            {/* Phone Script Button */}
            <button
              onClick={() => generateDocument("script")}
              className="flex flex-col items-center gap-3 p-5 rounded-xl border-2 border-gray-200 hover:border-amber-300 hover:bg-amber-50 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PhoneCall className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900">Phone Script</div>
                <div className="text-sm text-gray-500">What to say</div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-50 rounded-2xl w-full max-w-2xl h-[80vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ask Questions</h3>
                  <p className="text-sm text-gray-500">Get help with your issue</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <ChatInterface issueId={issueId} />
            </div>
          </div>
        </div>
      )}

      {/* Document Generation Modal */}
      {showDocument && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    showDocument === "appeal"
                      ? "bg-gradient-to-br from-teal-100 to-cyan-100"
                      : "bg-gradient-to-br from-amber-100 to-orange-100"
                  }`}
                >
                  {showDocument === "appeal" ? (
                    <FileEdit className="w-5 h-5 text-teal-600" />
                  ) : (
                    <PhoneCall className="w-5 h-5 text-amber-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {showDocument === "appeal" ? "Appeal Letter" : "Phone Script"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {isGenerating ? "Generating..." : "Customize and use"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowDocument(null);
                  setGeneratedDocument(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-teal-600 mb-4" />
                  <p className="text-gray-600">
                    Generating your{" "}
                    {showDocument === "appeal" ? "appeal letter" : "phone script"}...
                  </p>
                  <p className="text-sm text-gray-400 mt-2">This may take a moment</p>
                </div>
              ) : generatedDocument ? (
                <div>
                  {generatedDocument.instructions && (
                    <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <p className="text-sm text-amber-800">
                        <strong>Instructions:</strong> {generatedDocument.instructions}
                      </p>
                    </div>
                  )}
                  <div className="prose prose-sm max-w-none">
                    <pre className="whitespace-pre-wrap bg-gray-50 p-6 rounded-xl text-sm text-gray-800 font-sans leading-relaxed border border-gray-200">
                      {generatedDocument.content}
                    </pre>
                  </div>
                </div>
              ) : null}
            </div>

            {generatedDocument && !isGenerating && (
              <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                <Button variant="outline" onClick={copyToClipboard}>
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    setShowDocument(null);
                    setGeneratedDocument(null);
                  }}
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
