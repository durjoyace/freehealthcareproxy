import { describe, it, expect, beforeEach } from "vitest";
import {
  RuleBasedResolutionGenerator,
  type IssueInput,
  type ResolutionMap,
  type IssueType,
} from "@/lib/resolution-generator";

describe("RuleBasedResolutionGenerator", () => {
  let generator: RuleBasedResolutionGenerator;

  beforeEach(() => {
    generator = new RuleBasedResolutionGenerator();
  });

  describe("generate()", () => {
    it("should generate a resolution for denial issues", async () => {
      const input: IssueInput = {
        issueType: "denial",
        description: "My insurance denied my MRI claim",
        insurerName: "Blue Cross",
        hasDocuments: false,
      };

      const result = await generator.generate(input);

      expect(result).toBeDefined();
      expect(result.whatIsHappening).toContain("denied");
      expect(result.whoIsResponsible.parties.length).toBeGreaterThan(0);
      expect(result.nextSteps.length).toBeGreaterThan(0);
      expect(result.documentsNeeded.length).toBeGreaterThan(0);
      expect(["high", "medium", "low"]).toContain(result.likelihoodOfSuccess);
    });

    it("should generate a resolution for bill issues", async () => {
      const input: IssueInput = {
        issueType: "bill",
        description: "I got a confusing medical bill",
        providerName: "City Hospital",
        amountInvolved: 1500,
        hasDocuments: false,
      };

      const result = await generator.generate(input);

      expect(result).toBeDefined();
      expect(result.whatIsHappening).toContain("bill");
      expect(result.nextSteps.some((s) => s.action.toLowerCase().includes("itemized"))).toBe(true);
    });

    it("should generate a resolution for prior auth issues", async () => {
      const input: IssueInput = {
        issueType: "prior_auth",
        description: "My prior authorization is pending for 2 weeks",
        insurerName: "Aetna",
        hasDocuments: false,
      };

      const result = await generator.generate(input);

      expect(result).toBeDefined();
      expect(result.whatIsHappening).toContain("Prior authorization");
      expect(result.estimatedTimeframe).toBeDefined();
    });

    it("should generate a resolution for records issues", async () => {
      const input: IssueInput = {
        issueType: "records",
        description: "I need my medical records for a new doctor",
        providerName: "Dr. Smith's Office",
        hasDocuments: false,
      };

      const result = await generator.generate(input);

      expect(result).toBeDefined();
      expect(result.whatIsHappening).toContain("HIPAA");
      expect(result.likelihoodOfSuccess).toBe("high");
    });

    it("should generate a resolution for claim pending issues", async () => {
      const input: IssueInput = {
        issueType: "claim_pending",
        description: "My claim has been pending for 45 days",
        insurerName: "United Healthcare",
        hasDocuments: false,
      };

      const result = await generator.generate(input);

      expect(result).toBeDefined();
      expect(result.whatIsHappening).toContain("pending");
      expect(result.likelihoodOfSuccess).toBe("high");
    });

    it("should throw error for unknown issue type", async () => {
      const input: IssueInput = {
        issueType: "unknown" as IssueType,
        description: "Some issue",
        hasDocuments: false,
      };

      await expect(generator.generate(input)).rejects.toThrow("Unknown issue type");
    });
  });

  describe("resolution structure", () => {
    it("should return proper structure for all issue types", async () => {
      const issueTypes: IssueType[] = [
        "denial",
        "bill",
        "prior_auth",
        "records",
        "claim_pending",
      ];

      for (const issueType of issueTypes) {
        const input: IssueInput = {
          issueType,
          description: `Test description for ${issueType}`,
          hasDocuments: false,
        };

        const result = await generator.generate(input);

        // Check all required fields exist
        expect(result.whatIsHappening).toBeTruthy();
        expect(result.whoIsResponsible).toBeDefined();
        expect(result.whoIsResponsible.parties).toBeInstanceOf(Array);
        expect(result.whoIsResponsible.primaryContact).toBeTruthy();
        expect(result.likelihoodOfSuccess).toBeTruthy();
        expect(result.likelihoodReason).toBeTruthy();
        expect(result.nextSteps).toBeInstanceOf(Array);
        expect(result.documentsNeeded).toBeInstanceOf(Array);
        expect(result.estimatedTimeframe).toBeTruthy();
        expect(result.warnings).toBeInstanceOf(Array);
      }
    });

    it("should include proper next steps structure", async () => {
      const input: IssueInput = {
        issueType: "denial",
        description: "Insurance denied my claim",
        hasDocuments: false,
      };

      const result = await generator.generate(input);

      for (const step of result.nextSteps) {
        expect(step.order).toBeTypeOf("number");
        expect(step.action).toBeTruthy();
        expect(step.details).toBeTruthy();
      }
    });

    it("should include proper responsible parties structure", async () => {
      const input: IssueInput = {
        issueType: "bill",
        description: "Confusing bill",
        hasDocuments: false,
      };

      const result = await generator.generate(input);

      for (const party of result.whoIsResponsible.parties) {
        expect(party.name).toBeTruthy();
        expect(party.role).toBeTruthy();
        expect(party.contactMethod).toBeTruthy();
      }
    });
  });

  describe("likelihood assessment", () => {
    it("should return high likelihood for records requests", async () => {
      const input: IssueInput = {
        issueType: "records",
        description: "Need medical records",
        hasDocuments: false,
      };

      const result = await generator.generate(input);
      expect(result.likelihoodOfSuccess).toBe("high");
    });

    it("should return high likelihood for pending claims", async () => {
      const input: IssueInput = {
        issueType: "claim_pending",
        description: "Claim pending",
        hasDocuments: false,
      };

      const result = await generator.generate(input);
      expect(result.likelihoodOfSuccess).toBe("high");
    });

    it("should adjust likelihood based on amount for denials", async () => {
      const lowAmount: IssueInput = {
        issueType: "denial",
        description: "Denial",
        amountInvolved: 500,
        hasDocuments: false,
      };

      const highAmount: IssueInput = {
        issueType: "denial",
        description: "Denial",
        amountInvolved: 5000,
        hasDocuments: false,
      };

      const lowResult = await generator.generate(lowAmount);
      const highResult = await generator.generate(highAmount);

      expect(lowResult.likelihoodOfSuccess).toBe("high");
      expect(highResult.likelihoodOfSuccess).toBe("medium");
    });
  });

  describe("customization based on input", () => {
    it("should include insurer name in response when provided", async () => {
      const input: IssueInput = {
        issueType: "denial",
        description: "Denial",
        insurerName: "Cigna",
        hasDocuments: false,
      };

      const result = await generator.generate(input);
      expect(result.whatIsHappening).toContain("Cigna");
    });

    it("should include provider name in response when provided", async () => {
      const input: IssueInput = {
        issueType: "bill",
        description: "Bill",
        providerName: "Memorial Hospital",
        hasDocuments: false,
      };

      const result = await generator.generate(input);
      expect(result.whoIsResponsible.primaryContact).toContain("Memorial Hospital");
    });
  });
});
