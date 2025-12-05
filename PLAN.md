# Power BI User-Owns-Data Embed Sample App

A minimal Node.js/Express app with vanilla JavaScript that authenticates users via Entra ID (MSAL.js) and embeds two Power BI reports with toggle buttons. Keeps everything as simple as possible—no extra features.

---

## Milestone 0: Azure AD App Registration ✅ COMPLETE

1. ✅ **Register new app in Azure Portal** - Go to Azure Portal → Microsoft Entra ID → App registrations → New registration. Name it (e.g., "PowerBI-Embed-Sample"), select "Single tenant", and register.

2. ✅ **Configure SPA platform** - Go to Authentication → Add a platform → Single-page application. Set redirect URI to `http://localhost:3000`.

3. ✅ **Verify/Add API permissions** - Go to API permissions → Verify `User.Read` (Microsoft Graph, Delegated) is present (usually pre-added by default). For Milestone 2: Add Power BI Service → Delegated → `Report.Read.All` (must be explicitly added—not included by default).

4. ✅ **Note the Application (client) ID and Directory (tenant) ID** - Copy these from the Overview page; you'll need them for the app configuration.

---

## Milestone 1: Express App with Entra ID Login Only

5. ✅ **Create project structure** - Set up folders (`public/`, `public/js/`, `server/`, `config/`).

6. ✅ **Initialize git repo with .gitignore** - Run `git init`; create `.gitignore` with `node_modules/`, `config/auth.json`, and `config/reports.json`.

7. ✅ **Create config templates** - Add `config/auth.example.json` (with placeholder values for clientId, tenantId) and copy to `config/auth.json` with your real values. The example file gets committed; the real one stays local.

8. ✅ **Initialize npm and install dependencies** - Create `package.json` with `express`; run `npm install`.

9. ✅ **Build Express server** - Create `server/server.js` to serve static files from `public/` on port 3000.

10. ✅ **Implement MSAL authentication** - Create `public/js/authConfig.js` (loads from `/config/auth.json` endpoint) and `public/js/auth.js` (login/logout using MSAL.js popup flow).

11. ✅ **Create minimal login UI** - Build `public/index.html` with login/logout buttons showing signed-in user's name; add `public/js/app.js` to wire up buttons.

12. ✅ **Create remote repo and push** - Create a GitHub/Azure DevOps repo; add remote and push initial commit.

---

## Milestone 1: COMPLETE ✅

## Milestone 2: Add Power BI Embedding with Report Toggle

13. ✅ **Add Power BI dependency and update scopes** - Install `powerbi-client`; update auth config to request Power BI API scope.

14. ✅ **Create report configuration** - Add `config/reports.example.json` (template with placeholders) and `config/reports.json` (your real workspace/report IDs); update Express to serve config.

15. ✅ **Implement embedding** - Create `public/js/embed.js` to embed reports using `TokenType.Aad`.

16. ✅ **Add toggle UI** - Add two buttons and embed container to `index.html`; update `app.js` to switch reports.

17. **Commit and push Milestone 2** - Commit changes (example configs only) and push.

---

## Files Committed vs. Local-Only

| File | Committed? | Purpose |
|------|------------|---------|
| `config/auth.example.json` | ✅ Yes | Template with placeholders |
| `config/auth.json` | ❌ No (gitignored) | Your real clientId/tenantId |
| `config/reports.example.json` | ✅ Yes | Template for report config |
| `config/reports.json` | ❌ No (gitignored) | Your real report/workspace IDs |
| `node_modules/` | ❌ No (gitignored) | Reinstall via `npm install` |

---

## Setup on a New Machine

1. Clone the repo
2. Run `npm install`
3. Copy `config/auth.example.json` → `config/auth.json` and fill in your IDs
4. Copy `config/reports.example.json` → `config/reports.json` and fill in report details (Milestone 2)
5. Run `npm start`
