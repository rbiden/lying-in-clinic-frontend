# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Lying In Clinic serves the clinic administrator and authorized clinic staff, including midwives and clinicians. Staff assist patients with registration and care. The initial version has no patient portal or public registration.

There are two roles: Admin and Clinical.

- **Admin** manages staff and permissions, clinical catalogs, rooms and beds, facility availability, clinic settings, and audit logs.
- **Clinical** is one shared role for all other staff, including midwives and clinicians. Clinical staff find and register patients, review history and allergies, create encounters, assess priority, record vitals, diagnoses and clinical notes, and provide pregnancy-related care. They also handle admissions, bed assignments and transfers, facility usage, discharge or referral, and cleaning confirmation.

## Positioning

Small-clinic simplicity. The system is sized for a small lying-in clinic's staff: fewer screens, direct workflows, and a low training burden, rather than the breadth of a general hospital EMR.

## Product Purpose

Support daily clinic work from finding a patient through outpatient care or admission, while preserving clinical history and making room and bed availability clear. Success means staff can complete these workflows with accurate records, appropriate access, and a traceable history of changes.

## Operating Context

Desktop and laptop use are primary. The application must respond to tablet sizes and remain usable on mobile. No particular hardware has been specified. Display dates and times in Asia/Manila.

Required workflows:

- Search for an existing patient before registering a new patient.
- For a returning patient, review history before creating a new encounter.
- Support outpatient encounters without requiring admission or a bed.
- For inpatient care, proceed from admission to an available bed, care, discharge or transfer, cleaning, and availability again.

## Capabilities and Constraints

These are confirmed requirements for the intended product; they do not establish that the corresponding features are implemented.

- Preserve visits, pregnancy episodes, bed assignments, priority reassessments, and finalized clinical notes.
- Prevent duplicate active admissions and double allocation of beds.
- Automatically audit mutations. All application mutations must use database transactions.
- Preserve existing login and audit functionality. Authentication must use Laravel Sanctum with HttpOnly session cookies and CSRF protection.
- Use React, TypeScript, and shadcn/ui for the frontend, a Laravel REST API without Inertia, and MySQL. Hosting is Hostinger Premium, which the user has confirmed is compatible with this setup.
- The administrator maintains three clinical catalogs: diagnoses, services and procedures, and room and bed types.
- Provide loading, empty, error, and success states.
- Keep the dashboard focused on clinic tasks, with patient search, quick check-in, admission on one screen, and clear room and bed availability.
- Prioritize preserving login and audit functionality, then replacing dashboard and user-management placeholders with functional screens.

Open decisions: the API contracts for the catalogs and clinical workflows; whether the diagnosis catalog uses a standard code set or a clinic-defined list; whether a medicines catalog is needed (not confirmed).

## Brand Commitments

The product name is Lying In Clinic. Use plain English and clinic-friendly wording. No further language requirement has been confirmed. All user-facing copy, including the login page and the browser page title, must use the Lying In Clinic name; the leftover inventory/POS wording is to be removed.

## Evidence on Hand

Repository inspection found authentication and audit integration in the current frontend. Relevant source includes `src/pages/Login.tsx` and `src/pages/AuditLogs.tsx`. The dashboard and user pages contain placeholders, including sample John Doe content in the user screens (`src/pages/users/index.tsx` and `src/pages/users/ViewUser.tsx`); they are not evidence of implemented clinic workflows.

`src/pages/Login.tsx` still contains POS and inventory wording, and `index.html` has the legacy title Inventory Management System. Those strings are scheduled for replacement (see Brand Commitments). Laravel Sanctum behavior and backend clinic functionality have not been verified from this repository; hosting compatibility is confirmed by the user, not by repository evidence.

## Product Principles

- Begin with the patient record and preserve continuity across encounters and pregnancy episodes.
- Make the next clinic task and current room or bed availability clear.
- Protect record integrity through transactions, allocation safeguards, permissions, and automatic audit history.
- Keep routine work direct, using clinic language and visible feedback for each action.
- Stay small-clinic sized: prefer fewer screens and shorter paths over feature breadth, so new staff can learn the system quickly.

## Accessibility & Inclusion

Support keyboard operation, visible focus, readable text, sufficient contrast, explicit labels, and clear validation. Communicate status through more than color alone. Preserve usability across desktop, tablet, and mobile sizes.
