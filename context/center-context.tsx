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

// Database interfaces matching the Supabase schema
export interface Student {
  id: string;
  name: string;
  age: number;
  contact_info: string | null;
  batch_id: string | null;
  center_id: string | null;
  parent_name: string | null;
  parent_phone: string | null;
  parent_email: string | null;
  address: string | null;
  emergency_contact: string | null;
  medical_conditions: string | null;
  created_at: string;
  updated_at: string;
}

export interface Batch {
  id: string;
  name: string;
  description: string | null;
  coach_id: string | null;
  center_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  batch_id: string;
  date: string;
  status: 'present' | 'absent';
  marked_by: string | null;
  created_at: string;
}

export interface FeeRecord {
  id: string;
  student_id: string | null;
  amount: number;
  payment_date: string;
  payment_mode: string;
  receipt_number: string | null;
  status: 'paid' | 'due' | 'overdue';
  due_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

interface CenterContextType {
  centers: Center[];
  selectedCenter: Center | null;
  setSelectedCenter: (center: Center | null) => void;
  user: User | null;
  availableCenters: Center[];
  loading: boolean;
  // Center-specific data
  students: Student[];
  batches: Batch[];
  attendanceRecords: AttendanceRecord[];
  feeRecords: FeeRecord[];
  // Helper functions
  getStudentsByCenter: (centerId: string) => Student[];
  getBatchesByCenter: (centerId: string) => Batch[];
  getAttendanceByCenter: (centerId: string) => AttendanceRecord[];
  getFeesByCenter: (centerId: string) => FeeRecord[];
  // Refresh functions
  refreshData: () => Promise<void>;
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
  const [students, setStudents] = useState<Student[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>([]);

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

  // Helper functions to get center-specific data
  const getStudentsByCenter = (centerId: string): Student[] => {
    return students.filter(student => student.center_id === centerId);
  };

  const getBatchesByCenter = (centerId: string): Batch[] => {
    return batches.filter(batch => batch.center_id === centerId);
  };

  const getAttendanceByCenter = (centerId: string): AttendanceRecord[] => {
    const centerStudentIds = students
      .filter(student => student.center_id === centerId)
      .map(student => student.id);
    return attendanceRecords.filter(record => centerStudentIds.includes(record.student_id));
  };

  const getFeesByCenter = (centerId: string): FeeRecord[] => {
    const centerStudentIds = students
      .filter(student => student.center_id === centerId)
      .map(student => student.id);
    return feeRecords.filter(fee => fee.student_id && centerStudentIds.includes(fee.student_id));
  };

  // Fetch all data from Supabase
  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch centers
      const { data: centersData, error: centersError } = await supabase
        .from('centers')
        .select('*')
        .order('name');

      if (centersError) {
        console.error('Error fetching centers:', centersError);
        return;
      }

      setCenters(centersData || []);

      // Fetch students
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .order('name');

      if (studentsError) {
        console.error('Error fetching students:', studentsError);
      } else {
        setStudents(studentsData || []);
      }

      // Fetch batches
      const { data: batchesData, error: batchesError } = await supabase
        .from('batches')
        .select('*')
        .order('name');

      if (batchesError) {
        console.error('Error fetching batches:', batchesError);
      } else {
        setBatches(batchesData || []);
      }

      // Fetch recent attendance (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { data: attendanceData, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: false });

      if (attendanceError) {
        console.error('Error fetching attendance:', attendanceError);
      } else {
        setAttendanceRecords(attendanceData || []);
      }

      // Fetch fee payments (last 90 days)
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      
      const { data: feeData, error: feeError } = await supabase
        .from('fee_payments')
        .select('*')
        .gte('payment_date', ninetyDaysAgo.toISOString().split('T')[0])
        .order('payment_date', { ascending: false });

      if (feeError) {
        console.error('Error fetching fees:', feeError);
      } else {
        setFeeRecords(feeData || []);
      }

      // Set default selected center
      if (user && centersData && centersData.length > 0) {
        const userAvailableCenters = getAvailableCenters(user.role, user.center_id);
        
        if (userAvailableCenters.length > 0) {
          // For restricted roles (coach, center_manager), set their assigned center
          if (user.role === 'coach' || user.role === 'center_manager') {
            const userCenter = user.center_id ? userAvailableCenters.find(c => c.id === user.center_id) : undefined;
            setSelectedCenter(userCenter || userAvailableCenters[0] || null);
          } else {
            // For unrestricted roles, default to Kharadi if available, otherwise first center
            const kharadiCenter = userAvailableCenters.find(c => c.name.includes('Kharadi'));
            setSelectedCenter(kharadiCenter || userAvailableCenters[0] || null);
          }
        }
      } else if (centersData && centersData.length > 0) {
        // If no user, default to Kharadi or first center
        const kharadiCenter = centersData.find(c => c.name.includes('Kharadi'));
        setSelectedCenter(kharadiCenter || centersData[0] || null);
      }
    } catch (error) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    await fetchData();
  };

  useEffect(() => {
    fetchData();
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
        students,
        batches,
        attendanceRecords,
        feeRecords,
        getStudentsByCenter,
        getBatchesByCenter,
        getAttendanceByCenter,
        getFeesByCenter,
        refreshData,
      }}
    >
      {children}
    </CenterContext.Provider>
  );
}; 