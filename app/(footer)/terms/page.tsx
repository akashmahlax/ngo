
import { Scale, FileText, AlertTriangle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Scale className="h-16 w-16 mx-auto mb-4 text-purple-600" />
            <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: October 30, 2025</p>
          </div>

          {/* Important Notice */}
          <Card className="mb-8 border-2 bg-amber-50 dark:bg-amber-950/20">
            <CardContent className="p-6 flex gap-4">
              <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Important</h3>
                <p className="text-sm text-muted-foreground">
                  By accessing or using our platform, you agree to be bound by these Terms of Service. 
                  Please read them carefully before using our services.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Terms Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  These Terms of Service ("Terms") govern your access to and use of our volunteer-NGO platform 
                  ("Service"). By creating an account or using our Service, you agree to these Terms. 
                  If you disagree with any part of these Terms, you may not access the Service.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>You must meet the following criteria to use our Service:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be at least 16 years of age</li>
                  <li>Have the legal capacity to enter into binding agreements</li>
                  <li>Not be prohibited from using the Service under applicable laws</li>
                  <li>Provide accurate and complete registration information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Accounts</h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-xl font-semibold text-foreground">3.1 Account Creation</h3>
                <p>To use certain features, you must create an account. You agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and update your information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">3.2 Account Types</h3>
                <p>We offer two types of accounts:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Volunteer Accounts:</strong> For individuals seeking volunteer opportunities</li>
                  <li><strong>NGO Accounts:</strong> For organizations posting opportunities (requires verification)</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">3.3 Account Responsibility</h3>
                <p>You are responsible for all activities that occur under your account. You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Share your account credentials</li>
                  <li>Create multiple accounts for fraudulent purposes</li>
                  <li>Impersonate others or misrepresent your identity</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Acceptable Use</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>You agree not to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate any laws or regulations</li>
                  <li>Infringe on intellectual property rights</li>
                  <li>Post false, misleading, or fraudulent content</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Distribute spam or unsolicited messages</li>
                  <li>Upload viruses or malicious code</li>
                  <li>Attempt to access unauthorized areas of the platform</li>
                  <li>Use automated tools to scrape or extract data</li>
                  <li>Interfere with the proper functioning of the Service</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Content</h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-xl font-semibold text-foreground">5.1 Your Content</h3>
                <p>You retain ownership of content you post. By posting content, you grant us a worldwide, 
                   non-exclusive, royalty-free license to use, display, and distribute your content on our platform.</p>

                <h3 className="text-xl font-semibold text-foreground mt-6">5.2 Content Standards</h3>
                <p>All content must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Be accurate and truthful</li>
                  <li>Not violate third-party rights</li>
                  <li>Comply with applicable laws</li>
                  <li>Be appropriate and professional</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">5.3 Content Removal</h3>
                <p>We reserve the right to remove content that violates these Terms or is otherwise objectionable, 
                   without prior notice.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. NGO Verification</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Organizations must undergo verification to post opportunities. We verify:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Legal registration and nonprofit status</li>
                  <li>Contact information and organizational details</li>
                  <li>Mission alignment with platform values</li>
                </ul>
                <p>Verification does not constitute endorsement. Users should conduct their own due diligence.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Volunteer Opportunities</h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-xl font-semibold text-foreground">7.1 Posting Opportunities</h3>
                <p>NGOs posting opportunities must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide accurate descriptions of roles and requirements</li>
                  <li>Clearly state time commitments and expectations</li>
                  <li>Not discriminate based on protected characteristics</li>
                  <li>Comply with labor laws and volunteer regulations</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">7.2 Applying to Opportunities</h3>
                <p>Volunteers applying to opportunities must:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide truthful information about skills and experience</li>
                  <li>Communicate professionally with NGOs</li>
                  <li>Honor commitments made to organizations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Payment and Subscriptions</h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-xl font-semibold text-foreground">8.1 Pricing</h3>
                <p>Some features require paid subscriptions. Prices are displayed before purchase. 
                   We reserve the right to change pricing with 30 days notice.</p>

                <h3 className="text-xl font-semibold text-foreground mt-6">8.2 Billing</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscriptions automatically renew unless cancelled</li>
                  <li>You authorize recurring charges to your payment method</li>
                  <li>Refunds are provided only as required by law</li>
                </ul>

                <h3 className="text-xl font-semibold text-foreground mt-6">8.3 Cancellation</h3>
                <p>You may cancel your subscription at any time. Access continues until the end of the billing period.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Intellectual Property</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>The Service and its original content, features, and functionality are owned by us and protected 
                   by copyright, trademark, and other intellectual property laws. You may not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Copy, modify, or create derivative works</li>
                  <li>Reverse engineer or decompile the platform</li>
                  <li>Remove copyright or proprietary notices</li>
                  <li>Use our trademarks without permission</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Disclaimers</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="uppercase font-semibold">
                  THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. 
                  WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                </p>
                <p>We are not responsible for:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Interactions between volunteers and NGOs</li>
                  <li>Quality or safety of volunteer experiences</li>
                  <li>Disputes arising from volunteer arrangements</li>
                  <li>Third-party content or services</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Limitation of Liability</h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="uppercase font-semibold">
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, 
                  SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER 
                  INCURRED DIRECTLY OR INDIRECTLY.
                </p>
                <p>Our total liability shall not exceed the amount paid by you in the 12 months preceding the claim.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">12. Indemnification</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, 
                   and expenses arising from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your use of the Service</li>
                  <li>Your violation of these Terms</li>
                  <li>Your violation of any third-party rights</li>
                  <li>Your content posted on the platform</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">13. Termination</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We may suspend or terminate your account if you:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Violate these Terms</li>
                  <li>Engage in fraudulent or illegal activity</li>
                  <li>Harm other users or the platform</li>
                  <li>Fail to pay applicable fees</li>
                </ul>
                <p>You may terminate your account at any time through your settings. Upon termination, 
                   your right to use the Service ceases immediately.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">14. Dispute Resolution</h2>
              <div className="space-y-4 text-muted-foreground">
                <h3 className="text-xl font-semibold text-foreground">14.1 Governing Law</h3>
                <p>These Terms are governed by the laws of the State of California, without regard to conflict of law provisions.</p>

                <h3 className="text-xl font-semibold text-foreground mt-6">14.2 Arbitration</h3>
                <p>Any disputes will be resolved through binding arbitration, except for claims that may be brought 
                   in small claims court.</p>

                <h3 className="text-xl font-semibold text-foreground mt-6">14.3 Class Action Waiver</h3>
                <p>You agree to resolve disputes on an individual basis and waive the right to participate in 
                   class actions or representative proceedings.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">15. Changes to Terms</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We reserve the right to modify these Terms at any time. We will notify you of significant changes 
                   via email or through the platform. Continued use after changes constitutes acceptance of the new Terms.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">16. Contact Information</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>For questions about these Terms, contact us at:</p>
                <div className="bg-muted/50 p-6 rounded-lg mt-4">
                  <p><strong>Email:</strong> legal@ngoplatform.com</p>
                  <p><strong>Address:</strong> 123 Impact Street, Suite 400, San Francisco, CA 94105</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
