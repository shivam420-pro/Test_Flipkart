// IOsense API Service
import { getAuthToken, getOrganisation } from '@/auth/iosense-auth';
import type {
  DevicesResponse,
  DeviceMetadata,
  WidgetDataRequest,
  WidgetDataResponse,
} from '@/types/iosense';

const IOSENSE_API_URL = process.env.NEXT_PUBLIC_IOSENSE_API_URL || 'https://connector.iosense.io/api';

/**
 * Find user devices with optional search/filter criteria
 * @param skip - Pagination skip (starts at 1, not 0)
 * @param limit - Number of devices to return
 * @param searchCriteria - Optional search/filter options
 */
export async function findUserDevices(
  skip: number = 1,
  limit: number = 100,
  searchCriteria?: {
    search?: {
      all?: string[];
      devID?: string[];
      devName?: string[];
      devTypeID?: string[];
      devTypeName?: string[];
      tags?: string[];
      sensorName?: string[];
      deviceType?: string[];
    };
    filter?: any[];
    order?: 'default' | 'stared';
    sort?: 'AtoZ' | 'ZtoA' | 'timeCreated';
    isHidden?: boolean;
  }
): Promise<DevicesResponse> {
  const token = getAuthToken();
  const organisation = getOrganisation();

  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(
      `${IOSENSE_API_URL}/account/devices/${skip}/${limit}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
          'organisation': organisation || '',
          'ngsw-bypass': 'true',
        },
        body: JSON.stringify(searchCriteria || {}),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch devices: ${response.statusText}`);
    }

    const data: DevicesResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }
}

/**
 * Get specific device metadata
 * @param devID - Device ID
 */
export async function getDeviceMetadata(devID: string): Promise<DeviceMetadata> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(
      `${IOSENSE_API_URL}/account/ai-sdk/metaData/device/${devID}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': token,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch device metadata: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching device metadata:', error);
    throw error;
  }
}

/**
 * Get widget data for devices/clusters
 * @param request - Widget data request configuration
 */
export async function getWidgetData(request: WidgetDataRequest): Promise<WidgetDataResponse> {
  const token = getAuthToken();

  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(
      `${IOSENSE_API_URL}/account/ioLensWidget/getWidgetData`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token,
        },
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch widget data: ${response.statusText}`);
    }

    const data: WidgetDataResponse = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching widget data:', error);
    throw error;
  }
}
