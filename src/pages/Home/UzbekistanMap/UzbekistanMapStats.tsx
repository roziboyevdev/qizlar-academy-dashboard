import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from 'components/ui/card';
import { Skeleton } from 'components/ui/skeleton';
import { useStatsByArea } from 'modules/statistics/hooks/useStatsByArea';
import { useStatsByDistrict } from 'modules/statistics/hooks/useStatsByDistrict';
import type { IAreaStat, AreaSortBy } from 'modules/statistics/types';
import regionPaths from './regionPaths';
import { Users, BookOpen, Award, GraduationCap, ArrowLeft, MapPin } from 'lucide-react';

const SORT_OPTIONS: { value: AreaSortBy; label: string }[] = [
  { value: 'profiles', label: 'Profillar' },
  { value: 'startedCourses', label: 'Boshlangan kurslar' },
  { value: 'certificates', label: 'Sertifikatlar' },
  { value: 'certifiedUsers', label: 'Sertifikatlangan' },
];

/**
 * Primary color: #E8307D  hsl(335, 80%, 55%)
 * Gradient: background (eng kam) -> yorqin primary (eng ko'p)
 * sqrt scale ishlatiladi - kichik farqlarni ham ko'rsatish uchun
 */
const LEGEND_COLORS = [
  '#1a1015', '#2d1525', '#4a1838', '#6b1e4d',
  '#8e2562', '#b52c73', '#d4327a', '#E8307D',
];

const getHeatColor = (value: number, max: number): string => {
  if (max === 0 || value === 0) return '#1a1015';
  // sqrt scale - kichik qiymatlar ham ajralib turadi
  const ratio = Math.sqrt(value / max);
  if (ratio < 0.15) return '#2d1525';
  if (ratio < 0.3) return '#4a1838';
  if (ratio < 0.4) return '#6b1e4d';
  if (ratio < 0.5) return '#8e2562';
  if (ratio < 0.65) return '#b52c73';
  if (ratio < 0.8) return '#d4327a';
  return '#E8307D';
};

const formatNumber = (n: number) => n.toLocaleString('uz-UZ');

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Users; label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-card px-4 py-3">
      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] text-muted-foreground truncate">{label}</p>
        <p className="text-base font-bold tabular-nums">{formatNumber(value)}</p>
      </div>
    </div>
  );
}

