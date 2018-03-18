export interface Host {
  ip: string,
  mac?: string,
  hostname?: string,
  osNmap?: string,
  vendor?: string,
  status?: ('online' | 'offline' | 'inactive'),
  try?: number,
  scanning?: boolean
}
