// MSAL configuration - loaded from server
let msalConfig = null;

async function loadAuthConfig() {
  const response = await fetch('/api/auth-config');
  const config = await response.json();
  
  msalConfig = {
    auth: {
      clientId: config.clientId,
      authority: `https://login.microsoftonline.com/${config.tenantId}`,
      redirectUri: config.redirectUri
    },
    cache: {
      cacheLocation: 'sessionStorage',
      storeAuthStateInCookie: false
    }
  };
  
  return msalConfig;
}

// Scopes for login - includes Power BI Report.Read.All for embedding
const loginScopes = {
  scopes: ['User.Read', 'https://analysis.windows.net/powerbi/api/Report.Read.All']
};
