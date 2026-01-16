/**
 * Resolution Generator Module
 *
 * This module analyzes healthcare admin issues and generates structured "Issue Resolution Maps"
 * with deterministic rules/heuristics. The interface is designed to easily swap in an LLM later.
 */

export type IssueType = "denial" | "bill" | "prior_auth" | "records" | "claim_pending";

export interface IssueInput {
  issueType: IssueType;
  description: string;
  insurerName?: string;
  providerName?: string;
  amountInvolved?: number;
  dateOfService?: string;
  hasDocuments: boolean;
}

export interface ResponsibleParty {
  name: string;
  role: string;
  contactMethod: string;
}

export interface NextStep {
  order: number;
  action: string;
  details: string;
  deadline?: string;
}

export interface ResolutionMap {
  whatIsHappening: string;
  whoIsResponsible: {
    parties: ResponsibleParty[];
    primaryContact: string;
  };
  likelihoodOfSuccess: "high" | "medium" | "low";
  likelihoodReason: string;
  nextSteps: NextStep[];
  documentsNeeded: string[];
  estimatedTimeframe: string;
  warnings: string[];
}

/**
 * The main generator interface - designed for easy LLM swap-in later
 */
export interface ResolutionGenerator {
  generate(input: IssueInput): Promise<ResolutionMap>;
}

/**
 * Rule-based resolution generator (v1 implementation)
 */
export class RuleBasedResolutionGenerator implements ResolutionGenerator {
  async generate(input: IssueInput): Promise<ResolutionMap> {
    switch (input.issueType) {
      case "denial":
        return this.generateDenialResolution(input);
      case "bill":
        return this.generateBillResolution(input);
      case "prior_auth":
        return this.generatePriorAuthResolution(input);
      case "records":
        return this.generateRecordsResolution(input);
      case "claim_pending":
        return this.generateClaimPendingResolution(input);
      default:
        throw new Error(`Unknown issue type: ${input.issueType}`);
    }
  }

  private generateDenialResolution(input: IssueInput): ResolutionMap {
    const insurer = input.insurerName || "your insurance company";
    const provider = input.providerName || "your healthcare provider";
    const hasHighAmount = (input.amountInvolved || 0) > 1000;

    return {
      whatIsHappening: `Your insurance company (${insurer}) has denied coverage for a claim. This means they've decided not to pay for a service you received. Denials happen for many reasons: the service may have been deemed "not medically necessary," it may not be covered under your plan, or there may have been a coding or administrative error. The good news: most denials can be appealed, and a significant percentage of appeals succeed.`,

      whoIsResponsible: {
        parties: [
          {
            name: insurer,
            role: "Insurance Company",
            contactMethod: "Call the member services number on your insurance card",
          },
          {
            name: provider,
            role: "Healthcare Provider",
            contactMethod: "Contact their billing department",
          },
        ],
        primaryContact: `Start with ${insurer}'s member services to understand the exact denial reason`,
      },

      likelihoodOfSuccess: hasHighAmount ? "medium" : "high",
      likelihoodReason: hasHighAmount
        ? "Higher-value denials often require more documentation and persistence, but many are still successfully appealed with proper evidence."
        : "Many denials are due to administrative errors or missing information that can be corrected. First-level appeals have a good success rate.",

      nextSteps: [
        {
          order: 1,
          action: "Get the Denial Letter",
          details: `Request a written denial letter from ${insurer} if you haven't received one. This letter must include the specific reason code for denial.`,
          deadline: "Within 7 days",
        },
        {
          order: 2,
          action: "Understand the Denial Reason",
          details: "Read the denial code carefully. Common reasons include: lack of medical necessity, out-of-network provider, missing pre-authorization, or benefit exclusion.",
        },
        {
          order: 3,
          action: "Check Your Appeal Rights",
          details: "Your denial letter must include information about your appeal rights and deadlines. Most plans give you 180 days to file an internal appeal.",
        },
        {
          order: 4,
          action: "Gather Supporting Documentation",
          details: `Contact ${provider} to request medical records and a letter of medical necessity from your treating physician.`,
          deadline: "Within 14 days",
        },
        {
          order: 5,
          action: "File Internal Appeal",
          details: "Submit a written appeal letter with all supporting documentation. Send via certified mail and keep copies of everything.",
          deadline: "Check your denial letter for specific deadline",
        },
      ],

      documentsNeeded: [
        "Written denial letter with reason code",
        "Your insurance policy/plan documents",
        "Explanation of Benefits (EOB)",
        "Medical records related to the denied service",
        "Letter of medical necessity from your doctor",
        "Any prior authorization documentation",
      ],

      estimatedTimeframe: "4-8 weeks for internal appeal decision",

      warnings: [
        "Don't miss appeal deadlines - they're strictly enforced",
        "Keep copies of all correspondence",
        "If internal appeal fails, you have the right to an external review",
        "Never pay a denied claim until you've exhausted appeals",
      ],
    };
  }

