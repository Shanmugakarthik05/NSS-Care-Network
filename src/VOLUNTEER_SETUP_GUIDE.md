# NSS Volunteer Dashboard - Setup Guide

## Quick Start

### Accessing the Volunteer Dashboard

1. **Navigate to Login Page**
   - Click on "Login/Register" in the main navigation
   - Or visit the login route directly

2. **Select Volunteer Login**
   - Choose the "NSS Volunteer" card (heart icon, blue color)
   - You'll see it's positioned second in the login grid

3. **Enter Credentials**
   - Email: Any valid email format
   - Password: Any password (demo mode)
   - Click "Login"

4. **Dashboard Access**
   - You'll be automatically redirected to the volunteer dashboard
   - Default view is the Overview tab

## Dashboard Navigation

The volunteer dashboard sidebar includes:

| Tab | Icon | Description |
|-----|------|-------------|
| Overview | Home | Main dashboard with stats and activities |
| Digital ID | ID Card | View and download your digital volunteer ID |
| Volunteer Chat | Message | Chat with fellow volunteers |
| Settings | Settings | Account settings and preferences |

## Main Features

### 1. Overview Tab
**What you'll see:**
- Welcome banner with your name and total volunteer hours
- Four stat cards showing:
  - Hours logged (mock: 127h)
  - Events participated (mock: 23)
  - Blood donations (mock: 4)
  - People helped (mock: 156)
- Upcoming health camps you can register for
- Blood requests matching your blood group (O+)
- Your profile summary
- Achievement progress bars
- Recent activity timeline

**Interactions:**
- Click "Register to Volunteer" on any health camp
- Click "I Can Donate" on blood requests
- View achievement badges
- Track progress toward goals

### 2. Digital ID Tab
**What you'll see:**
- A professional digital ID card with:
  - Your name and college
  - Unique Volunteer ID (NSS + 6-digit number)
  - Blood group and contact info
  - Active status badge
  - Validity dates (1 year from join date)
  - QR code placeholder

**Actions:**
- **Download Card**: Opens print dialog (save as PDF)
- **Share**: Uses device share feature or copies to clipboard

### 3. Volunteer Chat Tab
**What you'll see:**
- Group chat interface with your NSS unit
- Pre-loaded messages from other volunteers
- Online volunteers sidebar (5 volunteers shown)
- Status indicators (green = online, yellow = away)

**Interactions:**
- Type messages in the input field
- Click send button or press Enter
- Messages auto-scroll to bottom
- New messages appear every ~15 seconds (simulated)

## Mock Data

The volunteer dashboard currently uses mock data for demonstration:

### Current Volunteer Profile
```
Name: Rajesh Kumar
Email: rajesh.kumar@college.edu
Phone: 9876543210
College: St. Xavier's College, Mumbai
Blood Group: O+
Join Date: January 15, 2024
Volunteer ID: NSS + timestamp
```

### Mock Stats
- 127 volunteer hours logged
- 23 events participated
- 4 blood donations
- 156 people helped

### Online Volunteers (Chat)
- Priya Sharma (online)
- Rahul Verma (online)
- Anita Kumar (away)
- Vikram Singh (online)
- Sneha Patel (online)

## Technical Details

### Components Created

1. **VolunteerDashboard.tsx**
   - Main dashboard component
   - Manages tabs and data loading
   - Auto-refresh every 30 seconds

2. **DigitalIDCard.tsx**
   - Standalone digital ID component
   - Print-friendly styling
   - Share functionality

3. **VolunteerChat.tsx**
   - Group chat interface
   - Simulated real-time updates
   - Online status tracking

### Files Modified

1. **App.tsx**
   - Added "volunteer" to UserType
   - Added VolunteerDashboard import
   - Added volunteer case to dashboard switch

2. **DashboardLayout.tsx**
   - Added IdCard and MessageSquare icons
   - Added volunteer navigation items
   - Added volunteer user label and color

3. **LoginRegister.tsx**
   - Added Heart icon
   - Added NSS Volunteer login card
   - Changed grid to 5 columns

### Data Flow

