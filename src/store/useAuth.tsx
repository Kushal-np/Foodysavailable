import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => boolean;
  logout: () => void;
  sendOTP: (email: string) => { success: boolean; otp?: string };
  verifyOTP: (email: string, otp: string) => boolean;
  resetPassword: (email: string, newPassword: string) => boolean;
  socialLogin: (provider: 'google' | 'facebook', userData: any) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

 const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users database
const mockUsers = [
  { id: 1, name: 'Admin User', email: 'admin@foodhub.com', password: 'admin123', role: 'admin' as const },
  { id: 2, name: 'John Doe', email: 'john@example.com', password: 'user123', role: 'user' as const },
];

// Store OTPs temporarily (in real app, this would be backend with expiry)
const otpStore: { [email: string]: string } = {};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('foodhub_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const userData = {
        id: foundUser.id,
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role
      };
      setUser(userData);
      localStorage.setItem('foodhub_user', JSON.stringify(userData));
      console.log('✅ Login successful:', userData);
      return true;
    }
    
    console.log('❌ Login failed: Invalid credentials');
    return false;
  };

  const signup = (name: string, email: string, password: string): boolean => {
    const existingUser = mockUsers.find(u => u.email === email);
    if (existingUser) {
      console.log('❌ Signup failed: User already exists');
      return false;
    }

    const newUser = {
      id: mockUsers.length + 1,
      name,
      email,
      password,
      role: 'user' as const
    };
    
    mockUsers.push(newUser);
    
    const userData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };
    
    setUser(userData);
    localStorage.setItem('foodhub_user', JSON.stringify(userData));
    console.log('✅ Signup successful:', userData);
    return true;
  };

  const sendOTP = (email: string): { success: boolean; otp?: string } => {
    const user = mockUsers.find(u => u.email === email);
    if (!user) {
      console.log('❌ Email not found');
      return { success: false };
    }

    // Generate random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[email] = otp;
    
    console.log(`📧 OTP sent to ${email}: ${otp}`);
    // In real app, send email here
    return { success: true, otp }; // Return OTP for demo purposes
  };

  const verifyOTP = (email: string, otp: string): boolean => {
    if (otpStore[email] === otp) {
      console.log('✅ OTP verified successfully');
      return true;
    }
    console.log('❌ Invalid OTP');
    return false;
  };

  const resetPassword = (email: string, newPassword: string): boolean => {
    const userIndex = mockUsers.findIndex(u => u.email === email);
    if (userIndex === -1) {
      console.log('❌ User not found');
      return false;
    }

    mockUsers[userIndex].password = newPassword;
    delete otpStore[email]; // Clear OTP
    console.log('✅ Password reset successful');
    return true;
  };

  const socialLogin = (provider: 'google' | 'facebook', userData: any) => {
    console.log(`🔐 Social login with ${provider}:`, userData);
    
    // Check if user exists
    let existingUser = mockUsers.find(u => u.email === userData.email);
    
    if (!existingUser) {
      // Create new user from social data
      const newUser = {
        id: mockUsers.length + 1,
        name: userData.name,
        email: userData.email,
        password: 'social_login', // Social users don't have password
        role: 'user' as const
      };
      mockUsers.push(newUser);
      existingUser = newUser;
    }

    const userDataToStore = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
      role: existingUser.role
    };
    
    setUser(userDataToStore);
    localStorage.setItem('foodhub_user', JSON.stringify(userDataToStore));
    console.log('✅ Social login successful:', userDataToStore);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('foodhub_user');
    console.log('✅ Logout successful');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    signup,
    logout,
    sendOTP,
    verifyOTP,
    resetPassword,
    socialLogin
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;