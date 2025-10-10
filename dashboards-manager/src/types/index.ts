// /src/types/index.ts
export interface BusInfo {
  busNumber: string;
  basicInfo: {
    driverName: string;
    conductor: string;
    busType: string;
    routeName: string;
    busStatus: "on-time" | "delayed" | "maintenance" | "off-duty";
  };
  moreInfo: {
    currentLocation: string;
    nextStop: string;
    lastUpdated: string;
    etaToNextStop: string;
    startTime: string;
    endTime: string;
    totalStops: string[];
    currentStop: string;
    driverContact: string;
    busFrequency: string;
    passengerCountStatus: "Low" | "Moderate" | "High";
    alerts: string[];
    isFavorite: boolean;
  };
}

export interface Manager {
  id: string;
  name: string;
  depot: string;
  buses: BusInfo[];
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  licenseNo: string;
  assignedBus?: string;
}

export interface Route {
  id: string;
  name: string;
  stops: string[];
  distanceKm?: number;
}

export interface Schedule {
  id: string;
  busNumber: string;
  routeId: string;
  startTime: string;
  endTime: string;
  frequency: string;
}

export interface User {
  id: string;
  name: string;
  role: "Admin" | "Manager" | "Driver" | "Dispatcher";
  email: string;
}
