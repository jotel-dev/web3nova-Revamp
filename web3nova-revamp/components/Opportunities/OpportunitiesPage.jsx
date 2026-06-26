import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  ExternalLink,
  Trophy,
  Zap,
  Globe,
  Users,
  Filter,
  TrendingUp,
  Clock,
  Award,
} from 'lucide-react';

// ===================================================================
// BackgroundEffects
// ===================================================================
function BackgroundEffects() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 animate-grid-flow"
          style={{
            backgroundImage: `
              linear-gradient(rgba(74, 144, 226, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(74, 144, 226, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)',
          }}
        />
      </div>
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-3xl animate-float-slow opacity-30"
        style={{ background: 'radial-gradient(circle, #4A90E2, transparent)' }}
      />
      <div
        className="absolute top-1/2 right-0 w-80 h-80 rounded-full blur-3xl animate-float-medium opacity-25"
        style={{ background: 'radial-gradient(circle, #FDB913, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full blur-3xl animate-float-fast opacity-20"
        style={{ background: 'radial-gradient(circle, #4A90E2, transparent)' }}
      />
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(50px, 50px) scale(1.1); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-40px, 40px) scale(1.15); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.2); }
        }
        @keyframes grid-flow {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 15s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 12s ease-in-out infinite; }
        .animate-grid-flow { animation: grid-flow 20s linear infinite; }
      `}</style>
    </div>
  );
}

