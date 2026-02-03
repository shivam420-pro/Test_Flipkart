// Dashboard Data Service - Transforms IOsense data into Flipkart Minutes format
import { findUserDevices, getWidgetData } from './iosense-api';
import type { ZoneData, DashboardData, Device } from '@/types/iosense';

/**
 * Calculate health score based on chamber metrics
 */
function calculateHealthScore(
  totalChambers: number,
  inactiveChambers: number,
  doorOpen: number
): number {
  if (totalChambers === 0) return 0;

  const activeChambers = totalChambers - inactiveChambers;
  const healthyChambers = activeChambers - doorOpen;
  const score = (healthyChambers / totalChambers) * 100;

  return Math.round(score);
}

/**
 * Determine zone status based on health score
 */
function getZoneStatus(healthScore: number): 'Healthy' | 'Warning' | 'Action Recommended' {
  if (healthScore >= 70) return 'Healthy';
  if (healthScore >= 50) return 'Warning';
  return 'Action Recommended';
}

/**
 * Group devices by zone based on tags or location
 * This simulates zones for Flipkart Minutes style dashboard
 */
function groupDevicesByZone(devices: Device[]): Map<string, Device[]> {
  const zoneMap = new Map<string, Device[]>();

  devices.forEach(device => {
    // Try to extract zone from tags (e.g., "zone:north", "north-zone")
    let zoneName = 'Unknown Zone';

    for (const tag of device.tags) {
      const lowerTag = tag.toLowerCase();
      if (lowerTag.includes('north')) zoneName = 'North Zone';
      else if (lowerTag.includes('south')) zoneName = 'South Zone';
      else if (lowerTag.includes('east')) zoneName = 'East Zone';
      else if (lowerTag.includes('west')) zoneName = 'West Zone';
      else if (lowerTag.includes('central')) zoneName = 'Central Zone';
      else if (lowerTag.startsWith('zone:')) {
        zoneName = tag.substring(5) + ' Zone';
      }
    }

    // If no zone tag, try to derive from device name or location
    if (zoneName === 'Unknown Zone') {
      const nameLower = device.devName.toLowerCase();
      if (nameLower.includes('north')) zoneName = 'North Zone';
      else if (nameLower.includes('south')) zoneName = 'South Zone';
      else if (nameLower.includes('east')) zoneName = 'East Zone';
      else if (nameLower.includes('west')) zoneName = 'West Zone';
      else if (nameLower.includes('central')) zoneName = 'Central Zone';
    }

    if (!zoneMap.has(zoneName)) {
      zoneMap.set(zoneName, []);
    }
    zoneMap.get(zoneName)!.push(device);
  });

  return zoneMap;
}

/**
 * Simulate chamber metrics from device data
 * In real scenario, this would query actual chamber/sensor data
 */
function generateChamberMetrics(devices: Device[]): {
  totalChambers: number;
  inactiveChambers: number;
  doorOpen: number;
  withinThreshold: number;
  aboveThreshold: number;
  belowThreshold: number;
} {
  // Each device can represent multiple chambers (sensors)
  const totalChambers = devices.reduce((sum, device) => {
    return sum + (device.sensors?.length || 1);
  }, 0);

  // Simulate inactive chambers (devices marked as hidden or no recent data)
  const inactiveChambers = devices.filter(d => d.isHidden).length;

  // Simulate door open status (random for demo, should be from actual sensor data)
  const doorOpen = Math.floor(totalChambers * 0.15); // ~15% doors open

  // Simulate threshold metrics
  const activeCount = totalChambers - inactiveChambers;
  const withinThreshold = Math.floor(activeCount * 0.50);
  const aboveThreshold = Math.floor(activeCount * 0.30);
  const belowThreshold = activeCount - withinThreshold - aboveThreshold;

  return {
    totalChambers,
    inactiveChambers,
    doorOpen,
    withinThreshold,
    aboveThreshold,
    belowThreshold,
  };
}

/**
 * Generate demo zone data for testing/demo purposes
 */
