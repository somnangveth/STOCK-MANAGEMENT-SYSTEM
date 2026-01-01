'use client';
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight} from "lucide-react";
import { LuLayoutDashboard } from "react-icons/lu";
import { LuUserRoundCog } from "react-icons/lu";
import { LuDollarSign } from "react-icons/lu";
import { LuTrendingUp } from "react-icons/lu";
import { LuUsers } from "react-icons/lu";
import { LuBoxes } from "react-icons/lu";

interface NavLinksProps {
    isAdmin: boolean;
}

export default function NavLinks({ isAdmin }: NavLinksProps){
    const pathname = usePathname();
    const [isProductsOpen, setIsProductsOpen] = useState(
        pathname.startsWith('/admin/products') ||
        pathname.startsWith('/admin/association') ||
        pathname.startsWith('/admin/stock') ||
        pathname.startsWith('/admin/categories') ||
        pathname.startsWith('/staff/products') ||
        pathname.startsWith('/staff/association') ||
        pathname.startsWith('/staff/stock') ||
        pathname.startsWith('/staff/categories')
    );

    // 新增 Suppliers 展开状态
    const [isSuppliersOpen, setIsSuppliersOpen] = useState(
        pathname.startsWith('/admin/vendors') ||
        pathname.startsWith('/admin/ledger') ||
        pathname.startsWith('/staff/vendors') ||
        pathname.startsWith('/staff/ledger')
    );

    const links =[
        {
            href: isAdmin ? '/admin' : '/staff',
            icon: <LuLayoutDashboard/>,
            text: 'Dashboard'
        },
        {
            href: '/admin/user',
            icon: <LuUserRoundCog/>,
            text: 'Users',
            adminOnly: true
        },
        {
            href: isAdmin ? '/admin/price' : '/staff/price',
            icon: <LuDollarSign/>,
            text: 'Price',
        },
        {
            href: isAdmin ? '/admin/pos' : '/staff/sales',
            icon: <LuTrendingUp/>,
            text: 'Sales',
        },
        
    ];

    const productLinks = [
        {
            href: isAdmin ? '/admin/products': 'staff/products',
            text: 'Products'
        },
        {
            href: isAdmin ? '/admin/categories': 'staff/category',
            text: 'Category'
        },
        {
            href: '/admin/association',
            text: 'Association'
        },
        {
            href: '/admin/stock',
            text: 'Stocks'
        }
    ];

    // 新增 Suppliers 子菜单
    const supplierLinks = [
        { 
            href: isAdmin ? '/admin/ledger' : '/staff/ledger', 
            text: 'Ledger' },
        { 
            href: isAdmin ? '/admin/vendors' : '/staff/vendors', 
            text: 'Vendor' }
    ];

    const isProductsActive = pathname.startsWith('/admin/products') || 
        pathname.startsWith('/admin/association') || 
        pathname.startsWith('/admin/stock') ||
        pathname.startsWith('/admin/categories') ||
        pathname.startsWith('/staff/products') || 
        pathname.startsWith('/staff/association') || 
        pathname.startsWith('/staff/stock') ||
        pathname.startsWith('/staff/categories');

    const isSuppliersActive = pathname.startsWith('/admin/vendors') ||
        pathname.startsWith('/admin/ledger') ||
        pathname.startsWith('/staff/vendors') ||
        pathname.startsWith('/staff/ledger');

    // Filter links based on admin status
    const filteredLinks = links.filter(link => !link.adminOnly || isAdmin);

    return (
        <div className="space-y-1 flex flex-col">
            {filteredLinks.slice(0,1).map((link, index)=> (
                <Link
                onClick={() => document.getElementById('sidebar-close')?.click()}
                    href = {link.href}
                    key={index}
                    className={cn(
                        "flex items-center gap-2 p-2 justify-start hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors",
                        {
                            "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300":
                            pathname === link.href
                        }
                    )}>
                       {link.icon} {link.text}
                </Link>
            ))}

            {/* Product Parents Menu */}
            <div>
                <button
                onClick={() => setIsProductsOpen(!isProductsOpen)}
                className={cn(
                    "w-full flex justify-start items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors",
                    {
                        "bg-amber-50 dark:bg-amber-950": isProductsActive
                    }
                )}>
                    <span className={cn(
                        "flex-1 text-left",
                        {
                            "text-amber-700 dark:text-amber-300 font-medium": isProductsActive
                        }
                    )}>
                       <p className="flex items-center gap-2"><LuBoxes/> Inventory</p>
                    </span>
                    {isProductsOpen ? (
                        <ChevronDown className="w-4 h-4"/>
                    ) : (
                        <ChevronRight className="w-4 h-4"/>
                    )}
                </button>

                {/* Sub-navigation */}
                {isProductsOpen && (
                    <div>
                        {productLinks.map((link, index) => (
                            <Link
                            onClick={() => document.getElementById('sidebar-close')?.click()}
                            href={link.href}
                            key={index}
                            className={cn(
                                "flex items-center justify-start gap-2 p-2 text-sm hover:bg-amber-100 dark:hover:bg-amber-800 rounded transition-colors",
                                {
                                    "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300":
                                    pathname === link.href
                                }
                            )}>
                            {link.text}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Suppliers Menu */}
                <div>
                <button
                    onClick={() => setIsSuppliersOpen(!isSuppliersOpen)}
                    className={cn(
                    "w-full flex justify-between items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors",
                    {
                        "bg-amber-50 dark:bg-amber-950": isSuppliersActive
                    }
                    )}
                >
                    <Link
                    href={isAdmin ? '/admin/vendors' : '/staff/vendors'}
                    onClick={() => document.getElementById('sidebar-close')?.click()}
                    className={cn(
                        "flex-1 flex items-center gap-2",
                        { "text-amber-700 dark:text-amber-300 font-medium": isSuppliersActive }
                    )}
                    >
                    <LuUsers /> Suppliers
                    </Link>
                    {isSuppliersOpen ? <ChevronDown className="w-4 h-4"/> : <ChevronRight className="w-4 h-4"/>}
                </button>

                {isSuppliersOpen && (
                    <div>
                    {supplierLinks.map((link, index) => (
                        <Link
                        key={index}
                        href={link.href}
                        onClick={() => document.getElementById('sidebar-close')?.click()}
                        className={cn(
                            "flex items-center justify-start gap-2 p-2 text-sm hover:bg-amber-100 dark:hover:bg-amber-800 rounded transition-colors",
                            {
                            "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300":
                                pathname === link.href
                            }
                        )}
                        >
                        {link.text}
                        </Link>
                    ))}
                    </div>
                )}
                </div>

            {/* Remaining Links */}
            {filteredLinks.slice(1).map((link, index) => (
                <Link
                onClick={() => document.getElementById('sidebar-close')?.click()}
                href={link.href}
                key={index}
                className={cn(
                    "flex items-center gap-2 p-2 justify-start hover:bg-amber-100 dark:hover:bg-amber-800 rounded transition-colors",
                    {
                        "bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300":
                        pathname === link.href
                    }
                )}>
                    {link.icon} {link.text}
                </Link>
            ))}
        </div>
    )
}