import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-gray-600">Last updated: March 5, 2025</p>
      </div>

      <div className="prose prose-sm max-w-none">
        <h2>1. Information We Collect</h2>
        <p>
          We collect information you provide directly to us, such as when you
          create an account, update your profile, or use our services. This may
          include your name, email address, and other contact information.
        </p>

        <h2>2. How We Use Information</h2>
        <p>
          We use the information we collect to provide, maintain, and improve our
          services, to develop new features, and to protect our users.
        </p>

        <h2>3. Information Sharing</h2>
        <p>
          We do not share your personal information with third parties except as
          described in this policy or with your consent.
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement security measures designed to protect your information from
          unauthorized access, alteration, and disclosure.
        </p>

        <h2>5. Your Choices</h2>
        <p>
          You may update, correct, or delete information about you at any time by
          logging into your account and modifying your profile.
        </p>

        <h2>6. Changes to This Policy</h2>
        <p>
          We may modify this Privacy Policy from time to time. If we make material
          changes, we will notify you by updating the date at the top of the policy.
        </p>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Link href="/terms">
          <Button variant="outline">
            View Terms
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
