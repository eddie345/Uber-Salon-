import React, { createContext, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './useAuth';

export { useAuth };

export type UserRole = 'customer' | 'artisan';

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  city: 'Accra' | 'Kumasi' | 'Takoradi' | 'Tamale' | 'Cape Coast';
  shopName?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedRole: UserRole | null;
  currentPhone: string;
  setRole: (role: UserRole) => void;
  sendOtp: (phone: string) => Promise<boolean>;
  verifyOtp: (otp: string) => Promise<{ success: boolean; isNew?: boolean }>;
  completeRegistration: (name: string, city: 'Accra' | 'Kumasi' | 'Takoradi' | 'Tamale' | 'Cape Coast', shopName?: string) => void;
  logout: () => void;
}

// Pre-registered users database to simulate existing users vs new users
const MOCK_USERS_DB: Record<string, Omit<AuthUser, 'id'>> = {
  '0501112222': {
    name: 'Ama Koduah',
    phone: '0501112222',
    role: 'customer',
    city: 'Accra'
  },
  '0201112222': {
    name: 'Kwesi Mensah',
    phone: '0201112222',
    role: 'artisan',
    city: 'Accra',
    shopName: 'Mensah Premium Cuts'
  },
  '0202223333': {
    name: 'Ama Serwaa',
    phone: '0202223333',
    role: 'artisan',
    city: 'Kumasi',
    shopName: 'Serwaa Braids & Styles'
  }
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [currentPhone, setCurrentPhone] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setRole = (role: UserRole) => {
    setSelectedRole(role);
  };

  const sendOtp = async (phone: string): Promise<boolean> => {
    setIsLoading(true);
    // Simulate API call to send OTP
    await new Promise((resolve) => setTimeout(resolve, 800));
    setCurrentPhone(phone);
    setIsLoading(false);
    return true;
  };

  const verifyOtp = async (otp: string): Promise<{ success: boolean; isNew?: boolean }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    if (otp !== '123456') {
      return { success: false };
    }

    // Check if the user exists in our DB
    const existingUser = MOCK_USERS_DB[currentPhone];
    if (existingUser && selectedRole && existingUser.role === selectedRole) {
      const loggedUser: AuthUser = {
        ...existingUser,
        id: selectedRole === 'artisan' ? (currentPhone === '0201112222' ? 'art-1' : 'art-2') : 'cust-1'
      };
      setUser(loggedUser);
      return { success: true, isNew: false };
    }

    // Otherwise, they are a new user and need to complete step 4
    return { success: true, isNew: true };
  };

  const completeRegistration = (
    name: string,
    city: 'Accra' | 'Kumasi' | 'Takoradi' | 'Tamale' | 'Cape Coast',
    shopName?: string
  ) => {
    if (!selectedRole) return;

    const newUser: AuthUser = {
      id: selectedRole === 'artisan' ? `art-new-${Date.now()}` : `cust-new-${Date.now()}`,
      name,
      phone: currentPhone,
      role: selectedRole,
      city,
      shopName: selectedRole === 'artisan' ? shopName || `${name}'s Shop` : undefined
    };

    // Store in our temporary mock DB during runtime
    MOCK_USERS_DB[currentPhone] = {
      name,
      phone: currentPhone,
      role: selectedRole,
      city,
      shopName: newUser.shopName
    };

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    setSelectedRole(null);
    setCurrentPhone('');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        selectedRole,
        currentPhone,
        setRole,
        sendOtp,
        verifyOtp,
        completeRegistration,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
