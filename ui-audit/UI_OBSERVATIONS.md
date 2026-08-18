# Current UI Observations

## Home
Layout:
- Standard Next.js starter layout with a primary hero section.
- Grid layout used for displaying top vendors or categories below the hero.
- Centered content blocks with maximum width bounds on desktop.

Typography:
- Geist font family used primarily (configured via Next.js next/font).
- Clean, unopinionated sans-serif typography.
- Standard h1, h2, h3 scaling with Tailwind text utility classes (`text-4xl`, `text-2xl`, etc.).

Colors:
- A very neutral and minimal color palette.
- High reliance on Tailwind default grays (`gray-100`, `gray-900`) for structural elements.
- Minimal brand colors currently applied (awaiting Figma redesign).

Cards:
- Vendor cards have basic styling with rounded borders.
- Content inside cards is stacked vertically (image on top, metadata below).

Navigation:
- Top-level sticky navigation on desktop.
- Transitions to a basic collapsible menu on mobile viewports.

Responsive behavior:
- Standard breakpoints. The vendor grid collapses from 3 or 4 columns on desktop (1440px) down to 1 column on mobile (390px).
- Paddings are reduced on the mobile viewport to maximize screen real estate.

## Vendor Details
Layout:
- Two-column layout on desktop (Image/Gallery on left, Details/Reviews on right).
- Stacks vertically on mobile.

Forms (Add, Contact, Report)
Layout:
- Standard stacked form inputs using React Hook Form and Zod validation.
- Validation errors appear below inputs in a distinct (usually red) text color.
- Submit buttons span full width on mobile, and inline/auto-width on desktop.

Admin 
Layout:
- Uses a dashboard-style layout (sidebar navigation + main content area).
- Tables and lists are used to display vendors pending approval or reports.
