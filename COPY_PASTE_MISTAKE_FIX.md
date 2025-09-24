# 🚨 Fix: "syntax error at or near ```" 

## ❌ The Problem: You Copied Markdown Formatting

The error happens because you copied the **markdown formatting** instead of just the **SQL code**.

### **What You Copied (WRONG):**
```
```sql
CREATE TYPE booking_status AS ENUM...
```
```

### **What You Should Copy (CORRECT):**
```
CREATE TYPE booking_status AS ENUM...
```

## ✅ The Fix: Copy Only SQL Code

### **Step 1: Clear the SQL Editor**
- Delete everything in your Supabase SQL Editor
- Start with a completely empty editor

### **Step 2: Copy the Clean SQL**
**Option A: From the Clean File**
- Open `supabase/CLEAN_SCHEMA.sql` in your repository
- Copy everything from line 3 onwards (skip the comments)
- Start copying from: `CREATE TYPE booking_status...`

**Option B: Copy from GitHub Raw**
- Go to: https://raw.githubusercontent.com/roltrader/autoperks/main/supabase/CLEAN_SCHEMA.sql
- Copy everything (this is pure SQL, no markdown)

### **Step 3: Paste and Run**
- Paste in Supabase SQL Editor
- Click "Run"
- Should work without syntax errors!

## 🔍 How to Identify the Difference

### **❌ Markdown Formatting (Don't Copy This):**
```
```sql
-- This is markdown formatting
CREATE TABLE...
```
```

**Signs you copied markdown:**
- Starts with triple backticks: ```
- Has "sql" after the backticks
- Ends with triple backticks: ```

### **✅ Pure SQL Code (Copy This):**
```
-- This is pure SQL
CREATE TABLE...
```

**Signs you copied correctly:**
- Starts directly with SQL commands
- No triple backticks anywhere
- Just SQL statements and comments

## 📋 Quick Copy-Paste (Pure SQL)

**Copy everything below this line:**

---

CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE user_role AS ENUM ('client', 'admin', 'technician');

CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'client',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.services (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.technicians (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  specialties TEXT[],
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.bookings (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) NOT NULL,
  service_id INTEGER REFERENCES public.services(id) NOT NULL,
  technician_id INTEGER REFERENCES public.technicians(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status booking_status DEFAULT 'pending',
  notes TEXT,
  total_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO public.services (name, description, price, duration) VALUES
('Car Wash', 'Professional exterior and interior cleaning', 25.00, 30),
('Full Detail', 'Complete vehicle detailing service including wash, wax, and interior deep clean', 150.00, 180),
('Oil Change', 'Quick and professional oil change with filter replacement', 45.00, 45),
('Tire Rotation', 'Professional tire rotation and pressure check', 35.00, 30),
('Brake Inspection', 'Complete brake system inspection and basic maintenance', 75.00, 60);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.technicians ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own data" ON public.users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Services are readable by authenticated users" ON public.services FOR SELECT TO authenticated USING (true);

CREATE POLICY "Technicians are readable by authenticated users" ON public.technicians FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can read own bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can read all bookings" ON public.bookings FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE POLICY "Admins can update all bookings" ON public.bookings FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() AND users.role = 'admin'
  )
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_technicians_updated_at BEFORE UPDATE ON public.technicians FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'role', 'client')::user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

SELECT 'Schema applied successfully! Your AutoPerks database is ready.' as status;

---

**Copy everything above this line!**

## ✅ Success Indicators

After pasting the correct SQL:
- ✅ **No syntax errors**
- ✅ **Green success message**
- ✅ **"Schema applied successfully!" message**
- ✅ **4 tables created**
- ✅ **5 services inserted**

## 🚀 Next Steps

Once the schema applies successfully:
1. **✅ Verify tables exist** in Table Editor
2. **✅ Deploy to Vercel** with your Supabase credentials  
3. **✅ Test your Next.js app**
4. **✅ "useApp must be used within AppProvider" error resolved!**

---

**The syntax error is now fixed - use pure SQL only!** 🎉