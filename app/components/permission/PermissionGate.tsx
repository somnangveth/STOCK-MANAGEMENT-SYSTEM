"use client";

import React from 'react';
import { usePermissions } from '@/app/functions/staff/permission/usePermissions';

type PermissionGateProps = {
  permission: string | string[];
  requireAll?: boolean;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
  children: React.ReactNode;
  strictMode?: boolean;
}

export function PermissionGate({
  permission,
  requireAll = false,
  fallback = <DefaultFallback/>,
  loadingFallback = <DefaultLoadingFallback/>,
  children,
  strictMode = false

}: PermissionGateProps){
  const {hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, loading} = usePermissions();

  //Show loading State
  if(loading){
    return <>{loadingFallback}</>
  }

  //Admins bypass all checks unless strictMode is enabled
  if(isAdmin && !strictMode){
    return <>{children}</>
  }

  //Normalize permissions to array
  const permissions = Array.isArray(permission) ? permission : [permission];

  //Check permissions
  let hasAccess = false;

  if(permission.length === 0){
    hasAccess = true;
  }else if(permission.length === 1){
    hasAccess = hasPermission(permissions[0]);
  }else if(requireAll){
    hasAccess = hasAllPermissions(permissions);
  }else{
    hasAccess = hasAnyPermission(permissions);
  }


  //Return appropriate content
  if(!hasAccess){
    return <>{fallback}</>
  }

  return <>{children}</>
}


//Default fallback component
function DefaultFallback(){
  return (
   <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-lg border border-gray-200">
      <svg 
        className="w-16 h-16 text-gray-400 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
        />
      </svg>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Access Denied
      </h3>
      <p className="text-gray-600 text-center max-w-md">
        You don't have permission to access this content. Please contact your administrator if you believe this is an error.
      </p>
    </div>
  )
}
//Default loading fallback component
function DefaultLoadingFallback(){
  return(
    <div className='flex items-center justify-center p-8'>
      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
      <p className='ml-3 text-gray-500'>Checking Permission</p>
    </div>
  );
}


//Utility component for inline permission checks
export function PermissionCheck({
  permission,
  requireAll = false,
  children,
  strictMode = false
}: Omit<PermissionGateProps, 'fallback' | 'loadingFallback'>){
  const {hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, loading} = usePermissions();

  if(loading) return null;
  if(isAdmin && !strictMode) return <>{children}</>

  const permissions = Array.isArray(permission) ? permission : [permission];

  let hasAccess = false;

  if(permissions.length === 1){
    hasAccess = hasPermission(permission[0])
  }else if(requireAll){
    hasAccess = hasAllPermissions(permissions);
  }else{
    hasAccess = hasAnyPermission(permissions);
  }

  return hasAccess ? <>{children}</> : null;
}


//Hook for conditional rendering in components
export function usePermissionGate(permission: string | string[], requireAll = false){
  const {hasPermission, hasAnyPermission, hasAllPermissions, isAdmin, loading} = usePermissions();

  if(loading){
    return {canAccess: false, loading: true, isAdmin};
  }

  if(isAdmin){
    return {canAccess: true, loading: false, isAdmin: true};
  }

  const permissions = Array.isArray(permission)? permission : [permission];

  let canAccess = false;

  if(permissions.length === 1){
    canAccess = hasPermission(permissions[0]);
  } else if(requireAll){
    canAccess = hasAllPermissions(permissions);
  }else{
    canAccess = hasAnyPermission(permissions);
  }


  return {canAccess, loading: false, isAdmin: false};
}