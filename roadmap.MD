AIzaSyCLpJJMj_Uh5IzjY44FQodCAtKeD7w6RVM


You are an expert fullstack developer specializing in Next.js, TypeScript, and PostgreSQL. I have designed a comprehensive PostgreSQL database schema for a travel agency website, covering user management, tours, bookings, payments, reviews, and more. My goal is to implement this schema and integrate it into a Next.js application.

Important Note on Tour Types: Our tours come in three distinct types: "One-Day Tour", "Multi-Day Tour", and "Date-Range Tour". The booking system will need to utilize specific, tailored forms for each of these tour types. This distinction should be considered when designing APIs and frontend components for tour management and booking.

Here is the database schema I've prepared:
Step 2: Database Schema


-- Modern Tour Management Database Schema
-- Güvenlik, performans ve ölçeklenebilirlik odaklı tasarım

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'guide', 'customer', 'operator');
CREATE TYPE tour_status AS ENUM ('draft', 'active', 'inactive', 'cancelled');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded', 'partial');
CREATE TYPE payment_method AS ENUM ('credit_card', 'bank_transfer', 'cash', 'digital_wallet');

-- Users table (Authentication & Authorization)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User sessions for security
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories for tours
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Countries
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    code VARCHAR(2) UNIQUE NOT NULL, -- ISO 3166-1 alpha-2
    currency VARCHAR(3) NOT NULL,
    timezone VARCHAR(50),
    phone_code VARCHAR(10),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cities
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    country_id UUID NOT NULL REFERENCES countries(id),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Destinations (Main destination pages)
CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    country_id UUID NOT NULL REFERENCES countries(id),
    city_id UUID REFERENCES cities(id),
    short_description VARCHAR(500),
    description TEXT NOT NULL,
    why_visit TEXT, -- Why visit this destination
    best_time_to_visit TEXT,
    getting_there TEXT,
    local_transport TEXT,
    local_culture TEXT,
    local_cuisine TEXT,
    safety_tips TEXT,
    budget_info TEXT,
    featured_image TEXT,
    gallery_images JSONB DEFAULT '[]',
    climate_info JSONB DEFAULT '{}', -- Monthly weather data
    attractions JSONB DEFAULT '[]', -- Top attractions
    activities JSONB DEFAULT '[]', -- Available activities
    accommodations JSONB DEFAULT '[]', -- Hotel recommendations
    restaurants JSONB DEFAULT '[]', -- Restaurant recommendations
    shopping JSONB DEFAULT '[]', -- Shopping areas
    nightlife JSONB DEFAULT '[]', -- Nightlife options
    transportation JSONB DEFAULT '{}', -- Transport options
    visa_requirements TEXT,
    local_customs TEXT,
    emergency_contacts JSONB DEFAULT '{}',
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    elevation INTEGER, -- meters above sea level
    population INTEGER,
    area_km2 DECIMAL(10, 2),
    founded_year INTEGER,
    unesco_site BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    popularity_score INTEGER DEFAULT 0,
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    tags TEXT[], -- Array of tags (beach, mountain, historic, etc.)
    languages_spoken TEXT[],
    local

-- Tours (Main entity)
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    short_description VARCHAR(500),
    category_id UUID REFERENCES categories(id),
    location_id UUID NOT NULL REFERENCES locations(id),
    guide_id UUID REFERENCES users(id),
    status tour_status DEFAULT 'draft',
    duration_hours INTEGER NOT NULL,
    max_participants INTEGER NOT NULL,
    min_participants INTEGER DEFAULT 1,
    price_adult DECIMAL(10, 2) NOT NULL,
    price_child DECIMAL(10, 2),
    price_currency VARCHAR(3) DEFAULT 'TRY',
    difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5),
    age_limit INTEGER,
    featured BOOLEAN DEFAULT FALSE,
    includes TEXT[], -- Array of what's included
    excludes TEXT[], -- Array of what's excluded
    requirements TEXT[], -- Requirements for participants
    cancellation_policy TEXT,
    images JSONB DEFAULT '[]', -- Array of image objects
    metadata JSONB DEFAULT '{}',
    seo_title VARCHAR(255),
    seo_description VARCHAR(500),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Tour schedules/availability
