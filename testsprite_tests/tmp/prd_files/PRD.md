# Product Requirements Document: UNI XML & XSLT Canlı Tasarım Editörü

## 1. Product Overview
A web-based, client-side XSLT design editor for visualizing and formatting e-Invoice (e-Fatura), e-Archive (e-Arşiv), and UBL-TR standard XML invoice data. Provides a WYSIWYG interface for editing styles and text without writing code. All transformations happen locally in the browser using XSLTProcessor — no data is sent to any server.

## 2. Target Users
- Invoice designers who need to create XSLT templates for Turkish e-Invoice standards
- Developers working with UBL-TR XML formats
- Business users who want to visually design invoice layouts

## 3. Core Features

### 3.1 Editor (Monaco-based)
- Syntax-highlighted XML and XSLT code editing with Monaco Editor
- Split-pane layout: code editor on left, live preview on right
- Error highlighting and basic validation

### 3.2 Live XSLT Preview
- Real-time transformation of XML + XSLT to HTML output using browser's native XSLTProcessor
- Iframe-based preview pane that updates on every keystroke
- Zoom in/out controls applied to iframe body content

### 3.3 WYSIWYG Mode
- Visual editing mode overlaid on the preview output
- Click-to-select elements with `data-xslt-id` mapping back to XSLT source
- Inline style injection (bold, italic, font size, color, alignment)
- Inline text editing (double-click to edit text content)
- Deletion of selected elements
- Temporary `data-xslt-id` attributes are cleaned before saving

### 3.4 Template Management
- Save custom XSLT templates to local disk (via `public/templates/`)
- List and load saved templates
- Version control with auto-updater (checks git for updates via `/api/check-update`)

### 3.5 Invoice Sample Data
- Default e-Invoice XML sample (`invoiceSample.ts`) pre-loaded
- Ability to paste custom XML data

### 3.6 UI Features
- Dark/Light theme toggle
- Responsive layout
- Print support with `@media print` styles (A4 format, clean borders)

## 4. Technical Architecture

### 4.1 Stack
- React 19, TypeScript, Tailwind CSS v4
- Vite 8 (build tool), Monaco Editor (`@monaco-editor/react`)
- Lucide React icons
- Oxlint (linter)

### 4.2 Key Constraints
- **NO server-side XSLT transformation**: All XSLT processing is client-side via `XSLTProcessor`
- **NO server-side data storage**: Templates are saved locally via Vite middleware API endpoints
- **NO login/authentication**: Fully local, single-user application
- **data-xslt-id mechanism must be preserved**: This is the core mapping between WYSIWYG selections and XSLT source code

### 4.3 API Endpoints (Vite Middleware)
- `POST /api/save-template` — Save template to local disk
- `GET /api/list-templates` — List saved templates
- `GET /api/check-update` — Check for git-based updates
- `POST /api/trigger-update` — Trigger application update

## 5. User Interface Structure
- Main App component with tab/panel layout
- Left panel: Monaco Editor (code input for XML and XSLT)
- Right panel: Live preview (iframe) with zoom controls
- Toolbar: Theme toggle, WYSIWYG mode toggle, save/load template buttons, update button
- WYSIWYG toolbar (appears in edit mode): Bold, Italic, Font size, Color, Alignment, Delete element

## 6. Non-Functional Requirements
- Must work 100% offline (no external API calls)
- Must preserve user privacy (no data exfiltration)
- Must support all modern browsers (Chrome, Firefox, Edge)
- Zoom must scale the preview body content without layout overflow