export default function UzbekistanMapStats() {
  const [sortBy, setSortBy] = useState<AreaSortBy>('profiles');
  const [selectedRegion, setSelectedRegion] = useState<IAreaStat | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<number | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const { data: regions, isLoading } = useStatsByArea(sortBy);

  const { data: districts, isLoading: districtsLoading } = useStatsByDistrict({
    sortBy,
    regionId: selectedRegion?.id,
    pageSize: 100,
    pageNumber: 1,
  });

  // Name-based matching: API name -> regionPaths name
  const regionDataMap = useMemo(() => {
    const map = new Map<number, IAreaStat>();
    if (!regions?.length) return map;

    for (const apiRegion of regions) {
      // 1) Direct ID match
      const byId = regionPaths.find((rp) => rp.id === apiRegion.id);
      if (byId) {
        map.set(byId.id, apiRegion);
        continue;
      }
      // 2) Name-based fuzzy match
      const normalName = apiRegion.name.toLowerCase().replace(/['\s]/g, '');
      const byName = regionPaths.find((rp) => {
        const rpName = rp.displayName.toLowerCase().replace(/['\s]/g, '');
        const rpShort = rp.name.toLowerCase().replace(/['\s]/g, '');
        return rpName.includes(normalName) || normalName.includes(rpShort) || rpShort.includes(normalName);
      });
      if (byName) {
        map.set(byName.id, apiRegion);
      }
    }
    return map;
  }, [regions]);

  const maxValue = useMemo(() => {
    if (!regions?.length) return 0;
    return Math.max(...regions.map((r) => r[sortBy]));
  }, [regions, sortBy]);

  const sortedRegions = useMemo(() => {
    return (regions ?? []).slice().sort((a, b) => b[sortBy] - a[sortBy]);
  }, [regions, sortBy]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  // Find tooltip data from regionDataMap
  const hoveredPath = hoveredRegion ? regionPaths.find((rp) => rp.id === hoveredRegion) : null;
  const tooltipRegion = hoveredRegion ? regionDataMap.get(hoveredRegion) : null;

  return (
    <>
      <h2 className="font-semibold text-center">O'zbekiston xaritasi bo'yicha statistika</h2>
      <Card className="mt-2 overflow-hidden">
        <CardHeader className="flex-row items-center justify-between gap-4 space-y-0 pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {selectedRegion ? selectedRegion.name : 'Viloyatlar kesimida'}
          </CardTitle>
          <div className="flex items-center gap-2">
            {selectedRegion && (
              <button
                onClick={() => setSelectedRegion(null)}
                className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-accent/20 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Orqaga
              </button>
            )}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as AreaSortBy)}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          {isLoading ? (
            <div className="flex flex-col xl:flex-row gap-4">
              {/* Xarita shimmer */}
              <div className="flex-1">
                <svg viewBox="0 0 900 500" className="w-full h-auto">
                  <defs>
                    <linearGradient id="shimmer-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(232,48,125,0.03)" />
                      <stop offset="50%" stopColor="rgba(232,48,125,0.12)">
                        <animate attributeName="offset" values="-0.5;1.5" dur="1.8s" repeatCount="indefinite" />
                      </stop>
                      <stop offset="100%" stopColor="rgba(232,48,125,0.03)" />
                    </linearGradient>
                  </defs>
                  {regionPaths.map((rp) => (
                    <path
                      key={rp.id}
                      d={rp.path}
                      fill="url(#shimmer-grad)"
                      stroke="rgba(232,48,125,0.15)"
                      strokeWidth="0.8"
                      strokeLinejoin="round"
                    />
                  ))}
                </svg>
                <div className="flex items-center gap-1 mt-3 justify-center">
                  <Skeleton className="w-40 h-3 rounded-full" />
                </div>
              </div>
              {/* Jadval shimmer */}
              <div className="xl:w-[340px] shrink-0">
                <div className="rounded-xl border border-border/60 p-3 space-y-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="w-5 h-4 rounded" />
                      <div className="flex-1 space-y-1.5">
                        <Skeleton className="h-3 w-3/4 rounded" />
                        <Skeleton className="h-1 w-full rounded-full" />
                      </div>
                      <Skeleton className="w-10 h-4 rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : !selectedRegion ? (
            <div className="flex flex-col xl:flex-row gap-4">
              {/* XARITA */}
              <div className="flex-1 relative" onMouseMove={handleMouseMove}>
                <svg
                  viewBox="0 0 900 500"
                  className="w-full h-auto"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <filter id="region-glow">
                      <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#E8307D" floodOpacity="0.5" />
                    </filter>
                  </defs>

                  {regionPaths.map((rp) => {
                    const stat = regionDataMap.get(rp.id);
                    const val = stat ? stat[sortBy] : 0;
                    const isHovered = hoveredRegion === rp.id;
                    return (
                      <path
                        key={rp.id}
                        d={rp.path}
                        fill={getHeatColor(val, maxValue)}
                        stroke={isHovered ? '#E8307D' : 'rgba(232,48,125,0.25)'}
                        strokeWidth={isHovered ? 2.5 : 0.8}
                        strokeLinejoin="round"
                        className="cursor-pointer"
                        style={{
                          transition: 'fill 0.2s, stroke-width 0.15s, opacity 0.2s',
                          filter: isHovered ? 'url(#region-glow)' : undefined,
                          opacity: hoveredRegion && !isHovered ? 0.5 : 1,
                        }}
                        onMouseEnter={() => setHoveredRegion(rp.id)}
                        onMouseLeave={() => setHoveredRegion(null)}
                        onClick={() => stat && setSelectedRegion(stat)}
                      />
                    );
                  })}

                  {/* Raqamlar - xarita ustida */}
                  {regionPaths.map((rp) => {
                    const stat = regionDataMap.get(rp.id);
                    if (!stat) return null;
                    if (rp.name === 'ToshkentShahri') return null;
                    const val = stat[sortBy];
                    return (
                      <text
                        key={`label-${rp.id}`}
                        x={rp.cx}
                        y={rp.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="rgba(255,255,255,0.85)"
                        fontSize={rp.name === 'Sirdaryo' ? '7' : '9'}
                        fontWeight="700"
                        className="pointer-events-none select-none"
                        style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}
                      >
                        {formatNumber(val)}
                      </text>
                    );
                  })}
                </svg>

                {/* Tooltip - kursor yonida */}
                {tooltipRegion && hoveredPath && (
                  <div
                    className="absolute z-20 pointer-events-none"
                    style={{
                      left: tooltipPos.x + 16,
                      top: tooltipPos.y - 60,
                      transform: tooltipPos.x > 500 ? 'translateX(-110%)' : undefined,
                    }}
                  >
                    <div className="rounded-xl border border-primary/30 bg-card/95 backdrop-blur-sm shadow-2xl px-4 py-3 min-w-[200px]">
                      <p className="font-semibold text-sm mb-2 text-primary">{hoveredPath.displayName}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                        <span className="text-muted-foreground">Profillar</span>
                        <span className="text-right font-bold tabular-nums">{formatNumber(tooltipRegion.profiles)}</span>
                        <span className="text-muted-foreground">Boshlangan</span>
                        <span className="text-right font-bold tabular-nums">{formatNumber(tooltipRegion.startedCourses)}</span>
                        <span className="text-muted-foreground">Sertifikatlar</span>
                        <span className="text-right font-bold tabular-nums">{formatNumber(tooltipRegion.certificates)}</span>
                        <span className="text-muted-foreground">Sertifikatlangan</span>
                        <span className="text-right font-bold tabular-nums">{formatNumber(tooltipRegion.certifiedUsers)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Legend */}
                <div className="flex items-center gap-1 mt-3 justify-center">
                  <span className="text-[10px] text-muted-foreground mr-1.5">Kam</span>
                  {LEGEND_COLORS.map((c, i) => (
                    <div
                      key={i}
                      className="w-8 h-3 first:rounded-l-full last:rounded-r-full"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                  <span className="text-[10px] text-muted-foreground ml-1.5">Ko'p</span>
                </div>
              </div>

              {/* Viloyatlar ro'yxati */}
              <div className="xl:w-[340px] shrink-0">
                <div className="overflow-y-auto max-h-[440px] rounded-xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card z-10">
                      <tr className="border-b border-border/60">
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-muted-foreground w-8">#</th>
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-muted-foreground">Viloyat</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-muted-foreground">
                          {SORT_OPTIONS.find((o) => o.value === sortBy)?.label}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRegions.map((r, i) => {
                        // Find matching regionPath by ID or name
                        const rp = regionPaths.find((p) => p.id === r.id) ??
                          regionPaths.find((p) => {
                            const n = r.name.toLowerCase().replace(/['\s]/g, '');
                            const pn = p.name.toLowerCase().replace(/['\s]/g, '');
                            return pn.includes(n) || n.includes(pn);
                          });
                        const displayName = rp?.displayName ?? r.name;
                        const barWidth = maxValue > 0 ? (r[sortBy] / maxValue) * 100 : 0;
                        const pathId = rp?.id ?? r.id;
                        return (
                          <tr
                            key={r.id}
                            className={`border-b border-border/30 cursor-pointer transition-colors ${
                              hoveredRegion === pathId ? 'bg-primary/15' : 'hover:bg-primary/5'
                            }`}
                            onMouseEnter={() => setHoveredRegion(pathId)}
                            onMouseLeave={() => setHoveredRegion(null)}
                            onClick={() => setSelectedRegion(r)}
                          >
                            <td className="py-2 px-3 text-muted-foreground text-xs">{i + 1}</td>
                            <td className="py-2 px-3">
                              <div className="text-xs font-medium">{displayName}</div>
                              <div className="mt-1 h-1 rounded-full bg-muted/30 overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-300"
                                  style={{
                                    width: `${barWidth}%`,
                                    background: 'linear-gradient(90deg, #8e2562, #E8307D)',
                                  }}
                                />
                              </div>
                            </td>
                            <td className="py-2 px-3 text-right font-semibold tabular-nums text-xs">
                              {formatNumber(r[sortBy])}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* ---- TUMAN DRILL-DOWN ---- */
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <StatCard icon={Users} label="Profillar" value={selectedRegion.profiles} color="bg-[#E8307D]" />
                <StatCard icon={BookOpen} label="Boshlangan kurslar" value={selectedRegion.startedCourses} color="bg-[#b52c73]" />
                <StatCard icon={Award} label="Sertifikatlar" value={selectedRegion.certificates} color="bg-[#8e2562]" />
                <StatCard icon={GraduationCap} label="Sertifikatlangan" value={selectedRegion.certifiedUsers} color="bg-[#6b1e4d]" />
              </div>

              {districtsLoading ? (
                <Skeleton className="h-40 w-full rounded-xl" />
              ) : (
                <div className="overflow-x-auto max-h-[400px] overflow-y-auto rounded-xl border border-border/60">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-card z-10">
                      <tr className="border-b border-border/60">
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-muted-foreground w-8">#</th>
                        <th className="py-2.5 px-3 text-left text-xs font-medium text-muted-foreground">Tuman / Shahar</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-muted-foreground">Profillar</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-muted-foreground">Boshlangan</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-muted-foreground">Sertifikatlar</th>
                        <th className="py-2.5 px-3 text-right text-xs font-medium text-muted-foreground">Sertifikatlangan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(districts?.data ?? []).map((d, i) => (
                        <tr key={d.id} className="border-b border-border/30 hover:bg-primary/5 transition-colors">
                          <td className="py-2 px-3 text-muted-foreground text-xs">{i + 1}</td>
                          <td className="py-2 px-3 font-medium text-xs">{d.name}</td>
                          <td className="py-2 px-3 text-right tabular-nums text-xs">{formatNumber(d.profiles)}</td>
                          <td className="py-2 px-3 text-right tabular-nums text-xs">{formatNumber(d.startedCourses)}</td>
                          <td className="py-2 px-3 text-right tabular-nums text-xs">{formatNumber(d.certificates)}</td>
                          <td className="py-2 px-3 text-right tabular-nums text-xs">{formatNumber(d.certifiedUsers)}</td>
                        </tr>
                      ))}
                      {(districts?.data ?? []).length === 0 && (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-muted-foreground text-sm">
                            Ma'lumot topilmadi
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
