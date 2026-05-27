CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE salons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    neighborhood VARCHAR(100),
    phone VARCHAR(20) NOT NULL,
    paystack_subaccount_code VARCHAR(100), -- For routing split payments
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_ghs DECIMAL(10, 2) NOT NULL,
    duration_minutes INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE availability_slots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_slot_per_salon UNIQUE (salon_id, slot_date, start_time)
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    slot_id UUID REFERENCES availability_slots(id) ON DELETE CASCADE,
    client_name VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, cancelled, no_show
    deposit_amount DECIMAL(10, 2) NOT NULL DEFAULT 20.00,
    total_amount DECIMAL(10, 2) NOT NULL,
    paystack_reference VARCHAR(100) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    paystack_reference VARCHAR(100) NOT NULL UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'initiated', -- initiated, success, failed
    gateway_response JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_availability_slots_date ON availability_slots(slot_date);
CREATE INDEX idx_availability_slots_salon ON availability_slots(salon_id);
CREATE INDEX idx_bookings_status ON bookings(status);
