# PropertyCP React - Real Estate Platform

A comprehensive real estate property management platform built with React, replicating all features from the Flutter application with email/password authentication.

## 🚀 Features

### Complete Feature List
- ✅ **Authentication**: Email/password based login and registration
- ✅ **Property Management**: Browse, search, create, edit, and delete properties
- ✅ **Lead Management**: Create and track customer leads with comments
- ✅ **Favorites**: Save and manage favorite properties
- ✅ **KYC Verification**: Upload and verify KYC documents
- ✅ **Admin Panel**: Manage users and leads
- ✅ **Responsive Design**: Mobile-first, works on all screen sizes
- ✅ **In-Memory Database**: No backend required, fully functional demo

## 📦 Installation

```bash
cd propertycp-react
npm install
```

## 🎯 Running the Application

```bash
npm start
```

The application will open at `http://localhost:3000`

## 👤 Demo Accounts

### Quick Reference Table

| User Type | Email | Password | Status | Mobile | Features |
|-----------|-------|----------|--------|--------|----------|
| Agent | john@example.com | password123 | ACTIVE | 9876543210 | All features |
| Agent | jane@example.com | password123 | ACTIVE | 9876543211 | All features |
| Admin | admin@example.com | admin123 | ACTIVE | 9999999999 | All + Admin Panel |

### Agent Account 1 - John Doe
- **Email**: john@example.com
- **Password**: password123
- **Mobile**: 9876543210
- **User Type**: Agent
- **Status**: ACTIVE (KYC Verified)
- **Capabilities**:
  - Browse and search properties
  - Create and manage leads
  - Post new properties
  - Add properties to favorites
  - View and update profile
  - Full access to all features

### Agent Account 2 - Jane Smith
- **Email**: jane@example.com
- **Password**: password123
- **Mobile**: 9876543211
- **User Type**: Agent
- **Status**: ACTIVE (KYC Verified)
- **Capabilities**:
  - Browse and search properties
  - Create and manage leads
  - Post new properties
  - Add properties to favorites
  - View and update profile
  - Full access to all features

### Admin Account - Admin User
- **Email**: admin@example.com
- **Password**: admin123
- **Mobile**: 9999999999
- **User Type**: Admin
- **Status**: ACTIVE (KYC Verified)
- **Capabilities**:
  - All agent capabilities
  - View all users in the system
  - Approve/Reject KYC documents
  - Activate/Suspend user accounts
  - Delete user accounts
  - View all leads from all users
  - Access admin panel features

### Test New User Registration
To test the complete user journey from registration to activation:
1. Click "Register Now" on login screen
2. Fill in new user details:
   - Full Name: Your Name
   - Email: your-email@example.com
   - Mobile: 10-digit number
   - User Type: Agent or Buyer
   - Password: your-password
3. Login with new credentials
4. Status will be **CREATED** (limited access)
5. Navigate to Profile → Complete KYC Verification
6. Upload documents (any image files)
7. Status changes to **PENDING**
8. Login as Admin → View All Users → Select your user → Approve KYC
9. Your account status becomes **ACTIVE** (full access)

## 📱 Application Structure

```
src/
├── context/
│   ├── AuthContext.js       # Authentication state management
│   └── DataContext.js        # Data state management (properties, leads)
├── services/
│   ├── database.js           # In-memory database with sample data
│   └── mockApi.js            # Mock API service (simulates backend)
├── screens/
│   ├── AppIntro.js           # Onboarding screen
│   ├── Login.js              # Login screen
│   ├── Register.js           # Registration screen
│   ├── HomeContainer.js      # Main container with bottom navigation
│   ├── [Home screens]        # Property browsing screens
│   ├── [Lead screens]        # Lead management screens
│   ├── [Profile screens]     # User profile and settings
│   └── [Admin screens]       # Admin management screens
└── App.js                    # Main app with routing
```

## 🎨 Design System