CREATE TABLE tour_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE,
    start_time TIME NOT NULL,
    available_spots INTEGER NOT NULL,
    booked_spots INTEGER DEFAULT 0,
    price_override DECIMAL(10, 2), -- Override tour price for specific dates
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT valid_spots CHECK (booked_spots <= available_spots)
);

-- Bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_number VARCHAR(20) UNIQUE NOT NULL,
    tour_id UUID NOT NULL REFERENCES tours(id),
    schedule_id UUID NOT NULL REFERENCES tour_schedules(id),
    user_id UUID NOT NULL REFERENCES users(id),
    status booking_status DEFAULT 'pending',
    adult_count INTEGER NOT NULL DEFAULT 1,
    child_count INTEGER DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    customer_notes TEXT,
    special_requirements TEXT,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    customer_info JSONB NOT NULL, -- Customer details
    participants JSONB DEFAULT '[]', -- Participant details
    booking_date TIMESTAMPTZ DEFAULT NOW(),
    confirmed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    payment_intent_id VARCHAR(255), -- For Stripe/external payment processors
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'TRY',
    status payment_status DEFAULT 'pending',
    method payment_method NOT NULL,
    transaction_id VARCHAR(255),
    gateway_response JSONB DEFAULT '{}',
    processed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    refund_amount DECIMAL(10, 2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reviews and ratings
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID NOT NULL REFERENCES tours(id),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(200),
    comment TEXT,
    images JSONB DEFAULT '[]',
    is_verified BOOLEAN DEFAULT FALSE,
    is_published BOOLEAN DEFAULT FALSE,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id) -- One review per booking
);

-- Coupons and discounts
CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10, 2) NOT NULL,
    min_amount DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    applicable_tours UUID[] DEFAULT '{}', -- Array of tour IDs
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Coupon usage tracking
CREATE TABLE coupon_usages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID NOT NULL REFERENCES coupons(id),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    user_id UUID NOT NULL REFERENCES users(id),
    discount_amount DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(coupon_id, booking_id)
);

-- Activity logs for audit trail
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for Performance Optimization

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);

-- Sessions indexes
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_user_sessions_expires ON user_sessions(expires_at);

-- Tours indexes
CREATE INDEX idx_tours_slug ON tours(slug);
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_category ON tours(category_id);
CREATE INDEX idx_tours_location ON tours(location_id);
CREATE INDEX idx_tours_guide ON tours(guide_id);
CREATE INDEX idx_tours_featured ON tours(featured);
CREATE INDEX idx_tours_deleted ON tours(deleted_at);
CREATE INDEX idx_tours_search ON tours USING gin(to_tsvector('turkish', title || ' ' || description));

-- Tour schedules indexes
CREATE INDEX idx_tour_schedules_tour_id ON tour_schedules(tour_id);
CREATE INDEX idx_tour_schedules_date ON tour_schedules(start_date);
CREATE INDEX idx_tour_schedules_available ON tour_schedules(is_available);

-- Bookings indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_schedule_id ON bookings(schedule_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_number ON bookings(booking_number);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- Payments indexes
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);

-- Reviews indexes
CREATE INDEX idx_reviews_tour_id ON reviews(tour_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_published ON reviews(is_published);

-- Locations indexes
CREATE INDEX idx_locations_slug ON locations(slug);
CREATE INDEX idx_locations_country ON locations(country);
CREATE INDEX idx_locations_coordinates ON locations(latitude, longitude);

-- Categories indexes
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_active ON categories(is_active);

-- Activity logs indexes
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entity ON activity_logs(entity_type, entity_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read_at);

-- TRIGGERS for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tour_schedules_updated_at BEFORE UPDATE ON tour_schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- SECURITY: Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Examples - customize based on your needs)
-- Users can only see their own data
CREATE POLICY users_policy ON users FOR ALL TO authenticated
USING (id = current_user_id() OR current_user_role() = 'admin');

