# Divine Naturals Dairy Delivery App

## Overview
Divine Naturals is a minimalist, eco-friendly dairy delivery application for scheduling milk deliveries and purchasing dairy products. It features a mobile-first design with role-based access for customers, vendors, delivery partners, and administrators. The app aims to provide a streamlined, efficient platform for dairy product delivery with a focus on ease of use and environmental consciousness, operating under the tagline "Pure. Fresh. Daily." The project seeks to capture a significant share of the local dairy delivery market through a superior user experience and reliable service.

## User Preferences
- Preferred communication style: Simple, everyday language.
- Design preference: Simple, clean designs over complex styling (no neumorphism, glassmorphism, or premium visual effects)
- User feedback: Complex themes consistently rejected as looking "worst"

## System Architecture
The application employs a modern full-stack architecture with distinct client and server components, prioritizing a mobile-first and responsive design.

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with a custom eco-friendly color palette
- **UI Components**: shadcn/ui built on Radix UI
- **Routing**: Wouter
- **State Management**: TanStack React Query

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Custom Email/Password system with `bcryptjs` for hashing and `express-session` with PostgreSQL storage
- **Session Management**: Express sessions with PostgreSQL storage

### Key Features and Implementations
- **Database Schema**: Supports multi-role user management (customer, admin, vendor, delivery), product catalog, order system, milk subscriptions, vendor management, delivery network, notifications, and stock movement tracking.
- **Authentication System**: Secure email/password login with `bcryptjs` hashing and session-based management.
- **UI/UX Decisions**: Mobile-first approach with a clean, minimalist aesthetic. Uses a custom eco-friendly color scheme and `shadcn/ui` components. Features inline login forms, a professional gradient background, and enhanced visual feedback.
- **Routing**: Customer home always shows the customer app. The admin dashboard is only accessible at the `/admin` path.
- **API Structure**: RESTful endpoints organized by domain with role-based access control.
- **Order Processing**: Manages customer order placement, stock reduction, invoice generation, and audit trails.
- **Milk Subscription Flow**: Allows recurring deliveries with options to pause and resume.
- **Product Management**: Includes dynamic product categories and comprehensive stock management.
- **Cart System**: Enables users to add products to a cart with quantity selection before checkout.
- **User Profile Management**: Users provide personal details during signup/profile setup.
- **Shopping & Checkout Flow**: Includes product browsing, category filtering, product detail pages, add to cart functionality, shopping cart management, delivery address CRUD operations, checkout with address and payment method selection (COD, UPI, Card, Net Banking), and order placement with stock reduction and order history viewing.
- **Delivery Partner System**:
    - **Database**: `delivery_partners` table with detailed fields and `deliveryAssignments` table.
    - **Admin APIs**: Endpoints for listing, creating, retrieving, updating, verifying, blocking, assigning orders, and resetting passwords for delivery partners.
    - **Driver APIs**: Endpoints for partner login, viewing today's assignments, starting, completing, failing deliveries, recording COD collection, and viewing earnings.
    - **Frontend**: Dedicated login and dashboard for delivery partners with route details, stats, earnings, and action buttons. Admin panel for managing delivery partners with stats, charts, and a directory.

