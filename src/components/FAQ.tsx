"use client";

import { useState } from "react";

const faqs = [
  {
    question: "Is the free guidance really free?",
    answer: "Yes, 100%. We believe everyone deserves to understand their healthcare situation. Our free service includes a full explanation of your problem, your rights, and your options. We only charge if you want us to handle things on your behalf.",
  },
  {
    question: "What qualifies as a healthcare admin problem?",
    answer: "Anything involving paperwork, billing, or bureaucracy — confusing medical bills, insurance claim denials, prior authorization issues, medical records requests, billing disputes, explanation of benefits (EOB) confusion, and more.",
  },
  {
    question: "How long does it take to get help?",
    answer: "We typically respond within 24-48 hours with your free guidance. For urgent matters (like time-sensitive appeals), let us know and we'll prioritize your case.",
  },
  {
    question: "What information do I need to provide?",
    answer: "The more you can share, the better we can help. Ideally: the document(s) you're confused about (bills, denial letters, EOBs), your insurance information, and a brief description of what happened. But even if you only have questions, reach out!",
  },
  {
    question: "Can you guarantee results?",
    answer: "We can't guarantee specific outcomes — healthcare systems are complex. But we can guarantee you'll understand your situation better and know exactly what steps to take. Many issues can be resolved once you know how to approach them.",
  },
  {
    question: "How is my information protected?",
    answer: "We take privacy seriously. Your health information is kept strictly confidential and is only used to help with your specific case. We never share or sell your data.",
  },
  {
    question: "What if I already tried to resolve this myself?",
    answer: "That's common! Many people come to us after hitting a wall. Share what you've already tried, and we'll help you figure out alternative approaches or escalation paths you might not know about.",
  },
  {
    question: "Do you work with any insurance company?",
    answer: "Yes, we can help regardless of your insurance provider — or even if you're uninsured. The healthcare system's complexity affects everyone, and the strategies for navigating it are often similar across carriers.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-16 md:py-24 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Got questions? We&apos;ve got answers.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <svg
                  className={`w-5 h-5 text-gray-500 transition-transform flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
