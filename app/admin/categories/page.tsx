'use client';

import AddCategoryForm from "./components/category/AddCatForm";
import DisplayAll from "./components/filter/DisplayAll";
import AddSubcategoryForm from "./components/subcategory/AddSubForm";

export default function CategoryPage(){
    return(
    <div>
        <div className="gap-2 flex justify-end">
        <AddCategoryForm/>
        <AddSubcategoryForm/>
        </div>

        <div className="mt-10">
            <DisplayAll/>
        </div>
    </div>
    )
}