## External Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity.
- **drizzle-orm**: Type-safe ORM for database operations.
- **@tanstack/react-query**: Server state management for React applications.
- **express**: Backend web application framework.
- **bcryptjs**: Library for password hashing.
- **express-session**: Middleware for session management.
- **@radix-ui/***: Accessible UI primitives.
- **tailwindcss**: Utility-first CSS framework.
- **lucide-react**: Icon system.
- **wouter**: Lightweight client-side router.
- **vite**: Frontend build tool.
- **typescript**: Language for type-safe code.
- **drizzle-kit**: Database migration tool.
- **date-fns**: Date manipulation library.
- **express-fileupload**: Middleware for handling file uploads.

## Recent Changes (December 2025)
- **HARIBOL-Style Hero Carousel with Admin CMS** (December 4, 2025):
    - **Database Tables**: Added `banners` and `homepage_sections` tables for CMS-managed homepage content
    - **Responsive Banner Images**: Each banner supports 3 different images for different screen sizes:
        - Desktop: `imageUrl` (1920x700px recommended) - shown on screens 1024px+
        - Tablet: `imageUrlTablet` (1024x600px recommended) - shown on screens 640px-1023px
        - Mobile: `imageUrlMobile` (640x400px recommended) - shown on screens <640px
    - **Hero Carousel Component**: Full-width slider with auto-rotation (5s), navigation arrows, gradient overlays, CTA buttons, promotional badges, Poppins typography, and HTML5 `<picture>` element for responsive image loading
    - **AI-Generated Banner Images**: 3 professional dairy-themed images (fresh milk pour, pastoral farm scene, premium dairy showcase)
    - **Admin Banner Management**: Full CRUD interface at `/admin/banners` with:
        - Responsive image inputs for Desktop, Tablet, and Mobile
        - Live preview switcher to preview each device size
        - Stats showing banners with mobile/tablet images configured
        - Titles, subtitles, CTAs, badges, and scheduling
    - **Security**: All admin banner endpoints protected with `isAuthenticated` and `isAdmin` middleware
    - **API Structure**: Public endpoint `/api/banners/public` (no auth), admin endpoints at `/api/banners` (auth required)
- **Complete HARIBOL-Style UI Redesign** (December 4, 2025): Professional, clean, minimal landing page inspired by HARIBOL dairy website with Divine Naturals green color scheme. Design principles: simple, clean, aesthetic, fully responsive.
    - **Component Architecture**: All components in `client/src/components/landing/` folder redesigned:
        - `site-header.tsx`: Clean sticky header with Divine Naturals tree logo, navigation (Home, Shop, Subscription, My Orders), search bar, cart icon, login button, responsive mobile menu
        - `hero-carousel.tsx`: Full-width banner carousel with gradient overlays, responsive images (desktop/tablet/mobile), CTA buttons, auto-rotation, navigation arrows
        - `ethos-section.tsx`: Clean 4-column grid with icon cards (Farm Fresh, Pure & Natural, Supporting Farmers, Quality Assured), hover effects
        - `deals-section.tsx`: Simple 2x4 product grid with product images, prices, add-to-cart buttons, "View All" link
        - `new-launches-section.tsx`: New products horizontal scroll section
        - `stats-section.tsx`: Green background section with animated number counters (2500+ customers, 100+ products, 50+ areas, 365 days)
        - `faq-section.tsx`: Clean accordion FAQ with expand/collapse, no external dependencies
        - `newsletter-section.tsx`: Green rounded card with email subscription form
        - `site-footer.tsx`: Dark footer with logo, contact info (phone, email, address), footer links (Shop, Account, Company), social media icons (Facebook, Instagram, X)
    - **Public Landing Page**: Updated routing so landing page is publicly accessible without authentication
    - **ProtectedRoute Component**: Created wrapper component for authenticated routes
    - **Shop Page Redesign**: Professional design with category sidebar, grid/list view toggle, mobile-responsive cards
- **Session Middleware Optimization**: Session middleware now only runs on `/api/*` routes, skipping static files and Vite dev server requests. This resolved a major performance bottleneck where every request was hitting the PostgreSQL session store. App load time improved from 4-10 seconds to ~2-3 seconds.
- **Cart Schema Fix**: Updated `cartItems` schema to match actual database structure (`added_at` instead of `created_at`, added `price` field).
- **Delivery Assignments Table**: Created `delivery_assignments` table for tracking delivery partner assignments.
- **Delivery Partner Modal Enhancements**: Added active/inactive toggle button to the partner detail modal, allowing admins to toggle delivery partner status multiple times without leaving the modal. Fixed backend LSP errors by removing non-existent field assignments.
- **Delivery Routing Interface**: Created new `/admin/routing` page with visual interface for assigning orders to active delivery partners. Shows all active partners by zone and vehicle type, displays unassigned orders with delivery addresses, and tracks assignment history.

## Landing Page Component Structure
```
client/src/components/landing/
├── site-header.tsx      # Navigation with auth-aware display
├── hero-section.tsx     # Main promotional section
├── ethos-section.tsx    # Values/ethos cards
├── deals-section.tsx    # Product deals grid
├── new-launches-section.tsx  # New products carousel
├── stats-section.tsx    # Achievement numbers
├── faq-section.tsx      # FAQ accordion
├── newsletter-section.tsx    # Email subscription
└── site-footer.tsx      # Footer with links
```