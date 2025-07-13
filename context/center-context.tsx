'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

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

interface CenterProviderProps {
  children: ReactNode;
  user: User | null;
}

export const CenterProvider: React.FC<CenterProviderProps> = ({ children, user }) => {
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);

  // Get available centers based on user role
  const getAvailableCenters = (userRole: string, userCenterId?: string | null): Center[] => {
    switch (userRole) {
      case 'super_admin':
      case 'club_manager':
      case 'head_coach':
        // These roles can access all centers
        return centers;
      case 'coach':
      case 'center_manager':
        // These roles can only access their assigned center
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
        const { data, error } = await supabase
          .from('centers')
          .select('*')
          .order('name');

        if (error) {
          console.error('Error fetching centers:', error);
          return;
        }

        setCenters(data || []);

        // Set default selected center based on user role
        if (user && data && data.length > 0) {
          const userAvailableCenters = getAvailableCenters(user.role, user.center_id);
          if (userAvailableCenters.length > 0) {
            // For restricted roles, set their assigned center
            if (user.role === 'coach' || user.role === 'center_manager') {
              const userCenter = user.center_id ? userAvailableCenters.find(c => c.id === user.center_id) : undefined;
              setSelectedCenter(userCenter || userAvailableCenters[0]);
            } else {
              // For unrestricted roles, set the first available center
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
    // Validate that the user can access this center
    if (center && user) {
      const userAvailableCenters = getAvailableCenters(user.role, user.center_id);
      const canAccess = userAvailableCenters.some(c => c.id === center.id);
      if (canAccess) {
        setSelectedCenter(center);
      } else {
        console.warn('User does not have access to this center');
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