- **UI Framework**: Material-UI (MUI) v5
- **Primary Color**: #1E88E5 (Blue)
- **Secondary Color**: #FF9800 (Orange)
- **Font**: Montserrat
- **Responsive**: Mobile-first design

## 📋 Screens Implemented

### Authentication (3 screens)
1. **App Intro** - Onboarding slides
2. **Login** - Email/password authentication
3. **Register** - User registration

### Main Application (24+ screens)
4. **HomeContainer** - Bottom navigation container
5. **Home** - Property browsing with search
6. **PropertyListing** - Filtered property list
7. **PropertyDetail** - Complete property information
8. **CreateLead** - Create new customer lead
9. **LeadScreen** - View user's leads
10. **LeadComment** - Lead details with comments
11. **Favorites** - Saved properties
12. **Profile** - User profile and settings
13. **KYC** - KYC document upload
14. **PostProperty** - Create new property (3-step wizard)
15. **PickPropertyImages** - Upload property images
16. **PickPropertyVideos** - Upload property videos
17. **EditPropertyText** - Edit property details
18. **EditPropertyImage** - Manage property images
19. **EditPropertyVideo** - Manage property videos
20. **UserList** - Admin: View all users
21. **UserDetail** - Admin: User details and actions
22. **AllLeadUsers** - Admin: Users with lead counts
23. **AdminLeadList** - Admin: User's leads

## 🔑 Key Differences from Flutter App

### Authentication
- **Flutter**: OTP-based SMS verification
- **React**: Email/password authentication

### File Storage
- **Flutter**: Firebase Storage
- **React**: Simulated with blob URLs (in-memory)

### Backend
- **Flutter**: Real C# API
- **React**: Mock API with in-memory database

## 🎯 User Journeys

### 1. New User Registration
1. Launch app → App Intro (swipe through slides)
2. Tap "Get Started" → Login Screen
3. Tap "Register Now"
4. Fill registration form:
   - Full Name
   - Email
   - Mobile Number
   - User Type (Agent/Buyer)
   - Password
   - Optional: Referral Code
5. Submit → Account created with status "CREATED"
6. Redirected to Login
7. Login → Home Container
8. Status: CREATED allows limited access
9. Complete KYC to get ACTIVE status

### 2. Property Posting Journey
1. Login as ACTIVE user
2. Bottom Navigation → "Post" tab
3. Fill Property Details:
   - Title, subtitle
   - Price, rooms, BHK
   - City, location
   - Property type, area
   - Description, contact number
4. Next → Upload Images:
   - Select main image
   - Add additional images (max 10)
5. Next → Upload Videos (optional, max 3)
6. Submit → Property created
7. Property appears in listings

### 3. Lead Creation & Follow-up
1. Browse Properties → Tap property
2. Property Detail Screen
3. Tap "Create Lead" button
4. Fill Customer Details:
   - Name, mobile number
   - Lead type (Buy/Rent/Sell)
   - Property type (if general inquiry)
5. Submit → Lead created
6. Navigate to "Leads" tab
7. View all your leads
8. Tap lead → Lead Comment Screen
9. Add follow-up comments
10. Call/WhatsApp customer
11. Update status (Open/Closed)

### 4. Search & Favorites
1. Home Screen → Enter city name
2. Select property type
3. Tap "Search"
4. View filtered results
5. Tap property → Property Detail
6. Tap heart icon → Add to favorites
7. Bottom Navigation → "Favorites" tab
8. View all saved properties
9. Tap heart again → Remove from favorites

### 5. Admin User Management
1. Login as Admin
2. Bottom Navigation → "Profile" tab
3. Admin Menu visible
4. Tap "All Users"
5. View list of all registered users
6. Search/filter users
7. Tap user → User Detail Screen
8. Review KYC documents
9. Actions:
   - Approve KYC → Status: ACTIVE
   - Reject KYC → User notified
   - Suspend Account → Status: SUSPENDED
   - Delete User

