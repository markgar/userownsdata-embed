# Power BI User-Owns-Data Embed Sample

A minimal Node.js/Express application demonstrating Power BI embedded analytics using the **User-Owns-Data** embedding scenario.

## What is User-Owns-Data?

In the User-Owns-Data scenario, users authenticate with their own Azure AD credentials to access Power BI content. The embedded reports respect the user's Power BI permissions and row-level security (RLS). This is ideal for:

- Internal applications where users have Power BI Pro or Premium Per User licenses
- Scenarios where you want to leverage existing Power BI permissions
- Applications that need user-specific data access through RLS

## Features

- **Entra ID (Azure AD) authentication** using MSAL.js popup flow
- **Power BI report embedding** with AAD token authentication
- **Dynamic report switching** - buttons generated from configuration
- **Page navigation** - open reports to a specific page
- **Clean UI** - filters and page navigation panes hidden

## Tech Stack

- Node.js / Express (backend)
- Vanilla JavaScript (frontend)
- MSAL.js 2.x (authentication)
- Power BI JavaScript Client (embedding)

## Prerequisites

1. **Azure AD App Registration** with:
   - Single-page application (SPA) platform configured
   - Redirect URI: `http://localhost:3000`
   - API permissions: `User.Read` (Microsoft Graph), `Report.Read.All` (Power BI Service)

2. **Power BI Pro or Premium Per User license** for users accessing the reports

3. **Power BI reports** in a workspace the user has access to

## Setup

1. Clone the repository
2. Run `npm install`
3. Copy `config/auth.example.json` → `config/auth.json` and fill in:
   - `clientId` - Your Azure AD app's Application (client) ID
   - `tenantId` - Your Azure AD Directory (tenant) ID
4. Copy `config/reports.example.json` → `config/reports.json` and configure your reports:
   - `id` - Power BI Report ID
   - `name` - Display name for the button
   - `workspaceId` - Power BI Workspace (Group) ID
   - `pageName` - (Optional) Page name to open by default
5. Run `npm start`
6. Open http://localhost:3000

## Configuration

### auth.json
```json
{
  "clientId": "YOUR_CLIENT_ID",
  "tenantId": "YOUR_TENANT_ID",
  "redirectUri": "http://localhost:3000"
}
```

### reports.json
```json
{
  "reports": [
    {
      "id": "REPORT_GUID",
      "name": "Sales Dashboard",
      "workspaceId": "WORKSPACE_GUID",
      "pageName": "ReportSection1"
    }
  ]
}
```

## Finding Report and Workspace IDs

Open your report in Power BI Service. The URL contains both IDs:
```
https://app.powerbi.com/groups/{workspaceId}/reports/{reportId}/...
```

## Finding Page Names

Page names can be found in the Power BI URL when viewing a specific page (`pageName=ReportSectionX`), or check the browser console after loading a report - available pages are logged if navigation fails.

## License

MIT
