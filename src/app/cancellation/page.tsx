import type { Metadata } from "next";
import Link from "next/link";
import { LegalPageShell } from "@/components/legal/legal-page-shell";
import { LEGAL } from "@/lib/legal/site";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Cancellation Policy",
  description: `How to cancel your ${LEGAL.productName} subscription and billing.`,
  path: "/cancellation",
});

export default function CancellationPolicyPage() {
  return (
    <LegalPageShell
      title="Cancellation Policy"
      description={`This Cancellation Policy explains how clinic subscriptions and billing work when you cancel ${LEGAL.productName}.`}
    >
      <h2>1. Scope</h2>
      <p>
        This policy applies to paid subscriptions for clinic accounts on {LEGAL.productName}.
        It supplements our <Link href="/terms">Terms of Service</Link>. Patient intake links
        are not separate subscriptions and are not billed directly to patients through this
        policy.
      </p>

      <h2>2. Sign up and subscribe</h2>
      <p>
        Clinics sign up to create a workspace, then subscribe to a paid plan to access
        subscription features. If a subscription lapses or is not active, access to paid
        features may be limited or suspended according to your workspace entitlements.
      </p>

      <h2>3. How to cancel a paid subscription</h2>
      <p>Clinic administrators with billing permissions may cancel as follows:</p>
      <ul>
        <li>
          Sign in to {LEGAL.productName} and open <strong>Billing</strong> from the app
          sidebar.
        </li>
        <li>
          Open the Razorpay subscription management link from your payment confirmation email,
          or contact us to cancel before your next renewal date.
        </li>
        <li>
          Email{" "}
          <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a> from your account
          owner address if you need help locating your subscription.
        </li>
      </ul>
      <p>
        If you cannot locate your Razorpay subscription, email{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a> from your account
        owner email with your clinic name and request cancellation.
      </p>

      <h2>4. When cancellation takes effect</h2>
      <p>
        Cancellations typically take effect at the end of the current billing period you have
        already paid for. Until that date, you retain access to features included in your
        active plan unless we suspend access for security or Terms violations.
      </p>
      <p>
        After cancellation, your tenant may enter a limited or read-only state depending on
        product configuration. Export any records you need before access ends.
      </p>

      <h2>5. Refunds</h2>
      <p>
        Subscription fees are generally non-refundable. We do not provide prorated refunds for
        unused time in a billing period unless required by applicable law or explicitly
        approved by us in writing.
      </p>
      <p>
        If you believe you were billed in error, contact{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a> within thirty (30)
        days of the charge. We will review duplicate charges, failed cancellations, or
        technical billing mistakes.
      </p>

      <h2>6. Plan changes</h2>
      <p>
        Upgrades may take effect immediately with prorated or adjusted charges as shown at
        checkout. Downgrades generally apply at the next renewal unless otherwise stated
        during checkout or in the billing portal.
      </p>

      <h2>7. Account closure and data</h2>
      <p>
        Canceling a subscription does not automatically delete clinic or patient data. After
        cancellation, data may be retained for a limited period for backup, legal, or
        operational reasons, then deleted or anonymized according to our retention practices
        and your agreements with us.
      </p>
      <p>
        To request expedited deletion of tenant data, contact{" "}
        <a href={`mailto:${LEGAL.privacyEmail}`}>{LEGAL.privacyEmail}</a> after canceling
        billing. Some records may need to be retained where required by law.
      </p>

      <h2>8. Reactivation</h2>
      <p>
        You may resubscribe through the billing page or customer portal if your workspace
        remains available. Reactivation may require selecting a current plan and payment
        method. Historical data may not be recoverable if it was deleted after closure.
      </p>

      <h2>9. Suspension for non-payment</h2>
      <p>
        If payment fails or a subscription lapses, we may suspend paid features after reasonable
        notice. Resolve payment in the billing portal or contact support to restore service.
      </p>

      <h2>10. Contact</h2>
      <p>
        Billing and cancellation support:{" "}
        <a href={`mailto:${LEGAL.supportEmail}`}>{LEGAL.supportEmail}</a>.
      </p>
      <p>
        See also our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/terms-of-use">Terms of Use</Link>.
      </p>
    </LegalPageShell>
  );
}