-- Customers can only see their own bookings
CREATE POLICY bookings_policy ON bookings FOR ALL TO authenticated
USING (user_id = current_user_id() OR current_user_role() IN ('admin', 'guide'));

-- Materialized view for tour statistics (Performance optimization)
CREATE MATERIALIZED VIEW tour_stats AS
SELECT 
    t.id,
    t.title,
    COUNT(DISTINCT b.id) as total_bookings,
    AVG(r.rating) as average_rating,
    COUNT(DISTINCT r.id) as review_count,
    SUM(b.adult_count + COALESCE(b.child_count, 0)) as total_participants
FROM tours t
LEFT JOIN bookings b ON t.id = b.tour_id AND b.status = 'completed'
LEFT JOIN reviews r ON t.id = r.tour_id AND r.is_published = true
WHERE t.deleted_at IS NULL
GROUP BY t.id, t.title;

CREATE UNIQUE INDEX idx_tour_stats_id ON tour_stats(id);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_tour_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY tour_stats;
END;
$$ LANGUAGE plpgsql;

-- Example stored procedure for booking creation with validation
CREATE OR REPLACE FUNCTION create_booking(
    p_tour_id UUID,
    p_schedule_id UUID,
    p_user_id UUID,
    p_adult_count INTEGER,
    p_child_count INTEGER DEFAULT 0,
    p_customer_info JSONB DEFAULT '{}'
) RETURNS UUID AS $$
DECLARE
    v_booking_id UUID;
    v_total_amount DECIMAL(10,2);
    v_available_spots INTEGER;
    v_booking_number VARCHAR(20);
BEGIN
    -- Validate availability
    SELECT available_spots - booked_spots INTO v_available_spots
    FROM tour_schedules
    WHERE id = p_schedule_id AND is_available = true;
    
    IF v_available_spots < (p_adult_count + COALESCE(p_child_count, 0)) THEN
        RAISE EXCEPTION 'Not enough available spots';
    END IF;
    
    -- Calculate total amount
    SELECT 
        (price_adult * p_adult_count) + 
        (COALESCE(price_child, price_adult * 0.5) * COALESCE(p_child_count, 0))
    INTO v_total_amount
    FROM tours
    WHERE id = p_tour_id;
    
    -- Generate booking number
    v_booking_number := 'TUR' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(nextval('booking_number_seq')::text, 4, '0');
    
    -- Create booking
    INSERT INTO bookings (
        booking_number, tour_id, schedule_id, user_id,
        adult_count, child_count, total_amount, customer_info
    ) VALUES (
        v_booking_number, p_tour_id, p_schedule_id, p_user_id,
        p_adult_count, p_child_count, v_total_amount, p_customer_info
    ) RETURNING id INTO v_booking_id;
    
    -- Update booked spots
    UPDATE tour_schedules 
    SET booked_spots = booked_spots + p_adult_count + COALESCE(p_child_count, 0)
    WHERE id = p_schedule_id;
    
    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql;

-- Sequence for booking numbers
CREATE SEQUENCE booking_number_seq START 1;

-- Create database roles for security
-- Application role (limited permissions)
CREATE ROLE tour_app_role;
GRANT CONNECT ON DATABASE your_database TO tour_app_role;
GRANT USAGE ON SCHEMA public TO tour_app_role;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO tour_app_role;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO tour_app_role;

-- Read-only role for analytics
CREATE ROLE tour_readonly_role;
GRANT CONNECT ON DATABASE your_database TO tour_readonly_role;
GRANT USAGE ON SCHEMA public TO tour_readonly_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO tour_readonly_role;








My Request:

Based on this schema, guide me through the following steps to implement and integrate it into a Next.js (with TypeScript) and PostgreSQL project. Your instructions should be practical, clear, concise, and executable for each step.
Important Note on Development Environment: Önce geliştirmeyi local PostgreSQL de yapacağız sonra Docker e geçeceğiz.


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