function generateDemoZones(): ZoneData[] {
  return [
    {
      id: 'zone-0',
      name: 'North Zone',
      status: 'Healthy',
      healthScore: 80,
      totalChambers: 780,
      inactiveChambers: 2,
      doorOpen: 180,
      withinThreshold: 480,
      aboveThreshold: 170,
      belowThreshold: 130,
      cityCount: 28,
    },
    {
      id: 'zone-1',
      name: 'South Zone',
      status: 'Warning',
      healthScore: 55,
      totalChambers: 710,
      inactiveChambers: 1,
      doorOpen: 195,
      withinThreshold: 360,
      aboveThreshold: 200,
      belowThreshold: 150,
      cityCount: 18,
    },
    {
      id: 'zone-2',
      name: 'West Zone',
      status: 'Action Recommended',
      healthScore: 37,
      totalChambers: 690,
      inactiveChambers: 2,
      doorOpen: 167,
      withinThreshold: 300,
      aboveThreshold: 220,
      belowThreshold: 170,
      cityCount: 31,
    },
    {
      id: 'zone-3',
      name: 'East Zone',
      status: 'Action Recommended',
      healthScore: 43,
      totalChambers: 712,
      inactiveChambers: 4,
      doorOpen: 190,
      withinThreshold: 260,
      aboveThreshold: 260,
      belowThreshold: 192,
      cityCount: 23,
    },
  ];
}

/**
 * Fetch and transform dashboard data from IOsense
 */
export async function getDashboardData(): Promise<DashboardData> {
  try {
    // Fetch all user devices
    const devicesResponse = await findUserDevices(1, 100, {
      sort: 'AtoZ',
      isHidden: false,
    });

    if (!devicesResponse.success) {
      throw new Error('Failed to fetch devices');
    }

    // Check if user has any devices
    if (!devicesResponse.data || devicesResponse.data.length === 0) {
      console.warn('No devices found. Using demo data for visualization.');
      return {
        zones: generateDemoZones(),
        lastUpdated: new Date().toISOString(),
      };
    }

    // Group devices by zone
    const zoneMap = groupDevicesByZone(devicesResponse.data);

    // Transform into zone data
    const zones: ZoneData[] = [];
    let zoneIndex = 0;

    for (const [zoneName, devices] of zoneMap.entries()) {
      const metrics = generateChamberMetrics(devices);
      const healthScore = calculateHealthScore(
        metrics.totalChambers,
        metrics.inactiveChambers,
        metrics.doorOpen
      );

      zones.push({
        id: `zone-${zoneIndex++}`,
        name: zoneName,
        status: getZoneStatus(healthScore),
        healthScore,
        totalChambers: metrics.totalChambers,
        inactiveChambers: metrics.inactiveChambers,
        doorOpen: metrics.doorOpen,
        withinThreshold: metrics.withinThreshold,
        aboveThreshold: metrics.aboveThreshold,
        belowThreshold: metrics.belowThreshold,
        cityCount: devices.filter(d => d.location).length,
      });
    }

    // If no zones were created (no matching tags/names), use demo data
    if (zones.length === 0) {
      console.warn('No zones detected from device data. Using demo data for visualization.');
      return {
        zones: generateDemoZones(),
        lastUpdated: new Date().toISOString(),
      };
    }

    // Sort zones by status priority (Action Recommended > Warning > Healthy)
    zones.sort((a, b) => {
      const statusPriority = {
        'Action Recommended': 0,
        'Warning': 1,
        'Healthy': 2,
      };
      return statusPriority[a.status] - statusPriority[b.status];
    });

    return {
      zones,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    // Return demo data instead of throwing error
    console.warn('Using demo data due to error:', error);
    return {
      zones: generateDemoZones(),
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Fetch real-time metrics for a specific zone using widget data
 */
export async function getZoneRealTimeMetrics(devices: Device[]): Promise<any> {
  try {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    // Build config for all devices in the zone
    const config = devices.slice(0, 5).map(device => ({
      type: 'device' as const,
      devID: device.devID,
      sensor: device.sensors[0]?.sensorId || 'D0',
      operator: 'avg' as const,
      key: 't',
      downscale: 0,
      dataPrecision: '2',
    }));

    const widgetData = await getWidgetData({
      startTime: oneDayAgo,
      endTime: now,
      timezone: 'UTC',
      timeBucket: ['day', 'hour'],
      timeFrame: 'hour',
      type: 'lineChart',
      cycleTime: '00:00',
      config,
    });

    return widgetData;
  } catch (error) {
    console.error('Error fetching zone real-time metrics:', error);
    return null;
  }
}
