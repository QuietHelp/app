"use client";

import { Phone, Globe, MessageSquare, Heart, AlertTriangle } from "lucide-react";
import Link from "next/link";

const HELPLINES = [
  {
    name: "National Suicide Prevention Lifeline",
    country: "USA",
    phone: "988",
    description: "24/7, free and confidential support for people in distress.",
    website: "https://988lifeline.org",
    available: "24/7",
  },
  {
    name: "Crisis Text Line",
    country: "USA",
    phone: "Text HOME to 741741",
    description: "Free, 24/7 support via text message.",
    website: "https://www.crisistextline.org",
    available: "24/7",
  },
  {
    name: "SAMHSA National Helpline",
    country: "USA",
    phone: "1-800-662-4357",
    description: "Free, confidential, 24/7 treatment referral and information service.",
    website: "https://www.samhsa.gov/find-help/national-helpline",
    available: "24/7",
  },
  {
    name: "Samaritans",
    country: "UK",
    phone: "116 123",
    description: "Emotional support for anyone in distress or struggling to cope.",
    website: "https://www.samaritans.org",
    available: "24/7",
  },
  {
    name: "Kids Help Phone",
    country: "Canada",
    phone: "1-800-668-6868",
    description: "24/7 counselling and support for young people.",
    website: "https://kidshelpphone.ca",
    available: "24/7",
  },
  {
    name: "Lifeline Australia",
    country: "Australia",
    phone: "13 11 14",
    description: "Crisis support and suicide prevention services.",
    website: "https://www.lifeline.org.au",
    available: "24/7",
  },
  {
    name: "iCall",
    country: "India",
    phone: "9152987821",
    description: "Psychosocial helpline providing counselling support.",
    website: "https://icallhelpline.org",
    available: "Mon-Sat, 8am-10pm IST",
  },
  {
    name: "Befrienders Worldwide",
    country: "International",
    phone: "Find local center",
    description: "Emotional support to prevent suicide worldwide.",
    website: "https://www.befrienders.org",
    available: "Varies by location",
  },
];

const ONLINE_RESOURCES = [
  {
    name: "7 Cups",
    description: "Free online chat with trained listeners.",
    website: "https://www.7cups.com",
  },
  {
    name: "Mental Health America",
    description: "Screening tools, information, and resources.",
    website: "https://www.mhanational.org",
  },
  {
    name: "NAMI (National Alliance on Mental Illness)",
    description: "Education, support groups, and advocacy.",
    website: "https://www.nami.org",
  },
  {
    name: "Mind (UK)",
    description: "Mental health information and support.",
    website: "https://www.mind.org.uk",
  },
];

export default function ResourcesPage() {
  return (
    <div className="min-h-screen relative overflow-hidden gradient-bg">
      <main className="relative min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 pt-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Mental Health Resources
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              If you or someone you know is in crisis, please reach out to these professional resources.
            </p>
          </div>

          {/* Emergency Banner */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8 border-l-4 border-l-red-500">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h2 className="text-lg font-semibold text-red-700 mb-2">
                  In Immediate Danger?
                </h2>
                <p className="text-red-600">
                  If you or someone else is in immediate danger, please call your local emergency services 
                  (911 in the US, 999 in the UK, 000 in Australia) or go to your nearest emergency room.
                </p>
              </div>
            </div>
          </div>

          {/* Crisis Helplines */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <Phone className="h-6 w-6 text-blue-600" />
              Crisis Helplines
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HELPLINES.map((helpline) => (
                <div key={helpline.name} className="landing-card p-5 hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {helpline.name}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium">
                      {helpline.country}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {helpline.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-gray-900">
                        {helpline.phone}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>Available: {helpline.available}</span>
                    </div>
                    <a
                      href={helpline.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Globe className="h-4 w-4" />
                      Visit Website
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Online Resources */}
          <div className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Online Support Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {ONLINE_RESOURCES.map((resource) => (
                <a
                  key={resource.name}
                  href={resource.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="landing-card p-5 hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-100"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {resource.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {resource.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm text-blue-600">
                    <Globe className="h-4 w-4" />
                    Visit
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* QuietHelp Section */}
          <div className="landing-card p-8 text-center border border-gray-100">
            <Heart className="h-10 w-10 text-blue-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Need Someone to Talk To?
            </h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              QuietHelp connects you anonymously with peers who understand. 
              Sometimes talking to someone who has been there helps.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Start a Conversation
            </Link>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              QuietHelp is a peer support platform and is not a substitute for professional mental health services.
              If you are experiencing a mental health crisis, please contact one of the helplines above.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
