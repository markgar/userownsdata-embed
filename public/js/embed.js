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
    logger.log('Power BI service initialized', { available: !!powerbiService });
  }
  return powerbiService;
}

// Load reports configuration from server
async function loadReportsConfig() {
  logger.log('Loading reports config...');
  const response = await fetch('/api/reports-config');
  reportsConfig = await response.json();
  logger.log('Reports config loaded', reportsConfig);
  return reportsConfig;
}

// Embed a Power BI report
async function embedReport(reportIndex) {
  logger.log('embedReport called', { reportIndex });
  
  const container = document.getElementById('embedContainer');
  if (!container) {
    logger.error('Embed container not found');
    return;
  }

  // Get report config
  const report = reportsConfig.reports[reportIndex];
  if (!report) {
    logger.error('Report not found at index', { reportIndex });
    return;
  }

  logger.log('Embedding report', { name: report.name, id: report.id, workspaceId: report.workspaceId });

  // Get access token for Power BI
  try {
    logger.log('Getting access token for Power BI...');
    const accessToken = await getAccessToken(powerBiScope);
    logger.log('Got access token', { tokenLength: accessToken?.length });

    // Initialize Power BI
    const pbi = initPowerBI();
    if (!pbi) {
      logger.error('Power BI service not available');
      return;
    }
    
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

    logger.log('Embed config created', { embedUrl: embedConfig.embedUrl, tokenType: embedConfig.tokenType });

    // Container starts hidden via CSS, we just track when to show it
    let isShown = false;
    logger.log('Container hidden (via CSS), waiting for render...');
    
    // Timeout fallback - show after 15 seconds no matter what
    const showTimeout = setTimeout(() => {
      if (!isShown) {
        logger.warn('Showing container via timeout fallback (rendered event did not fire in 15s)');
        container.style.opacity = '1';
        isShown = true;
      }
    }, 15000);
    
    // Helper to show container
    const showContainer = (reason) => {
      if (!isShown) {
        logger.log('Showing container', { reason });
        container.style.opacity = '1';
        isShown = true;
        clearTimeout(showTimeout);
      }
    };

    // Embed the report
    currentReport = pbi.embed(container, embedConfig);
    logger.log('Report embed initiated');

    // Handle embed events - navigate to page after loaded
    currentReport.on('loaded', async () => {
      logger.log('Report loaded event fired', { name: report.name });
      
      // Navigate to specific page if configured
      if (report.pageName) {
        try {
          const pages = await currentReport.getPages();
          logger.log('Available pages', pages.map(p => ({ name: p.name, displayName: p.displayName })));
          const targetPage = pages.find(p => p.name === report.pageName || p.displayName === report.pageName);
          if (targetPage) {
            await targetPage.setActive();
            logger.log('Navigated to page', { pageName: report.pageName });
          } else {
            logger.warn('Page not found', { pageName: report.pageName });
          }
        } catch (err) {
          logger.error('Failed to navigate to page', { error: err.message });
        }
      }
    });

    currentReport.on('rendered', () => {
      logger.log('Report rendered event fired', { name: report.name });
      showContainer('rendered event');
    });

    currentReport.on('error', (event) => {
      logger.error('Power BI embed error', event.detail);
      showContainer('error occurred');
    });

    return currentReport;
  } catch (err) {
    logger.error('Failed to embed report', { error: err.message, stack: err.stack });
    throw err;
  }
}

// Get report name by index
function getReportName(reportIndex) {
  if (reportsConfig && reportsConfig.reports[reportIndex]) {
    return reportsConfig.reports[reportIndex].name;
  }
  return `Report ${reportIndex + 1}`;
}
