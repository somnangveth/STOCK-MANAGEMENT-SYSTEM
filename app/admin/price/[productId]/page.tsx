// "use client";

// import { useEffect, useState } from "react";
// import PriceForm from "@/components/PriceForm";

// export default function EditPricePage({ params }) {
//   const { productId } = params;
//   const [data, setData] = useState(null);

//   useEffect(() => {
//     async function load() {
//       const base = await fetch(`/api/products/${productId}/price`).then((r) =>
//         r.json()
//       );
//       const rule = await fetch(`/api/products/${productId}/rules`).then((r) =>
//         r.json()
//       );

//       setData({ base, rule });
//     }
//     load();
//   }, []);

//   if (!data) return <div>Loading...</div>;

//   return <PriceForm productId={productId} data={data} />;
// }