  private generateBillResolution(input: IssueInput): ResolutionMap {
    const provider = input.providerName || "your healthcare provider";
    const insurer = input.insurerName || "your insurance company";
    const amount = input.amountInvolved || 0;
    const isHighBill = amount > 2000;

    return {
      whatIsHappening: `You've received a medical bill that seems confusing, unexpected, or potentially incorrect. Medical billing is notoriously complex—studies show that up to 80% of medical bills contain errors. Common issues include: duplicate charges, unbundling (charging separately for services that should be billed together), charges for services not received, incorrect insurance information, and balance billing (charging you for amounts your insurance should cover).`,

      whoIsResponsible: {
        parties: [
          {
            name: provider,
            role: "Healthcare Provider (Billing Department)",
            contactMethod: "Call the billing phone number on your bill",
          },
          {
            name: insurer,
            role: "Insurance Company",
            contactMethod: "Call member services to verify what they paid",
          },
        ],
        primaryContact: `Start with ${provider}'s billing department to request an itemized bill`,
      },

      likelihoodOfSuccess: isHighBill ? "high" : "medium",
      likelihoodReason: isHighBill
        ? "Higher bills have more line items that can contain errors. Providers are often willing to negotiate or correct mistakes on larger bills."
        : "Even smaller bills may contain errors. Always request an itemized statement to verify charges.",

      nextSteps: [
        {
          order: 1,
          action: "Request an Itemized Bill",
          details: `Call ${provider}'s billing department and request a detailed itemized statement showing every charge with procedure codes (CPT codes) and diagnosis codes (ICD codes).`,
          deadline: "Do this before paying anything",
        },
        {
          order: 2,
          action: "Compare to Your EOB",
          details: `Get your Explanation of Benefits (EOB) from ${insurer} for the same date of service. Compare what insurance paid vs. what you're being billed.`,
        },
        {
          order: 3,
          action: "Check for Common Errors",
          details: "Look for: duplicate charges, services you didn't receive, incorrect dates, wrong insurance information, and charges that should be covered.",
        },
        {
          order: 4,
          action: "Dispute Any Errors",
          details: "Call billing department to dispute specific charges. Document the date, time, and name of everyone you speak with.",
        },
        {
          order: 5,
          action: "Negotiate if Valid",
          details: "If charges are valid but unaffordable, ask about: payment plans, financial assistance programs, prompt-pay discounts, or reduced rates for uninsured/underinsured.",
        },
      ],

      documentsNeeded: [
        "Original bill received",
        "Itemized statement with CPT/ICD codes",
        "Explanation of Benefits (EOB) from insurance",
        "Your insurance card and policy information",
        "Any receipts or records from the visit",
        "Notes from calls with billing department",
      ],

      estimatedTimeframe: "2-4 weeks to resolve billing disputes",

      warnings: [
        "Never pay a bill without an itemized statement",
        "Don't ignore bills—they can be sent to collections",
        "Keep records of all phone calls and correspondence",
        "You have the right to dispute charges within 60 days of receiving the bill",
        "If sent to collections, you still have rights to verify the debt",
      ],
    };
  }

