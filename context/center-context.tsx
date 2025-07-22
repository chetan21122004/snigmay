'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Center {
  id: string;
  name: string;
  location: string;
  description?: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: string;
  center_id?: string | null;
}

interface CenterContextType {
  centers: Center[];
  selectedCenter: Center | null;
  setSelectedCenter: (center: Center | null) => void;
  user: User | null;
  availableCenters: Center[];
  loading: boolean;
}

const CenterContext = createContext<CenterContextType | undefined>(undefined);

export const useCenterContext = () => {
  const context = useContext(CenterContext);
  if (!context) {
    throw new Error('useCenterContext must be used within a CenterProvider');
  }
  return context;
};

// Mock centers data
const MOCK_CENTERS: Center[] = [
  {
    id: 'center-1',
    name: 'Kharadi Center',
    location: 'Kharadi, Pune',
    description: 'Main training facility in Kharadi'
  },
  {
    id: 'center-2',
    name: 'Viman Nagar Center',
    location: 'Viman Nagar, Pune',
    description: 'Training facility in Viman Nagar'
  },
  {
    id: 'center-3',
    name: 'Hadapsar Center',
    location: 'Hadapsar, Pune',
    description: 'Training facility in Hadapsar'
  }
];

interface CenterProviderProps {
  children: ReactNode;
  user: User | null;
}

export const CenterProvider: React.FC<CenterProviderProps> = ({ children, user }) => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);

  // Get available centers based on user role according to context.md
  const getAvailableCenters = (userRole: string, userCenterId?: string | null): Center[] => {
    switch (userRole) {
      case 'super_admin':
        // Super Admin: Full access to all modules and data across all centers
        return centers;
      case 'club_manager':
        // Club Manager: Access to view and manage attendance and financials across all centers
        return centers;
      case 'head_coach':
        // Head Coach: Can view and manage attendance and fee data across all centers
        return centers;
      case 'coach':
        // Coach: Access limited to their assigned center(s) only
        if (userCenterId) {
          return centers.filter(center => center.id === userCenterId);
        }
        return [];
      case 'center_manager':
        // Center Manager: Access limited to their own center
        if (userCenterId) {
          return centers.filter(center => center.id === userCenterId);
        }
        return [];
      default:
        return [];
    }
  };

  const availableCenters = user ? getAvailableCenters(user.role, user.center_id) : [];

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        setLoading(true);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setCenters(MOCK_CENTERS);

        // Set default selected center based on user role
        if (user && MOCK_CENTERS.length > 0) {
          const userAvailableCenters = getAvailableCenters(user.role, user.center_id);
          if (userAvailableCenters.length > 0) {
            // For restricted roles (coach, center_manager), set their assigned center
            if (user.role === 'coach' || user.role === 'center_manager') {
              const userCenter = user.center_id ? userAvailableCenters.find(c => c.id === user.center_id) : undefined;
              setSelectedCenter(userCenter || userAvailableCenters[0]);
            } else {
              // For unrestricted roles (super_admin, club_manager, head_coach), set the first available center
              setSelectedCenter(userAvailableCenters[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchCenters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCenters();
  }, [user]);

  const handleSetSelectedCenter = (center: Center | null) => {
    // Validate that the user can access this center based on role permissions
    if (center && user) {
      const userAvailableCenters = getAvailableCenters(user.role, user.center_id);
      const canAccess = userAvailableCenters.some(c => c.id === center.id);
      if (canAccess) {
        setSelectedCenter(center);
      } else {
        console.warn(`User with role ${user.role} does not have access to center: ${center.name}`);
      }
    } else {
      setSelectedCenter(center);
    }
  };

  return (
    <CenterContext.Provider
      value={{
        centers,
        selectedCenter,
        setSelectedCenter: handleSetSelectedCenter,
        user,
        availableCenters,
        loading,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
}; 