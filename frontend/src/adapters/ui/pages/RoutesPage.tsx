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
      <h2 className="text-xl font-semibold mb-4">Routes</h2>
      <div className="flex gap-2 mb-4">
        <input className="border px-2 py-1" placeholder="Vessel Type" value={filters.vesselType ?? ''} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value || undefined }))} />
        <input className="border px-2 py-1" placeholder="Fuel Type" value={filters.fuelType ?? ''} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value || undefined }))} />
        <input className="border px-2 py-1" placeholder="Year" value={filters.year ?? ''} onChange={e => setFilters(f => ({ ...f, year: e.target.value || undefined }))} />
        <button className="px-3 py-1 rounded bg-gray-900 text-white" onClick={load}>Filter</button>
      </div>
      {loading && <div>Loading…</div>}
      <div className="overflow-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">routeId</th>
              <th className="p-2 border">vesselType</th>
              <th className="p-2 border">fuelType</th>
              <th className="p-2 border">year</th>
              <th className="p-2 border">ghgIntensity</th>
              <th className="p-2 border">fuelConsumption (t)</th>
              <th className="p-2 border">distance (km)</th>
              <th className="p-2 border">totalEmissions (t)</th>
              <th className="p-2 border">baseline</th>
              <th className="p-2 border">actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id} className="odd:bg-white even:bg-gray-50">
                <td className="p-2 border">{r.routeId}</td>
                <td className="p-2 border">{r.vesselType}</td>
                <td className="p-2 border">{r.fuelType}</td>
                <td className="p-2 border">{r.year}</td>
                <td className="p-2 border">{r.ghgIntensity.toFixed(2)}</td>
                <td className="p-2 border">{r.fuelConsumption.toFixed(0)}</td>
                <td className="p-2 border">{r.distance.toFixed(0)}</td>
                <td className="p-2 border">{r.totalEmissions.toFixed(0)}</td>
                <td className="p-2 border">{r.isBaseline ? '✅' : '❌'}</td>
                <td className="p-2 border"><button className="px-2 py-1 rounded bg-gray-200" onClick={() => setBaseline(r.id)}>Set Baseline</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


