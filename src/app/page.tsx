'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';

export default function LandingPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'organizer' | 'partner'>();

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_type')
          .eq('id', user.id)
          .maybeSingle();
        if (profile) {
          setUserType(profile.user_type as 'organizer' | 'partner');
        }
      }
    }
    checkAuth();
  }, []);

  async function handleSignOut() {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserType(undefined);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated} 
        userType={userType}
        onSignOut={handleSignOut}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Automate Your Event Planning in Minutes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Connect with venues, caterers, and service providers instantly with AI-powered outreach
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register?type=organizer" className="btn bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3">
                I'm an Organizer
              </Link>
              <Link href="/register?type=partner" className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-3">
                I'm a Partner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create your free account as an event organizer in seconds
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Fill the Form</h3>
              <p className="text-gray-600">
                Tell us about your event - date, attendees, budget, and requirements
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Offers</h3>
              <p className="text-gray-600">
                Our AI sends personalized inquiries to relevant partners automatically
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Why Choose EventAI?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg">
              <div className="text-primary-600 text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-2">Save Time</h3>
              <p className="text-gray-600">
                Send inquiries to multiple partners in one click instead of hours of manual outreach
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <div className="text-primary-600 text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
              <p className="text-gray-600">
                Get professionally written, personalized emails generated by AI
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <div className="text-primary-600 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Compare Offers</h3>
              <p className="text-gray-600">
                Receive responses in one place and compare options easily
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <div className="text-primary-600 text-3xl mb-4">✉️</div>
              <h3 className="text-xl font-semibold mb-2">Direct Replies</h3>
              <p className="text-gray-600">
                Partners reply directly to your email - no middleman
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <div className="text-primary-600 text-3xl mb-4">📎</div>
              <h3 className="text-xl font-semibold mb-2">File Attachments</h3>
              <p className="text-gray-600">
                Automatically attach logos and documents for merchandise requests
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg">
              <div className="text-primary-600 text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is protected with enterprise-grade security
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Simplify Your Event Planning?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join hundreds of organizers who save hours with automated outreach
          </p>
          <Link href="/register" className="btn btn-primary text-lg px-8 py-3">
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

