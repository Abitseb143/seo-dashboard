import Link from "next/link";
import { LayoutDashboard, CheckCircle, Zap, Code, FileText, History, Settings } from "lucide-react";

const navItems = [
    { name: "Overview", href: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Best Fixes", href: "/dashboard/best-fixes", icon: <CheckCircle size={20} /> },
    { name: "Quick Wins", href: "/dashboard/quick-wins", icon: <Zap size={20} /> },
    { name: "Technical SEO", href: "/dashboard/technical", icon: <Code size={20} /> },
    { name: "Content SEO", href: "/dashboard/content", icon: <FileText size={20} /> },
    { name: "Audit History", href: "/dashboard/history", icon: <History size={20} /> },
    { name: "Settings", href: "/dashboard/settings", icon: <Settings size={20} /> },
];

export default function Sidebar() {
    return (
        <aside className="w-64 bg-slate-900 text-slate-300 min-h-screen flex flex-col hidden md:flex">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Zap className="text-emerald-400" /> SEO Fixer AI
                </h1>
            </div>
            <nav className="flex-1 px-4 space-y-1">
                {navItems.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                    >
                        {item.icon}
                        <span className="font-medium">{item.name}</span>
                    </Link>
                ))}
            </nav>

        </aside>
    );
}
