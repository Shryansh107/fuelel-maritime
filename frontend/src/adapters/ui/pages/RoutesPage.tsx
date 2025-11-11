import { useEffect, useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { sleep } from '../../../shared/utils/sleep';

type RouteRow = {
  id: number;
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline: boolean;
};

type FilterOptions = {
  vesselTypes: string[];
  fuelTypes: string[];
  years: number[];
};

export default function RoutesPage() {
  const [rows, setRows] = useState<RouteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ vesselType?: string; fuelType?: string; year?: string }>({});
  const toast = useToast();
  const [options, setOptions] = useState<FilterOptions>({ vesselTypes: [], fuelTypes: [], years: [] });

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.vesselType) params.set('vesselType', filters.vesselType);
      if (filters.fuelType) params.set('fuelType', filters.fuelType);
      if (filters.year) params.set('year', filters.year);
      const data = await api.get<RouteRow[]>(`/routes?${params.toString()}`);
      setRows(data);
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to load routes');
    } finally {
      await sleep(150);
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);
  useEffect(() => {
    (async () => {
      try {
        const o = await api.get<FilterOptions>('/routes/filters');
        setOptions(o);
      } catch (e: any) {
        // Non-blocking; filters will stay as text inputs if this fails
      }
    })();
  }, []);

  const setBaseline = async (id: number) => {
    const prev = rows;
    // optimistic
    setRows((curr) => curr.map(r => ({ ...r, isBaseline: r.id === id })));
    try {
      await api.post(`/routes/${id}/baseline`, {});
      toast.success('Baseline updated');
      // Optionally reconcile in background:
      // void load();
    } catch (e: any) {
      setRows(prev);
      toast.error(e.message ?? 'Failed to set baseline');
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Routes</h2>
      <div className="flex flex-wrap items-end gap-2 mb-4">
        {options.vesselTypes.length > 0 ? (
          <select className="w-40" value={filters.vesselType ?? ''} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value || undefined }))}>
            <option value="">All Vessels</option>
            {options.vesselTypes.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        ) : (
          <input className="w-40" placeholder="Vessel Type" value={filters.vesselType ?? ''} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value || undefined }))} />
        )}

        {options.fuelTypes.length > 0 ? (
          <select className="w-40" value={filters.fuelType ?? ''} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value || undefined }))}>
            <option value="">All Fuels</option>
            {options.fuelTypes.map(v => <option key={v} value={v}>{v}</option>)}
          </select>
        ) : (
          <input className="w-40" placeholder="Fuel Type" value={filters.fuelType ?? ''} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value || undefined }))} />
        )}

        {options.years.length > 0 ? (
          <select className="w-28" value={filters.year ?? ''} onChange={e => setFilters(f => ({ ...f, year: e.target.value || undefined }))}>
            <option value="">All Years</option>
            {options.years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        ) : (
          <input className="w-28" placeholder="Year" value={filters.year ?? ''} onChange={e => setFilters(f => ({ ...f, year: e.target.value || undefined }))} />
        )}

        <button className="btn btn-primary" onClick={load}>Filter</button>
        <button className="btn btn-ghost" onClick={() => { setFilters({}); load(); }}>Reset</button>
      </div>
      {loading && (
        <div className="card p-4 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
      {!loading && rows.length === 0 && <EmptyState title="No routes found" message="Try adjusting filters." />}
      {!loading && rows.length > 0 && (
      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr>
              <th className="p-2">routeId</th>
              <th className="p-2">vesselType</th>
              <th className="p-2">fuelType</th>
              <th className="p-2">year</th>
              <th className="p-2">ghgIntensity</th>
              <th className="p-2">fuelConsumption (t)</th>
              <th className="p-2">distance (km)</th>
              <th className="p-2">totalEmissions (t)</th>
              <th className="p-2">actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2">{r.routeId}</td>
                <td className="p-2">{r.vesselType}</td>
                <td className="p-2">{r.fuelType}</td>
                <td className="p-2">{r.year}</td>
                <td className="p-2">{r.ghgIntensity.toFixed(2)}</td>
                <td className="p-2">{r.fuelConsumption.toFixed(0)}</td>
                <td className="p-2">{r.distance.toFixed(0)}</td>
                <td className="p-2">{r.totalEmissions.toFixed(0)}</td>
                <td className="p-2"><button className={`btn w-32 ${r.isBaseline ? 'btn-success' : 'btn-ghost'}`} onClick={() => setBaseline(r.id)}>{r.isBaseline ? 'Baseline' : 'Set Baseline'}</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
    </div>
  );
}


