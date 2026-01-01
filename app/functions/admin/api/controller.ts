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

//Fetch Prices for B2C
export async function fetchPricesB2C(){
    const res = await fetch('/api/admin/fetchPricesB2C');
    if(!res.ok){
        throw new Error('Failed to fetch');
    }

    return res.json();
}

//Fetch Prices for B2B
export async function fetchPricesB2B(){
    const res = await fetch('/api/admin/fetchPricesB2B');

    if(!res.ok){
        throw new Error("Failed to fetch");
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

//Fetch Batch
export async function fetchBatch(){
    const res = await fetch('/api/admin/fetchBatch');
    if(!res.ok){
        throw new Error("Error to fetch");
    }

    return res.json();
}

//Fetch Expired Batch
export async function fetchExpiredBatch(){
const res = await fetch('/api/admin/getExpiredBatches');
if(!res.ok){
    console.error('Failed to fetch expired datas');
    throw new Error('Failed to fetch');
}

    return res.json();
}

//Fetch Dealers
export async function fetchDealers(){
    const res = await fetch('/api/admin/fetchDealers');
    if(!res.ok){
        console.error("Failed to fetch Dealers")
    }

    return res.json();
}

//Fetch Sales
export async function fetchSales(){
    const res = await fetch("/api/admin/fetchSales");
    if(!res.ok){
        console.error("Failed to fetch sales");
    }

    return res.json();
}

//Fetch Sale Items
export async function fetchSaleItems(){
    const res= await fetch("/api/admin/fetchSaleItems");

    if(!res.ok){
        console.error("Failed to fetch sale items");
    }

    return res.json();
}