// ===================================================================
// HeroSection
// ===================================================================
function HeroSection({ stats }) {
  return (
    <section className="relative z-10 py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block px-6 py-2 rounded-full mb-6 bg-blue-500/10 border border-blue-500/20">
            <span
              className="text-blue-400 font-semibold text-sm"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              Live Opportunities
            </span>
          </div>
          <h1
            className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Web3Nova{' '}
            <span className="bg-gradient-to-r from-blue-400 to-yellow-400 bg-clip-text text-transparent">
              Hackathons
            </span>
          </h1>
          <p
            className="text-xl md:text-2xl text-gray-400 leading-relaxed mb-12"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Compete, build, and win. New opportunities posted as they open.
          </p>

          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              {[
                { label: 'Active Hackathons', value: stats.active, icon: Zap, color: '#4A90E2' },
                {
                  label: 'Total Prize Pool',
                  value: stats.totalPrize,
                  icon: Trophy,
                  color: '#FDB913',
                },
                { label: 'Web3 Focused', value: stats.web3Count, icon: Globe, color: '#4A90E2' },
                { label: 'AI Focused', value: stats.aiCount, icon: TrendingUp, color: '#88B9E6' },
              ].map((s, i) => (
                <div
                  key={i}
                  className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-4 text-center"
                >
                  <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
                  <div
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {s.value}
                  </div>
                  <div
                    className="text-xs text-gray-400"
                    style={{ fontFamily: 'Space Grotesk, sans-serif' }}
                  >
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ===================================================================
// Filters
// ===================================================================
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'Web3', label: 'Web3' },
  { key: 'AI', label: 'AI' },
  { key: 'Both', label: 'Web3 + AI' },
  { key: 'Online', label: 'Online' },
  { key: 'In-Person', label: 'In-Person' },
  { key: 'closing', label: 'Closing This Week' },
  { key: 'free', label: 'Free to Enter' },
];

const SORTS = [
  { key: 'deadline', label: 'Deadline Soonest' },
  { key: 'prize', label: 'Prize Largest' },
  { key: 'newest', label: 'Recently Added' },
];

function FilterBar({ active, sort, onChange, onSort }) {
  return (
    <div className="relative z-10 mb-10">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => onChange(f.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === f.key
                    ? 'bg-gradient-to-r from-[#2E7BD1] to-[#92B4E4] text-white'
                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20 hover:text-white'
                }`}
                style={{ fontFamily: 'Space Grotesk, sans-serif' }}
              >
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={sort}
              onChange={(e) => onSort(e.target.value)}
              className="bg-white/5 border border-white/10 text-gray-300 text-sm rounded-lg px-3 py-2 outline-none hover:border-white/20 transition-colors"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key} style={{ backgroundColor: '#0a0a0a' }}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===================================================================
// DeadlineBadge
// ===================================================================
function DeadlineBadge({ daysLeft }) {
  if (daysLeft === null) return null;

  if (daysLeft < 0) {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400 border border-gray-500/30">
        Closed
      </span>
    );
  }
  if (daysLeft === 0) {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
        Ending Today
      </span>
    );
  }
  if (daysLeft <= 3) {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">
        Closing Soon
      </span>
    );
  }
  if (daysLeft <= 7) {
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
        This Week
      </span>
    );
  }
  return null;
}

// ===================================================================
// OpportunityCard
// ===================================================================
function OpportunityCard({ opp, index }) {
  const categoryColors = {
    Web3: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400' },
    AI: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
    Both: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400' },
  };

  const formatColor = {
    Online: { bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
    'In-Person': { bg: 'bg-pink-500/10', border: 'border-pink-500/30', text: 'text-pink-400' },
    Hybrid: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400' },
  };

  const formatDeadline = (d) => {
    if (!d) return 'No deadline';
    return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatPrize = (prize, label) => {
    if (label) return label;
    if (!prize) return 'Non-cash';
    return `$${prize.toLocaleString()}`;
  };

  return (
    <div
      className="group relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-white/20 hover:bg-white/[0.07] transition-all duration-300"
      style={{
        animation: `fade-in-up 0.5s ease-out ${index * 0.06}s forwards`,
        opacity: 0,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <p
            className="text-xs text-gray-500 mb-1 truncate"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {opp.organizer}
          </p>
          <h3
            className="text-xl font-bold text-white leading-snug"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            {opp.title}
          </h3>
        </div>
        <DeadlineBadge daysLeft={opp.daysLeft} />
      </div>

      {/* Description */}
      <p
        className="text-gray-400 text-sm leading-relaxed mb-5 line-clamp-2"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        {opp.description}
      </p>

      {/* Tags row */}
      <div className="flex flex-wrap gap-2 mb-5">
        {opp.category.map((cat) => {
          const c = categoryColors[cat] ?? categoryColors['Web3'];
          return (
            <span
              key={cat}
              className={`px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.border} ${c.text} border`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {cat}
            </span>
          );
        })}
        {opp.format && (() => {
          const c = formatColor[opp.format] ?? formatColor['Online'];
          return (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${c.bg} ${c.border} ${c.text} border`}
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              {opp.format}
            </span>
          );
        })()}
        {opp.isFree && (
          <span
            className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Free
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm text-gray-400">
        <div className="flex items-center gap-1.5">
          <Trophy className="w-4 h-4 text-yellow-400" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {formatPrize(opp.prize, opp.prizeLabel)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-blue-400" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {opp.daysLeft !== null && opp.daysLeft >= 0
              ? `${opp.daysLeft}d left`
              : formatDeadline(opp.deadline)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-gray-500" />
          <span style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
            {formatDeadline(opp.deadline)}
          </span>
        </div>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3">
        {opp.registrationLink && (
          <Link href={opp.registrationLink} target="_blank" rel="noopener noreferrer">
            <button
              className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2E7BD1] to-[#92B4E4] text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 4px 20px rgba(46, 123, 209, 0.35)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Register Now
              <ExternalLink className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
            </button>
          </Link>
        )}
        {opp.communityLink && (
          <Link href={opp.communityLink} target="_blank" rel="noopener noreferrer">
            <button
              className="group/btn inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm font-semibold transition-all duration-300 hover:border-white/20 hover:text-white hover:bg-white/10"
              style={{ fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <Users className="w-3.5 h-3.5" />
              Find Teammates
            </button>
          </Link>
        )}
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            'radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(74,144,226,0.04), transparent 40%)',
        }}
      />
    </div>
  );
}

// ===================================================================
// EmptyState
// ===================================================================
function EmptyState({ filter }) {
  return (
    <div className="col-span-full text-center py-20">
      <Award className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <h3
        className="text-2xl font-bold text-white mb-2"
        style={{ fontFamily: 'Space Grotesk, sans-serif' }}
      >
        No hackathons right now
      </h3>
      <p className="text-gray-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
        {filter === 'all'
          ? 'New opportunities are posted regularly. Check back soon or follow us on Telegram.'
          : 'No opportunities match this filter. Try another category.'}
      </p>
    </div>
  );
}

// ===================================================================
// SkeletonCard
// ===================================================================
function SkeletonCard() {
  return (
    <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 animate-pulse">
      <div className="h-3 bg-white/10 rounded w-1/4 mb-2" />
      <div className="h-6 bg-white/10 rounded w-3/4 mb-4" />
      <div className="h-4 bg-white/10 rounded w-full mb-2" />
      <div className="h-4 bg-white/10 rounded w-2/3 mb-6" />
      <div className="flex gap-2 mb-6">
        <div className="h-6 w-16 bg-white/10 rounded-full" />
        <div className="h-6 w-20 bg-white/10 rounded-full" />
      </div>
      <div className="h-10 bg-white/10 rounded-xl w-32" />
    </div>
  );
}

// ===================================================================
// TelegramCTA
// ===================================================================
function TelegramCTA() {
  return (
    <section className="relative z-10 py-16">
      <div className="container mx-auto px-6">
        <div
          className="max-w-2xl mx-auto text-center backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10"
          style={{
            background:
              'linear-gradient(135deg, rgba(46,123,209,0.08) 0%, rgba(253,185,19,0.06) 100%)',
          }}
        >
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Zap className="w-7 h-7 text-blue-400" />
          </div>
          <h2
            className="text-3xl font-bold text-white mb-3"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Never miss an opportunity
          </h2>
          <p
            className="text-gray-400 mb-6 leading-relaxed"
            style={{ fontFamily: 'Space Grotesk, sans-serif' }}
          >
            Opportunities are posted directly from our Telegram community. Join to get instant
            alerts whenever a new hackathon drops.
          </p>
          <Link
            href="https://t.me/theweb3novaorg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#2E7BD1] to-[#92B4E4] text-white rounded-xl font-bold text-base transition-all duration-300 hover:scale-105"
              style={{
                boxShadow: '0 8px 32px rgba(46, 123, 209, 0.4)',
                fontFamily: 'Space Grotesk, sans-serif',
              }}
            >
              Join Web3Nova on Telegram
              <ExternalLink className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ===================================================================
// Main OpportunitiesPage
// ===================================================================
export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeSort, setActiveSort] = useState('deadline');

  useEffect(() => {
    fetch('/api/opportunities')
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setOpportunities(data.opportunities ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = opportunities
    .filter((o) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'closing') return o.daysLeft !== null && o.daysLeft <= 7 && o.daysLeft >= 0;
      if (activeFilter === 'free') return o.isFree;
      if (activeFilter === 'Online' || activeFilter === 'In-Person') return o.format === activeFilter;
      return o.category.includes(activeFilter);
    })
    .sort((a, b) => {
      if (activeSort === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      }
      if (activeSort === 'prize') return (b.prize ?? 0) - (a.prize ?? 0);
      if (activeSort === 'newest') return new Date(b.addedAt) - new Date(a.addedAt);
      return 0;
    });

  const stats = {
    active: opportunities.length,
    totalPrize:
      '$' +
      (opportunities.reduce((s, o) => s + (o.prize ?? 0), 0) / 1000).toFixed(0) +
      'k',
    web3Count: opportunities.filter((o) => o.category.includes('Web3') || o.category.includes('Both')).length,
    aiCount: opportunities.filter((o) => o.category.includes('AI') || o.category.includes('Both')).length,
  };

  return (
    <div className="min-h-screen relative bg-black">
      <BackgroundEffects />
      <div className="h-20 md:h-24" />
      <HeroSection stats={!loading && !error ? stats : null} />
      <FilterBar
        active={activeFilter}
        sort={activeSort}
        onChange={setActiveFilter}
        onSort={setActiveSort}
      />

      <section className="relative z-10 pb-20">
        <div className="container mx-auto px-6">
          {error && (
            <div className="text-center py-12">
              <p className="text-red-400" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                {error}
              </p>
            </div>
          )}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : filtered.length === 0
              ? <EmptyState filter={activeFilter} />
              : filtered.map((opp, i) => (
                  <OpportunityCard key={opp.id} opp={opp} index={i} />
                ))}
          </div>
        </div>
      </section>

      <TelegramCTA />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
