'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Header } from '@/components/Header';
import { ServiceType } from '@/types/database';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userType, setUserType] = useState<'organizer' | 'partner' | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // Partner-specific fields
  const [companyName, setCompanyName] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('venue');
  const [city, setCity] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'organizer' || type === 'partner') {
      setUserType(type);
    }
  }, [searchParams]);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Create auth user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Failed to create user');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          user_type: userType!,
          full_name: fullName,
          phone: phone || null,
        });

      if (profileError) throw profileError;

      // If partner, create partner record
      if (userType === 'partner') {
        const { error: partnerError } = await supabase
          .from('partners')
          .insert({
            user_id: authData.user.id,
            company_name: companyName,
            service_type: serviceType,
            city,
            contact_name: contactName,
            contact_email: contactEmail,
            description: description || null,
          });

        if (partnerError) throw partnerError;
      }

      // Redirect to appropriate dashboard
      if (userType === 'organizer') {
        router.push('/dashboard/organizer');
      } else {
        router.push('/dashboard/partner');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  }

  if (!userType) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        
        <div className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-4xl">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Choose Your Account Type
            </h1>
            
            <div className="grid md:grid-cols-2 gap-8">
              <button
                onClick={() => setUserType('organizer')}
                className="card hover:shadow-xl transition-shadow text-left"
              >
                <div className="text-4xl mb-4">🎯</div>
                <h2 className="text-2xl font-bold mb-2">I'm an Organizer</h2>
                <p className="text-gray-600 mb-4">
                  Planning an event and need to find venues, caterers, and other service providers
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Create event requests</li>
                  <li>✓ Send automated inquiries</li>
                  <li>✓ Compare offers from partners</li>
                  <li>✓ Save time on outreach</li>
                </ul>
              </button>

              <button
                onClick={() => setUserType('partner')}
                className="card hover:shadow-xl transition-shadow text-left"
              >
                <div className="text-4xl mb-4">🏢</div>
                <h2 className="text-2xl font-bold mb-2">I'm a Partner</h2>
                <p className="text-gray-600 mb-4">
                  Providing services like venues, catering, merchandise, or sponsorships
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Receive event inquiries</li>
                  <li>✓ Connect with organizers</li>
                  <li>✓ Grow your business</li>
                  <li>✓ Manage opportunities</li>
                </ul>
              </button>
            </div>

            <p className="text-center mt-8 text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="card">
            <button
              onClick={() => setUserType(null)}
              className="text-gray-600 hover:text-gray-900 mb-4"
            >
              ← Back
            </button>

            <h1 className="text-3xl font-bold mb-2">
              {userType === 'organizer' ? 'Register as Organizer' : 'Register as Partner'}
            </h1>
            <p className="text-gray-600 mb-8">
              {userType === 'organizer' 
                ? 'Create your account to start automating event outreach'
                : 'Join our network of service providers'}
            </p>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Common Fields */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="label">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="label">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
              </div>

              {/* Partner-Specific Fields */}
              {userType === 'partner' && (
                <>
                  <div className="border-t pt-4 mt-6">
                    <h3 className="font-semibold text-lg mb-4">Business Information</h3>
                  </div>

                  <div>
                    <label className="label">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="input"
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Service Type</label>
                      <select
                        value={serviceType}
                        onChange={(e) => setServiceType(e.target.value as ServiceType)}
                        className="input"
                        required
                      >
                        <option value="venue">Venue</option>
                        <option value="catering">Catering</option>
                        <option value="merchandise">Merchandise/Printing</option>
                        <option value="sponsor">Sponsor</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className="label">City</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="label">Contact Name</label>
                      <input
                        type="text"
                        value={contactName}
                        onChange={(e) => setContactName(e.target.value)}
                        className="input"
                        required
                      />
                    </div>

                    <div>
                      <label className="label">Contact Email</label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="input"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="label">Description (Optional)</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="input"
                      rows={3}
                      placeholder="Tell us about your services..."
                    />
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full mt-6"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

