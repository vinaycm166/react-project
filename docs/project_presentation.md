# Project Presentation: e-GRCP Platform

This document outlines the slide-by-slide presentation structure for the **Enterprise Governance, Risk, Compliance, and Procurement (e-GRCP) Platform** assessment demo.

---

## Slide 1: Title Slide
### e-GRCP Enterprise Platform
*Sub-title: Scaling Procurement, Governance & Risk Management in Multinational Settings*

* **Presenter Name**: Vinay C M
* **OS / Stack**: Windows, React 19, Redux Toolkit, React Router, Material UI, Axios, Jest
* **Host URL**: Deployed on Vercel
* **Code Repository**: GitHub: [github.com/vinaycm166/react-project](https://github.com/vinaycm166/react-project)

---

## Slide 2: The Business Problem
### Operational Bottlenecks in Large Scale Corporations
* **Approval Delays**: Email-based purchase requests get lost; managers lack automated routing (delegation, review escalations).
* **Vendor Compliancy Vulnerability**: Companies onboard vendors with expired licenses or suspended status (e.g. ISO 27001, SOC 2 breaches).
* **Undetected Risks**: Procurement requests lack standardized impact/likelihood rating assessments.
* **Audit Failure**: Lack of unified, chronological system logs for transactions and state shifts.

---

## Slide 3: Product Vision & Solution
### Unified Governance, Risk & Procurement Core
* **Automated Workbench**: Standardized workflow actions (Approve, Reject, Send Back, Delegate).
* **Compliance Vault**: Centralized directory tracking onboarding, document validation, and registration status.
* **5x5 Heat Map Matrix**: Visual grid representing active corporate risks grouped by Likelihood and Impact.
* **Traceable Logs**: Complete auditing system tracking all changes, ready to export as CSV for auditors.

---

## Slide 4: Enterprise Folder Structure
### Scalable Folder Layout (Feature-Based Design)
* **`src/components/`**: Reusable shared UI blocks (`DataTable`, `KpiCard`, `Modal`, `SearchBar`, `Loader`, `ErrorState`).
* **`src/features/`**: Independent, self-contained business domains (procurement, vendors, risk, compliance).
* **`src/services/`**: API endpoint actions and local database adapters.
* **`src/store/`**: Decoupled Redux Toolkit state slices.
* **`src/tests/`**: Component, Slice, Service, and Form validation suites.

---

## Slide 5: Global State Management (Redux Toolkit)
### Single Source of Truth
* **Decoupled Slices**: Slices configured for UI state, auth sessions, and individual feature spaces.
* **Asynchronous Lifecycles**: Handled via `createAsyncThunk` (loading, fulfilled, and rejection workflows).
* **Session Persistence**: Managed via `redux-persist` to maintain active layout states and user profiles.
* **Safe-Copy Adapter**: Custom wrapper in Axios ensures mock DB references are cloned, preventing RTK DevTools state freezing.

---

## Slide 6: Routing & Guard Architecture
### Multi-Level Navigation Security
* **Nested Outlets**: `AppLayout` wrapper loads sidebars/headers while loading lazy views in content windows.
* **RouteGuards**:
  * **AuthGuard**: Checks login session token.
  * **GuestGuard**: Directs unauthenticated traffic.
  * **RoleGuard**: Blocks unauthorized roles from sensitive modules (e.g. Procurement managers vs. auditors).

---

## Slide 7: UI/UX & Design Excellence
### Enterprise Theme Support
* **Clean Theme System**: Powered by Material-UI ThemeProvider with standard Roboto fonts.
* **Contrast-Compliant Dark Mode**: Restored full color compatibility on the dashboard and workspaces.
* **Component Highlights**:
  * **Stat KPI Cards**: Displays count differences.
  * **5x5 Heat Map Grid**: Highlights cells on click, filtering the list of risks instantly.

---

## Slide 8: Reusable Component Strategy
### Shared Core UI
* **`DataTable`**: Features client-side text searches, sorting, pagination, and built-in CSV exports.
* **`KpiCard`**: Counts items and outputs color indicators.
* **`ErrorState` & `Loader`**: Provides fallback view triggers with manual retry hooks.
* **`GlobalErrorBoundary`**: Class component that catches runtime bugs and shows a recovery panel.

---

## Slide 9: Testing & Quality Assurance
### Comprehensive Test Suites (Jest & RTL)
* **Component Testing**: Verifies stats counter updates.
* **Redux State Testing**: Asserts auth slice login/logout logic.
* **Service Layer Testing**: Validates axios response interceptors.
* **Form UI Verification**: Checks email and select inputs on registration forms.
* **Result**: All 5 test suites pass successfully with zero warnings.

---

## Slide 10: Summary & Live Demo
### Key Takeaways
* Fully resolved 100% of the project objectives (Procurement, Risk heat maps, Audit trails, and Document vaulting).
* Highly optimized, lazy loaded route structure.
* Zero build compile warnings.
* Live url deployed on Vercel.
