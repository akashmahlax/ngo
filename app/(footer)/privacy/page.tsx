
import { Shield, Lock, Eye, Database, UserCheck, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-purple-600" />
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: October 30, 2025</p>
          </div>

          {/* Key Principles */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {[
              { icon: Lock, title: "Data Encryption", desc: "All data encrypted in transit and at rest" },
              { icon: Eye, title: "Transparency", desc: "Clear information about data usage" },
              { icon: UserCheck, title: "Your Control", desc: "You own and control your data" },
            ].map((item, i) => (
              <Card key={i} className="border-2">
                <CardContent className="p-6 text-center">
                  <item.icon className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Policy Content */}
          <div className="prose prose-lg dark:prose-invert max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Account Information:</strong> Name, email address, password, and profile details</li>
                  <li><strong>Profile Data:</strong> Skills, interests, experience, and bio information</li>
                  <li><strong>Volunteer Activity:</strong> Applications, opportunities posted, and communication records</li>
                  <li><strong>Usage Data:</strong> How you interact with our platform, pages visited, and features used</li>
                  <li><strong>Device Information:</strong> IP address, browser type, and operating system</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Match volunteers with relevant opportunities</li>
                  <li>Communicate with you about updates, opportunities, and platform news</li>
                  <li>Analyze usage patterns to enhance user experience</li>
                  <li>Detect and prevent fraud or abuse</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>With NGOs:</strong> When you apply to volunteer opportunities, relevant profile information is shared with the posting organization</li>
                  <li><strong>With Service Providers:</strong> Third-party vendors who assist in platform operations (e.g., hosting, analytics)</li>
                  <li><strong>For Legal Reasons:</strong> When required by law or to protect our rights</li>
                  <li><strong>With Your Consent:</strong> Any other sharing is done with your explicit permission</li>
                </ul>
                <p className="font-semibold">We never sell your personal information to third parties.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We implement industry-standard security measures to protect your data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Regular security audits and penetration testing</li>
                  <li>Secure authentication with OAuth 2.0</li>
                  <li>Access controls and monitoring</li>
                  <li>Regular backups and disaster recovery plans</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Your Rights and Choices</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>You have the following rights regarding your personal data:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your account and data</li>
                  <li><strong>Portability:</strong> Export your data in a machine-readable format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                  <li><strong>Object:</strong> Object to certain processing activities</li>
                </ul>
                <p>To exercise these rights, contact us at privacy@ngoplatform.com</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We use cookies and similar technologies to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Keep you logged in</li>
                  <li>Remember your preferences</li>
                  <li>Understand how you use our platform</li>
                  <li>Improve our services</li>
                </ul>
                <p>You can control cookie preferences through your browser settings.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Data Retention</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We retain your information for as long as your account is active or as needed to provide services. 
                   After account deletion, we may retain certain information for legal compliance, dispute resolution, 
                   and fraud prevention for a period of up to 7 years.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Children's Privacy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Our services are not intended for users under 16 years of age. We do not knowingly collect 
                   personal information from children. If we become aware that we have collected data from a child, 
                   we will take steps to delete such information.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. International Data Transfers</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Your information may be transferred to and processed in countries other than your country of residence. 
                   We ensure appropriate safeguards are in place to protect your data in accordance with this privacy policy.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Changes to This Policy</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>We may update this privacy policy from time to time. We will notify you of significant changes via 
                   email or through a prominent notice on our platform. Your continued use of our services after changes 
                   constitutes acceptance of the updated policy.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Us</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>If you have questions or concerns about this privacy policy or our data practices, please contact us:</p>
                <div className="bg-muted/50 p-6 rounded-lg mt-4">
                  <p><strong>Email:</strong> privacy@ngoplatform.com</p>
                  <p><strong>Address:</strong> 123 Impact Street, Suite 400, San Francisco, CA 94105</p>
                  <p><strong>Data Protection Officer:</strong> dpo@ngoplatform.com</p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer Note */}
          <Card className="mt-12 border-2 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="p-6 flex gap-4">
              <AlertCircle className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold mb-2">Your Privacy Matters</h3>
                <p className="text-sm text-muted-foreground">
                  We are committed to protecting your privacy and being transparent about our data practices. 
                  If you have any questions or concerns, please don't hesitate to reach out to our team.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
