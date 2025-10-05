import { useContext } from 'react';
import { useAuthContext } from '@/providers/AuthProvider';

export const useAuth = () => useAuthContext();