## 🔧 In-Memory Database

### Sample Data Included
- **3 Users**: 2 Agents + 1 Admin (all ACTIVE, KYC verified)
- **6 Properties**: Various types (Residential, Commercial)
- **3 Leads**: Mix of Open and Closed leads
- **Property Images**: High-quality Unsplash images

### Database Methods Available
```javascript
// Users
getAllUsers()
getUserById(id)
getUserByEmail(email)
createUser(userData)
updateUser(id, userData)
deleteUser(id)

// Properties
getAllProperties()
getPropertiesByCity(city, propertyType)
getPropertyById(id)
getPropertiesByIds(ids)
createProperty(propertyData)
updateProperty(id, propertyData)
deleteProperty(id)

// Leads
getAllLeads()
getLeadsByUserId(userId)
getLeadById(id)
createLead(leadData)
updateLead(id, leadData)
addLeadComment(leadId, comment)

// Favorites
getFavorites(userId)
addFavorite(userId, propertyId)
removeFavorite(userId, propertyId)
isFavorite(userId, propertyId)
```

## 🎨 Responsive Design Features

- **Mobile-First**: Optimized for phones (320px+)
- **Tablet Support**: Enhanced layouts for tablets (768px+)
- **Desktop Support**: Full-featured desktop experience (1024px+)
- **Touch-Friendly**: Large tap targets, swipeable carousels
- **Adaptive Navigation**: Bottom nav on mobile, side nav on desktop
- **Responsive Images**: Optimized loading and display
- **Flexible Grids**: Property cards adjust to screen size

## 📱 Screen-Specific Features

### HomeContainer (Bottom Navigation)
- **Home**: Property discovery
- **Leads**: Lead management
- **Post**: Quick property posting (ACTIVE users only)
- **Favorites**: Saved properties
- **Profile**: Settings and account

### Property Detail Screen
- Image carousel with full-screen view
- Property information (price, BHK, area, location)
- Description with read more/less
- Contact builder (call/WhatsApp)
- Create lead button
- Add to favorites
- Share property
- Edit/Delete (owner only)

### Lead Comment Screen
- Lead information card
- Customer contact details
- Comments timeline
- Add new comment
- Call/WhatsApp customer
- Change lead status (Open/Closed)

### KYC Screen
- Upload Aadhar Front
- Upload Aadhar Back
- Upload PAN Card
- Preview uploaded documents
- Submit for verification
- Status updates (CREATED → PENDING → ACTIVE)

## 🔒 User Status Flow

```
REGISTER
   ↓
CREATED (Limited access, can browse but not post)
   ↓
SUBMIT KYC
   ↓
PENDING (Awaiting admin approval)
   ↓
ADMIN APPROVES
   ↓
ACTIVE (Full access to all features)

ADMIN SUSPENDS → SUSPENDED (No access)
```

## 🛠️ Technology Stack

- **React** 18.2.0
- **React Router** 6.20.0
- **Material-UI** 5.14.20
- **Emotion** (CSS-in-JS)
- **date-fns** (Date formatting)

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "@mui/material": "^5.14.20",
  "@mui/icons-material": "^5.14.19",
  "@emotion/react": "^11.11.1",
  "@emotion/styled": "^11.11.0",
  "date-fns": "^2.30.0"
}
```

## 🚀 Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` folder.

## 🧪 Testing

```bash
npm test
```

## 📝 API Endpoints (Mock)

All endpoints return promises with standardized response:
```javascript
{
  success: boolean,
  message: string,
  data: any
}
```

### Authentication
- `login(email, password)` - Authenticate user
- `register(userData)` - Create new user

### Properties
- `getAllProperties(city, type)` - Get filtered properties
- `getPropertyById(id)` - Get single property
- `createProperty(data)` - Create new property
- `updateProperty(id, data)` - Update property
- `deleteProperty(id)` - Delete property

