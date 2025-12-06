import React from 'react';
import { usePermissions } from '@/app/functions/staff/permission/usePermissions';

type PermissionGateProps = {
  permission: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

export function PermissionGate({ 
  permission, 
  requireAll = false,
  fallback = null,
  children 
}: PermissionGateProps) {
  const { hasPermission, hasAnyPermission, hasAllPermissions, loading } = usePermissions();

  if (loading) {
    return null; // or a loading spinner
  }

  const permissions = Array.isArray(permission) ? permission : [permission];
  
  let hasAccess = false;
  if (permissions.length === 1) {
    hasAccess = hasPermission(permissions[0]);
  } else if (requireAll) {
    hasAccess = hasAllPermissions(permissions);
  } else {
    hasAccess = hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}