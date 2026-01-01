"use client";

import { useState } from "react";
import { deleteMember } from "../../actions";
import { styledToast } from "@/app/components/Toast";
import { Button } from "@/components/ui/button";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle, 
    AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { trash } from "@/app/components/Icons";
import { Loader2 } from "lucide-react";

export default function DeleteMember({ user_id }: { user_id: string }) {
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    async function handleDelete() {
        setIsDeleting(true);
        
        try {
            const res = await deleteMember(user_id);
            
            // Handle different response types
            let result;
            if (typeof res === "string") {
                try {
                    result = JSON.parse(res);
                } catch (parseError) {
                    console.error("Failed to parse response:", parseError);
                    styledToast.error("Invalid response from server");
                    setIsDeleting(false);
                    return;
                }
            } else {
                result = res;
            }

            // Check for errors
            if (result?.error) {
                console.error("Failed to delete:", result.error);
                styledToast.error(result.error || "Failed to delete user");
            } else if (result?.success) {
                styledToast.success("Member deleted successfully!");
                setOpen(false);
                
                // Optional: Trigger a refresh or redirect
                // window.location.reload();
                // or use router.refresh() if using Next.js router
            } else {
                // Unexpected response format
                console.error("Unexpected response:", result);
                styledToast.error("Unexpected response from server");
            }
        } catch (error) {
            console.error("Delete error:", error);
            const errorMessage = error instanceof Error 
                ? error.message 
                : "Something went wrong while deleting";
            styledToast.error(errorMessage);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    className="
                        h-7 w-15
                        bg-transparent text-red-700
                        text-sm
                        rounded-xl
                        hover:bg-red-500 hover:text-red-100
                        transition-colors
                    "
                    aria-label="Delete member"
                >
                    {trash}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-semibold text-red-700">
                        Confirm Deletion
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Are you sure you want to delete this member? This action cannot be undone.
                        All associated data including permissions will be permanently removed.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel 
                        disabled={isDeleting}
                        className="border border-gray-300 hover:bg-gray-100 rounded-xl"
                    >
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault(); // Prevent default dialog close
                            handleDelete();
                        }}
                        disabled={isDeleting}
                        className="bg-red-200 border-2 border-red-700 rounded-xl text-red-700 hover:bg-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}