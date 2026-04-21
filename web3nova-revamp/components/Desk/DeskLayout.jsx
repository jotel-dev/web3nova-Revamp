import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Users, UserCheck, Clock, LogOut } from "lucide-react";
import { getToken, clearToken } from "@/lib/deskApi";

const NAV = [
  { href: "/desk/applicants", label: "Applicants", icon: Users },
  { href: "/desk/interns", label: "Interns", icon: UserCheck },
  { href: "/desk/attendance", label: "Attendance", icon: Clock },
];

export default function DeskLayout({ children, title }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/desk/login");
    } else {
      setReady(true);
    }
  }, [router]);

  function logout() {
    clearToken();
    router.replace("/desk/login");
  }

  if (!ready) return null;

  return (
    <div className="min-h-screen bg-black text-white flex">
      <aside className="w-60 border-r border-zinc-900 bg-zinc-950 flex flex-col">
        <div className="px-5 py-6 border-b border-zinc-900">
          <div className="text-lg font-semibold">Desk</div>
          <div className="text-xs text-zinc-500">Web3Nova</div>
        </div>

        <nav className="flex-1 py-4">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-5 py-2.5 text-sm ${
                  active
                    ? "bg-zinc-900 text-white border-l-2 border-white"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 px-5 py-3 text-sm text-zinc-400 hover:text-red-400 border-t border-zinc-900"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {title && <h1 className="text-2xl font-semibold mb-6">{title}</h1>}
        {children}
      </main>
    </div>
  );
}