  private generatePriorAuthResolution(input: IssueInput): ResolutionMap {
    const insurer = input.insurerName || "your insurance company";
    const provider = input.providerName || "your healthcare provider";

    return {
      whatIsHappening: `Prior authorization (pre-auth) is insurance company permission required before certain medical services, medications, or procedures. Your prior auth may be: pending review, denied, or expired. This is one of the most frustrating parts of healthcare—insurers use it to control costs, but it can delay necessary care. Know that providers can request "expedited" or "urgent" reviews for time-sensitive situations.`,

      whoIsResponsible: {
        parties: [
          {
            name: provider,
            role: "Healthcare Provider",
            contactMethod: "Contact the office that ordered the service/procedure",
          },
          {
            name: insurer,
            role: "Insurance Company (Utilization Management)",
            contactMethod: "Call the prior authorization department number",
          },
        ],
        primaryContact: `Start with ${provider}—they typically submit prior auth requests on your behalf`,
      },

      likelihoodOfSuccess: "medium",
      likelihoodReason: "Prior auth issues are often resolved once the right documentation is submitted. If denied, appeals based on medical necessity have reasonable success rates.",

      nextSteps: [
        {
          order: 1,
          action: "Verify Request Status",
          details: `Call ${provider} to confirm a prior auth request was submitted and get the reference/tracking number.`,
          deadline: "Immediately",
        },
        {
          order: 2,
          action: "Check Insurance Status",
          details: `Call ${insurer}'s prior auth department with the reference number to check status. Ask: Is it pending? Denied? What additional information is needed?`,
        },
        {
          order: 3,
          action: "Request Expedited Review if Urgent",
          details: "If this is time-sensitive (within 72 hours needed), ask your doctor to request an urgent/expedited review. Insurers must respond within 24-72 hours for urgent requests.",
        },
        {
          order: 4,
          action: "Provide Missing Documentation",
          details: `If prior auth is pending due to missing info, work with ${provider} to submit required clinical documentation immediately.`,
        },
        {
          order: 5,
          action: "Appeal if Denied",
          details: "If denied, your doctor can submit a peer-to-peer review (doctor talks to insurance doctor) or file a formal appeal with additional medical justification.",
        },
      ],

      documentsNeeded: [
        "Prior authorization reference/tracking number",
        "Prescription or order for the service/medication",
        "Clinical notes supporting medical necessity",
        "Previous treatments tried (for step therapy requirements)",
        "Insurance policy showing covered services",
        "Doctor's letter of medical necessity",
      ],

      estimatedTimeframe: "Standard: 5-15 business days; Urgent: 24-72 hours",

      warnings: [
        "Don't schedule procedures without confirmed prior auth",
        "Prior authorizations can expire—check validity dates",
        "Some insurers require prior auth even for generic medications",
        "If you proceed without required prior auth, you may be responsible for full cost",
        "For urgent medical needs, go to the ER—prior auth isn't required for emergencies",
      ],
    };
  }

  private generateRecordsResolution(input: IssueInput): ResolutionMap {
    const provider = input.providerName || "the healthcare provider";

    return {
      whatIsHappening: `You're trying to obtain your medical records. Under HIPAA (Health Insurance Portability and Accountability Act), you have the legal right to access your medical records within 30 days of request (or 60 days for records not stored on-site). Providers can charge reasonable fees for copies but cannot deny access. Common reasons for needing records: transferring to a new doctor, reviewing your own health history, or preparing for a legal matter.`,

      whoIsResponsible: {
        parties: [
          {
            name: provider,
            role: "Healthcare Provider (Medical Records Department)",
            contactMethod: "Contact the medical records or health information management (HIM) department",
          },
        ],
        primaryContact: `${provider}'s medical records department—often separate from the main office`,
      },

      likelihoodOfSuccess: "high",
      likelihoodReason: "You have a legal right to your records under HIPAA. Providers must comply. Delays are usually administrative, not denials.",

      nextSteps: [
        {
          order: 1,
          action: "Submit Written Request",
          details: `Send a written request to ${provider}'s medical records department. Include: your full name, date of birth, dates of service, specific records requested, and how you want them delivered (mail, email, patient portal).`,
          deadline: "Start immediately",
        },
        {
          order: 2,
          action: "Complete Authorization Form",
          details: "Most providers require their own authorization form. Call to request one or download from their website. This must be signed and may need notarization for some requests.",
        },
        {
          order: 3,
          action: "Specify What You Need",
          details: "Be specific: office visit notes, lab results, imaging reports, operative notes, discharge summaries, etc. Request 'complete medical records' if unsure.",
        },
        {
          order: 4,
          action: "Follow Up at 15 Days",
          details: "If you haven't heard back in 15 days, call to check status. They have 30 days to comply (60 if records are off-site).",
          deadline: "15 days after request",
        },
        {
          order: 5,
          action: "File Complaint if Delayed",
          details: "If they don't comply within legal timeframes, you can file a complaint with the HHS Office for Civil Rights (OCR).",
        },
      ],

      documentsNeeded: [
        "Government-issued photo ID",
        "Completed records request/authorization form",
        "List of specific records or dates needed",
        "Method of delivery preference",
        "Payment for copying fees (if applicable)",
      ],

      estimatedTimeframe: "15-30 days (legally required)",

      warnings: [
        "Providers can charge reasonable copying fees—ask about costs upfront",
        "Electronic records must be provided in electronic format if you request it",
        "You can request records be sent directly to another provider",
        "Providers cannot withhold records due to unpaid medical bills",
        "You can request amendments to incorrect information in your records",
      ],
    };
  }

