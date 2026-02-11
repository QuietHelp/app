"use client";

import { Heart, Shield, Users, MessageCircle } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen relative overflow-hidden gradient-bg">
      <main className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              About QuietHelp
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A safe, anonymous space for peer support when you need someone to listen.
            </p>
          </div>

          {/* Mission Section */}
          <div className="landing-card p-8 sm:p-10 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-3">
              <Heart className="h-6 w-6 text-blue-600" />
              Our Mission
            </h2>
            <p className="text-gray-600 leading-relaxed">
              QuietHelp was created with a simple belief: everyone deserves a safe space to be heard. 
              We understand that sometimes you just need to talk to someone who understands, without 
              the pressure of revealing who you are. Our platform connects you with peers who are 
              ready to listen, support, and walk alongside you through difficult moments.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="landing-card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Anonymous & Safe
              </h3>
              <p className="text-gray-500 text-sm">
                No accounts, no personal information required. Your privacy is our priority.
              </p>
            </div>

            <div className="landing-card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Peer Support
              </h3>
              <p className="text-gray-500 text-sm">
                Connect with others who understand what you are going through.
              </p>
            </div>

            <div className="landing-card p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Real Conversations
              </h3>
              <p className="text-gray-500 text-sm">
                Genuine human connection, not bots or automated responses.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="landing-card p-8 sm:p-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              How It Works
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  1
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">Share how you are feeling</h4>
                  <p className="text-gray-500 text-sm">
                    Select your current mood so we can match you with the right support.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  2
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">Get matched with a peer</h4>
                  <p className="text-gray-500 text-sm">
                    We connect you with someone who is ready to listen and support you.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                  3
                </span>
                <div>
                  <h4 className="font-medium text-gray-900">Start chatting</h4>
                  <p className="text-gray-500 text-sm">
                    Have a real conversation with someone who cares. No judgment, just support.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              QuietHelp is a peer support platform and is not a substitute for professional mental health services.
              If you are in crisis, please contact a mental health professional or emergency services.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
