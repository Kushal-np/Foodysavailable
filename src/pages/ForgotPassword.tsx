import { useState } from 'react';
import { Mail, ArrowLeft } from 'lucide-react';
import useAuth from '../store/useAuth';

export default function ForgotPassword({ navigate }: any) {
  const { sendOTP } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    const result = sendOTP(email);
    setLoading(false);

    if (result.success) {
      // Show OTP in alert for demo (in real app, it's sent via email)
      alert(`OTP sent! For demo purposes, your OTP is: ${result.otp}`);
      navigate('verify-otp', { email });
    } else {
      setError('Email not found. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">FoodHub</h1>
          <p className="text-gray-600">Reset your password</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={() => navigate('signin')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
          >
            <ArrowLeft size={20} />
            Back to Sign In
          </button>

          <h2 className="text-2xl font-bold mb-2">Forgot Password?</h2>
          <p className="text-gray-600 mb-6">
            No worries! Enter your email and we'll send you an OTP to reset your password.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}