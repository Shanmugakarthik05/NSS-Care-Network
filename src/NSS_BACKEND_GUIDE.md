# NSS Care Network - Backend Integration Guide

## Overview

The NSS Care Network Portal now includes a fully functional Supabase backend that stores and manages:
- Blood donor registrations
- Emergency help requests
- Health camp events and registrations
- Volunteer data
- Blood requests from hospitals
- Analytics and statistics

## Getting Started

### 1. Initialize Sample Data

When you first load the application, you'll see a purple "Initialize Sample Data" button in the bottom-right corner of the screen. Click this button to populate the database with sample data including:
- 3 blood donors
- 2 upcoming health camps
- 1 emergency help request

This only needs to be done once. The button will disappear after initialization.

### 2. Explore the Features

#### Public Features (No Login Required)

**Find Blood Donors**
- Navigate to "Find Blood" in the navbar
- Select a blood group (required)
- Optionally filter by district
- Click "Search Donors" to see available donors
- Use "Show Contact" to reveal phone numbers

**Browse Health Camps**
- Navigate to "Health Camps" in the navbar
- Browse upcoming and past camps
- Apply filters by camp type and location
- Click on any camp to see details and register

**Submit Emergency Help Request**
- Navigate to "Emergency Help" in the navbar
- Fill in your details and the type of help needed
- Submit the request - it will be routed to nearby NSS units

#### Dashboard Features (Login Required)

**College Admin Dashboard**
- Login with any email/password and select "College Admin"
- View nearby emergency help requests
- See unit statistics (volunteers, donors, camps)
- Manage upcoming camps and collaboration requests

**Hospital Admin Dashboard**
- Login and select "Hospital Admin"
- Post urgent blood requests
- Manage health camps
- View NSS collaboration opportunities

**Super Admin Dashboard**
- Login and select "Super Admin"
- View national-level statistics
- See growth charts and state-wise distribution
- Approve new college/hospital registrations

## API Endpoints

The backend server provides the following API endpoints:

### Blood Donors
- `GET /donors?bloodGroup=O+&district=Mumbai` - Search donors with filters
- `POST /donors` - Register a new blood donor

### Emergency Help Requests
- `GET /help-requests?status=pending` - Get help requests
- `POST /help-requests` - Submit new help request
- `PUT /help-requests/:id` - Update request status

### Health Camps
- `GET /camps?type=Blood+Donation&upcoming=true` - Get camps with filters
- `POST /camps` - Create new camp
- `POST /camps/:id/register` - Register for a camp

### Volunteers
- `GET /volunteers?college=Mumbai+University` - Get volunteers by college
- `POST /volunteers` - Add new volunteer

### Blood Requests (Hospital)
- `GET /blood-requests?hospital=City+Hospital` - Get blood requests
- `POST /blood-requests` - Create new blood request

### Statistics
- `GET /stats` - Get dashboard statistics

## Data Storage

All data is stored in Supabase's key-value store with the following prefixes:
- `donor:*` - Blood donor records
- `help:*` - Emergency help requests
- `camp:*` - Health camp events
- `volunteer:*` - Volunteer registrations
- `bloodreq:*` - Hospital blood requests

## Adding Your Own Data

You can add data through the UI:

1. **Add Blood Donors**: Use the College Admin dashboard → "Add Donor" button
2. **Create Health Camps**: Use College/Hospital dashboard → "Create Camp" button
3. **Submit Help Requests**: Use the public "Emergency Help" page
4. **Register for Camps**: Click on any camp and use the registration form

## Technical Details

### Frontend API Client
All API calls are handled through `/utils/api.ts` which provides typed functions:
```typescript
import { donorsApi, campsApi, helpRequestsApi } from './utils/api';

// Example usage
const donors = await donorsApi.getAll({ bloodGroup: 'O+' });
const response = await campsApi.register(campId, { name, phone, email });
```

### Server Architecture
- Built with Hono web framework
- Runs on Supabase Edge Functions (Deno runtime)
- CORS enabled for all origins
- Error logging to console
- RESTful API design

### Error Handling
The application includes comprehensive error handling:
- Toast notifications for user feedback
- Console logging for debugging
- Graceful fallbacks for failed requests
- Loading states during API calls

## Production Considerations

⚠️ **Important**: This implementation is designed for prototyping and demonstration. For a production deployment:

1. **Data Privacy**: Implement proper PII encryption and access controls
2. **Authentication**: Add Supabase Auth with role-based access control
3. **Validation**: Add server-side input validation and sanitization
4. **Rate Limiting**: Implement rate limiting to prevent abuse
5. **Compliance**: Ensure HIPAA/medical data compliance for health records
6. **Monitoring**: Add error tracking and performance monitoring
7. **Backups**: Implement regular database backups

## Support

For issues or questions about the backend integration, check:
- Browser console for error messages
- Network tab for API request/response details
- Server logs in Supabase dashboard

## Future Enhancements

Potential improvements for a production system:
- User authentication with email/password
- Real-time notifications for emergency requests
- SMS alerts for urgent blood requirements
- Geolocation-based donor matching
- Photo uploads for camp posters
- Email confirmations for registrations
- Advanced analytics and reporting
- Mobile app integration
