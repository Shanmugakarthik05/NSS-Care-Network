# NSS Volunteer Dashboard - Feature Documentation

## Overview
The NSS Volunteer Dashboard is a dedicated portal for NSS volunteers to manage their volunteer activities, view their digital ID, and communicate with fellow volunteers.

## Features

### 1. Volunteer Dashboard (Overview Tab)
**Location:** Main dashboard view when logged in as a volunteer

**Key Features:**
- **Welcome Section**: Personalized greeting with volunteer hours summary
- **Stats Cards**: Quick overview of:
  - Hours Logged
  - Events Participated
  - Blood Donations Made
  - People Helped
- **Upcoming Health Camps**: List of camps the volunteer can register for
- **Blood Requests**: Urgent blood donation requests matching the volunteer's blood group
- **Profile Card**: Quick view of volunteer information
- **Achievement Progress**: Visual progress bars for volunteer goals and earned badges
- **Recent Activity Log**: Timeline of recent volunteer activities

**Components Used:**
- Motion animations for smooth transitions
- Real-time data fetching with auto-refresh every 30 seconds
- Skeleton loading states

### 2. Digital ID Card
**Location:** Digital ID tab in volunteer dashboard

**Key Features:**
- **Professional ID Card Design**:
  - Gradient header with volunteer photo placeholder
  - Unique Volunteer ID number (format: NSS + timestamp)
  - Personal details (name, college, blood group, phone, email)
  - Active status badge
  - Validity dates (1-year validity)
  - QR code placeholder for verification
  - NSS branding

- **Actions**:
  - Download Card (opens print dialog for PDF export)
  - Share Card (uses Web Share API or clipboard fallback)

**Technical Implementation:**
- Print-friendly CSS for download functionality
- Responsive design that works on mobile and desktop
- Auto-generated volunteer ID based on timestamp
- Valid for one year from join date

### 3. Volunteer Chat
**Location:** Chat tab in volunteer dashboard

**Key Features:**
- **Group Chat Interface**:
  - Real-time messaging (simulated with mock data)
  - Message history with timestamps
  - Self messages highlighted in blue
  - Other volunteers' messages in gray
  - Auto-scroll to newest messages

- **Online Volunteers Sidebar**:
  - List of online volunteers from the same NSS unit
  - Online/Away status indicators (green/yellow dots)
  - Avatar with initials
  - Live status updates

- **Message Composition**:
  - Text input with send button
  - Character limit handling
  - Toast notification on send
  - Disabled state while sending

**Technical Implementation:**
- Simulated real-time with interval-based updates (every 15 seconds)
- AnimatePresence for smooth message animations
- ScrollArea component for message history
- Mock volunteer data for demonstration

## User Flow

### Accessing Volunteer Dashboard
1. Navigate to Login/Register page
2. Select "NSS Volunteer" user type
3. Enter credentials (or register as new volunteer)
4. Automatically redirected to volunteer dashboard

### Dashboard Navigation
The volunteer dashboard has three main tabs accessible via the sidebar:
- **Overview** (Home icon): Main dashboard with stats and activities
- **Digital ID** (ID Card icon): View and download digital volunteer ID
- **Volunteer Chat** (Message icon): Communicate with fellow volunteers
- **Settings** (Settings icon): Account and preferences

## Data Structure

### Volunteer Profile
```typescript
{
  id: string,              // Unique volunteer ID
  name: string,            // Full name
  email: string,           // Email address
  phone: string,           // Phone number (10 digits)
  college: string,         // College/NSS unit name
  bloodGroup: string,      // Blood group (optional)
  joinDate: string         // ISO date string
}
```

### Chat Message
```typescript
{
  id: string,              // Unique message ID
  sender: string,          // Sender's name
  senderId: string,        // Sender's volunteer ID
  message: string,         // Message content
  timestamp: Date,         // When sent
  isSelf: boolean          // Whether current user sent it
}
```

## API Integration

Currently using mock data for demonstration. In production, integrate with:

### Recommended Endpoints
- `GET /volunteers/:id` - Get volunteer profile
- `GET /volunteers/:id/activities` - Get activity history
- `GET /volunteers/:id/stats` - Get volunteer statistics
- `POST /volunteers/:id/register-camp` - Register for a health camp
- `GET /chat/messages` - Get chat messages
- `POST /chat/messages` - Send a new message
- `GET /chat/online` - Get online volunteers

## Color Scheme
- **Primary Blue**: `#0077B6` - Used for trust elements, volunteer branding
- **Accent Red**: `#E63946` - Used for blood-related elements, urgent actions
- **Success Green**: `#10B981` - Used for positive actions, status indicators
- **Warning Yellow**: `#F59E0B` - Used for pending/away status

## Responsive Design
- Mobile-first approach
- Grid layouts adapt from 1 column (mobile) to 3 columns (desktop)
- Sidebar navigation collapses on mobile
- Cards stack vertically on smaller screens
- Chat interface maintains usability across all screen sizes

## Future Enhancements
1. **Real-time Chat**: Integrate with WebSocket or Supabase Realtime
2. **Push Notifications**: Notify volunteers of new blood requests or camps
3. **Photo Upload**: Allow volunteers to upload their photo for ID card
4. **Activity Tracking**: Manual logging of volunteer hours
5. **Certificate Generation**: Auto-generate participation certificates
6. **Leaderboards**: Gamification with volunteer rankings
7. **Event Check-in**: QR code scanning for camp attendance
8. **Direct Messaging**: One-on-one chats between volunteers
9. **File Sharing**: Share documents and resources in chat
10. **Calendar Integration**: Sync volunteer activities with Google Calendar