### Leads
- `getAllLeads()` - Get all leads (admin)
- `getLeadsByUserId(userId)` - Get user's leads
- `getLeadById(id)` - Get single lead
- `createLead(data)` - Create new lead
- `updateLead(id, data)` - Update lead
- `addLeadComment(leadId, comment)` - Add comment

### Favorites
- `getFavorites(userId)` - Get user's favorites
- `addFavorite(userId, propertyId)` - Add to favorites
- `removeFavorite(userId, propertyId)` - Remove from favorites

## 🎯 Status

### ✅ COMPLETE - Ready to Use!

**All features implemented and fully functional:**

#### Infrastructure (100%)
- ✅ Project structure and configuration
- ✅ In-memory database with sample data
- ✅ Mock API service with network simulation
- ✅ Authentication context and flow
- ✅ Data context for state management
- ✅ Protected routing system
- ✅ Responsive design system

#### Authentication Screens (100%)
- ✅ AppIntro - Beautiful onboarding
- ✅ Login - Email/password authentication
- ✅ Register - User registration with validation

#### Main Application Screens (100%)
- ✅ HomeContainer - Bottom navigation
- ✅ HomeScreen - Property browsing with search
- ✅ PropertyDetail - Complete property information
- ✅ PropertyListing - Filtered property list
- ✅ FavoriteScreen - Saved properties
- ✅ CreateLead - Lead creation form
- ✅ LeadScreen - User's leads list
- ✅ LeadComment - Lead details with comments
- ✅ ProfileScreen - User profile and settings
- ✅ PostProperty - Create property form
- ✅ KYC - Document upload and verification

#### Admin Screens (100%)
- ✅ UserList - All users management
- ✅ UserDetail - User details and actions
- ✅ AllLeadUsers - Users with lead counts
- ✅ AdminLeadList - User's leads (admin view)

#### Features (100%)
- ✅ Property search and filtering
- ✅ Favorites management
- ✅ Lead creation and tracking
- ✅ Comment system for leads
- ✅ KYC verification flow
- ✅ Admin user management
- ✅ Role-based access control
- ✅ Responsive layouts for all screens
- ✅ Form validations throughout
- ✅ Loading states and error handling

## 🎯 Quick Start Testing Guide

### Test Property Browsing Flow
1. Login with `john@example.com` / `password123`
2. Browse properties on Home screen
3. Use search to filter by city (try "Bangalore")
4. Click on a property to view details
5. Add property to favorites (heart icon)
6. Create a lead for the property

### Test Lead Management Flow
1. Navigate to "Leads" tab
2. View all your leads with statistics
3. Click on a lead to view details
4. Add follow-up comments
5. Call or WhatsApp the customer
6. Update lead status (Open/Closed)

### Test Property Posting Flow
1. Login with ACTIVE account
2. Navigate to "Post" tab
3. Fill in property details
4. Submit to create property
5. View your property in listings

### Test Admin Features
1. Login with `admin@example.com` / `admin123`
2. Navigate to Profile → "All Users"
3. View user statistics and filter users
4. Click on a user to manage their account
5. Test KYC approval workflow
6. View "All Leads" to see leads from all users

### Test KYC Verification Flow
1. Register a new user account
2. Login with new account (status: CREATED)
3. Navigate to Profile → KYC Verification
4. Upload documents (any image files)
5. Login as admin and approve KYC
6. Login as new user (status: ACTIVE)
7. Now able to post properties

## 📖 Documentation Reference

Refer to `FRONTEND_DOCUMENTATION.md` for complete Flutter app specifications that this React app replicates.

## 🤝 Contributing

This is a demo project showcasing a complete real estate platform. Feel free to extend with:
- Real backend integration
- Additional features
- Enhanced UI/UX
- Tests
- Performance optimizations

## 📄 License

MIT

---

**Created by**: PropertyCP Team
**Version**: 2.0.0 (Complete)
**Last Updated**: 2024-12-22
**Status**: ✅ Production Ready - All Features Implemented
