export interface User {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'club_manager' | 'head_coach' | 'coach' | 'center_manager'
  center_id: string | null
  created_at: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  full_name: string
  role: 'super_admin' | 'club_manager' | 'head_coach' | 'coach' | 'center_manager'
  center_id?: string
}

// Mock users data - in a real app, this would be in a database
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@snigmay.com',
    full_name: 'Super Admin',
    role: 'super_admin',
    center_id: null,
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    email: 'club@snigmay.com',
    full_name: 'Club Manager',
    role: 'club_manager',
    center_id: null,
    created_at: new Date().toISOString()
  },
  {
    id: '3',
    email: 'headcoach@snigmay.com',
    full_name: 'Head Coach',
    role: 'head_coach',
    center_id: null,
    created_at: new Date().toISOString()
  },
  {
    id: '4',
    email: 'coach.kharadi@snigmay.com',
    full_name: 'Coach Kharadi',
    role: 'coach',
    center_id: 'center-1',
    created_at: new Date().toISOString()
  },
  {
    id: '5',
    email: 'manager.kharadi@snigmay.com',
    full_name: 'Center Manager Kharadi',
    role: 'center_manager',
    center_id: 'center-1',
    created_at: new Date().toISOString()
  }
]

// Mock passwords - in a real app, these would be hashed
const MOCK_PASSWORDS: Record<string, string> = {
  'admin@snigmay.com': 'admin123',
  'club@snigmay.com': 'club123',
  'headcoach@snigmay.com': 'coach123',
  'coach.kharadi@snigmay.com': 'coach123',
  'manager.kharadi@snigmay.com': 'manager123'
}

const AUTH_STORAGE_KEY = 'snigmay_auth_user'
const USERS_STORAGE_KEY = 'snigmay_users'
const PASSWORDS_STORAGE_KEY = 'snigmay_passwords'

// Initialize localStorage with mock data if not exists
const initializeStorage = () => {
  if (typeof window === 'undefined') return

  if (!localStorage.getItem(USERS_STORAGE_KEY)) {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(MOCK_USERS))
  }
  
  if (!localStorage.getItem(PASSWORDS_STORAGE_KEY)) {
    localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(MOCK_PASSWORDS))
  }
}

// Get all users from localStorage
const getUsers = (): User[] => {
  if (typeof window === 'undefined') return MOCK_USERS
  
  const users = localStorage.getItem(USERS_STORAGE_KEY)
  return users ? JSON.parse(users) : MOCK_USERS
}

// Get all passwords from localStorage
const getPasswords = (): Record<string, string> => {
  if (typeof window === 'undefined') return MOCK_PASSWORDS
  
  const passwords = localStorage.getItem(PASSWORDS_STORAGE_KEY)
  return passwords ? JSON.parse(passwords) : MOCK_PASSWORDS
}

// Save users to localStorage
const saveUsers = (users: User[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
}

// Save passwords to localStorage
const savePasswords = (passwords: Record<string, string>) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(PASSWORDS_STORAGE_KEY, JSON.stringify(passwords))
}

export const signIn = async (credentials: LoginCredentials): Promise<{ user: User }> => {
  initializeStorage()
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers()
      const passwords = getPasswords()
      
      const user = users.find(u => u.email === credentials.email)
      
      if (!user) {
        reject(new Error('User not found'))
        return
      }
      
      if (passwords[credentials.email] !== credentials.password) {
        reject(new Error('Invalid password'))
        return
      }
      
      // Store user in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
      
      resolve({ user })
    }, 500) // Simulate network delay
  })
}

export const signUp = async (signupData: SignupData): Promise<{ user: User }> => {
  initializeStorage()
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers()
      const passwords = getPasswords()
      
      // Check if user already exists
      if (users.find(u => u.email === signupData.email)) {
        reject(new Error('User already exists'))
        return
      }
      
      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: signupData.email,
        full_name: signupData.full_name,
        role: signupData.role,
        center_id: signupData.center_id || null,
        created_at: new Date().toISOString()
      }
      
      // Save user and password
      const updatedUsers = [...users, newUser]
      const updatedPasswords = { ...passwords, [signupData.email]: signupData.password }
      
      saveUsers(updatedUsers)
      savePasswords(updatedPasswords)
      
      // Store user in localStorage
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newUser))
      
      resolve({ user: newUser })
    }, 500) // Simulate network delay
  })
}

export const signOut = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
      resolve()
    }, 100)
  })
}

export const getCurrentUser = async (): Promise<User | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (typeof window === 'undefined') {
        resolve(null)
        return
      }
      
      const userString = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!userString) {
        resolve(null)
        return
      }
      
      try {
        const user = JSON.parse(userString)
        resolve(user)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
        resolve(null)
      }
    }, 100)
  })
}

export const updateUser = async (userData: Partial<User>): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentUserString = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!currentUserString) {
        reject(new Error('No user logged in'))
        return
      }
      
      const currentUser = JSON.parse(currentUserString)
      const users = getUsers()
      
      const updatedUser = { ...currentUser, ...userData }
      const updatedUsers = users.map(u => u.id === updatedUser.id ? updatedUser : u)
      
      saveUsers(updatedUsers)
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser))
      
      resolve(updatedUser)
    }, 300)
  })
}

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const currentUserString = localStorage.getItem(AUTH_STORAGE_KEY)
      if (!currentUserString) {
        reject(new Error('No user logged in'))
        return
      }
      
      const currentUser = JSON.parse(currentUserString)
      const passwords = getPasswords()
      
      if (passwords[currentUser.email] !== currentPassword) {
        reject(new Error('Current password is incorrect'))
        return
      }
      
      const updatedPasswords = { ...passwords, [currentUser.email]: newPassword }
      savePasswords(updatedPasswords)
      
      resolve()
    }, 300)
  })
}

// Role-based access control utilities
export const hasAccess = (userRole: string, requiredRoles: string[]): boolean => {
  return requiredRoles.includes(userRole)
}

export const canAccessAllCenters = (userRole: string): boolean => {
  return ['super_admin', 'club_manager', 'head_coach'].includes(userRole)
}

export const canManageUsers = (userRole: string): boolean => {
  return ['super_admin', 'club_manager', 'head_coach'].includes(userRole)
}

export const canManageFinances = (userRole: string): boolean => {
  return ['super_admin', 'club_manager', 'head_coach'].includes(userRole)
}

export const canMarkAttendance = (userRole: string): boolean => {
  return ['super_admin', 'club_manager', 'head_coach', 'coach', 'center_manager'].includes(userRole)
}

export const canViewReports = (userRole: string): boolean => {
  return ['super_admin', 'club_manager', 'head_coach'].includes(userRole)
}

// Initialize storage when module loads
if (typeof window !== 'undefined') {
  initializeStorage()
}
