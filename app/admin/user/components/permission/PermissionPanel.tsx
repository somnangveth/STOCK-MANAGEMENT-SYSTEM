"use client";

import { styledToast } from "@/app/components/Toast";
import { fetchPermission, updateAllStaffPermission } from "@/app/functions/admin/permission/permission";
import { useEffect, useState, useTransition } from "react";

type Permission = {
    permission_id: string;
    permission_name: string;
    description: string;
    module: string;
}

export function PermissionPanel(){
    const [edit, setEdit] = useState(false);
    const [isPending, startTransition] = useTransition();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [selectedPermission, setSelectedPermissions] = useState<string[]>([]);

    //Styling
    const button = "px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors disabled:opacity-50";

    //Fetching permission_table data
    useEffect(() => {
        async function fetchData(){
            try{
                //fetch permission table
                const permissionData = await fetchPermission();

                if(!permissionData){
                    console.error("Failed to fetch permission data");
                    throw new Error("Failed to fetch permissions");
                }

                setPermissions(permissionData);
            }catch(error){
                console.error('Error in fetchData', error);
            }
        }
        fetchData();
    }, []);

    //Update staff Permission
    async function onSubmit(){
        startTransition(async() => {
            try{
                const insertedPermissions = await updateAllStaffPermission();

                if(!insertedPermissions){
                    console.error("Failed to update staff permission");
                    throw new Error("Failed to update");
                }

                console.log("Selected permissions: ", selectedPermission);

                //Simulate API Call
                await new Promise((resolve) => setTimeout(resolve, 1000));

                setEdit(false);
                styledToast.success("Permissions updated successfully!");
                
                // Reset selections after successful save
                setSelectedPermissions([]);
            }catch(error){
                console.error("Failed to update permissions: ", error);
                styledToast.error("Failed to update permissions");
            }
        });
    }

    //Handle Cancel
    const onCancel = () => {
        setSelectedPermissions([]);
        setEdit(false);
    }

    //Toggle individual permission
    const togglePermission = (permissionId: string) => {
        setSelectedPermissions(prev => 
            prev.includes(permissionId)
            ? prev.filter(id => id !== permissionId)
            : [...prev, permissionId]
        );
    };

    //Toggle all permission in a module
    const toggleModule = (modulePermIds: string[]) => {
        const allSelected = modulePermIds.every(id =>
            selectedPermission.includes(id)
        );

        if(allSelected){
            setSelectedPermissions(prev => prev.filter(id => !modulePermIds.includes(id)));
        }else{
            setSelectedPermissions(prev => [...new Set([...prev, ...modulePermIds])]);
        }
    };

    //Group permissions by module
    const groupedPermissions = permissions.reduce((acc, permission) => {
        const module = permission.module;
        if(!acc[module]) {
            acc[module] = [];
        }
        acc[module].push(permission);
        return acc;
    }, {} as Record<string, Permission[]>);

    const hasChanges = selectedPermission.length > 0;

    return(
        <div>
            <h2>Staff Permission Management</h2>
        {!edit ? (
            <button
            onClick={() => setEdit(true)}
            className={button}>
            Edit Permission
            </button>
        ):(
            <div>
                <button
                onClick={onCancel}
                disabled={isPending}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50">
                    Cancel
                </button>
                <button
                onClick={onSubmit}
                disabled={isPending || !hasChanges}
                className={button}>
                    {isPending ? "Saving..." : "Save Changes"}
                </button>
            </div>
        )}

        <div className="grid grid-cols-3 gap-2 border p-3 m-1 bg-white shadow-md">
            {Object.entries(groupedPermissions).map(([module, perms]) => {
                const modulePermIds = perms.map((p) => p.permission_id);
                const allSelected = modulePermIds.every((id) => selectedPermission.includes(id));
                return(
                    <div key={module}>
                        <div>
                            <input type="checkbox"
                            checked={allSelected}
                            onChange={() => toggleModule(modulePermIds)}
                            disabled = {!edit}
                            className="w-4 h-4" />
                            <p className="font-semibold">{module}</p>
                            <div className="ml-6 space-y-2">
                                {perms.map((permission) => (
                                    <div key={permission.permission_id} className="flex items-start gap-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedPermission.includes(permission.permission_id)}
                                            onChange={() => togglePermission(permission.permission_id)}
                                            disabled={!edit}
                                            className="w-4 h-4 mt-1"
                                        />
                                        <div>
                                            <div className="font-medium">{permission.permission_name}</div>
                                            <div className="text-sm text-gray-600">{permission.description}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
        </div>
    )
}