```
Login as Volunteer
    ↓
App.tsx (sets userType = "volunteer")
    ↓
DashboardLayout (renders volunteer navigation)
    ↓
VolunteerDashboard (loads based on activeTab)
    ↓
├── Overview Tab (default)
├── Digital ID Tab
└── Volunteer Chat Tab
```

### Auto-Refresh Mechanism

The dashboard implements smart auto-refresh:
- Only refreshes data for the active tab
- Interval: 30 seconds
- Prevents memory leaks with cleanup on unmount
- Uses React useEffect with dependencies

### Responsive Design

**Mobile (< 768px)**
- Single column layout
- Stacked cards
- Collapsible sidebar
- Full-width chat

**Tablet (768px - 1024px)**
- 2-column grid for stats
- Side-by-side content
- Responsive chat layout

**Desktop (> 1024px)**
- 4-column grid for stats
- 3-column layout (2:1 ratio)
- Full sidebar visible
- Optimized spacing

## Color Coding

| Element | Color | Usage |
|---------|-------|-------|
| Primary Actions | #0077B6 (Blue) | Buttons, volunteer branding |
| Blood Related | #E63946 (Red) | Blood requests, donations |
| Success | #10B981 (Green) | Active status, achievements |
| Warning | #F59E0B (Yellow) | Away status, pending items |
| Purple | #8B5CF6 | Admin elements |

## Integration Guide

### Connecting to Real API

Replace mock data in `VolunteerDashboard.tsx`:

```typescript
// Current (mock)
const currentVolunteer = {
  id: "VOL12345",
  name: "Rajesh Kumar",
  // ... mock data
};

// Replace with
const [currentVolunteer, setCurrentVolunteer] = useState(null);

useEffect(() => {
  // Get from auth context or API
  const fetchVolunteer = async () => {
    const response = await volunteersApi.getProfile();
    setCurrentVolunteer(response.volunteer);
  };
  fetchVolunteer();
}, []);
```

### Adding Real-Time Chat

Use Supabase Realtime:

```typescript
// In VolunteerChat.tsx
import { supabase } from '../utils/supabase/client';

useEffect(() => {
  const channel = supabase
    .channel('volunteer-chat')
    .on('postgres_changes', 
      { event: 'INSERT', schema: 'public', table: 'messages' },
      (payload) => {
        setMessages(prev => [...prev, payload.new]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

### Authentication Integration

Update `LoginRegister.tsx` to use real auth:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    // Real authentication
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    
    // Check user role from database
    const { data: profile } = await supabase
      .from('volunteers')
      .select('*')
      .eq('user_id', data.user.id)
      .single();
    
    if (profile) {
      onLogin('volunteer');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

## Troubleshooting

### Issue: Dashboard not loading
**Solution**: Check that activeTab prop is being passed correctly and matches tab IDs ("home", "digital-id", "chat")

### Issue: Chat messages not appearing
**Solution**: Verify mock data is loading, check console for errors, ensure VolunteerChat component receives currentVolunteer prop

### Issue: Digital ID download not working
**Solution**: Check browser print permissions, verify print CSS is loading, try using screenshot instead

### Issue: Stats not updating
**Solution**: Check auto-refresh interval is running, verify API endpoints are accessible, check network tab for errors

## Future Development

### Planned Enhancements
1. Real volunteer authentication
2. Photo upload for ID card
3. WebSocket-based real-time chat
4. Push notifications for urgent requests
5. Activity logging with manual entry
6. Certificate generation
7. Event check-in with QR codes
8. Volunteer leaderboards
9. Direct messaging
10. Calendar sync

### Database Schema Recommendations

```sql
-- Volunteers table
CREATE TABLE volunteers (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  blood_group TEXT,
  join_date DATE NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Volunteer activities table
CREATE TABLE volunteer_activities (
  id UUID PRIMARY KEY,
  volunteer_id UUID REFERENCES volunteers,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  location TEXT,
  hours NUMERIC,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY,
  volunteer_id UUID REFERENCES volunteers,
  college TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Support

For issues or questions:
1. Check VOLUNTEER_FEATURES.md for detailed feature documentation
2. Review component code comments
3. Check browser console for errors
4. Verify all required dependencies are installed
