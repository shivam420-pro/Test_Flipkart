// IOsense SDK Type Definitions

export interface AuthResponse {
  success: boolean;
  token?: string;
  organisation?: string;
  userId?: string;
  errors?: string[];
}

export interface Device {
  _id: string;
  devID: string;
  devName: string;
  devTypeID: string;
  devTypeName: string;
  iconURL?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  tags: string[];
  sensors: Sensor[];
  params?: Record<string, any>;
  unitSelected?: Record<string, string>;
  properties?: DeviceProperty[];
  star: boolean;
  isHidden: boolean;
  addedOn: string;
  timeCreated: string;
}

export interface Sensor {
  sensorId: string;
  sensorName: string;
}

export interface DeviceProperty {
  propertyName: string;
  propertyValue: any;
}

export interface DevicesResponse {
  success: boolean;
  totalCount: number;
  order: string;
  sort: string;
  data: Device[];
}

export interface DeviceMetadata {
  location?: {
    latitude: number;
    longitude: number;
  };
  tags: string[];
  sensors: Sensor[];
  addedOn: string;
  widgets: any[];
  mapSensorConfig: any[];
  isHidden: boolean;
  dynamicFilter: any[];
  _id: string;
  devID: string;
  devName: string;
  params?: Record<string, any>;
  devTypeID: string;
  devTypeName: string;
  topic: string;
  unitSelected?: Record<string, string>;
  properties?: DeviceProperty[];
}

export interface WidgetDataConfig {
  type: 'device' | 'cluster' | 'compute';
  devID?: string;
  sensor?: string;
  clusterID?: string;
  operator: 'sum' | 'min' | 'max' | 'avg' | 'count';
  clusterOperator?: string;
  key: string;
  downscale?: number;
  dataPrecision?: string;
}

export interface WidgetDataRequest {
  startTime: number;
  endTime: number;
  timezone: string;
  timeBucket: string[];
  timeFrame: string;
  type: string;
  cycleTime: string;
  config: WidgetDataConfig[];
}

export interface WidgetDataResponse {
  success: boolean;
  data: Record<string, Record<string, any[]>>;
  comparisonData?: Record<string, any>;
  errors?: string[];
}

// Dashboard-specific types
export interface ZoneData {
  id: string;
  name: string;
  status: 'Healthy' | 'Warning' | 'Action Recommended';
  healthScore: number;
  totalChambers: number;
  inactiveChambers: number;
  doorOpen: number;
  withinThreshold: number;
  aboveThreshold: number;
  belowThreshold: number;
  cityCount?: number;
}

export interface DashboardData {
  zones: ZoneData[];
  lastUpdated: string;
}
