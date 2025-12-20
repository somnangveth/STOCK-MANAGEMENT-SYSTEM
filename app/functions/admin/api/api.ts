//Fetch Products
export async function fetchProducts(){
    const res = await fetch("/api/admin/fetchProducts");
    if(!res.ok){
        throw new Error("Failed to fetch");
    }
    return res.json();
}

//Fetch Category And Subcategory
export async function fetchCategoryAndSubcategory(){
    const res = await fetch('/api/admin/fetchCategoryAndSubcategory');
    if(!res.ok){
        throw new Error("Failed to fetch");
    }

    return res.json();
}

//Fetch Contact
export async function fetchContact(){
    const res = await fetch('/api/admin/fetchContact');
    if(!res.ok){
        throw new Error("Failed to fetch");
    }

    return res.json();
}

//Fetch Prices
export async function fetchPrices(){
    const res = await fetch('/api/admin/fetchPrices');
    if(!res.ok){
        throw new Error('Failed to fetch');
    }

    return res.json();
}


//Fetch Vendors
export async function fetchVendors(){
    const res = await fetch('/api/admin/fetchVendors');
    if(!res.ok){
        throw new Error("Failed to fetch");
    }

    return res.json();
}