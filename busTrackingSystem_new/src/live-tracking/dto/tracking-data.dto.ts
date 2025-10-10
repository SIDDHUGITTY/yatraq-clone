export interface TrackingDataInput {
  tracking_id: string;
  bus_id: string;
  latitude: number;
  longitude: number;
  speed?: number;
}

export interface TrackingData extends TrackingDataInput {
  recorded_at: Date;
}
