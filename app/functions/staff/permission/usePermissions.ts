'use client';

import { createSupabaseBrowserClient } from '@/lib/storage/browser';
import { useEffect, useState } from 'react';

// Add proper type definition for the nested query result
type PermissionData = {
  permission_table: {
    code: string;
  };
};

export function usePermissions() {
  const supabase = createSupabaseBrowserClient();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadPermissions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPermissions([]);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      // Check if admin
      const { data: member } = await supabase
        .from('member')
        .select('admin_id, staff_id')
        .eq('auth_id', user.id)
        .single();

      if (member?.admin_id) {
        setIsAdmin(true);
        setPermissions([]);
        setLoading(false);
        return; // Admins have all permissions
      }

      setIsAdmin(false);

      // Get staff permissions
      if (member?.staff_id) {
        const { data: permData } = await supabase
          .from('staff_permission')
          .select(`
            permission_table!inner (
              code
            )
          `)
          .eq('staff_id', member.staff_id);

        // Type assertion to fix the TypeScript error
        const codes = (permData as PermissionData[] | null)?.map(
          p => p.permission_table.code
        ) || [];
        
        setPermissions(codes);
      } else {
        setPermissions([]);
      }
    } catch (error) {
      console.error('Error loading permissions:', error);
      setPermissions([]);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPermissions();

    // Listen for auth changes to refresh permissions
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        loadPermissions();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const hasPermission = (code: string): boolean => {
    return isAdmin || permissions.includes(code);
  };

  const hasAnyPermission = (codes: string[]): boolean => {
    return isAdmin || codes.some(code => permissions.includes(code));
  };

  const hasAllPermissions = (codes: string[]): boolean => {
    return isAdmin || codes.every(code => permissions.includes(code));
  };

  const refetch = () => {
    setLoading(true);
    loadPermissions();
  };

  return {
    permissions,
    isAdmin,
    loading,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refetch, // Expose refetch in case you need to manually reload
  };
}