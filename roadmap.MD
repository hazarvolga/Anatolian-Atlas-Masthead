You are an expert fullstack developer specializing in Next.js, TypeScript, and PostgreSQL. I have designed a comprehensive PostgreSQL database schema for a travel agency website, covering user management, tours, bookings, payments, reviews, and more. My goal is to implement this schema and integrate it into a Next.js application.

Important Note on Tour Types: Our tours come in three distinct types: "One-Day Tour", "Multi-Day Tour", and "Date-Range Tour". The booking system will need to utilize specific, tailored forms for each of these tour types. This distinction should be considered when designing APIs and frontend components for tour management and booking.

Here is the database schema I've prepared:
Step 2: Database Schema

1. User Management (Users & Roles)

    Users:

        user_id (PRIMARY KEY, UUID/INT)

        username (VARCHAR(50), UNIQUE)

        email (VARCHAR(255), UNIQUE)

        password_hash (VARCHAR(255))

        first_name (VARCHAR(50))

        last_name (VARCHAR(50))

        phone_number (VARCHAR(20), NULLABLE)

        address (TEXT, NULLABLE)

        city (VARCHAR(50), NULLABLE)

        country (VARCHAR(50), NULLABLE)

        zip_code (VARCHAR(10), NULLABLE)

        profile_picture_url (VARCHAR(255), NULLABLE)

        created_at (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        updated_at (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        is_active (BOOLEAN, DEFAULT TRUE)

        last_login_at (TIMESTAMP WITH TIME ZONE, NULLABLE)

        role_id (FOREIGN KEY to Roles.role_id)

    Roles:

        role_id (PRIMARY KEY, INT)

        role_name (VARCHAR(50), UNIQUE)

        description (TEXT, NULLABLE)

    Permissions:

        permission_id (PRIMARY KEY, INT)

        permission_name (VARCHAR(100), UNIQUE)

    RolePermissions:

        role_id (FOREIGN KEY to Roles.role_id)

        permission_id (FOREIGN KEY to Permissions.permission_id)

        (PRIMARY KEY: role_id, permission_id)

2. Tour Packages (Tours & Categories)

    Tours:

        tour_id (PRIMARY KEY, UUID/INT)

        tour_name (VARCHAR(255))

        description (TEXT)

        destination (VARCHAR(100))

        duration_days (INT)

        price_per_person (DECIMAL(10, 2))

        currency (VARCHAR(10), DEFAULT 'USD')

        start_date (DATE)

        end_date (DATE)

        max_participants (INT)

        current_participants (INT, DEFAULT 0)

        is_active (BOOLEAN, DEFAULT TRUE)

        created_by_user_id (FOREIGN KEY to Users.user_id)

        created_at (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        updated_at (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        category_id (FOREIGN KEY to Categories.category_id)

        thumbnail_image_url (VARCHAR(255), NULLABLE)

        average_rating (DECIMAL(2, 1), NULLABLE)

        number_of_reviews (INT, DEFAULT 0)

    TourImages:

        image_id (PRIMARY KEY, UUID/INT)

        tour_id (FOREIGN KEY to Tours.tour_id)

        image_url (VARCHAR(255))

        description (VARCHAR(255), NULLABLE)

        order_index (INT, DEFAULT 0)

    Categories:

        category_id (PRIMARY KEY, INT)

        category_name (VARCHAR(100), UNIQUE)

        description (TEXT, NULLABLE)

    TourHighlights:

        highlight_id (PRIMARY KEY, UUID/INT)

        tour_id (FOREIGN KEY to Tours.tour_id)

        description (TEXT)

        order_index (INT, DEFAULT 0)

    InclusionsExclusions:

        item_id (PRIMARY KEY, UUID/INT)

        tour_id (FOREIGN KEY to Tours.tour_id)

        type (VARCHAR(20))

        description (TEXT)

3. Bookings & Payments

    Bookings:

        booking_id (PRIMARY KEY, UUID/INT)

        user_id (FOREIGN KEY to Users.user_id)

        tour_id (FOREIGN KEY to Tours.tour_id)

        booking_date (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        number_of_participants (INT)

        total_price (DECIMAL(10, 2))

        currency (VARCHAR(10), DEFAULT 'USD')

        status (VARCHAR(50))

        payment_status (VARCHAR(50))

        notes (TEXT, NULLABLE)

    Participants:

        participant_id (PRIMARY KEY, UUID/INT)

        booking_id (FOREIGN KEY to Bookings.booking_id)

        first_name (VARCHAR(50))

        last_name (VARCHAR(50))

        email (VARCHAR(255), NULLABLE)

        phone_number (VARCHAR(20), NULLABLE)

        date_of_birth (DATE, NULLABLE)

        passport_number (VARCHAR(50), NULLABLE)

        nationality (VARCHAR(50), NULLABLE)

    Payments:

        payment_id (PRIMARY KEY, UUID/INT)

        booking_id (FOREIGN KEY to Bookings.booking_id)

        user_id (FOREIGN KEY to Users.user_id)

        amount (DECIMAL(10, 2))

        currency (VARCHAR(10), DEFAULT 'USD')

        payment_date (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        payment_method (VARCHAR(50))

        transaction_id (VARCHAR(255), UNIQUE)

        status (VARCHAR(50))

4. Discounts & Coupons

    Discounts:

        discount_id (PRIMARY KEY, UUID/INT)

        discount_code (VARCHAR(50), UNIQUE, NULLABLE)

        discount_type (VARCHAR(20))

        discount_value (DECIMAL(5, 2))

        min_booking_amount (DECIMAL(10, 2), NULLABLE)

        valid_from (TIMESTAMP WITH TIME ZONE)

        valid_until (TIMESTAMP WITH TIME ZONE)

        applies_to_tour_id (FOREIGN KEY to Tours.tour_id, NULLABLE)

        is_active (BOOLEAN, DEFAULT TRUE)

        max_uses (INT, NULLABLE)

        current_uses (INT, DEFAULT 0)

    UserDiscounts:

        user_discount_id (PRIMARY KEY, UUID/INT)

        user_id (FOREIGN KEY to Users.user_id)

        discount_id (FOREIGN KEY to Discounts.discount_id)

        used_at (TIMESTAMP WITH TIME ZONE, NULLABLE)

5. Reviews & Ratings

    Reviews:

        review_id (PRIMARY KEY, UUID/INT)

        tour_id (FOREIGN KEY to Tours.tour_id)

        user_id (FOREIGN KEY to Users.user_id)

        rating (INT)

        comment (TEXT, NULLABLE)

        review_date (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        is_approved (BOOLEAN, DEFAULT FALSE)

6. Support & Contact

    SupportTickets:

        ticket_id (PRIMARY KEY, UUID/INT)

        user_id (FOREIGN KEY to Users.user_id)

        subject (VARCHAR(255))

        message (TEXT)

        status (VARCHAR(50))

        priority (VARCHAR(50))

        created_at (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        closed_at (TIMESTAMP WITH TIME ZONE, NULLABLE)

        assigned_to_user_id (FOREIGN KEY to Users.user_id)

    TicketReplies:

        reply_id (PRIMARY KEY, UUID/INT)

        ticket_id (FOREIGN KEY to SupportTickets.ticket_id)

        user_id (FOREIGN KEY to Users.user_id)

        message (TEXT)

        replied_at (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

7. Other Modules

    Partners:

        partner_id (PRIMARY KEY, UUID/INT)

        partner_name (VARCHAR(255))

        contact_person (VARCHAR(100), NULLABLE)

        email (VARCHAR(255), NULLABLE)

        phone_number (VARCHAR(20), NULLABLE)

        address (TEXT, NULLABLE)

        website (VARCHAR(255), NULLABLE)

        partner_type (VARCHAR(50))

    BlogPosts:

        post_id (PRIMARY KEY, UUID/INT)

        title (VARCHAR(255))

        content (TEXT)

        author_id (FOREIGN KEY to Users.user_id)

        published_at (TIMESTAMP WITH TIME ZONE)

        last_updated_at (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        is_published (BOOLEAN, DEFAULT FALSE)

        thumbnail_url (VARCHAR(255), NULLABLE)

    BlogCategories:

        blog_category_id (PRIMARY KEY, INT)

        category_name (VARCHAR(100), UNIQUE)

    PostTags:

        tag_id (PRIMARY KEY, INT)

        tag_name (VARCHAR(50), UNIQUE)

    BlogPostTags:

        post_id (FOREIGN KEY to BlogPosts.post_id)

        tag_id (FOREIGN KEY to PostTags.tag_id)

        (PRIMARY KEY: post_id, tag_id)

    Subscribers:

        subscriber_id (PRIMARY KEY, UUID/INT)

        email (VARCHAR(255), UNIQUE)

        subscribed_at (TIMESTAMP WITH TIME ZONE, DEFAULT CURRENT_TIMESTAMP)

        is_active (BOOLEAN, DEFAULT TRUE)

My Request:

Based on this schema, guide me through the following steps to implement and integrate it into a Next.js (with TypeScript) and PostgreSQL project. Your instructions should be practical, clear, concise, and executable for each step.
Important Note on Development Environment: Docker

I intend to develop this project using Docker for both the Next.js application and the PostgreSQL database. This means the development environment setup should involve Docker Compose for containerization, ensuring consistency and ease of setup across different machines.
Step 1: PostgreSQL Database Setup and Schema Creation

Please provide the necessary SQL commands to:

    Create a new PostgreSQL database named travel_db.

    Create all tables exactly as defined in the schema above. Ensure all primary keys, foreign keys, unique constraints, nullability, and default values are correctly applied. Pay close attention to the order of table creation to satisfy foreign key dependencies.

    Include commands for setting up a basic PostgreSQL user (if needed for local development, e.g., travel_user with password travel_password) and granting appropriate permissions to this user on the travel_db database.

Your SQL commands should be ready to execute in a PostgreSQL client (like psql or pgAdmin).
Step 2: Next.js Project Setup and ORM Integration

Please provide clear, concise, and executable instructions for the following sub-steps:

    Next.js Project Initialization:

        Show the exact command to create a new Next.js project. It should be configured with TypeScript for robust development. Let's name the project travel-booking-app.

    ORM Selection and Justification:

        Recommend one primary ORM/Query Builder for this project (e.g., Prisma, Kysely, Drizzle ORM, Knex.js) that best fits a complex PostgreSQL schema and a TypeScript-first Next.js application.

        Briefly justify your recommendation, highlighting its key advantages for this specific project context (e.g., type safety, migrations, ease of use with Next.js API routes).

    ORM Installation and Initialization:

        Provide the npm/yarn commands to install the recommended ORM and its necessary client libraries.

        Detail the initialization command(s) for the chosen ORM within the travel-booking-app project. This should prepare the project for database schema synchronization.

    Database Connection Configuration (Environment Variables):

        Explain how to set up the .env.local file in the Next.js project to store the PostgreSQL database connection URL securely.

        Provide an example format for the DATABASE_URL environment variable, assuming a local PostgreSQL setup (e.g., postgresql://user:password@host:port/database_name).

    Schema Synchronization with ORM (Initial Migration):

        Describe the process and commands to import my provided PostgreSQL database schema into the ORM's schema definition file (e.g., schema.prisma for Prisma).

        Crucially, provide the command(s) to run the initial migration, which will apply this schema definition to the PostgreSQL database, creating all the tables, relationships, and constraints as defined.

        Explain any common pitfalls or considerations during this initial migration step.

    ORM Client Generation:

        Provide the command to generate the ORM client, which will allow the Next.js application to interact with the database using type-safe queries.

Step 3: Basic CRUD APIs and Frontend Integration

Please provide clear, concise, and executable instructions for the following sub-steps, focusing on the Tours table as a primary example:

    Prisma Client Instance:

        Show how to create a single, reusable instance of PrismaClient in your Next.js project, ensuring it's handled correctly for development (hot-reloading) and production environments to prevent multiple connections.

    Next.js API Route for Listing Tours (GET):

        Create a complete Next.js API route (pages/api/tours/index.ts) that handles GET requests.

        This API should fetch all active tours from the Tours table using Prisma.

        Include proper error handling and return JSON responses.

    Next.js API Route for Creating a Tour (POST):

        Extend the same pages/api/tours/index.ts API route or create a new one to handle POST requests.

        This API should receive tour data (e.g., tour_name, description, destination, price_per_person, duration_days, start_date, end_date, max_participants, category_id) from the request body.

        Use Prisma to create a new record in the Tours table.

        Include basic validation for required fields and appropriate error handling.

        Return the newly created tour object in the response.

    Frontend Page for Displaying Tours:

        Create a new Next.js page (e.g., pages/tours/index.tsx) that fetches and displays the list of tours.

        Use getServerSideProps to fetch the initial list of tours from your /api/tours API route on the server-side.

        Render a simple, responsive UI (using Tailwind CSS classes for basic styling, assuming Tailwind is available) to display each tour's tour_name, destination, price_per_person, and duration_days.

        Ensure the page is responsive for different screen sizes.

    Frontend Component for Adding a New Tour:

        Create a React component (e.g., components/TourForm.tsx) that includes a form for creating a new tour.

        The form should have input fields for tour_name, description, destination, price_per_person, duration_days, start_date, end_date, max_participants, and category_id.

        On form submission, use fetch or a similar client-side method to send a POST request to your /api/tours API route.

        Provide basic client-side validation and feedback to the user (e.g., success/error messages).

        After successful submission, consider how to refresh the tour list (e.g., re-fetching data).

Step 4: User Registration and Authentication System

Please provide clear, concise, and executable instructions for the following sub-steps, focusing on integrating NextAuth.js with the Users table in my PostgreSQL database:

    NextAuth.js Installation:

        Provide the npm/yarn command to install NextAuth.js and any other necessary dependencies.

    NextAuth.js Configuration ([...nextauth].ts):

        Create the pages/api/auth/[...nextauth].ts file.

        Configure NextAuth.js to use the Credentials Provider for email/password authentication.

        Show how to connect NextAuth.js to your PostgreSQL database using the Prisma Adapter.

        Include basic configuration for session management and JWT.

        Demonstrate how to hash passwords for new user registration and verify them during login (using bcryptjs or a similar library).

        Ensure the User model from your Prisma schema is correctly mapped and utilized by the adapter.

    API Route for User Registration:

        Create a new Next.js API route (e.g., pages/api/auth/register.ts) for user registration.

        This API should handle POST requests, receiving email, username, password, first_name, last_name, and role_id (initially, perhaps a default 'Customer' role) from the request body.

        Hash the password before saving it to the Users table using Prisma.

        Include validation to check for existing users (email/username) and required fields.

        Return appropriate success or error responses.

    Frontend Page for User Registration:

        Create a new Next.js page (e.g., pages/register.tsx) with a form for user registration.

        The form should include input fields for email, username, password, first_name, last_name.

        On form submission, send a POST request to your /api/auth/register API route.

        Provide client-side validation and user feedback.

    Frontend Page for User Login:

        Create a new Next.js page (e.g., pages/login.tsx) with a form for user login.

        The form should include input fields for email (or username) and password.

        On form submission, use signIn from next-auth/react to authenticate the user via the Credentials Provider.

        Handle successful login (e.g., redirect to a dashboard) and display error messages for failed attempts.

    Displaying User Session Information:

        Show how to use useSession from next-auth/react in a client-side component (e.g., a header or dashboard page) to display the logged-in user's information (e.g., username, email) and a logout button.

        Demonstrate how to protect a page using getSession in getServerSideProps or useSession on the client.

Step 5: User Authorization

Please provide clear, concise, and executable instructions for the following sub-steps, leveraging the Roles and Permissions tables in the database:

    Seed Initial Roles and Permissions:

        Provide a script or a method to seed your PostgreSQL database with initial roles (e.g., 'Admin', 'Tour Operator', 'Customer') and permissions (e.g., 'create_tour', 'manage_bookings', 'view_all_users', 'view_own_bookings').

        Show how to link these roles and permissions in the RolePermissions table. This can be a simple Node.js script that uses Prisma Client.

    Enhance NextAuth.js Session with Role/Permissions:

        Modify the [...nextauth].ts configuration to include the user's role_name and associated permissions (from RolePermissions table) in the NextAuth.js session object (both JWT and session callback). This will allow you to access user roles and permissions easily on the frontend and backend.

    Backend (API Route) Authorization:

        Demonstrate how to implement authorization checks within a Next.js API route (e.g., for creating a tour, pages/api/tours/index.ts POST method).

        Show how to retrieve the user's session from the request.

        Implement a check to ensure only users with the 'Tour Operator' or 'Admin' role (or specific 'create_tour' permission) can create new tours.

        Return a 403 Forbidden status if the user is not authorized.

    Frontend Page-Level Authorization:

        Show how to protect a Next.js page (e.g., pages/admin/dashboard.tsx or pages/tours/new.tsx) using getServerSideProps to check if the user has the required role/permission before rendering the page.

        If the user is not authorized, redirect them to a login page or an access denied page.

    Frontend Component-Level Authorization (Conditional Rendering):

        Demonstrate how to conditionally render UI elements (e.g., a "Create New Tour" button, an "Edit User" link) on a frontend page based on the logged-in user's roles or permissions.

        Use the useSession hook to access user session data for these checks.

Step 6: Advanced UI/UX Components and Pages

Please provide clear, concise, and executable instructions for the following sub-steps, focusing on improving the visual appeal and user interaction:

    Responsive Layout with Navigation:

        Design a responsive main layout component (e.g., components/Layout.tsx) that includes a header, a main content area, and a footer.

        Implement a responsive navigation bar in the header that adapts for mobile (e.g., hamburger menu) and desktop views.

        Include navigation links to key pages (e.g., Home, Tours, My Bookings, Login/Register/Dashboard based on auth status).

        Use Tailwind CSS for all styling and ensure it's fully responsive across different breakpoints (sm:, md:, lg:).

    Tour Detail Page:

        Create a dynamic Next.js page (e.g., pages/tours/[id].tsx) to display detailed information for a single tour.

        Use getStaticPaths and getStaticProps (or getServerSideProps if real-time data is critical) to fetch tour details based on the tour_id.

        Display all relevant tour information from the Tours table, including images (from TourImages), highlights (from TourHighlights), and inclusions/exclusions (from InclusionsExclusions).

        Include a "Book Now" button that links to a booking form.

    Booking Form (Dynamic based on Tour Type):

        Create a sophisticated booking form component (e.g., components/BookingForm.tsx) that dynamically adjusts its fields based on the selected tour_type (One-Day, Multi-Day, Date-Range).

        For "One-Day Tour", require a single date picker.

        For "Multi-Day Tour" and "Date-Range Tour", require a date range picker.

        Include fields for number_of_participants and participant details (first name, last name, email).

        Implement client-side validation using a library like react-hook-form and zod for schema validation.

        Use a modern date picker component (e.g., from shadcn/ui or a simple custom one).

    User Dashboard / My Bookings Page:

        Create a protected Next.js page (e.g., pages/dashboard/my-bookings.tsx) where logged-in users can view their past and upcoming bookings.

        Fetch bookings associated with the current user_id from the Bookings table.

        Display booking details (tour name, dates, number of participants, status, total price) in a well-structured, responsive table or card layout.

        Include options to view booking details or potentially cancel (if applicable and authorized).

    Reviews and Ratings Display:

        On the Tour Detail Page (pages/tours/[id].tsx), display existing reviews and ratings for that tour.

        Show the average rating and individual comments from the Reviews table.

        Implement a simple star rating display.

Step 7: Application-Specific Additional Features

Please provide clear, concise, and executable instructions for the following sub-steps:

    Payment Gateway Integration (Conceptual):

        Outline the conceptual steps for integrating a payment gateway (e.g., Stripe, PayPal) for booking payments.

        Explain how the Payments table would be updated after a successful or failed transaction.

        Briefly describe the necessary API routes (e.g., /api/checkout, /api/webhook) and client-side integration. No actual API keys or live integration needed, just the flow.

    Admin Dashboard for Tour Management:

        Create a protected Next.js page (e.g., pages/admin/tours.tsx) accessible only to 'Admin' or 'Tour Operator' roles.

        This page should allow administrators to:

            View all tours (active/inactive).

            Edit existing tour details (e.g., tour_name, price, dates, max_participants).

            Change a tour's is_active status.

            Delete tours (with confirmation).

        Implement API routes for these update/delete operations (pages/api/tours/[id].ts for PUT/DELETE).

        Use a responsive table component for displaying tours with action buttons.

    Review Submission and Moderation:

        On the Tour Detail Page, allow logged-in users who have completed a booking for that tour to submit a review and rating.

        Create an API route (e.g., pages/api/reviews.ts) to handle POST requests for new reviews.

        Implement a moderation system: new reviews should initially have is_approved: false and require an 'Admin' to approve them before they are publicly visible.

        Create an Admin page (e.g., pages/admin/reviews.tsx) to view, approve, or reject pending reviews.

        Update the Tours.average_rating and Tours.number_of_reviews fields automatically when new reviews are approved or existing ones are updated/deleted.

    Discount Code Application:

        On the booking form or a dedicated checkout page, provide an input field for users to enter a discount_code.

        Create an API route (e.g., pages/api/discounts/apply.ts) that validates the entered code against the Discounts table (checking valid_from, valid_until, is_active, max_uses, min_booking_amount).

        Apply the discount to the total_price of the booking on the frontend and update the UI accordingly.

        Ensure the current_uses of the discount code are incremented upon successful booking completion.

    Basic Search and Filtering for Tours:

        Implement a search bar on the main tours listing page (pages/tours/index.tsx) that allows users to search tours by tour_name or destination.

        Add filters for category and price_range.

        Modify the /api/tours GET endpoint to accept query parameters for search and filter criteria and use Prisma to filter the results.

Step 8: Tests and Optimization

Please provide clear, concise, and executable instructions for the following sub-steps:

    Setting Up Testing Environment (Jest & React Testing Library):

        Provide commands to install Jest and React Testing Library.

        Show how to configure Jest for a Next.js and TypeScript project.

        Outline the basic folder structure for tests (e.g., __tests__ directories).

    Unit Tests for an API Route:

        Choose one of your existing API routes (e.g., /api/tours/index.ts POST method for creating a tour).

        Write a comprehensive unit test for this API route using Jest.

        Mock Prisma Client interactions to isolate the API logic from the actual database.

        Test different scenarios: successful creation, validation errors, unauthorized access.

    Component Unit Test (React Testing Library):

        Choose a simple React component (e.g., components/TourForm.tsx or a basic button component).

        Write a unit test for this component using React Testing Library.

        Demonstrate how to render the component, simulate user interactions (e.g., typing, clicking), and assert on the component's behavior and rendered output.

    Performance Optimization Techniques:

        Discuss and provide code examples (where applicable) for at least three common Next.js performance optimization techniques relevant to this project:

            Image Optimization: Explain how to use next/image component for responsive and optimized image loading.

            Lazy Loading Components: Show how to dynamically import components using next/dynamic to reduce initial bundle size.

            Data Fetching Strategy: Briefly explain when to use getStaticProps, getServerSideProps, and client-side fetching (SWR/React Query) for optimal performance in different scenarios within your travel app.

    Code Quality and Linting (ESLint & Prettier):

        Ensure ESLint and Prettier are configured in the project (they are usually set up by create-next-app).

        Provide commands to run linting and formatting checks.

        Briefly explain the benefits of using them for code consistency and error prevention.

Step 9: Deployment

Please provide clear, concise, and executable instructions for deploying this fullstack Next.js application with a PostgreSQL database. Focus on a common and recommended deployment strategy.

    Choosing a Deployment Platform:

        Recommend a primary platform for deploying the Next.js application (e.g., Vercel, Netlify, Render). Justify your choice for this specific project (Next.js, API Routes, serverless functions).

        Recommend a primary platform for deploying the PostgreSQL database (e.g., ElephantSQL, Supabase, Neon, AWS RDS, Google Cloud SQL). Justify your choice.

    Preparing the Next.js Application for Deployment:

        Explain any necessary changes or configurations in the Next.js project before deployment (e.g., environment variables, build command).

        Provide the standard build command for a Next.js project.

    Database Deployment Steps:

        Outline the high-level steps to deploy the PostgreSQL database to the recommended cloud database platform (e.g., creating an instance, obtaining connection string).

        Explain how to import your existing schema (and potentially initial seed data) into the deployed database.

        Emphasize the importance of securing the database connection string.

    Connecting Next.js App to Deployed Database:

        Explain how to configure the DATABASE_URL environment variable on the chosen Next.js deployment platform to point to your deployed PostgreSQL database.

        Detail how to run Prisma migrations on the deployed environment (e.g., via a build step or a separate command).

    Deployment Process (Step-by-Step):

        Provide a step-by-step guide for deploying the Next.js application to the recommended platform, assuming a Git repository (e.g., GitHub, GitLab).

        Cover linking the repository, configuring build settings, and setting environment variables.

    Post-Deployment Considerations:

        Briefly discuss important post-deployment steps:

            Monitoring application health and performance.

            Setting up continuous deployment (if not already covered).

            Managing environment variables securely.

            Handling database backups.