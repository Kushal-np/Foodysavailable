import { useState } from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import useAuth from '../store/useAuth';

export default function VerifyOTP({ navigate, email }: any) {
  const { verifyOTP, sendOTP } = useAuth();
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    const isValid = verifyOTP(email, otp);
    
    if (isValid) {
      navigate('reset-password', { email });
    } else {
      setError('Invalid OTP. Please try again.');
    }
  };

  const handleResend = () => {
    const result = sendOTP(email);
    if (result.success) {
      alert(`New OTP sent! For demo: ${result.otp}`);
      setOtp('');
      setError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-600 mb-2">FoodHub</h1>
          <p className="text-gray-600">Verify your identity</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <button
            onClick={() => navigate('forgot-password')}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 mb-6"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
              <Shield className="text-orange-600" size={32} />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2 text-center">Enter OTP</h2>
          <p className="text-gray-600 mb-6 text-center">
            We've sent a 6-digit code to<br />
            <strong>{email}</strong>
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="text"
                maxLength={6}
                className="w-full text-center text-2xl tracking-widest py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="000000"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setOtp(value);
                  setError('');
                }}
              />
            </div>

            <button
              onClick={handleVerify}
              className="w-full bg-orange-600 text-white py-3 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Verify OTP
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{' '}
                <button
                  onClick={handleResend}
                  className="text-orange-600 font-semibold hover:underline"
                >
                  Resend OTP
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}