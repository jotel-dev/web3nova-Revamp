import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Users, UserCheck, Clock, LogOut, Wifi, RefreshCw, Menu, X } from "lucide-react";
import { getToken, clearToken, deskFetch } from "@/lib/deskApi";

const NAV = [
  { href: "/desk/applicants", label: "Applicants", icon: Users },
  { href: "/desk/interns", label: "Interns", icon: UserCheck },
  { href: "/desk/attendance", label: "Attendance", icon: Clock },
];

function Sidebar({ router, hub, syncing, syncMsg, syncHubIp, logout, onClose }) {
  return (
    <aside className="w-full bg-zinc-950 flex flex-col h-full">
      <div className="px-5 py-6 border-b border-zinc-900 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Desk</div>
          <div className="text-xs text-zinc-500">Web3Nova</div>
        </div>
        {onClose && (
          <button type="button" onClick={onClose} aria-label="Close navigation" className="text-zinc-400 hover:text-white md:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 py-4">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = router.pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
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

      <div className="border-t border-zinc-900 px-5 py-4 space-y-2">
        <div className="flex items-center gap-2 text-xs text-zinc-500">
          <Wifi size={12} />
          <span className="font-mono truncate">{hub?.current_ip || "not set"}</span>
        </div>
        {hub?.updated_at && (
          <div className="text-[10px] text-zinc-600">
            updated {new Date(hub.updated_at).toLocaleString()}
          </div>
        )}
        <button
          onClick={syncHubIp}
          disabled={syncing}
          className="w-full flex items-center justify-center gap-2 text-xs bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-300 py-2 rounded border border-zinc-800"
        >
          <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
          {syncing ? "syncing..." : "Sync hub IP"}
        </button>
        {syncMsg && (
          <div className={`text-[10px] ${syncMsg.type === "ok" ? "text-emerald-400" : "text-red-400"}`}>
            {syncMsg.text}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-3 px-5 py-3 text-sm text-zinc-400 hover:text-red-400 border-t border-zinc-900"
      >
        <LogOut size={16} />
        Sign out
      </button>
    </aside>
  );
}

export default function DeskLayout({ children, title }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [hub, setHub] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/desk/login");
    } else {
      setReady(true);
      deskFetch("/hub/ip").then(setHub).catch(() => {});
    }
  }, [router]);

  // Close drawer on route change
  useEffect(() => { setDrawerOpen(false); }, [router.pathname]);

  async function syncHubIp() {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const data = await deskFetch("/hub/sync-ip", { method: "POST" });
      setHub((h) => ({ ...h, ...data }));
      setSyncMsg({ type: "ok", text: `Synced: ${data.current_ip}` });
    } catch (err) {
      setSyncMsg({ type: "err", text: err.message });
    } finally {
      setSyncing(false);
    }
  }

  function logout() {
    clearToken();
    router.replace("/desk/login");
  }

  if (!ready) return null;

  const sidebarProps = { router, hub, syncing, syncMsg, syncHubIp, logout };

  return (
    <div className="min-h-screen bg-black text-white flex">

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-60 border-r border-zinc-900 flex-col">
        <Sidebar {...sidebarProps} />
      </div>

      {/* Mobile drawer overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-y-0 left-0 z-50 w-60 border-r border-zinc-900 flex flex-col md:hidden">
          <Sidebar {...sidebarProps} onClose={() => setDrawerOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-zinc-900 bg-zinc-950">
          <button type="button" onClick={() => setDrawerOpen(true)} aria-label="Open navigation" className="text-zinc-400 hover:text-white">
            <Menu size={20} />
          </button>
          <span className="text-sm font-semibold">{title || "Desk"}</span>
        </header>

        <main className="flex-1 p-4 md:p-8 overflow-auto">
          {title && <h1 className="hidden md:block text-2xl font-semibold mb-6">{title}</h1>}
          {children}
        </main>
      </div>
    </div>
  );
}
