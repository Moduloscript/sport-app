import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms and Conditions</h1>
        <p className="text-gray-600">Last updated: March 5, 2025</p>
      </div>

      <div className="prose prose-sm max-w-none">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using our services, you agree to be bound by these terms.
          If you do not agree to all the terms, you may not access or use our services.
        </p>

        <h2>2. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          and password and for restricting access to your account. You agree to
          accept responsibility for all activities that occur under your account.
        </p>

        <h2>3. Content</h2>
        <p>
          All content provided on our platform is for informational purposes only.
          We reserve the right to modify or discontinue any content at any time
          without notice.
        </p>

        <h2>4. Privacy</h2>
        <p>
          Your use of our services is subject to our Privacy Policy. Please review
          our Privacy Policy, which explains how we collect, use, and protect your
          personal information.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event shall we be liable for any damages arising out of or in
          connection with your use or inability to use our services.
        </p>

        <h2>6. Changes to Terms</h2>
        <p>
          We reserve the right to modify these terms at any time. Your continued
          use of our services after any such changes constitutes your acceptance
          of the new terms.
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link href="/privacy">
          <Button variant="outline">
            View Privacy Policy
          </Button>
        </Link>
        <Link href="/signup">
          <Button variant="outline">
            Return to Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
