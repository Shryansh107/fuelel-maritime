import { useEffect, useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';

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

export default function RoutesPage() {
  const [rows, setRows] = useState<RouteRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<{ vesselType?: string; fuelType?: string; year?: string }>({});
  const toast = useToast();

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
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const setBaseline = async (id: number) => {
    try {
      await api.post(`/routes/${id}/baseline`, {});
      await load();
      toast.success('Baseline updated');
    } catch (e: any) {
      toast.error(e.message ?? 'Failed to set baseline');
    }
  };

  return (
    <div className="p-4">
      <h2 className="mb-4">Routes</h2>
      <div className="flex gap-2 mb-4">
        <input className="w-40" placeholder="Vessel Type" value={filters.vesselType ?? ''} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value || undefined }))} />
        <input className="w-40" placeholder="Fuel Type" value={filters.fuelType ?? ''} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value || undefined }))} />
        <input className="w-28" placeholder="Year" value={filters.year ?? ''} onChange={e => setFilters(f => ({ ...f, year: e.target.value || undefined }))} />
        <button className="btn btn-primary" onClick={load}>Filter</button>
      </div>
      {loading && <div>Loading…</div>}
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
              <th className="p-2">baseline</th>
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
                <td className="p-2">{r.isBaseline ? '✅' : '❌'}</td>
                <td className="p-2"><button className="btn btn-ghost" onClick={() => setBaseline(r.id)}>Set Baseline</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


