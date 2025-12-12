// app/admin/sales/components/addForm.tsx


"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddSaleForm from "./addsales";
import DialogForm from "@/app/components/DialogForm";
import { plusCircle } from "@/app/components/Icons";

export default function AddSalesForm({
    onAddsaleform,
    className = "" // 添加 className 参数
}:{
    onAddsaleform?: () => void
    className?: string // 类型定义
}){
    return(
        <div className={className}> {/* 添加容器 */}
            <DialogForm
                id="vendor-trigger"
                title="Create New Sales"
                Trigger ={
                    <Button
                        className="border border-blue-700 bg-blue-100 text-blue-700 hover:bg-blue-700 hover:text-blue-50">
                        {plusCircle} Add Sales
                    </Button>
                }
                form={<AddSaleForm onAddSuccess={onAddsaleform}/>}
            />
        </div>
    )
}