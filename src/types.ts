export interface Scooter {
  s_id: string;
  loc: number[];
  status: 'available' | 'in-use' | 'maintenance';
}

export interface RideState {
  status: 'browsing' | 'unlocking' | 'validating_alcohol' | 'high_bac' | 'riding' | 'parking' | 'locked';
  selectedScooter: Scooter | null;
}