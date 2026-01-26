# PRD (Project Requirements Document)

## PG Discovery & Management Platform (Phase-Based Product)

---

## 1. Product Overview

**Product Name:** PG Discovery & Management Platform
**Version:** 0.1.0 (Phase-0 MVP)
**Product Type:** Full-Stack Web Application (Next.js Monolith)

The PG Discovery & Management Platform is a web-based system designed to allow PG owners to publicly showcase their properties while managing PG inventory (PGs, rooms, beds, amenities) through a secure owner-only interface.

The platform is intentionally designed with a **progressive, phase-based architecture**:

* Phase-0 focuses on **public PG discovery** and a **lightweight owner CMS**
* Later phases expand into **tenant management, payments, and automation**

Early phases emphasize **SEO, read-heavy performance, cost efficiency, and type safety**, while keeping the architecture flexible for future scale.

---

## 2. Goals & Objectives

### Phase-0 Goals

* Launch a fast, SEO-friendly PG discovery website
* Provide owners a secure CMS to manage PG inventory
* Keep infrastructure simple and cost-efficient
* Establish a clean, typed domain model for future growth

### Non-Goals (Phase-0)

* No tenant onboarding
* No payment handling
* No rent ledger
* No workflow orchestration

---

## 3. Target Users

### 3.1 Visitor (Public User)

* Browse PG listings
* View PG details (rooms, beds, amenities, nearby areas)
* Submit enquiries
* No authentication required

### 3.2 Owner (Admin)

* Authenticated user
* Manages PG listings and inventory
* Marks PGs as featured
* Views and manages enquiries

### 3.3 Future Users (Not in Phase-0)

* Tenants
* Staff / Sub-admins

---

## 4. Core Features (Phase-0)

---

## 4.1 Authentication & Authorization

### Phase-0 Approach

* **Authentication Provider:** Clerk
* **Auth Scope:** Owner only
* **Session Type:** Secure server-validated sessions
* **Public Access:** No authentication required

### Authorization Rules

* Owner-only access enforced on:

  * Server Actions
  * Route Handlers
* No custom JWT logic
* No credentials stored manually

---

## 4.2 PG & Inventory Management (Owner CMS)

### PG Management

Owners can:

* Create PG listings
* Update PG details:

  * Name
  * Description
  * Images
  * Amenities
  * Address / locality
* Generate SEO-friendly slugs
* Mark PGs as *Featured*

### Room Management

* Rooms belong to a PG
* Room attributes:

  * Room number
  * Room type (Single / Double / Triple)
  * Base price

### Bed Management

* Beds belong to rooms
* Track availability:

  * `isOccupied` flag
* No tenant association in Phase-0

### Domain Constraints

* PG → Rooms → Beds (strict hierarchy)
* Cascade deletes enforced at database level
* Orphan records are not allowed

---

## 4.3 Public PG Discovery (Visitor-Facing)

### Homepage

* Featured PGs
* City / locality sections
* Minimal, animated UI
* Optimized for fast first paint

### PG Listing Page

* Lists all public PGs
* Filter by:

  * City
  * Amenities (basic)
* SEO-friendly URLs

### PG Detail Page

* PG overview
* Image gallery
* Amenities
* Rooms and bed availability (read-only)
* Nearby areas / landmarks

### SEO Requirements

* Slug-based routing
* Server-rendered pages
* Crawlable metadata
* CDN-friendly responses

---

## 4.4 Enquiry & Lead Management

### Public Enquiries

* Visitor submits:

  * Name
  * Phone number
  * Optional message
* Enquiry linked to a PG
* No authentication required

### Anti-Spam Rules

* One enquiry per phone number per PG per 24 hours
* Enforced server-side

### Owner Workflow

* View enquiries
* Update enquiry status:

  * New
  * Contacted
  * Closed

---

## 4.5 System Health & Observability

* Health check endpoint
* Database connectivity verification
* Structured server logs
* Centralized error handling

---

## 5. Technical Architecture

---

## 5.1 Application Architecture

* **Framework:** Next.js (App Router)
* **Language:** TypeScript (strict mode)
* **Architecture Style:** Modular Monolith
* **Rendering Strategy:**

  * Server Components for reads
  * Server Actions for writes

---

## 5.2 Backend (Inside Next.js)

* **Database:** PostgreSQL

  * Local: Docker
  * Cloud: Neon
* **ORM:** Prisma
* **Validation:** Zod
* **Authentication:** Clerk
* **Caching:** Next.js data cache (Phase-0)
* **Background Jobs:** Not used in Phase-0

---

## 5.3 Frontend

* **Styling:** Tailwind CSS
* **Component Library:** shadcn/ui
* **Animations:** Framer Motion (minimal usage)
* **State Management:**

  * Server State: React Server Components
  * Client UI State: Zustand (only when needed)

---

## 6. API & Data Boundaries

### Phase-0 Design Choice

* No separate backend service
* No REST API exposure for public reads

### Data Access

* Public reads via Server Components
* Mutations via Server Actions
* Form submissions via Route Handlers

### Security Rules

* No direct DB access from client
* No internal IDs exposed publicly
* All writes validated with Zod

---

## 7. Non-Functional Requirements

### Performance

* Optimized for read-heavy traffic
* Minimal DB queries
* Fast TTFB for public pages

### Security

* Managed authentication
* Server-side authorization
* Input validation on all writes

### Cost Efficiency

* Serverless-friendly design
* Minimal infrastructure
* No background workers in Phase-0

### Scalability

* Schema designed for joins
* Clean domain boundaries
* Ready for Redis and Temporal later

---

## 8. Testing Strategy

### Phase-0

* Schema validation tests
* Manual QA
* Lighthouse performance audits

### Phase-2+

* Playwright end-to-end tests
* CI-based regression testing

---

## 9. AI Usage & Compliance

* AI tools may be used for:

  * Boilerplate generation
  * Documentation drafting
  * Test scaffolding
* AI usage must be:

  * Transparently documented
  * Declared in README under **AI Usage**
  * Referenced in commit messages where applicable

---

## 10. Deliverables (Phase-0)

* Public Git repository
* Next.js full-stack application
* PostgreSQL schema (Prisma)
* Documentation (PRD, architecture, setup)
* README with AI usage disclosure

---

## 11. Success Criteria (Phase-0)

* Public PG pages load fast and reliably
* Owners can manage PGs, rooms, and beds
* Enquiries function without spam abuse
* System remains stable under read-heavy traffic
* Codebase is clean, typed, and extensible

---

## 12. Future Enhancements

* Tenant onboarding
* Rent & ledger system
* Temporal workflows (rent cycles, onboarding)
* Redis caching
* Analytics dashboard
* Mobile-first tenant experience

---
