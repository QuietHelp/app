"use client";

import { useState, useEffect, useRef } from "react";
import { Shield, Heart, Clock, Users, Star, ArrowDown, Sparkles, Lock, MessageCircle } from "lucide-react";
import ActionBar from "@/components/ActionBar";
import Link from "next/link";

const CALMING_MESSAGES = [
  "Inhale for 4… hold… exhale for 6.",
  "It is okay to not be okay.",
  "Small steps are still progress.",
  "You are doing better than you think.",
  "Take your time. There is no rush.",
];

const FEATURES = [
  {
    icon: Lock,
    title: "Completely Anonymous",
    description: "No sign-ups, no accounts, no personal information required. Your privacy is protected.",
    color: "blue",
  },
  {
    icon: Heart,
    title: "Judgment-Free Zone",
    description: "A safe space where you can share freely without fear of judgment or criticism.",
    color: "pink",
  },
  {
    icon: Clock,
    title: "Available 24/7",
    description: "Whether it is 3 AM or noon, support is always just a click away.",
    color: "purple",
  },
  {
    icon: Users,
    title: "Real Human Connection",
    description: "Connect with peers who understand because they have been there too.",
    color: "emerald",
  },
];

const TESTIMONIALS = [
  {
    quote: "Sometimes you just need someone to listen without trying to fix everything. QuietHelp gave me that.",
    author: "Anonymous User",
  },
  {
    quote: "I was hesitant at first, but the anonymity made it easier to open up. It really helped.",
    author: "Anonymous User",
  },
  {
    quote: "Having someone to talk to at 2 AM when I could not sleep made all the difference.",
    author: "Anonymous User",
  },
  {
    quote: "The AI companion helped me process my thoughts when no one else was available.",
    author: "Anonymous User",
  },
  {
    quote: "QuietHelp made me feel less alone during a really difficult time.",
    author: "Anonymous User",
  },
];

// Animated counter hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return { count, ref };
}

export default function Home() {
  const [calmMessage, setCalmMessage] = useState("");
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const stats = {
    conversations: useCountUp(10000, 2000),
    users: useCountUp(5000, 2000),
    available: useCountUp(24, 1500),
  };

  useEffect(() => {
    const randomMessage = CALMING_MESSAGES[Math.floor(Math.random() * CALMING_MESSAGES.length)];
    setCalmMessage(randomMessage);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: "bg-blue-100", text: "text-blue-600" },
    pink: { bg: "bg-pink-100", text: "text-pink-600" },
    purple: { bg: "bg-purple-100", text: "text-purple-600" },
    emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 mb-8 shadow-sm">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-sm text-gray-600">Anonymous | No logins | Real Connections</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
            QuietHelp {"- "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-pink-600">
            Supporting You Quietly
            </span>
          </h1>

          {/* Calming message */}
          {calmMessage && (
            <p className="text-lg text-black italic mb-12 flex items-center justify-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              &ldquo;{calmMessage}&rdquo;
            </p>
          )}

          {/* Action Bar */}
          <ActionBar className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Why Choose QuietHelp Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need for Support
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              We have created a space where getting support is simple, private, and accessible to everyone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="landing-card p-8 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border border-gray-100"
              >
                <div className={`w-16 h-16 ${colorClasses[feature.color].bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-8 w-8 ${colorClasses[feature.color].text}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Hear What Our Users Say
          </h2>
          <p className="text-gray-500 mb-12">
            Real stories from people who found support through QuietHelp
          </p>

          <div className="flex justify-center gap-1 mb-8">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>

          <div className="relative min-h-[160px] mb-8">
            {TESTIMONIALS.map((testimonial, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-500 flex flex-col items-center justify-center ${
                  index === currentTestimonial 
                    ? "opacity-100 translate-y-0" 
                    : "opacity-0 translate-y-4"
                }`}
              >
                <blockquote className="text-2xl sm:text-3xl text-gray-700 italic mb-6 leading-relaxed max-w-3xl">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <p className="text-gray-600">— {testimonial.author}</p>
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2">
            {TESTIMONIALS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentTestimonial 
                    ? "bg-blue-600 w-8" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              A Seamless Path to Support
            </h2>
            <p className="text-xl text-gray-500">
              Getting help is simple. Just three easy steps.
            </p>
          </div>

          <div className="relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-16 left-1/2 -translate-x-1/2 w-2/3 h-0.5 bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 opacity-30" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                {
                  step: "1",
                  title: "Choose Your Path",
                  description: "Select peer support, global chat, or AI companion based on what feels right for you.",
                  color: "from-blue-500 to-blue-600",
                },
                {
                  step: "2",
                  title: "Share How You Feel",
                  description: "Tell us about your mood so we can provide the best support experience for you.",
                  color: "from-purple-500 to-purple-600",
                },
                {
                  step: "3",
                  title: "Start Talking",
                  description: "Connect instantly and start a conversation in a safe, supportive space.",
                  color: "from-pink-500 to-pink-600",
                },
              ].map((item) => (
                <div key={item.step} className="text-center relative">
                  <div className={`w-16 h-16 bg-linear-to-br ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-6 text-white font-bold text-2xl shadow-lg`}>
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl bg-gray-100 p-12 sm:p-16 text-center shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl text-black lg:text-5xl font-bold  mb-6">
                Ready to Talk?
              </h2>
              <p className="text-xl text-black mb-10 max-w-2xl mx-auto">
                Taking the first step is often the hardest. We are here to make it a little easier. Start a conversation now — completely free and anonymous.
              </p>
              <ActionBar variant="compact" />
            </div>
          </div>
        </div>
      </section>

      {/* Resources Banner */}
      <section className="py-12 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-500 mb-3">
            If you are in crisis or need immediate help, please reach out to professional resources.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <Shield className="h-4 w-4" />
            View Crisis Helplines →
          </Link>
        </div>
      </section>
    </div>
  );
}
