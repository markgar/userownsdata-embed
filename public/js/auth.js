// MSAL instance
let msalInstance = null;

// Initialize MSAL
async function initializeMsal() {
  logger.log('Initializing MSAL...');
  const config = await loadAuthConfig();
  msalInstance = new msal.PublicClientApplication(config);
  
  // Handle redirect response (if returning from redirect flow)
  await msalInstance.initialize();
  logger.log('MSAL initialized successfully');
  
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
    logger.log('Starting login popup...');
    const response = await msalInstance.loginPopup(loginScopes);
    logger.log('Login successful', { username: response.account?.username });
    return response.account;
  } catch (error) {
    logger.error('Login failed', { error: error.message, stack: error.stack });
    throw error;
  }
}

// Logout
function logout() {
  const account = getAccount();
  if (account) {
    logger.log('Starting logout...');
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
    logger.error('No account signed in when requesting token');
    throw new Error('No account signed in');
  }
  
  try {
    logger.log('Acquiring token silently...', { scopes });
    const response = await msalInstance.acquireTokenSilent({
      scopes: scopes,
      account: account
    });
    logger.log('Token acquired silently', { expiresOn: response.expiresOn });
    return response.accessToken;
  } catch (error) {
    logger.warn('Silent token acquisition failed, trying popup...', { error: error.message });
    // If silent fails, try popup
    const response = await msalInstance.acquireTokenPopup({
      scopes: scopes
    });
    logger.log('Token acquired via popup', { expiresOn: response.expiresOn });
    return response.accessToken;
  }
}
