// UI Elements
const userInfo = document.getElementById('user-info');
const userName = document.getElementById('user-name');
const reportSection = document.getElementById('report-section');
const reportButtonsContainer = document.getElementById('report-buttons');

// Track report buttons
let reportButtons = [];

// Update UI based on auth state
function updateUI(account) {
  if (account) {
    userInfo.classList.remove('hidden');
    userName.textContent = account.name || account.username;
    reportSection.classList.remove('hidden');
  } else {
    userInfo.classList.add('hidden');
    userName.textContent = '';
    reportSection.classList.add('hidden');
  }
}

// Update button states
function setActiveButton(activeIndex) {
  reportButtons.forEach((btn, index) => {
    btn.classList.toggle('active', index === activeIndex);
  });
}

// Switch to a report
async function switchReport(reportIndex) {
  setActiveButton(reportIndex);
  await embedReport(reportIndex);
}

// Create buttons dynamically from reports config
function createReportButtons(reports) {
  reportButtonsContainer.innerHTML = '';
  reportButtons = [];
  
  reports.forEach((report, index) => {
    const button = document.createElement('button');
    button.textContent = report.name;
    button.addEventListener('click', () => switchReport(index));
    reportButtonsContainer.appendChild(button);
    reportButtons.push(button);
  });
}

// Initialize app
async function initializeApp() {
  try {
    await initializeMsal();
    
    // Check if already signed in
    let account = getAccount();
    
    // If not signed in, trigger login automatically
    if (!account) {
      account = await login();
    }
    
    updateUI(account);
    
    // If signed in, load reports config and set up buttons
    if (account) {
      try {
        const config = await loadReportsConfig();
        
        // Create buttons dynamically
        createReportButtons(config.reports);
        
        // Embed first report by default
        console.log('Auto-loading first report...');
        await switchReport(0);
      } catch (embedError) {
        console.error('Failed to load reports:', embedError);
      }
    }
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
}

// Start the app
initializeApp();
