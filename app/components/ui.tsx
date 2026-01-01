"use client";
import { FaEdit } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { RxPlusCircled } from "react-icons/rx";
import { FaPlusCircle } from "react-icons/fa";
import { FaMinusCircle } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { FaCircleXmark, FaDesktop } from "react-icons/fa6";
import { FaTasks } from "react-icons/fa";
import { FaBox } from "react-icons/fa";
//============== Icons ==================
// Edit Pen
export const edit = <FaEdit />;

//View
export const view = <FaEye/>;

//Delete TrashCan
export const trash = <FaTrashAlt/>;

//Fa Plus Circle
export const faPlusCircle = <FaPlusCircle/>;

//Fa Minus Circle
export const faMinusCircle = <FaMinusCircle/>;

//Plus Circle
export const plusCircle = <RxPlusCircled/>;

//Circle Cross
export const circleCross = <FaCircleXmark/>;

//Monitor Icon
export const desktop = <FaDesktop/>

//Tasks Icon
export const task = <FaTasks/>

//Box Icon
export const box = <FaBox/>
//=========================================


//============== Styling ==================
//Button
export const btnStyle = 'text-sm border border-amber-700 text-amber-700 bg-yellow-100 flex items-center p-2 rounded-lg gap-2 hover:bg-amber-700 hover:text-white dark:bg-amber-700';
//Submit Button
export const SubmitBtn = 'text-sm bg-amber-500 text-white items-center p-2 rounded-lg hover:bg-amber-700 hover:text-white';
//Cancel Button 
export const CancelBtn = 'text-sm bg-white border-gray-500 items-center text-gray-600 rounded-lg hover:bg-gray-300';
//Edit Icon Button
export const EditIconBtn = "bg-transparent hover:bg-transparent text-blue-500 hover:text-blue-700";
//Delete Icon Button
export const DeleteIconBtn = "bg-transparent hover:bg-transparent text-red-500 hover:text-red-700";
//Completed Button
export const CompletedBtn = "bg-green-500 text-white px-3 py-1 rounded-lg";
//=========================================
