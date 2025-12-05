// Power BI embedding functionality
let reportsConfig = null;
let currentReport = null;
let powerbiService = null;

// Power BI API scope for getting tokens
const powerBiScope = ['https://analysis.windows.net/powerbi/api/Report.Read.All'];

// Initialize Power BI service
function initPowerBI() {
  if (!powerbiService) {
    powerbiService = window.powerbi;
  }
  return powerbiService;
}

// Load reports configuration from server
async function loadReportsConfig() {
  const response = await fetch('/api/reports-config');
  reportsConfig = await response.json();
  console.log('Reports config loaded:', reportsConfig);
  return reportsConfig;
}

// Embed a Power BI report
async function embedReport(reportIndex) {
  const container = document.getElementById('embedContainer');
  if (!container) {
    console.error('Embed container not found');
    return;
  }

  // Get report config
  const report = reportsConfig.reports[reportIndex];
  if (!report) {
    console.error('Report not found at index:', reportIndex);
    return;
  }

  console.log('Embedding report:', report.name, report.id);

  // Get access token for Power BI
  const accessToken = await getAccessToken(powerBiScope);
  console.log('Got access token');

  // Initialize Power BI
  const pbi = initPowerBI();
  
  // Configure embed settings
  const embedConfig = {
    type: 'report',
    id: report.id,
    embedUrl: `https://app.powerbi.com/reportEmbed?reportId=${report.id}&groupId=${report.workspaceId}`,
    accessToken: accessToken,
    tokenType: window['powerbi-client'].models.TokenType.Aad,
    settings: {
      panes: {
        filters: {
          visible: false
        },
        pageNavigation: {
          visible: false
        }
      }
    }
  };

  // Embed the report
  currentReport = pbi.embed(container, embedConfig);

  // Handle embed events - navigate to page after loaded
  currentReport.on('loaded', async () => {
    console.log('Report loaded:', report.name);
    
    // Navigate to specific page if configured
    if (report.pageName) {
      try {
        const pages = await currentReport.getPages();
        const targetPage = pages.find(p => p.name === report.pageName || p.displayName === report.pageName);
        if (targetPage) {
          await targetPage.setActive();
          console.log('Navigated to page:', report.pageName);
        } else {
          console.warn('Page not found:', report.pageName, 'Available pages:', pages.map(p => ({ name: p.name, displayName: p.displayName })));
        }
      } catch (err) {
        console.error('Failed to navigate to page:', err);
      }
    }
  });

  currentReport.on('error', (event) => {
    console.error('Embed error:', event.detail);
  });

  return currentReport;
}

// Get report name by index
function getReportName(reportIndex) {
  if (reportsConfig && reportsConfig.reports[reportIndex]) {
    return reportsConfig.reports[reportIndex].name;
  }
  return `Report ${reportIndex + 1}`;
}
