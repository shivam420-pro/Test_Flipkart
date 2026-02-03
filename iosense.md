# IOsense SDK API Tracking

## Authentication Flow
- **functionId**: `validateSSOToken`
- **Purpose**: Exchange SSO token (from URL) for Bearer JWT authorization token
- **Endpoint**: `GET https://connector.iosense.io/api/retrieve-sso-token/{token}`
- **Headers**:
  - `organisation: https://iosense.io`
  - `ngsw-bypass: true`
  - `Content-Type: application/json`
- **Response**: `{ success, token, organisation, userId }`

## Device Management Flow
- **functionId**: `findUserDevices`
- **Purpose**: Get paginated list of user devices with search/filter capabilities
- **Endpoint**: `PUT https://connector.iosense.io/api/account/devices/{skip}/{limit}`
- **Headers**:
  - `Authorization: Bearer {token}`
  - `organisation: {organisation_context}`
  - `Content-Type: application/json`
- **Body**: `{ search, filter, order, sort, isHidden }`
- **Response**: `{ success, totalCount, data[] }`

## Device Metadata Flow
- **functionId**: `getDeviceSpecificMetadata`
- **Purpose**: Get detailed metadata for a specific device
- **Endpoint**: `GET https://connector.iosense.io/api/account/ai-sdk/metaData/device/{devID}`
- **Headers**:
  - `Authorization: Bearer {token}`
- **Response**: `{ success, data: { location, tags, sensors, properties } }`

## Widget Data Flow
- **functionId**: `getWidgetData`
- **Purpose**: Get time-series aggregated data for devices/clusters
- **Endpoint**: `PUT https://connector.iosense.io/api/account/ioLensWidget/getWidgetData`
- **Headers**:
  - `Authorization: Bearer {token}`
  - `Content-Type: application/json`
- **Body**: `{ startTime, endTime, timezone, timeBucket, config[] }`
- **Response**: `{ success, data }`

---
*Last updated: 2026-02-03*
