// MSAL instance
let msalInstance = null;

// Initialize MSAL
async function initializeMsal() {
  const config = await loadAuthConfig();
  msalInstance = new msal.PublicClientApplication(config);
  
  // Handle redirect response (if returning from redirect flow)
  await msalInstance.initialize();
  
  return msalInstance;
}

// Get current signed-in account
function getAccount() {
  const accounts = msalInstance.getAllAccounts();
  return accounts.length > 0 ? accounts[0] : null;
}

// Login with popup
async function login() {
  try {
    const response = await msalInstance.loginPopup(loginScopes);
    return response.account;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Logout
function logout() {
  const account = getAccount();
  if (account) {
    msalInstance.logoutPopup({
      account: account,
      postLogoutRedirectUri: window.location.origin
    }).then(() => {
      window.location.reload();
    });
  }
}

// Get access token silently (or via popup if needed)
async function getAccessToken(scopes) {
  const account = getAccount();
  if (!account) {
    throw new Error('No account signed in');
  }
  
  try {
    const response = await msalInstance.acquireTokenSilent({
      scopes: scopes,
      account: account
    });
    return response.accessToken;
  } catch (error) {
    // If silent fails, try popup
    const response = await msalInstance.acquireTokenPopup({
      scopes: scopes
    });
    return response.accessToken;
  }
}
