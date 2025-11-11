import { useEffect, useState } from 'react';
import { api } from '../../infrastructure/api';
import { useToast } from '../../../shared/toast/ToastProvider';
import { Skeleton } from '../../../shared/ui/Skeleton';
import { EmptyState } from '../../../shared/ui/EmptyState';
import { sleep } from '../../../shared/utils/sleep';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Select } from '../../../components/ui/select';
import { Table, Thead, Tbody, Tr, Th, Td } from '../../../components/ui/table';

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
          <Select className="w-40" value={filters.vesselType ?? ''} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value || undefined }))}>
            <option value="">All Vessels</option>
            {options.vesselTypes.map(v => <option key={v} value={v}>{v}</option>)}
          </Select>
        ) : (
          <Input className="w-40" placeholder="Vessel Type" value={filters.vesselType ?? ''} onChange={e => setFilters(f => ({ ...f, vesselType: e.target.value || undefined }))} />
        )}

        {options.fuelTypes.length > 0 ? (
          <Select className="w-40" value={filters.fuelType ?? ''} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value || undefined }))}>
            <option value="">All Fuels</option>
            {options.fuelTypes.map(v => <option key={v} value={v}>{v}</option>)}
          </Select>
        ) : (
          <Input className="w-40" placeholder="Fuel Type" value={filters.fuelType ?? ''} onChange={e => setFilters(f => ({ ...f, fuelType: e.target.value || undefined }))} />
        )}

        {options.years.length > 0 ? (
          <Select className="w-28" value={filters.year ?? ''} onChange={e => setFilters(f => ({ ...f, year: e.target.value || undefined }))}>
            <option value="">All Years</option>
            {options.years.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        ) : (
          <Input className="w-28" placeholder="Year" value={filters.year ?? ''} onChange={e => setFilters(f => ({ ...f, year: e.target.value || undefined }))} />
        )}

        <Button onClick={load}>Filter</Button>
        <Button variant="secondary" onClick={() => { setFilters({}); load(); }}>Reset</Button>
      </div>
      {loading && (
        <Card className="p-4 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </Card>
      )}
      {!loading && rows.length === 0 && <EmptyState title="No routes found" message="Try adjusting filters." />}
      {!loading && rows.length > 0 && (
      <Card className="overflow-auto">
        <Table>
          <Thead>
            <Tr>
              <Th>routeId</Th>
              <Th>vesselType</Th>
              <Th>fuelType</Th>
              <Th>year</Th>
              <Th>ghgIntensity</Th>
              <Th>fuelConsumption (t)</Th>
              <Th>distance (km)</Th>
              <Th>totalEmissions (t)</Th>
              <Th>actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {rows.map(r => (
              <Tr key={r.id} className="odd:bg-white even:bg-gray-50">
                <Td>{r.routeId}</Td>
                <Td>{r.vesselType}</Td>
                <Td>{r.fuelType}</Td>
                <Td>{r.year}</Td>
                <Td>{r.ghgIntensity.toFixed(2)}</Td>
                <Td>{r.fuelConsumption.toFixed(0)}</Td>
                <Td>{r.distance.toFixed(0)}</Td>
                <Td>{r.totalEmissions.toFixed(0)}</Td>
                <Td><Button className="w-32" variant={r.isBaseline ? 'success' : 'secondary'} onClick={() => setBaseline(r.id)}>{r.isBaseline ? 'Baseline' : 'Set Baseline'}</Button></Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Card>
      )}
    </div>
  );
}


