# FORMA Implementation Checklist

> **Project:** AI-Powered Book Publishing Platform  
> **Status:** In Progress  
> **Last Updated:** [Date]  
> **Overall Progress:** 0/296 tasks

---

## Phase 0: Project Setup & Infrastructure

### Setup Frontend (Next.js)
- [x] Run `npx create-next-app@latest forma-frontend --typescript --tailwind`
- [x] Choose: App Router (yes), TypeScript (yes), Tailwind (yes), shadcn/ui (yes)
- [ ] Delete boilerplate files
- [x] Create folder structure:
  - [x] `/app` - Main app routes
  - [x] `/components` - Reusable UI components
  - [x] `/components/ui` - shadcn components
  - [x] `/lib` - Utilities and helpers
  - [x] `/hooks` - Custom React hooks
  - [x] `/types` - TypeScript type definitions
  - [x] `/public` - Static assets
- [x] Install dependencies:
  - [x] `npm install @supabase/supabase-js`
  - [x] `npm install lucide-react`
  - [x] `npm install framer-motion`
  - [x] `npm install clsx class-variance-authority`
  - [x] `npm install react-hook-form zod`
- [x] Create `.env.local` with placeholders:
  - [x] `NEXT_PUBLIC_SUPABASE_URL=`
  - [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
  - [x] `NEXT_PUBLIC_API_URL=http://localhost:8000`
- [ ] Verify dev server: `npm run dev` (localhost:3000)
- [ ] Test Tailwind CSS (styles visible)
- [ ] Test TypeScript (no errors)
- [ ] Commit: "feat: Initialize Next.js frontend with App Router"

### Setup Backend (Django)
- [x] Create virtual environment: `python -m venv venv`
- [x] Activate venv
- [x] Create Django project: `django-admin startproject forma_backend`
- [x] Create Django apps:
  - [ ] `python manage.py startapp users`
  - [ ] `python manage.py startapp projects`
  - [ ] `python manage.py startapp metadata`
  - [ ] `python manage.py startapp core`
- [x] Create `requirements.txt`:
  - [ ] Django==4.2
  - [ ] djangorestframework==3.14
  - [ ] django-cors-headers==4.2
  - [ ] python-decouple==3.8
  - [ ] openai==1.0
  - [ ] supabase==2.0
  - [ ] psycopg2-binary==2.9
  - [ ] python-dotenv==1.0
  - [ ] playwright==1.40
  - [ ] mammoth==0.4 (DOCX parsing)
  - [ ] pdf-parse-py==0.1 (PDF parsing) OR pdfplumber
- [x] Install dependencies: `pip install -r requirements.txt`
- [x] Create `.env` file with placeholders:
  - [ ] `DEBUG=True`
  - [ ] `SECRET_KEY=generate-new-key`
  - [ ] `SUPABASE_URL=`
  - [ ] `SUPABASE_KEY=`
  - [ ] `SUPABASE_SERVICE_KEY=`
  - [ ] `OPENAI_API_KEY=`
  - [ ] `EMAIL_HOST=`
  - [ ] `EMAIL_PORT=`
  - [ ] `EMAIL_USER=`
  - [ ] `EMAIL_PASSWORD=`
- [x] Configure Django settings.py:
  - [ ] Add installed apps (rest_framework, corsheaders, users, projects, metadata, core)
  - [ ] Configure CORS for localhost:3000
  - [ ] Configure JWT authentication
  - [ ] Setup Supabase PostgreSQL connection
  - [ ] Configure static files
- [x] Verify dev server: `python manage.py runserver` (localhost:8000)
- [ ] Test database connection (can ping Supabase)
- [x] Verify Django admin works
- [ ] Commit: "feat: Initialize Django backend with DRF"

### Setup Supabase
- [ ] Create Supabase project at supabase.com
  - [ ] Project name: forma
  - [ ] Choose region closest to location
  - [ ] Generate strong database password
- [ ] Save credentials to `.env` files:
  - [ ] `SUPABASE_URL`
  - [ ] `SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_KEY`
- [ ] Configure Authentication:
  - [ ] Enable Email/Password provider
  - [ ] Enable Google OAuth (get credentials from Google Cloud)
  - [ ] Set email confirmation: ON
  - [ ] Set session duration: 24 hours
- [ ] Create Database Tables (run in SQL editor):
  - [ ] `users` table (id, email, first_name, last_name, created_at)
  - [ ] `projects` table (id, user_id, title, author_name, status, format_type, marketplace, created_at, updated_at, deleted_at)
  - [ ] `project_files` table (id, project_id, file_type, file_path, uploaded_at)
  - [ ] `project_metadata` table (id, project_id, description, keywords, categories, audience_type, reading_age, series_info, generated_at)
  - [ ] `formatting_settings` table (id, project_id, trim_size, font_family, margins, ai_decisions_json, created_at)
  - [ ] `bisac_categories` table (id, code, name, parent_category)
- [ ] Create Storage Buckets:
  - [ ] Bucket: `manuscripts` (for uploaded files)
  - [ ] Bucket: `pdfs` (for generated PDFs)
- [ ] Setup Row Level Security (RLS) policies:
  - [ ] Users can only see their own projects
  - [ ] Users can only access their own files
  - [ ] Apply to all relevant tables
- [ ] Create Database Indexes:
  - [ ] `projects.user_id`
  - [ ] `projects.status`
  - [ ] `project_files.project_id`
- [ ] Test Supabase connection from backend
- [ ] Test Supabase connection from frontend
- [ ] Verify authentication provider setup
- [ ] Commit: "feat: Setup Supabase auth and database schema"

### Environment Configuration
- [ ] Create `.env.example` (frontend) with all placeholders
- [ ] Create `.env.example` (backend) with all placeholders
- [ ] Document each environment variable
- [ ] Create SETUP.md with detailed setup instructions
- [ ] Verify both `.env` files in `.gitignore`
- [ ] Test that `npm run dev` and `python manage.py runserver` work together
- [ ] Commit: "chore: Configure environment and documentation"

---

## Phase 1: Authentication & User Management

### Supabase Auth Integration (Frontend)
- [ ] Create `/lib/supabase.ts`:
  - [ ] Initialize Supabase client
  - [ ] Export createClient function
- [ ] Create auth context (`/hooks/useAuth.ts`):
  - [ ] Setup AuthContext provider
  - [ ] Track: currentUser, isLoading, error
  - [ ] Implement methods: signUp, signIn, signOut, signInWithGoogle
  - [ ] Handle token persistence
- [ ] Wrap app with AuthProvider in `/app/layout.tsx`
- [ ] Create `/app/auth` directory structure
- [ ] Create Signup Page (`/app/auth/signup`):
  - [ ] Form fields: first_name, last_name, email, password, confirm_password
  - [ ] Form validation (email format, password strength, match)
  - [ ] Submit handler calls useAuth().signUp()
  - [ ] Redirect to `/auth/verify` after signup
  - [ ] Show error messages
  - [ ] Link to login page
- [ ] Create Login Page (`/app/auth/login`):
  - [ ] Form fields: email, password
  - [ ] Submit handler calls useAuth().signIn()
  - [ ] Redirect to `/dashboard` after login
  - [ ] Show error messages
  - [ ] Link to signup and forgot password
  - [ ] Google OAuth button
- [ ] Create Email Verification Page (`/app/auth/verify`):
  - [ ] Display: "Check your email for verification link"
  - [ ] Show countdown timer (5 minutes)
  - [ ] "Resend email" button
  - [ ] Auto-redirect after verification
  - [ ] Redirect to `/dashboard` when verified
- [ ] Create Auth Layout (`/app/auth/layout.tsx`):
  - [ ] Centered, minimal design
  - [ ] Supabase branding/logo
  - [ ] Responsive sizing
- [ ] Create Dashboard placeholder (`/app/dashboard/page.tsx`)
- [ ] Setup route protection:
  - [ ] Redirect unauthenticated users to `/auth/login`
  - [ ] Redirect authenticated users away from `/auth/*`
- [ ] Test signup flow end-to-end
- [ ] Test email verification
- [ ] Test login flow
- [ ] Test Google OAuth
- [ ] Test logout
- [ ] Test session persistence on refresh
- [ ] Commit: "feat: Add Supabase authentication (signup, login, OAuth, verify)"

### Backend User Sync & Profile API
- [ ] Create `/backend/users/models.py`:
  - [ ] UserProfile model with: user_id, first_name, last_name, email, created_at, updated_at
  - [ ] Run migrations: `python manage.py makemigrations users`
  - [ ] Run migrations: `python manage.py migrate`
- [ ] Create `/backend/users/serializers.py`:
  - [ ] UserProfileSerializer for reading/writing
  - [ ] Add validation for fields
- [ ] Create `/backend/users/authentication.py`:
  - [ ] Custom JWT authentication backend
  - [ ] Validate Supabase JWT tokens
  - [ ] Extract user_id from token
  - [ ] Auto-create UserProfile on first request
- [ ] Create `/backend/users/views.py`:
  - [ ] GET /api/users/profile - Get current user
  - [ ] PUT /api/users/profile - Update user profile
  - [ ] Both require JWT auth
- [ ] Create `/backend/users/urls.py`:
  - [ ] Route to profile endpoints
- [ ] Add users URLs to main urls.py
- [ ] Test signup creates UserProfile in Django
- [ ] Test GET /api/users/profile returns current user
- [ ] Test PUT /api/users/profile updates user
- [ ] Test unauthenticated requests return 401
- [ ] Test invalid tokens rejected
- [ ] Test user can only access own profile
- [ ] Commit: "feat: Add backend user sync and profile API"

---

## Phase 2: Landing Page & Basic Navigation

### Landing Page Structure
- [ ] Create `/app/page.tsx` (landing page root)
- [ ] Create layout with sections: Hero, Features, HowItWorks, Pricing, FAQ, Footer
- [ ] Setup Tailwind color scheme:
  - [ ] Primary accent: soft blue (#4A90E2)
  - [ ] Background: white
  - [ ] Text: dark gray (#2C3E50)
  - [ ] Borders: light gray (#E5E7EB)
- [ ] Create `/components/landing/HeroSection.tsx`:
  - [ ] Headline: "From Manuscript to Published Book in Minutes"
  - [ ] Subheadline about Forma's value
  - [ ] CTA buttons: "Get Started" (blue), "Learn More" (secondary)
  - [ ] Placeholder for demo GIF
  - [ ] Make responsive
- [ ] Create `/components/landing/FeaturesSection.tsx`:
  - [ ] Show 3 features:
    - [ ] AI-Powered Formatting
    - [ ] Metadata Generation
    - [ ] WYSIWYG Editor
  - [ ] Each: icon (lucide-react), title, description
  - [ ] Grid layout: 1 col mobile, 3 col desktop
- [ ] Create `/components/landing/HowItWorksSection.tsx`:
  - [ ] 3-step visual flow
  - [ ] Step icons and descriptions
  - [ ] Connecting lines between steps
  - [ ] Hover animations
- [ ] Create `/components/landing/PricingSection.tsx`:
  - [ ] Show future pricing: $29/book, $199/year
  - [ ] "Coming Soon" badge
  - [ ] Value proposition
- [ ] Create `/components/landing/FAQSection.tsx`:
  - [ ] 5-7 FAQ items with accordion
  - [ ] Use shadcn accordion component
  - [ ] Questions TBD
- [ ] Create `/components/landing/Footer.tsx`:
  - [ ] Links: About, Contact, Privacy, Terms
  - [ ] Copyright notice
  - [ ] Social links (placeholders)
- [ ] Test all sections render
- [ ] Test responsive on mobile/tablet/desktop
- [ ] Test accordion works
- [ ] Test CTA buttons navigate to auth
- [ ] Commit: "feat: Create landing page with hero, features, pricing, FAQ"

---

## Phase 3: Dashboard Infrastructure

### Dashboard Layout & Sidebar
- [ ] Create `/app/dashboard/layout.tsx`
  - [ ] Check authentication (redirect to login if not authenticated)
- [ ] Create `/components/layout/DashboardLayout.tsx`
  - [ ] Wrap sidebar + main content
  - [ ] Handle responsive layout
- [ ] Create `/components/layout/Sidebar.tsx` using provided component:
  - [ ] Setup from PROMPT code
  - [ ] Navigation items:
    - [ ] Home (LayoutDashboard icon)
    - [ ] Projects (FolderOpen icon)
    - [ ] Guidelines (BookOpen icon)
    - [ ] Help (HelpCircle icon)
    - [ ] Settings (Settings icon)
    - [ ] About (Info icon)
    - [ ] Logout (LogOut icon)
  - [ ] Logo at top
  - [ ] User profile at bottom
  - [ ] Animations on hover
  - [ ] Mobile hamburger menu
- [ ] Create route structure:
  - [ ] `/app/dashboard/` - Home
  - [ ] `/app/dashboard/projects` - Projects
  - [ ] `/app/dashboard/guidelines` - Guidelines
  - [ ] `/app/dashboard/help` - Help
  - [ ] `/app/dashboard/settings` - Settings
  - [ ] `/app/dashboard/about` - About Us
  - [ ] Create placeholder page.tsx for each
- [ ] Test sidebar navigation
- [ ] Test responsive on mobile/desktop
- [ ] Test logout functionality
- [ ] Commit: "feat: Add dashboard layout with animated sidebar"

### Home Page (Dashboard)
- [ ] Create `/app/dashboard/page.tsx`
- [ ] Create `/components/dashboard/StatsSection.tsx`:
  - [ ] Show: Total Projects, Completed Books, In Progress
  - [ ] Grid layout
- [ ] Create `/components/dashboard/RecentProjectsSection.tsx`:
  - [ ] Show last 3-5 projects
  - [ ] Display: thumbnail, title, author
  - [ ] Empty state if no projects
  - [ ] Clickable cards
- [ ] Create `/components/dashboard/QuickActionsSection.tsx`:
  - [ ] Buttons: "Create New Project", "View All Projects", "Browse Guidelines"
- [ ] Create `/lib/api/projects.ts`:
  - [ ] Function: getStats() → GET /api/projects/stats
  - [ ] Function: getRecentProjects(limit) → GET /api/projects/recent?limit=5
- [ ] Create Django endpoints:
  - [ ] GET /api/projects/stats - return { total, completed, in_progress }
  - [ ] GET /api/projects/recent?limit=5 - return recent projects
- [ ] Test home page loads
- [ ] Test stats display
- [ ] Test recent projects display
- [ ] Test empty state
- [ ] Test buttons clickable
- [ ] Commit: "feat: Add dashboard home page with stats and recent projects"

### Projects Page with Filtering
- [ ] Create `/app/dashboard/projects/page.tsx`
- [ ] Create `/components/projects/ProjectsHeader.tsx`:
  - [ ] Tabs: "All", "In Progress", "Completed"
  - [ ] Sync with URL query param (?tab=all|in-progress|completed)
- [ ] Create `/components/projects/ProjectCard.tsx`:
  - [ ] Display: thumbnail, title, author
  - [ ] Three-dot menu button
- [ ] Create `/components/projects/ProjectsGrid.tsx`:
  - [ ] Grid layout: 3 cards per row (responsive)
  - [ ] Empty state message
- [ ] Create `/lib/api/projects.ts` function:
  - [ ] getProjects(status) → GET /api/projects/?status={status}
- [ ] Create Django endpoint:
  - [ ] GET /api/projects/?status=all|draft|in_progress|completed
  - [ ] Return projects filtered by status and user_id
- [ ] Test tab switching
- [ ] Test URL query params
- [ ] Test filtering works
- [ ] Test responsive grid
- [ ] Test empty state
- [ ] Commit: "feat: Add projects page with status filtering and cards"

### Guidelines Page
- [ ] Create `/app/dashboard/guidelines/page.tsx`
- [ ] Create `/components/guidelines/GuidelinesContent.tsx`:
  - [ ] Sections with collapsible accordion
  - [ ] Upload Best Practices
  - [ ] Formatting Tips
  - [ ] Amazon KDP Requirements
- [ ] Add content to each section (from SPEC)
- [ ] Test accordion expand/collapse
- [ ] Test mobile responsive
- [ ] Commit: "feat: Add guidelines page with upload best practices"

### Help Page (FAQ & Contact Form)
- [ ] Create `/app/dashboard/help/page.tsx`
- [ ] Create `/components/help/FAQSection.tsx`:
  - [ ] 5-7 FAQ questions with accordion
  - [ ] Questions about: How Forma works, file formats, editing, time, formatting, KDP publishing, not satisfied
- [ ] Create `/components/help/ContactForm.tsx`:
  - [ ] Fields: Name, Email, Subject, Message
  - [ ] Form validation
  - [ ] Submit button
- [ ] Create `/lib/api/contact.ts`:
  - [ ] Function: submitContactForm(data)
- [ ] Create Django endpoint:
  - [ ] POST /api/contact
  - [ ] Accept: name, email, subject, message
  - [ ] Send email to: nitya@antifragilitylabs.com, noah@antifragilitylabs.com
  - [ ] Configure Django email settings
- [ ] Test form submission
- [ ] Test validation works
- [ ] Test email delivery
- [ ] Test success message shows
- [ ] Commit: "feat: Add help page with FAQ and contact form"

### Settings Page
- [ ] Create `/app/dashboard/settings/page.tsx`
- [ ] Create `/components/settings/AccountSection.tsx`:
  - [ ] Display: First Name, Last Name, Email
  - [ ] Editable fields (inline)
  - [ ] Save button
- [ ] Create `/components/settings/PreferencesSection.tsx`:
  - [ ] Default format type (radio: Paperback/Hardcover)
  - [ ] Default marketplace (dropdown)
  - [ ] Theme toggle (light only, placeholder for dark)
- [ ] Create `/components/settings/ConnectedAccountsSection.tsx`:
  - [ ] Show connected accounts (Email, Google)
  - [ ] Disconnect button for OAuth
- [ ] Create `/components/settings/DangerZoneSection.tsx`:
  - [ ] Delete Account button (red warning style)
  - [ ] Confirmation dialog
- [ ] Create Django endpoints:
  - [ ] PUT /api/users/preferences
  - [ ] DELETE /api/users/account
- [ ] Test account editing
- [ ] Test preferences save
- [ ] Test account deletion
- [ ] Commit: "feat: Add settings page with account and preferences"

### About Us Page
- [ ] Create `/app/dashboard/about/page.tsx`
- [ ] Create `/components/about/AboutHeader.tsx`
- [ ] Create `/components/about/TeamSection.tsx`:
  - [ ] Team members with names, bios, LinkedIn
  - [ ] Include Nitya and Noah
  - [ ] Card layout
- [ ] Create `/components/about/HowItWorksSection.tsx`:
  - [ ] Brief explanation of Forma
- [ ] Create `/components/about/ContactSection.tsx`:
  - [ ] Display emails
  - [ ] Link to contact form
- [ ] Create `/components/about/LegalSection.tsx`:
  - [ ] Links: Privacy, Terms, Cookie Policy
- [ ] Test all sections render
- [ ] Test links work
- [ ] Test mobile responsive
- [ ] Commit: "feat: Add about us page with team and contact info"

---

## Phase 4: Project Creation & File Upload

### Create Project Dialog
- [ ] Create `/components/projects/CreateProjectDialog.tsx`:
  - [ ] Modal with form:
    - [ ] Project Title (required, max 100 chars)
    - [ ] Author Name (required, max 100 chars)
    - [ ] Publication Year (required, default current year)
    - [ ] Marketplace (dropdown: US, UK, AU, EU)
    - [ ] Format Type (radio: Paperback, Hardcover)
  - [ ] Validation
  - [ ] Cancel/Create buttons
- [ ] Create Django endpoint:
  - [ ] POST /api/projects/create
  - [ ] Validate all fields
  - [ ] Create project with status = "draft"
  - [ ] Return project_id
- [ ] Create `/lib/api/projects.ts` function:
  - [ ] createProject(data)
- [ ] Add "Create New Project" buttons to:
  - [ ] Projects page
  - [ ] Home page
- [ ] Test dialog opens/closes
- [ ] Test form validation
- [ ] Test project creation
- [ ] Test redirect to upload flow
- [ ] Commit: "feat: Add create project dialog with form validation"

### Upload Flow - Page 1 (Guidelines + File Upload)
- [ ] Create `/app/dashboard/projects/[id]/upload/page.tsx`
- [ ] Create `/components/upload/UploadWizardLayout.tsx`:
  - [ ] Progress indicator
  - [ ] Back/Next buttons
  - [ ] Fade transitions between pages
- [ ] Create `/components/upload/Page1Guidelines.tsx`:
  - [ ] Collapsible guidelines section
  - [ ] Content about upload best practices
- [ ] Create `/components/upload/FileUploadForm.tsx`:
  - [ ] File input (DOCX, PDF)
  - [ ] File validation (type, size max 100MB)
  - [ ] Show file name and size
  - [ ] Message about DOCX preference
  - [ ] Remove button
- [ ] Create `/components/upload/Page1Content.tsx`
  - [ ] Assemble guidelines + upload form
  - [ ] "Next" button (disabled until file selected)
- [ ] Create Django endpoint:
  - [ ] POST /api/projects/{id}/upload
  - [ ] Accept file (multipart)
  - [ ] Validate file type and size
  - [ ] Store in Supabase Storage
  - [ ] Extract text (DOCX: mammoth, PDF: pdf-parse)
  - [ ] Save to database
- [ ] Create `/lib/api/projects.ts` function:
  - [ ] uploadManuscript(projectId, file)
- [ ] Test file upload validation
- [ ] Test file extraction (DOCX and PDF)
- [ ] Test navigation to Page 2
- [ ] Test error handling
- [ ] Commit: "feat: Add upload wizard page 1 with file upload"

### Upload Flow - Page 2 (Validation & Editing)
- [ ] Create `/components/upload/Page2Content.tsx`
- [ ] Create `/components/upload/ManuscriptPreview.tsx`:
  - [ ] Display extracted text
  - [ ] Editable text area
  - [ ] Scrollable
- [ ] Create `/components/upload/ValidationErrors.tsx`:
  - [ ] Right sidebar showing detected errors
  - [ ] Color coding: Red (critical), Yellow (warnings)
  - [ ] Error descriptions
- [ ] Create `/components/upload/InlineErrorHighlighting.tsx`:
  - [ ] Red underlines in preview
  - [ ] Hoverable tooltips
- [ ] Create Django endpoint:
  - [ ] POST /api/projects/{id}/validate
  - [ ] AI analyzes for critical errors
  - [ ] Return: critical_errors[], warnings[]
- [ ] Create AI validation in `/backend/core/ai.py`:
  - [ ] Analyze structure, formatting, integrity
  - [ ] Return structured JSON
- [ ] Test validation runs
- [ ] Test errors display correctly
- [ ] Test inline editing works
- [ ] Test "Start Formatting" button behavior
- [ ] Commit: "feat: Add upload wizard page 2 with validation and inline editing"

---

## Phase 5: AI-Powered Formatting

### AI Manuscript Analysis - Step 1 (Genre Detection)
- [ ] Create `/backend/core/ai.py`:
  - [ ] Function: analyze_manuscript_genre(manuscript_content)
  - [ ] Extract first 10k words
  - [ ] Create OpenAI prompt
  - [ ] Use GPT-4o-mini
  - [ ] Parse JSON response
  - [ ] Return: genre, target_audience, book_type, tone, reasoning
- [ ] Implement error handling:
  - [ ] Retry on failure (exponential backoff, max 3 attempts)
  - [ ] Return sensible defaults on error
- [ ] Implement caching:
  - [ ] Store results in formatting_settings table
  - [ ] Don't re-analyze if exists
- [ ] Create unit tests
- [ ] Test with sample manuscript
- [ ] Test error handling
- [ ] Commit: "feat: Add AI manuscript genre analysis (step 1)"

### AI Formatting Decisions - Step 2
- [ ] Create `/backend/core/formatting_rules.py`:
  - [ ] Define rule-based defaults by genre
  - [ ] Fiction and non-fiction rules
- [ ] Create function in `/backend/core/ai.py`:
  - [ ] get_formatting_decisions(manuscript, genre, book_type)
  - [ ] Apply defaults
  - [ ] Create OpenAI prompt for refinement
  - [ ] Use GPT-4o-mini
  - [ ] Return: formatting_decisions with reasoning
- [ ] Implement error handling
- [ ] Implement caching
- [ ] Create unit tests
- [ ] Test with sample manuscript
- [ ] Commit: "feat: Add AI formatting decisions with rule-based defaults (step 2)"

### HTML/CSS Template Generation
- [ ] Create `/backend/core/templates.py`:
  - [ ] Define fiction template
  - [ ] Define non-fiction template
  - [ ] Semantic HTML5 structure
  - [ ] Professional CSS with @page rules
- [ ] Create `/backend/core/html_generator.py`:
  - [ ] Function: generate_book_html(manuscript, formatting_decisions, metadata, book_type)
  - [ ] Parse chapters
  - [ ] Generate front matter (title, copyright, TOC)
  - [ ] Generate main content
  - [ ] Apply formatting decisions
  - [ ] Return HTML string
- [ ] Implement chapter detection
- [ ] Implement TOC generation
- [ ] Implement error handling
- [ ] Create unit tests
- [ ] Test HTML generation
- [ ] Test semantic structure
- [ ] Commit: "feat: Add HTML/CSS template generation for formatted books"

### PDF Generation with Puppeteer
- [ ] Install Playwright (or Puppeteer)
- [ ] Create `/backend/core/pdf_generator.py`:
  - [ ] Function: generate_pdf(html_content, output_path, options)
  - [ ] Use Playwright to convert HTML → PDF
  - [ ] Apply formatting options (margins, trim size, etc.)
  - [ ] Embed fonts
  - [ ] Generate page numbers
  - [ ] Make TOC links interactive
- [ ] Implement error handling
- [ ] Implement font embedding
- [ ] Test PDF generation
- [ ] Test margins and sizing
- [ ] Test font rendering
- [ ] Test interactive TOC
- [ ] Commit: "feat: Add PDF generation with Puppeteer/Playwright"

### Formatting Pipeline Orchestration
- [ ] Create `/backend/projects/tasks.py`:
  - [ ] Function: format_manuscript_pipeline(project_id)
  - [ ] Orchestrate steps 1-4:
    - [ ] Fetch content
    - [ ] Analyze genre
    - [ ] Get formatting decisions
    - [ ] Generate HTML
    - [ ] Generate PDF
  - [ ] Update status at each step
  - [ ] Handle errors and retries
- [ ] Add formatting_status field to Project model:
  - [ ] States: not_started, analyzing, deciding, generating_html, generating_pdf, complete, error
  - [ ] Add format_error field (nullable)
  - [ ] Add timestamps
- [ ] Create Django endpoint:
  - [ ] POST /api/projects/{id}/format-start
  - [ ] Start pipeline (async or direct)
  - [ ] Return immediate response
- [ ] Create polling endpoint:
  - [ ] GET /api/projects/{id}/format-status
  - [ ] Return current status
  - [ ] If complete: return PDF URL
  - [ ] If error: return error message
- [ ] Implement retry logic with exponential backoff
- [ ] Implement timeout (5 min total, per-step varies)
- [ ] Implement logging
- [ ] Test full pipeline
- [ ] Test error handling
- [ ] Test polling endpoint
- [ ] Commit: "feat: Add formatting pipeline orchestration with polling"

### Upload Flow - Page 3 (Loading & Polling)
- [ ] Create `/components/upload/Page3Content.tsx`
- [ ] Create `/components/upload/FormattingProgress.tsx`:
  - [ ] Show luma-spin box loader
  - [ ] Message: "This might take some time..."
  - [ ] Poll backend every 2-3 seconds
  - [ ] Display current step
  - [ ] On completion: fade to Page 4
  - [ ] On error: show error message (static, require refresh)
- [ ] Test loading screen
- [ ] Test polling works
- [ ] Test fade transition to Page 4
- [ ] Test error handling
- [ ] Commit: "feat: Add upload wizard page 3 with formatting progress polling"

---

## Phase 6: WYSIWYG Editor

### TipTap Editor Setup
- [ ] Create `/components/editor/BookEditor.tsx`:
  - [ ] Initialize TipTap with extensions
  - [ ] Extensions: Document, Paragraph, Text, Bold, Italic, Underline, Heading (H1-H3), TextAlign, HardBreak, History, FontFamily, FontSize, Dropcursor, Gapcursor
- [ ] Create `/components/editor/EditorToolbar.tsx`:
  - [ ] Left: Back button, inline project title
  - [ ] Center: Save Draft, Export PDF, Preview, Generate Metadata
  - [ ] Right: User avatar menu
  - [ ] Styling with soft blue accent
- [ ] Create `/components/editor/FloatingBubbleMenu.tsx`:
  - [ ] Appears on text selection
  - [ ] Format options: Bold, Italic, Underline, Headings, Alignment
- [ ] Create `/components/editor/EditorContainer.tsx`:
  - [ ] Main wrapper
  - [ ] Handle layout
  - [ ] Mobile: show desktop-only message
- [ ] Create `/lib/editor/extensions.ts`:
  - [ ] Export array of all extensions
  - [ ] Configure each with options
- [ ] Create content loader:
  - [ ] Function: loadManuscriptContent(htmlContent)
  - [ ] Convert HTML to TipTap JSON
  - [ ] Parse with prosemirror parser
  - [ ] Set editor content
- [ ] Test editor initializes
- [ ] Test all formatting works
- [ ] Test keyboard shortcuts
- [ ] Test floating menu appears
- [ ] Test content loads
- [ ] Commit: "feat: Add TipTap WYSIWYG editor with toolbar and bubble menu"

### Auto-Save Implementation
- [ ] Create `/hooks/useAutoSave.ts`:
  - [ ] Custom hook for auto-save
  - [ ] Debounce 3 seconds
  - [ ] Track: isSaving, lastSaved, error
- [ ] Create `/components/editor/SaveIndicator.tsx`:
  - [ ] Display save status
  - [ ] States: Saved, Saving..., Failed to save
  - [ ] Show timestamp
- [ ] Create Django endpoint:
  - [ ] PUT /api/projects/{id}/content
  - [ ] Accept HTML content
  - [ ] Validate user owns project
  - [ ] Store in project.content
  - [ ] Update updated_at
- [ ] Create `/lib/api/projects.ts` function:
  - [ ] saveProjectContent(projectId, content)
- [ ] Test debounce works (save only after 3 sec inactivity)
- [ ] Test save indicator updates
- [ ] Test content saved to database
- [ ] Test error handling
- [ ] Commit: "feat: Add auto-save with debounce and save indicator"

### PDF Export from Editor
- [ ] Create export button handler:
  - [ ] Get editor HTML content
  - [ ] Call exportProjectPDF(projectId, content)
  - [ ] Show loading spinner
  - [ ] Trigger browser download
- [ ] Create `/lib/api/projects.ts` function:
  - [ ] exportProjectPDF(projectId, content)
  - [ ] POST /api/projects/{id}/export-pdf
- [ ] Create Django endpoint:
  - [ ] POST /api/projects/{id}/export-pdf
  - [ ] Accept HTML content
  - [ ] Validate user owns project
  - [ ] Call generate_pdf()
  - [ ] Save to Supabase Storage (overwrite)
  - [ ] Return PDF URL/download link
  - [ ] Update pdf_generated_at timestamp
- [ ] Test export works
- [ ] Test PDF generated correctly
- [ ] Test browser download triggered
- [ ] Test error handling
- [ ] Commit: "feat: Add PDF export from editor"

### Upload Flow - Page 4 (WYSIWYG Editor)
- [ ] Create `/components/upload/Page4Content.tsx`
- [ ] Integrate components:
  - [ ] BookEditor
  - [ ] EditorToolbar
  - [ ] SaveIndicator
  - [ ] FloatingBubbleMenu
- [ ] Implement content loading:
  - [ ] Fetch formatted content on mount
  - [ ] Load into editor
- [ ] Implement back button:
  - [ ] Show confirmation if unsaved changes
  - [ ] "Save & Leave", "Leave without saving", "Cancel" options
- [ ] Implement "Generate Metadata" button:
  - [ ] Trigger auto-save first
  - [ ] Navigate to Page 5
- [ ] Test editor loads with content
- [ ] Test editing works
- [ ] Test auto-save active
- [ ] Test back button confirmation
- [ ] Test Generate Metadata flow
- [ ] Commit: "feat: Add upload wizard page 4 with full editor"

---

## Phase 7: Metadata Generation

### AI Metadata Generation (Backend)
- [ ] Create function in `/backend/core/ai.py`:
  - [ ] generate_metadata(manuscript_content, project_title, author_name)
  - [ ] Create OpenAI prompt for GPT-4o
  - [ ] Request: description (1500-4000 chars), keywords (max 7), categories (top 3), audience, reading_age, content_warnings
  - [ ] Parse JSON response
  - [ ] Return structured metadata
- [ ] Implement BISAC category matching:
  - [ ] Match suggested categories to database codes
  - [ ] Return both code and name
- [ ] Implement content warning detection
- [ ] Implement error handling
- [ ] Implement defaults on failure
- [ ] Create Django endpoint:
  - [ ] POST /api/projects/{id}/generate-metadata
  - [ ] Fetch project content
  - [ ] Call AI function
  - [ ] Store in project_metadata table
  - [ ] Return results to frontend
- [ ] Create unit tests
- [ ] Test metadata generation
- [ ] Test category matching
- [ ] Commit: "feat: Add AI metadata generation (step 3)"

### Upload Flow - Page 5 (Metadata Review)
- [ ] Create `/components/upload/Page5Content.tsx`
- [ ] Trigger metadata generation on load:
  - [ ] Show loading screen (luma-spin)
  - [ ] Call POST /api/projects/{id}/generate-metadata
  - [ ] On completion: populate form
- [ ] Create `/components/upload/MetadataForm.tsx`:
  - [ ] Form fields:
    - [ ] Title (editable)
    - [ ] Subtitle (optional)
    - [ ] Author (editable)
    - [ ] Contributors (optional)
    - [ ] Publisher (optional)
    - [ ] Description (textarea, AI-generated, editable, char count)
    - [ ] Keywords (tag input, max 7)
    - [ ] Categories (searchable dropdown, max 3)
    - [ ] Primary Audience (Yes/No explicit content)
    - [ ] Reading Age (optional)
    - [ ] Series Info (if detected)
  - [ ] Validation
- [ ] Create `/components/upload/KeywordInput.tsx`:
  - [ ] Tag-style input
  - [ ] Add/remove keywords
  - [ ] Max 7 enforced
- [ ] Create `/components/upload/CategorySelector.tsx`:
  - [ ] Searchable dropdown
  - [ ] Allow 1-3 selection
  - [ ] Show AI recommendations first
- [ ] Implement "Regenerate Metadata" button:
  - [ ] Re-run AI analysis
  - [ ] Update form
- [ ] Implement "Next" button:
  - [ ] Save metadata to database
  - [ ] Validate all required fields
  - [ ] Navigate to Page 6 (completion)
- [ ] Create Django endpoint:
  - [ ] PUT /api/projects/{id}/metadata
  - [ ] Accept and save metadata
- [ ] Test metadata form loads
- [ ] Test form validation
- [ ] Test regenerate works
- [ ] Test metadata saves
- [ ] Commit: "feat: Add upload wizard page 5 with metadata review"

### Completion Summary Page (Page 6)
- [ ] Create `/components/upload/CompletionSummary.tsx`
- [ ] Create `/components/upload/CompletionChecklist.tsx`:
  - [ ] Show completed steps with checkmarks
- [ ] Create `/components/upload/FilesSummary.tsx`:
  - [ ] Show available files
  - [ ] Download buttons for PDF and metadata
- [ ] Implement metadata download:
  - [ ] Create Django endpoint: GET /api/projects/{id}/metadata/download
  - [ ] Return metadata as plain text file
  - [ ] Format: Title, Subtitle, Author, Description, Keywords, Categories, etc.
  - [ ] Trigger browser download
- [ ] Create `/components/upload/NextSteps.tsx`:
  - [ ] Instructions for Amazon KDP
  - [ ] 7 numbered steps
  - [ ] Link to KDP website
- [ ] Create `/components/upload/ActionButtons.tsx`:
  - [ ] "Start New Project" button
  - [ ] "Back to Dashboard" button
- [ ] Implement project status update:
  - [ ] POST /api/projects/{id}/mark-complete (or PUT)
  - [ ] Set status to "completed"
  - [ ] Update updated_at
- [ ] Test summary page loads
- [ ] Test checklist displays
- [ ] Test PDF download works
- [ ] Test metadata TXT download works
- [ ] Test action buttons work
- [ ] Test project marked as completed
- [ ] Commit: "feat: Add upload wizard completion summary page"

---

## Phase 8: Project Management

### Project Actions - Delete, Rename, Download
- [ ] Create `/components/projects/DeleteProjectDialog.tsx`:
  - [ ] Confirmation dialog
  - [ ] Soft delete on confirm
  - [ ] Remove from list
- [ ] Create `/components/projects/RenameProjectDialog.tsx`:
  - [ ] Dialog with title input
  - [ ] Save button
  - [ ] Update project card
- [ ] Create three-dot menu functionality:
  - [ ] Use Radix UI DropdownMenu or custom
  - [ ] Actions: Delete, Rename, Download PDF
  - [ ] Download disabled if no PDF
- [ ] Create Django endpoints:
  - [ ] DELETE /api/projects/{id}
    - [ ] Soft delete (set deleted_at)
  - [ ] PUT /api/projects/{id}/rename
    - [ ] Update title
  - [ ] GET /api/projects/{id}/download-pdf
    - [ ] Return PDF URL or stream file
    - [ ] Browser downloads as {title}_formatted.pdf
- [ ] Create `/lib/api/projects.ts` functions:
  - [ ] deleteProject(projectId)
  - [ ] updateProjectTitle(projectId, title)
  - [ ] downloadProjectPDF(projectId)
- [ ] Test delete with confirmation
- [ ] Test rename updates immediately
- [ ] Test download works
- [ ] Test error handling
- [ ] Commit: "feat: Implement project card actions (delete, rename, download)"

### List View for Projects
- [ ] Create `/components/projects/ViewToggle.tsx`:
  - [ ] Grid/List toggle buttons
  - [ ] Track active view
  - [ ] Store preference (URL param or localStorage)
- [ ] Create `/components/projects/ProjectsList.tsx`:
  - [ ] Row layout instead of cards
  - [ ] Columns: Thumbnail, Title, Author, Last Edited, Actions
  - [ ] Sortable (optional)
  - [ ] Full width
  - [ ] Responsive
- [ ] Test toggle works
- [ ] Test both views display correctly
- [ ] Test preference persists
- [ ] Commit: "feat: Add list view for projects with toggle"

---

## Phase 9: Error Handling, Validation, Security, Accessibility

### Comprehensive Error Handling
- [ ] Create `/components/layout/ErrorBoundary.tsx`:
  - [ ] Catch React errors
  - [ ] Display user-friendly message
  - [ ] Reload button
- [ ] Create `/lib/api/client.ts`:
  - [ ] Wrap all API calls
  - [ ] Handle errors: 401, 403, 404, 5xx
  - [ ] Show appropriate messages
- [ ] Implement form validation:
  - [ ] Frontend: email, required fields, length
  - [ ] Backend: always validate
  - [ ] Inline error messages
- [ ] Implement file upload validation:
  - [ ] Type check
  - [ ] Size check
  - [ ] Content check
  - [ ] Specific error messages
- [ ] Create toast/notification system:
  - [ ] Component: `/components/ui/Toast.tsx`
  - [ ] Types: success, error, warning, info
  - [ ] Auto-dismiss, dismissible, stack
- [ ] Add loading states:
  - [ ] Spinners for all async operations
  - [ ] Disable buttons during action
  - [ ] "Loading..." text
- [ ] Handle network errors:
  - [ ] Offline detection
  - [ ] Timeout handling
  - [ ] 503 server down
  - [ ] Show appropriate message
- [ ] Standardize backend error responses:
  - [ ] Format: { success, error, code }
  - [ ] No sensitive info
  - [ ] No stack traces
- [ ] Create input validation rules:
  - [ ] Email: RFC format
  - [ ] Password: 8+ chars (frontend), stronger backend
  - [ ] Titles: 3-100 chars, no HTML
  - [ ] Description: max 4000 chars
  - [ ] Keywords: max 7, 2-3 words each
  - [ ] Files: DOCX/PDF only, max 100MB
- [ ] Test all error paths
- [ ] Test validation rules
- [ ] Test error messages
- [ ] Test retry mechanisms
- [ ] Commit: "feat: Add comprehensive error handling and validation"

### Responsive Design & Mobile
- [ ] Test on all screen sizes:
  - [ ] iPhone SE (375px)
  - [ ] iPad (768px)
  - [ ] Desktop (1920px)
- [ ] Review each page:
  - [ ] Landing page: responsive text, spacing, grid layout
  - [ ] Auth pages: centered, max 400px width
  - [ ] Dashboard: hamburger menu on mobile, sidebar on desktop
  - [ ] Projects: 1 col mobile, 3 col desktop
  - [ ] Editor: desktop-only message on mobile
  - [ ] Upload wizard: all responsive, forms stack
- [ ] Touch targets:
  - [ ] All buttons: min 44x44px
  - [ ] Links: min 44px height
  - [ ] Menu items: min 44px height
- [ ] Typography:
  - [ ] Body text: 16px minimum (iOS zoom prevention)
  - [ ] Responsive heading sizes
  - [ ] Good contrast (WCAG AA)
- [ ] Images and assets:
  - [ ] Responsive images (srcset)
  - [ ] Lazy loading
  - [ ] SVG icons scale properly
- [ ] Navigation:
  - [ ] Mobile: hamburger menu
  - [ ] Clear back buttons
  - [ ] No horizontal scrolling
- [ ] Test on actual devices if possible
- [ ] Test landscape and portrait
- [ ] Test zoom and pinch
- [ ] Commit: "feat: Add responsive design for mobile, tablet, desktop"

### Performance Optimization
- [ ] Frontend optimization:
  - [ ] Code splitting
  - [ ] Image optimization (next/image)
  - [ ] Lazy loading non-critical components
  - [ ] Minification
  - [ ] Bundle size monitoring
- [ ] API optimization:
  - [ ] Pagination for lists (limit 20)
  - [ ] Return only needed fields
  - [ ] Gzip compression
  - [ ] Response caching headers
- [ ] Database optimization:
  - [ ] Verify indexes on frequently queried fields
  - [ ] Limit fetched data
  - [ ] Avoid N+1 queries
- [ ] Async operations:
  - [ ] Debounce (auto-save already done)
  - [ ] Memoization (useCallback)
- [ ] Puppeteer optimization:
  - [ ] Reuse browser instance
  - [ ] Timeouts to prevent hanging
  - [ ] Memory management
- [ ] Storage optimization:
  - [ ] Don't store unnecessary large files
  - [ ] Clean up temp files
- [ ] Monitor performance:
  - [ ] Log slow operations
  - [ ] Track error rates
- [ ] Test performance:
  - [ ] App load: < 3 seconds
  - [ ] Page transitions: smooth
  - [ ] API responses: < 1 second
  - [ ] PDF generation: < 2 minutes
  - [ ] Large files: supported
  - [ ] Memory: reasonable, no leaks
  - [ ] Lighthouse: 80+ score
- [ ] Commit: "feat: Optimize performance (bundling, queries, caching)"

### Security Implementation
- [ ] Authentication:
  - [ ] Supabase Auth secure
  - [ ] Password requirements enforced
  - [ ] Email verification required
  - [ ] Session expiration: 24 hours
- [ ] Authorization:
  - [ ] RLS policies enforced
  - [ ] Check ownership on every endpoint
  - [ ] Users see only own data
- [ ] Input validation:
  - [ ] Sanitize all inputs (prevent XSS)
  - [ ] Validate file types and sizes
  - [ ] Validate form inputs
  - [ ] Check SQL injection prevention (ORM)
  - [ ] Remove HTML/scripts from inputs
- [ ] File handling:
  - [ ] Validate file contents
  - [ ] Store in private bucket
  - [ ] Access via authenticated URLs only
- [ ] API security:
  - [ ] CORS: only frontend origin
  - [ ] Rate limiting:
    - [ ] Signup: max 5/hour per IP
    - [ ] Login: max 10/hour per IP
    - [ ] Contact: max 5/hour per IP
  - [ ] HTTPS ready
- [ ] Error messages:
  - [ ] No sensitive info leaked
  - [ ] Generic messages (e.g., "invalid credentials")
  - [ ] No stack traces
- [ ] Dependencies:
  - [ ] Keep updated
  - [ ] Security scanning (npm audit, pip audit)
  - [ ] Review new packages
- [ ] Environment variables:
  - [ ] .env files in .gitignore
  - [ ] .env.example with placeholders
  - [ ] Different secrets for dev/prod
- [ ] CSRF protection:
  - [ ] Django: tokens in forms
- [ ] XSS prevention:
  - [ ] Escape user inputs
  - [ ] React escaping
  - [ ] Sanitize HTML if needed
- [ ] Test security:
  - [ ] Can't access other user's data
  - [ ] Can't modify other user's projects
  - [ ] Can't bypass auth
- [ ] Commit: "feat: Implement security measures (auth, validation, RLS)"

### Accessibility (WCAG 2.1 AA)
- [ ] Color contrast:
  - [ ] Text vs background: 4.5:1 minimum
  - [ ] Large text: 3:1 minimum
  - [ ] Verify with WebAIM tool
- [ ] Keyboard navigation:
  - [ ] All interactive elements via Tab
  - [ ] Focus visible everywhere
  - [ ] Tab order logical
  - [ ] Forms navigable with Tab
  - [ ] Submit with Enter
  - [ ] Dismiss modals with Escape
- [ ] Screen reader support:
  - [ ] Semantic HTML
  - [ ] ARIA labels where needed
  - [ ] Image alt text
  - [ ] Form labels associated
  - [ ] Landmarks: main, nav, region
  - [ ] Headings properly nested
- [ ] Text sizing:
  - [ ] Body: 16px minimum
  - [ ] Zoom to 200% without breaking
  - [ ] Allow user font preferences
- [ ] Forms:
  - [ ] Labels visible and associated
  - [ ] Error messages linked (aria-describedby)
  - [ ] Required fields marked
  - [ ] Instructions clear
- [ ] Links and buttons:
  - [ ] Clear link text (not "click here")
  - [ ] Min 44px size
  - [ ] Focus indicator visible
  - [ ] Distinguishable from text
- [ ] Images and icons:
  - [ ] Alt text for all images
  - [ ] Decorative: alt=""
  - [ ] Icons: aria-label or title
- [ ] Navigation:
  - [ ] Skip to main content link (optional)
  - [ ] Breadcrumbs helpful
  - [ ] Current page indicated
  - [ ] Navigation consistent
- [ ] Modals:
  - [ ] Focus trapped
  - [ ] Can close with Escape
  - [ ] Focus returns after close
  - [ ] aria-modal="true"
- [ ] Data tables:
  - [ ] Headers marked <th>
  - [ ] aria-rowcount, aria-colcount
- [ ] Focus management:
  - [ ] Visible focus indicator
  - [ ] Logical focus order
  - [ ] Focus moves to new content
  - [ ] Modal captures focus
- [ ] Test accessibility:
  - [ ] Keyboard-only navigation
  - [ ] Screen reader (NVDA, JAWS)
  - [ ] Color contrast tools
  - [ ] Lighthouse a11y score 90+
- [ ] Commit: "feat: Implement accessibility (WCAG 2.1 AA)"

---

## Phase 10: Testing, Documentation, Deployment

### End-to-End Testing (Full Workflow)
- [ ] Happy path (complete workflow):
  - [ ] Signup with email/password
  - [ ] Verify email
  - [ ] Login
  - [ ] Navigate Projects
  - [ ] Create new project
  - [ ] Upload DOCX file
  - [ ] Validate and fix errors
  - [ ] Start formatting
  - [ ] Wait for completion
  - [ ] Edit content in editor
  - [ ] Auto-save works
  - [ ] Generate metadata
  - [ ] Review and edit metadata
  - [ ] See completion summary
  - [ ] Download PDF
  - [ ] Download metadata TXT
  - [ ] Back to dashboard
  - [ ] Project in Completed filter
  - [ ] Can reopen and export again
  - [ ] Can delete project
  - [ ] Can rename project
- [ ] Error paths:
  - [ ] Upload wrong file type
  - [ ] Upload file > 100MB
  - [ ] Network disconnect during polling
  - [ ] Page refresh during operations
  - [ ] Logout and login (state preserved)
  - [ ] Delete and undo attempts
  - [ ] Form validation errors
- [ ] Edge cases:
  - [ ] Very short manuscript
  - [ ] Very long manuscript (150k words)
  - [ ] Manuscript with no chapters
  - [ ] Special characters in title
  - [ ] Unicode characters
  - [ ] Rapid button clicks
  - [ ] Browser back button
- [ ] Cross-browser:
  - [ ] Chrome/Edge (Chromium)
  - [ ] Firefox
  - [ ] Safari (iOS)
- [ ] Device testing:
  - [ ] Desktop (1920x1080)
  - [ ] Tablet (768x1024)
  - [ ] Mobile (375x667)
- [ ] Performance testing:
  - [ ] Signup/login < 3s
  - [ ] Project creation < 2s
  - [ ] File upload shows progress
  - [ ] Formatting < 2 min
  - [ ] Metadata gen < 1 min
  - [ ] PDF export < 1 min
  - [ ] Dashboard load < 2s
  - [ ] Editor load < 3s
- [ ] Data consistency:
  - [ ] Persist after refresh
  - [ ] Multiple projects independent
  - [ ] Formatting preserved
  - [ ] Metadata preserved
- [ ] Security testing:
  - [ ] Can't access other user's data
  - [ ] Can't delete other projects
  - [ ] Can't access unverified account
  - [ ] Session timeout redirects to login
- [ ] Create test report
- [ ] Document all issues found
- [ ] Create test cases for regression testing
- [ ] Commit: "test: Comprehensive end-to-end testing complete"

### Documentation
- [ ] Create README.md:
  - [ ] Project overview
  - [ ] Tech stack
  - [ ] Quick start
  - [ ] Project structure
  - [ ] Features
  - [ ] Contributing
- [ ] Create SETUP.md:
  - [ ] Step-by-step frontend setup
  - [ ] Step-by-step backend setup
  - [ ] Step-by-step database setup
  - [ ] Environment variables
  - [ ] How to run locally
  - [ ] Common issues/solutions
- [ ] Create /docs/API.md:
  - [ ] All endpoints documented
  - [ ] Method, route, auth, params, response
  - [ ] Example requests/responses
  - [ ] Error codes
  - [ ] Auth headers
- [ ] Create /docs/ARCHITECTURE.md:
  - [ ] System overview
  - [ ] Frontend structure
  - [ ] Backend structure
  - [ ] Data flow diagram
  - [ ] AI pipeline description
- [ ] Create /docs/DATABASE.md:
  - [ ] All tables documented
  - [ ] Columns, types, relationships
  - [ ] Indexes
  - [ ] RLS policies
  - [ ] Migrations
- [ ] Create /docs/DEPLOYMENT.md:
  - [ ] Frontend deployment (Vercel)
  - [ ] Backend deployment (Railway/Render)
  - [ ] Environment setup
  - [ ] Database setup
  - [ ] SSL/HTTPS
  - [ ] Monitoring
- [ ] Create /docs/USER_GUIDE.md:
  - [ ] How to use Forma
  - [ ] Step-by-step workflows
  - [ ] Screenshots (optional)
  - [ ] FAQ
- [ ] Create /docs/TROUBLESHOOTING.md:
  - [ ] Common issues and solutions
  - [ ] How to report bugs
  - [ ] Support contact
- [ ] Add code comments:
  - [ ] JSDoc/docstrings for complex functions
  - [ ] Comments for non-obvious logic
  - [ ] API endpoint documentation
- [ ] Create .env.example files:
  - [ ] Frontend: all variables with descriptions
  - [ ] Backend: all variables with descriptions
- [ ] Verify all docs are clear and complete
- [ ] Commit: "docs: Add comprehensive documentation"

### Final Integration & Deployment Prep
- [ ] Frontend build:
  - [ ] Run: npm run build
  - [ ] Check for errors
  - [ ] Check bundle size
  - [ ] Test production build locally: npm start
- [ ] Backend checks:
  - [ ] Run: python manage.py collectstatic
  - [ ] Run: python manage.py migrate
  - [ ] Verify settings configured
  - [ ] Test with production settings
- [ ] Environment setup:
  - [ ] Production .env files created
  - [ ] All secrets generated/set
  - [ ] Database connection tested
  - [ ] Storage connection tested
  - [ ] OpenAI API key verified
  - [ ] Email credentials verified
- [ ] Database:
  - [ ] All tables created
  - [ ] All indexes created
  - [ ] RLS policies active
  - [ ] Migrations up to date
  - [ ] Backup tested
- [ ] Storage:
  - [ ] Buckets created
  - [ ] RLS policies set
  - [ ] Paths correct
- [ ] API integration:
  - [ ] All endpoints functional
  - [ ] CORS configured
  - [ ] Auth working
  - [ ] Rate limiting active
- [ ] Frontend-Backend integration:
  - [ ] All API calls working
  - [ ] Auth tokens handled correctly
  - [ ] Errors handled
  - [ ] Timeouts configured
- [ ] Monitoring setup (optional):
  - [ ] Error tracking (optional: Sentry)
  - [ ] Performance monitoring (optional)
  - [ ] Analytics (optional)
- [ ] Final testing:
  - [ ] Run full test suite
  - [ ] Test with production config
  - [ ] Performance check
  - [ ] Security check
- [ ] Deployment checklist:
  - [ ] Deployment runbooks created
  - [ ] Rollback plan defined
  - [ ] Backup tested
  - [ ] Recovery tested
- [ ] Test once more before deploy
- [ ] Commit: "chore: Final deployment preparation"

### Post-Launch Monitoring & Improvements
- [ ] Error tracking:
  - [ ] Setup (Sentry or email alerts)
  - [ ] Monitor API errors
  - [ ] Monitor formatting failures
  - [ ] Alert on critical errors
- [ ] Performance monitoring:
  - [ ] Track response times
  - [ ] Track PDF generation time
  - [ ] Track page loads
  - [ ] Alert on degradation
- [ ] Usage analytics (optional):
  - [ ] Track users and projects
  - [ ] Identify popular features
  - [ ] Dashboard created
- [ ] User feedback:
  - [ ] In-app feedback form (optional)
  - [ ] Email support
  - [ ] Track issues
- [ ] Improvement roadmap:
  - [ ] List potential improvements:
    - [ ] List view polish
    - [ ] Dark mode
    - [ ] Cover image upload
    - [ ] Grammar assistance
    - [ ] KDP direct integration
    - [ ] Royalty estimator
  - [ ] Prioritize by impact
  - [ ] Plan iterations
- [ ] Infrastructure improvements:
  - [ ] Scaling if needed
  - [ ] Caching (Redis)
  - [ ] Query optimization
  - [ ] File archival
- [ ] Monitor production:
  - [ ] Error rates
  - [ ] Performance metrics
  - [ ] User adoption
  - [ ] Support tickets
- [ ] Commit: "ops: Setup monitoring and feedback collection"

---

## Summary

**Total Tasks:** 296+  
**Phases:** 10  
**Estimated Time:** 40-60 hours  

### How to Use This Checklist

1. **Work through sequentially** - Each phase builds on the previous
2. **Check off items as completed** - Track progress
3. **Run tests at each step** - Verify acceptance criteria
4. **Commit after each major phase** - Good Git hygiene
5. **Update the date** at the top as you progress
6. **Track overall progress** - Calculate: Completed / Total

### Key Milestones

- [ ] **Phase 0 Complete** - Infrastructure ready
- [ ] **Phase 1 Complete** - Users can authenticate
- [ ] **Phase 2 Complete** - Landing page and navigation ready
- [ ] **Phase 3 Complete** - Dashboard fully functional
- [ ] **Phase 4 Complete** - File upload working
- [ ] **Phase 5 Complete** - AI formatting pipeline done
- [ ] **Phase 6 Complete** - Editor operational
- [ ] **Phase 7 Complete** - Metadata generation done
- [ ] **Phase 8 Complete** - Project management features
- [ ] **Phase 9 Complete** - Polishing, security, accessibility
- [ ] **Phase 10 Complete** - Testing and documentation

### Success Criteria

- [ ] All 296+ tasks completed
- [ ] All unit tests passing
- [ ] End-to-end workflow tested
- [ ] Security audit passed
- [ ] Accessibility audit passed
- [ ] Performance targets met
- [ ] Documentation complete
- [ ] Ready for production deployment

---

**Last Update:** [Date]  
**By:** [Your Name]  
**Status:** In Progress 🚀