  private generateClaimPendingResolution(input: IssueInput): ResolutionMap {
    const insurer = input.insurerName || "your insurance company";
    const provider = input.providerName || "your healthcare provider";

    return {
      whatIsHappening: `Your insurance claim is in "pending" status, meaning it hasn't been fully processed yet. Claims can pend for various reasons: waiting for additional information, coordination of benefits questions, provider credentialing issues, or simply a backlog. Most claims should process within 30-45 days. A pending claim does NOT mean it's denied—it's just not finalized yet.`,

      whoIsResponsible: {
        parties: [
          {
            name: insurer,
            role: "Insurance Company (Claims Department)",
            contactMethod: "Call member services and ask for claims status",
          },
          {
            name: provider,
            role: "Healthcare Provider",
            contactMethod: "Contact billing to verify claim was submitted correctly",
          },
        ],
        primaryContact: `${insurer}'s claims department—ask specifically why the claim is pending`,
      },

      likelihoodOfSuccess: "high",
      likelihoodReason: "Most pending claims are eventually processed and paid. The key is identifying what's holding up processing and addressing it quickly.",

      nextSteps: [
        {
          order: 1,
          action: "Get Claim Details",
          details: `Call ${insurer} and get: claim number, date received, current status, and specific reason for pending status. Write everything down.`,
          deadline: "Within 7 days",
        },
        {
          order: 2,
          action: "Identify the Hold-Up",
          details: "Common reasons: missing information from provider, coordination of benefits (COB) questions, medical records needed, or claim under review.",
        },
        {
          order: 3,
          action: "Address the Issue",
          details: `Work with ${provider} and ${insurer} to provide whatever is needed. If COB, complete the COB questionnaire. If records needed, authorize their release.`,
          deadline: "Within 7-14 days",
        },
        {
          order: 4,
          action: "Request Timeline",
          details: "Ask the insurance company when you can expect a decision. Most states require claims to be processed within 30-45 days of receiving all information.",
        },
        {
          order: 5,
          action: "Escalate if Necessary",
          details: "If claim pends beyond 45 days with no resolution, ask to escalate to a supervisor or file a complaint with your state's insurance commissioner.",
        },
      ],

      documentsNeeded: [
        "Claim number and date of service",
        "Insurance member ID and group number",
        "Explanation of Benefits (EOB) if any",
        "Provider's billing statement",
        "Any correspondence from insurance about the claim",
        "Coordination of Benefits form (if applicable)",
      ],

      estimatedTimeframe: "2-4 weeks once all information is provided",

      warnings: [
        "Don't pay the provider until insurance processes the claim",
        "A pending claim is NOT a denial—don't panic",
        "Keep notes of every call: date, time, representative name, reference numbers",
        "If you have multiple insurance plans, COB must be resolved first",
        "Providers typically can't send you to collections while claims are pending",
      ],
    };
  }
}

// Import Claude generator
import { ClaudeResolutionGenerator } from "./claude-resolution-generator";

/**
 * Factory function to create the appropriate resolution generator
 * Uses Claude if API key is available, otherwise falls back to rule-based
 */
export function createResolutionGenerator(): ResolutionGenerator {
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

  if (hasApiKey) {
    console.log("Using Claude-powered resolution generator");
    return new ClaudeResolutionGenerator();
  }

  console.log("Using rule-based resolution generator (no API key)");
  return new RuleBasedResolutionGenerator();
}

// Export singleton instance - uses Claude if available
export const resolutionGenerator = createResolutionGenerator();

// Also export the rule-based generator for testing/fallback
export const ruleBasedGenerator = new RuleBasedResolutionGenerator();
