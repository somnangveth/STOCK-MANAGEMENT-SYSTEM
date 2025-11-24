"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

export default function NavLinks(){
    const pathname = usePathname();

    const links = [
        {
            href: "/admin",
            text: "Dashboard"
        },
        {
            href: "/admin/products",
            text: "Products",
        },
        {
            href: "/admin/user",
            text: "Users"
        },
        {
            href: "admin/price",
            text: "Price"
        },
        {
            href: "admin/sales",
            text: "Sales"
        },
        {
            href: "/admin/stock",
            text: "Stocks"
        },
        {
            href: "/admin/vendors",
            text: "Suppliers"
        }
    ];

    return(
        <div>
            {links.map((link, index) => {
                return(
                    <Link
                    onClick={() => 
                        document.getElementById("sidebar-close")?.click()
                    }
                    href={link.href}
                    key={index}
                    className={cn(
                        "flex items-center gap-2 p-2 justify-center",
                        {
                            "bg-blue-100 dark:bg-blue-50 text-blue-700":
                            pathname === link.href,
                        }
                    )}>
                        {link.text}
                    </Link>
                )
            })}
        </div>
    )
}