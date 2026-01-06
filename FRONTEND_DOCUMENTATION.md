# Real Estate Flutter Frontend Documentation

## Project Overview

**Project Name:** PropertyCP - Real Estate Mobile Application
**Technology Stack:** Flutter 3.0.3+
**Platform Support:** Android & iOS
**App Version:** 1.1.0+6 (Build 6)
**State Management:** Provider Pattern
**HTTP Client:** Dio 5.2.1+1

---

## Table of Contents

1. [Environment & Configuration](#environment--configuration)
2. [Project Structure](#project-structure)
3. [Data Models](#data-models)
4. [Services & API Integration](#services--api-integration)
5. [Screens & User Flows](#screens--user-flows)
6. [Navigation & Routing](#navigation--routing)
7. [State Management](#state-management)
8. [Third-Party Integrations](#third-party-integrations)
9. [Assets & Resources](#assets--resources)

---

## Environment & Configuration

### SDK Version

```yaml
sdk: ">=3.0.3 <4.0.0"
```

### Dependencies & Versions

#### Core Dependencies
```yaml
flutter_sdk: flutter
dio: ^5.2.1+1                    # HTTP client for API calls
provider: ^6.0.5                 # State management
shared_preferences: ^2.2.0       # Local storage
```

#### UI/UX Dependencies
```yaml
google_fonts: any                # Custom fonts
flutter_svg: ^2.0.7             # SVG support
cached_network_image: any        # Image caching
carousel_slider: ^4.2.1         # Image carousels
flashy_tab_bar2: ^0.0.6         # Bottom navigation
cupertino_icons: ^1.0.2         # iOS icons
line_awesome_flutter: ^2.0.0    # Icon pack
awesome_dialog: ^3.1.0          # Alert dialogs
sn_progress_dialog: ^1.1.3      # Loading indicators
```

#### Media & File Handling
```yaml
image_picker: ^1.0.1            # Camera/Gallery access
firebase_storage: ^11.2.5       # Cloud storage
video_thumbnail: ^0.5.3         # Video thumbnails
pod_player: ^0.2.1              # Video player
gallery_image_viewer: ^1.2.0    # Image viewer
```

#### Document & PDF
```yaml
pdf: ^3.10.4                    # PDF generation
printing: ^5.11.0               # PDF printing
```

#### Utilities
```yaml
intl: ^0.18.1                   # Internationalization
timeago: ^3.4.0                 # Time formatting
url_launcher: ^6.1.11           # External URLs
share_plus: ^7.2.1              # Share functionality
whatsapp_share: ^2.0.2          # WhatsApp integration
string_validator: ^1.0.0        # Input validation
path_provider: ^2.0.15          # File paths
```

#### Firebase
```yaml
firebase_core: ^2.15.0          # Firebase initialization
firebase_storage: ^11.2.5       # Cloud storage
```

#### UI Components
```yaml
dropdown_button2: ^2.3.9        # Enhanced dropdowns
easy_autocomplete: ^1.6.0       # Autocomplete fields
otp_text_field: ^1.1.3         # OTP input
flutter_html: any               # HTML rendering
introduction_screen: ^3.1.8     # Onboarding screens
```

### Dev Dependencies
```yaml
flutter_test: flutter_test
flutter_lints: ^3.0.1
flutter_launcher_icons: ^0.13.1
flutter_native_splash: ^2.3.1
```

### API Configuration

**Base URL:** `https://13.48.104.206:7240/api`

**Endpoints:**
- Users API: `https://13.48.104.206:7240/api/users/`
- Properties API: `https://13.48.104.206:7240/api/properties/`
- Leads API: `https://13.48.104.206:7240/api/leads/`

**OTP Service:** TextLocal API
- API URL: `https://api.textlocal.in/send/`

**File:** `lib/utils/api.dart:1-11`

---

## Project Structure

```
propertycp/
├── lib/
│   ├── main.dart                    # App entry point
│   ├── firebase_options.dart        # Firebase configuration
│   ├── models/                      # Data models
│   │   ├── user_model.dart
│   │   ├── property_model.dart
│   │   ├── leads_model.dart
│   │   ├── leads_model_with_user.dart
│   │   ├── property_short_model.dart
│   │   ├── property_media.dart
│   │   ├── lead_comment_model.dart
│   │   ├── property_type_model.dart
│   │   └── list/
│   │       ├── user_list.dart
│   │       ├── property_list.dart
│   │       ├── lead_list.dart
│   │       └── lead_with_user_list.dart
│   ├── screens/                     # UI screens
│   │   ├── appIntro/
│   │   │   └── app_intro_screen.dart
│   │   ├── onboarding/
│   │   │   ├── login_screen.dart
│   │   │   └── register_screen.dart
│   │   ├── home_container/
│   │   │   └── home_container.dart
│   │   ├── home/
│   │   │   ├── home_screen.dart
│   │   │   └── home_screen_bkp.dart
│   │   ├── property_listing/
│   │   │   ├── property_listing_screen.dart
│   │   │   └── property_detail.dart
│   │   ├── leads/
│   │   │   ├── lead_screen.dart
│   │   │   ├── lead_list.dart
│   │   │   ├── create_lead.dart
│   │   │   └── lead_comment.dart
│   │   ├── adminlead/
│   │   │   ├── lead_users.dart
│   │   │   └── lead_list.dart
│   │   ├── profile/
│   │   │   ├── profile_screen.dart
│   │   │   ├── kyc/
│   │   │   │   └── kyc.dart
│   │   │   ├── post_property/
│   │   │   │   ├── post_property_screen.dart
│   │   │   │   ├── pick_propert_images.dart
│   │   │   │   └── pick_propert_video.dart
│   │   │   └── users/
│   │   │       ├── user_list.dart
│   │   │       └── user_detail.dart
│   │   ├── favourite/
│   │   │   └── favourite_screen.dart
│   │   └── edit_property/
│   │       ├── edit_property_text.dart
│   │       ├── edit_property_image.dart
│   │       └── edit_property_video.dart
│   ├── services/                    # Business logic
│   │   ├── api_service.dart         # API provider
│   │   ├── storage_service.dart     # Firebase storage
│   │   └── snakbar_service.dart     # Notifications
│   ├── utils/                       # Utilities
│   │   ├── api.dart                 # API endpoints
│   │   ├── router.dart              # Navigation routing
│   │   ├── colors.dart              # App colors
│   │   ├── theme.dart               # App theme
│   │   ├── constants.dart           # Constants
│   │   ├── enum.dart                # Enums
│   │   ├── preference_key.dart      # SharedPreferences keys
│   │   ├── helper_method.dart       # Helper functions
│   │   ├── date_time_formatter.dart # Date formatting
│   │   └── dummy.dart               # Test data
│   └── widgets/                     # Reusable widgets
│       ├── custom_image_viewer.dart
│       ├── custom_video_player.dart
│       └── video_gallery.dart
├── assets/
│   ├── logos/
│   ├── images/
│   └── svgs/
├── pubspec.yaml
└── README.md
```

---

## Data Models

### 1. UserModel

**File:** `lib/models/user_model.dart:3-162`

**Purpose:** Represents user/agent information including authentication and KYC details.

```dart
class UserModel {
  int? id;                      // Unique user identifier
  String? fullName;             // User's full name
  String? mobileNo;             // Mobile number (10 digits)
  String? email;                // Email address
  String? status;               // User status: CREATED, PENDING, ACTIVE, SUSPENDED
  String? aadharFront;          // Aadhar card front image URL
  String? aadharBack;           // Aadhar card back image URL
  String? pan;                  // PAN card image URL
  String? createdDate;          // Account creation timestamp
  String? updatedDate;          // Last update timestamp
  String? userType;             // User type: Agent, Buyer, Admin
  String? vpa;                  // UPI VPA for payments
  String? image;                // Profile image URL
  String? referralCode;         // Referral code
  bool? isKycVerified;          // KYC verification status
}
```

**Methods:**
- `toMap()` - Converts to JSON
- `fromMap(Map)` - Creates from JSON
- `copyWith()` - Creates copy with modified fields
- `toJson()` / `fromJson()` - JSON serialization

---

### 2. PropertyModel

**File:** `lib/models/property_model.dart:7-219`

**Purpose:** Represents a real estate property listing.

```dart
class PropertyModel {
  int? id;                          // Unique property identifier
  String? title;                    // Property title
  String? subTitle;                 // Property subtitle
  String? price;                    // Property price (string format)
  String? numberOfRooms;            // Total rooms count
  String? bhk;                      // Bedroom configuration (e.g., "3")
  String? location;                 // Detailed address
  String? city;                     // City name
  String? mainImage;                // Main property image URL
  List<PropertyMedia>? images;      // Collection of images/videos
  String? type;                     // Property type: Property, Commercial, Residential
  String? area;                     // Property area (string format)
  String? areaUnit;                 // Area unit: Sqft, Sqm, Acre, Hectare
  String? description;              // Property description
  String? createdDate;              // Listing creation date
  String? updatedDate;              // Last update date
  String? builderPhoneNumber;       // Builder/owner contact
}
```

**Related Models:**
- `PropertyMedia` - Images and videos for property
- `PropertyShortModel` - Simplified property model

---

### 3. LeadsModel

**File:** `lib/models/leads_model.dart:8-159`

**Purpose:** Represents customer inquiries and leads.

```dart
class LeadsModel {
  int? id;                                      // Unique lead identifier
  String? propertyType;                         // Property type interested in
  String? leadPropertyType;                     // Lead type: Buy, Rent, Sell
  String? mobileNo;                             // Customer mobile number
  String? fullName;                             // Customer name
  String? status;                               // Lead status: Open, Closed
  List<LeadCommentModel>? leadCommentModel;     // Comments/follow-ups
  String? createdDate;                          // Lead creation date
  String? updatedDate;                          // Last update date
  int? createdById;                             // ID of user who created lead
  int? propertyId;                              // Associated property ID
}
```

**Related Models:**
- `LeadsModelWithUser` - Lead with user information
- `LeadCommentModel` - Comments on leads

---

### 4. PropertyMedia

**File:** `lib/models/property_media.dart`

**Purpose:** Stores URLs for property images and videos.

```dart
class PropertyMedia {
  int? id;              // Unique identifier
  String? link;         // URL of image/video
  bool? isVideo;        // true if video, false if image
  int? propertyId;      // Associated property ID
}
```

---

### 5. LeadCommentModel

**File:** `lib/models/lead_comment_model.dart`

**Purpose:** Stores comments and follow-up notes on leads.

```dart
class LeadCommentModel {
  int? id;              // Comment ID
  String? comment;      // Comment text
  int? leadId;          // Associated lead ID
  String? createdDate;  // Comment timestamp
}
```

---

## Services & API Integration

### ApiProvider Service

**File:** `lib/services/api_service.dart:26-665`

**Purpose:** Central service for all backend API communications using Dio HTTP client.

**State Management:**
```dart
enum ApiStatus { ideal, loading, success, failed }
```

#### User Management APIs

##### 1. Create User
**Method:** `createUser(UserModel user)`
**API Endpoint:** `POST /api/users`
**Returns:** `Future<bool>`
**Screen Usage:** Register Screen

```dart
// Request body (from RegisterScreen)
{
  "fullName": "John Doe",
  "mobileNo": "9876543210",
  "email": "john@example.com",
  "status": "CREATED",
  "userType": "Agent",
  "referralCode": "REF123"
}
```

**Success Response:** User created, returns true
**Error Handling:** Shows snackbar with error message

---

##### 2. Get User by Phone
**Method:** `getUserByPhone(String phone)`
**API Endpoint:** `GET /api/users/mobileNo/{phone}`
**Returns:** `Future<UserModel?>`
**Screen Usage:** Login Screen

**Purpose:** Validates user credentials during login
**Success:** Saves user ID to SharedPreferences, returns UserModel
**Error:** Returns null

---

##### 3. Get User by ID
**Method:** `getUserById(int id)`
**API Endpoint:** `GET /api/users/{id}`
**Returns:** `Future<UserModel?>`
**Screen Usage:** Main app initialization, Profile Screen

**Purpose:** Fetches user details on app startup
**Cached:** User ID stored in SharedPreferences

---

##### 4. Update User
**Method:** `updateUser(Map<String, dynamic> user, int id)`
**API Endpoint:** `PUT /api/users/{id}`
**Returns:** `Future<bool>`
**Screen Usage:** KYC Screen, Profile Screen

```dart
// Example: Update KYC documents
{
  "aadharFront": "https://firebase-url/aadhar-front.jpg",
  "aadharBack": "https://firebase-url/aadhar-back.jpg",
  "pan": "https://firebase-url/pan.jpg",
  "isKycVerified": false,
  "status": "PENDING"
}
```

---

##### 5. Get All Users
**Method:** `getAllUsers()`
**API Endpoint:** `GET /api/users`
**Returns:** `Future<UserListModel?>`
**Screen Usage:** User List Screen (Admin), All Lead Users Screen

**Purpose:** Admin functionality to view all registered users

---

#### Property Management APIs

##### 6. Create Property
**Method:** `createProperty(PropertyModel property)`
**API Endpoint:** `POST /api/properties`
**Returns:** `Future<bool>`
**Screen Usage:** Post Property Screen

```dart
// Request body from PostPropertyScreen
{
  "title": "Luxury Apartment",
  "subTitle": "Near City Center",
  "price": "5000000",
  "numberOfRooms": "5",
  "bhk": "3",
  "location": "MG Road, Bangalore",
  "city": "Bangalore",
  "mainImage": "https://firebase-url/main.jpg",
  "images": [
    {"link": "https://firebase-url/img1.jpg", "isVideo": false},
    {"link": "https://firebase-url/video1.mp4", "isVideo": true}
  ],
  "type": "Property",
  "area": "1500",
  "areaUnit": "Sqft",
  "description": "Beautiful apartment",
  "builderPhoneNumber": "9876543210"
}
```

---

##### 7. Get All Properties by City and Type
**Method:** `getAllProperties(String city, String propertyType)`
**API Endpoint:** `GET /api/properties/city/?city={city}&propertyType={type}`
**Returns:** `Future<PropertyListModel?>`
**Screen Usage:** Property Listing Screen, Home Screen

**Example Call:**
```dart
apiProvider.getAllProperties("Bangalore", "Property")
```

---

##### 8. Get Property by ID
**Method:** `getPropertyById(int id)`
**API Endpoint:** `GET /api/properties/{id}`
**Returns:** `Future<PropertyModel?>`
**Screen Usage:** Property Detail Screen

**Purpose:** Fetches complete property details including images and videos

---

##### 9. Update Property
**Method:** `updatePropety(Map<String, dynamic> property, int id)`
**API Endpoint:** `PUT /api/properties/{id}`
**Returns:** `Future<bool>`
**Screen Usage:** Edit Property Text/Image/Video Screens

**Use Cases:**
- Update property details
- Add/remove images
- Add/remove videos

---

##### 10. Delete Property
**Method:** `deletePropety(int id)`
**API Endpoint:** `DELETE /api/properties/{id}`
**Returns:** `Future<bool>`
**Screen Usage:** Property Detail Screen (Owner)

---

##### 11. Get Multiple Properties (Favorites)
**Method:** `getAllFavProperties(List<int> ids)`
**API Endpoint:** `POST /api/properties/get-multiple`
**Returns:** `Future<PropertyListModel?>`
**Screen Usage:** Favourite Screen

```dart
// Request body
{
  "ids": [1, 5, 8, 12, 15]
}
```

**Purpose:** Fetches all favorited properties in one API call

---

#### Lead Management APIs

##### 12. Create Lead
**Method:** `createLead(LeadsModel lead)`
**API Endpoint:** `POST /api/leads`
**Returns:** `Future<bool>`
**Screen Usage:** Create Lead Screen

```dart
// Request body from CreateLeadScreen
{
  "leadPropertyType": "Buy",
  "propertyType": "Residential",
  "mobileNo": "9876543210",
  "fullName": "Jane Smith",
  "status": "Open",
  "createdById": 5,
  "propertyId": 10
}
```

---

##### 13. Get All Leads by User
**Method:** `getAllLeadsByUserId(int userId)`
**API Endpoint:** `GET /api/leads/createdby/{userId}`
**Returns:** `Future<LeadListModel?>`
**Screen Usage:** Lead List Screen

**Purpose:** Shows all leads created by the logged-in user

---

##### 14. Get Lead by ID
**Method:** `getLeadsById(int leadId)`
**API Endpoint:** `GET /api/leads/{id}`
**Returns:** `Future<LeadsModel?>`
**Screen Usage:** Lead Comment Screen

**Purpose:** Fetches lead details with comments for follow-up

---

##### 15. Update Lead
**Method:** `updateLead(Map<String, dynamic> lead, int id)`
**API Endpoint:** `PUT /api/leads/{id}`
**Returns:** `Future<bool>`
**Screen Usage:** Lead Comment Screen

**Use Cases:**
- Add comments to leads
- Change lead status (Open/Closed)
- Update lead information

---

##### 16. Get All Leads (Admin)
**Method:** `getAllLeads()`
**API Endpoint:** `GET /api/leads`
**Returns:** `Future<Map<UserModel, int>?>`
**Screen Usage:** All Lead Users Screen (Admin)

**Purpose:** Admin view showing all leads grouped by users
**Returns:** Map of users with their lead counts

---

#### OTP Service

##### 17. Send OTP
**Method:** `sendOtp(String phone, String otp)`
**API Endpoint:** External - `https://api.textlocal.in/send/`
**Returns:** `Future<bool>`
**Screen Usage:** Login Screen, Register Screen

**Purpose:** Sends OTP via SMS for phone verification

---

### StorageProvider Service

**File:** `lib/services/storage_service.dart`

**Purpose:** Manages file uploads to Firebase Storage.

**Methods:**
- `uploadImage(File image, String path)` - Uploads image to Firebase
- `uploadVideo(File video, String path)` - Uploads video to Firebase
- `deleteFile(String url)` - Deletes file from Firebase

**Usage:**
- KYC document uploads (Aadhar, PAN)
- Property images upload
- Property videos upload
- Profile picture upload

---

### SnackBarService

**File:** `lib/services/snakbar_service.dart`

**Purpose:** Displays toast messages and notifications.

**Methods:**
- `showSnackBarSuccess(String message)` - Success messages
- `showSnackBarError(String message)` - Error messages
- `showSnackBarInfo(String message)` - Info messages

---

## Screens & User Flows

### 1. App Intro Screen

**File:** `lib/screens/appIntro/app_intro_screen.dart`
**Route:** `/appIntro`

**Purpose:** First-time onboarding experience showing app features.

**Features:**
- Swipeable introduction slides
- Skip button to jump to login
- Uses `introduction_screen` package

**API Calls:** None

**Navigation:**
- First Launch → App Intro
- Skip/Done → Login Screen

**SharedPreferences:**
- Sets `firstTimeAppOpen: false` after viewing

---

### 2. Login Screen

**File:** `lib/screens/onboarding/login_screen.dart`
**Route:** `/login`

**Purpose:** User authentication via phone number and OTP.

**UI Components:**
- Phone number input field (10 digits)
- OTP input field (6 digits)
- Send OTP button
- Verify OTP button
- Register link

**User Flow:**
1. Enter 10-digit mobile number
2. Tap "Send OTP"
3. Receive SMS with 6-digit OTP
4. Enter OTP in the field
5. Tap "Verify"
6. If user exists and verified → Home Container
7. If user not found → Register Screen
8. If user pending verification → Show message

**API Calls:**
1. `sendOtp(phone, otp)` - Send OTP via SMS
2. `getUserByPhone(phone)` - Verify user credentials

**Validations:**
- Phone number: Exactly 10 digits
- OTP: Exactly 6 digits
- Validates user status (ACTIVE, PENDING, SUSPENDED)

**Navigation Targets:**
- Success → Home Container
- New User → Register Screen
- Pending/Suspended → Shows error, stays on login

---

### 3. Register Screen

**File:** `lib/screens/onboarding/register_screen.dart`
**Route:** `/register`

**Purpose:** New user registration with basic details.

**UI Components:**
- Full Name input
- Phone number (pre-filled from login)
- Email input
- Referral code input (optional)
- User Type dropdown (Agent/Buyer)
- Register button

**User Flow:**
1. Enter full name
2. Verify pre-filled phone number
3. Enter email address
4. Enter referral code (optional)
5. Select user type
6. Tap "Register"
7. Account created with CREATED status
8. Redirected to Login → KYC Screen

**API Calls:**
1. `createUser(userModel)` - Creates new user account

**Validations:**
- Name: Required, min 3 characters
- Email: Valid email format
- Phone: Already validated in login

**Default Values:**
- Status: "CREATED"
- isKycVerified: false

**Navigation:**
- Success → Login Screen (then to KYC)
- Cancel → Back to Login

---

### 4. Home Container

**File:** `lib/screens/home_container/home_container.dart`
**Route:** `/home`

**Purpose:** Main container with bottom navigation bar.

**Bottom Navigation Tabs:**
1. **Home** - Property browsing
2. **Leads** - Lead management
3. **Post** - Add new property
4. **Favorites** - Saved properties
5. **Profile** - User settings

**Features:**
- Flashy tab bar with icons
- Maintains state across tabs
- Conditional rendering based on user type

**Special Routes:**
- Admin users see additional options in Profile tab

**API Calls:** None (container only)

---

### 5. Home Screen

**File:** `lib/screens/home/home_screen.dart`
**Route:** N/A (Tab 0 in Home Container)

**Purpose:** Main property discovery and search interface.

**UI Sections:**

#### Header
- Welcome message with user name
- Notification icon

#### Search Section
- City autocomplete field
- Property type dropdown (Property/Commercial/Residential)
- Search button

#### Featured Properties Carousel
- Horizontal scrolling property cards
- Shows: Image, Title, Price, Location
- Tap to view details

#### Recent Properties List
- Vertical list of property cards
- Shows: Image, Title, Price, BHK, Location
- Create Lead button
- View Details button

**User Flow:**
1. User enters city name (autocomplete)
2. Selects property type from dropdown
3. Taps Search
4. Views filtered properties
5. Can scroll through carousel
6. Tap property card → Property Detail Screen
7. Tap "Create Lead" → Create Lead Screen

**API Calls:**
1. `getAllProperties(city, propertyType)` - Load properties on search
2. Initial load shows all properties for default city

**Features:**
- Real-time search
- Property type filtering
- Image caching for performance
- Pull-to-refresh

**Navigation Targets:**
- Property Card → Property Detail Screen
- Create Lead Button → Create Lead Screen
- Search → Filtered results in same screen

---

### 6. Property Listing Screen

**File:** `lib/screens/property_listing/property_listing_screen.dart`
**Route:** `/propertyListing`

**Purpose:** Shows filtered list of properties based on search criteria.

**Parameters:**
- `city` (String)
- `propertyType` (String)

**UI Components:**
- AppBar with filters
- Grid/List view toggle
- Property cards with:
  - Main image
  - Title & subtitle
  - Price
  - BHK, Area
  - Location
  - View Details button

**User Flow:**
1. Navigate from Home Screen after search
2. View list of matching properties
3. Toggle between grid/list view
4. Tap property → Property Detail Screen

**API Calls:**
1. `getAllProperties(city, propertyType)` - Loads on screen open

**Features:**
- Grid/List view options
- Sort by price/date
- Empty state when no properties found

---

### 7. Property Detail Screen

**File:** `lib/screens/property_listing/property_detail.dart`
**Route:** `/propertyDetail`

**Purpose:** Complete property information with images, videos, and actions.

**Parameters:**
- `propertyId` (int)

**UI Sections:**

#### Image Gallery
- Main image carousel
- Thumbnail strip
- Full-screen image viewer
- Video player for property videos

#### Property Information
- Title & Subtitle
- Price (large, prominent)
- BHK & Number of rooms
- Area with unit (Sqft/Sqm/Acre/Hectare)
- Property type badge
- Location with city

#### Description
- Full property description
- Read more/less functionality

#### Contact Section
- Builder phone number
- Call button (url_launcher)
- WhatsApp button (whatsapp_share)

#### Action Buttons
- **Favorite** - Toggle favorite (stored locally)
- **Create Lead** - Open Create Lead screen
- **Share** - Share property via share_plus
- **Edit** (Owner only) - Edit property details
- **Delete** (Owner only) - Delete property

**User Flow:**
1. Navigate from listing/home
2. View all property details
3. Scroll through images/videos
4. Read description
5. Contact builder via call/WhatsApp
6. Create lead if interested
7. Add to favorites
8. Share with others

**API Calls:**
1. `getPropertyById(propertyId)` - Loads property details
2. `deletePropety(propertyId)` - If owner deletes

**Features:**
- Image zoom functionality
- Video playback
- Share property link
- Call/WhatsApp integration
- Favorite management (SharedPreferences)

**Navigation Targets:**
- Edit Button → Edit Property Text Screen
- Create Lead → Create Lead Screen
- Image Gallery → Custom Image Viewer
- Video → Custom Video Player
- Call/WhatsApp → External apps

---

### 8. Create Lead Screen

**File:** `lib/screens/leads/create_lead.dart`
**Route:** `/createLead`

**Purpose:** Create a new lead for a property or general inquiry.

**Parameters:**
- `propertyShortModel` (PropertyShortModel) - Optional

**UI Components:**
- Property details card (if from property)
- Customer name input
- Customer phone input
- Lead type dropdown (Buy/Rent/Sell)
- Property type dropdown (if not from property)
- Submit button

**User Flow:**
1. From Property Detail OR manual entry
2. If from property, details pre-filled
3. Enter customer name
4. Enter customer phone (10 digits)
5. Select lead type (Buy/Rent/Sell)
6. Select property type if general lead
7. Tap Submit
8. Lead created with status "Open"
9. Navigate back with success message

**API Calls:**
1. `createLead(leadsModel)` - Creates new lead

**Form Data:**
```dart
{
  "fullName": "Jane Smith",
  "mobileNo": "9876543210",
  "leadPropertyType": "Buy",
  "propertyType": "Residential",
  "status": "Open",
  "createdById": currentUserId,
  "propertyId": propertyId (if from property)
}
```

**Validations:**
- Name: Required
- Phone: 10 digits, required
- Lead type: Required
- Property type: Required if not from specific property

**Navigation:**
- Success → Back to previous screen
- Cancel → Back without saving

---

### 9. Lead Screen (My Leads)

**File:** `lib/screens/leads/lead_screen.dart`
**Route:** N/A (Tab 1 in Home Container)

**Purpose:** View and manage leads created by the logged-in user.

**UI Components:**
- AppBar with "My Leads" title
- Search bar for leads
- Lead count badge
- List of lead cards showing:
  - Customer name
  - Phone number
  - Lead type
  - Property type
  - Status badge (Open/Closed)
  - Created date (timeago format)
  - Tap to view comments

**User Flow:**
1. Navigate from bottom navigation
2. View all personal leads
3. Search leads by name/phone
4. Tap lead → Lead Comment Screen
5. Pull to refresh

**API Calls:**
1. `getAllLeadsByUserId(userId)` - Loads user's leads
2. Called on screen init and refresh

**Features:**
- Real-time search
- Status color coding (Open=green, Closed=gray)
- Time ago formatting ("2 hours ago")
- Pull-to-refresh
- Empty state when no leads

**Navigation Targets:**
- Lead Card → Lead Comment Screen

---

### 10. Lead List Screen

**File:** `lib/screens/leads/lead_list.dart`
**Route:** N/A (Sub-screen of Lead Screen)

**Purpose:** Alternative view showing leads in list format.

Similar to Lead Screen but with different layout.

---

### 11. Lead Comment Screen

**File:** `lib/screens/leads/lead_comment.dart`
**Route:** `/leadComment`

**Purpose:** View lead details and add follow-up comments.

**Parameters:**
- `leadId` (int)

**UI Sections:**

#### Lead Information Card
- Customer name
- Phone number with call button
- Lead type badge
- Property type badge
- Status badge
- Created date
- Associated property (if any)

#### Comments Section
- List of all comments
- Each comment shows:
  - Comment text
  - Timestamp (timeago)
  - Commenter name (if multi-user)

#### Add Comment Section
- Text input field
- Character counter
- Add Comment button

#### Actions
- **Call Customer** - Opens dialer
- **WhatsApp Customer** - Opens WhatsApp
- **Mark as Closed** - Updates status to "Closed"
- **Reopen Lead** - Updates status to "Open"

**User Flow:**
1. Navigate from Lead Screen
2. View complete lead information
3. Read existing comments
4. Add new comment
5. Call/WhatsApp customer
6. Change lead status if needed
7. Back to Lead Screen

**API Calls:**
1. `getLeadsById(leadId)` - Loads lead with comments
2. `updateLead(updatedLead, leadId)` - Adds comment or changes status

**Comment Submission:**
```dart
{
  "id": leadId,
  "leadCommentModel": [
    ...existingComments,
    {
      "comment": "Customer interested, scheduling visit",
      "leadId": leadId,
      "createdDate": DateTime.now()
    }
  ]
}
```

**Features:**
- Comment history
- Status management
- Quick contact actions
- Auto-refresh after update

---

### 12. All Lead Users Screen (Admin)

**File:** `lib/screens/adminlead/lead_users.dart`
**Route:** `/allLeadUsers`

**Purpose:** Admin view showing all users with their lead counts.

**Access:** Admin users only

**UI Components:**
- AppBar with "All Lead Users"
- Search bar for users
- List of user cards showing:
  - User profile image
  - Full name
  - Email
  - Phone number
  - Lead count badge
  - Tap to view user's leads

**User Flow:**
1. Navigate from Profile (Admin only)
2. View all registered users
3. See lead count for each user
4. Search users by name/email
5. Tap user → Admin Lead List Screen

**API Calls:**
1. `getAllLeads()` - Returns Map<UserModel, leadCount>

**Features:**
- User search functionality
- Lead count display
- User profile pictures
- Sort by lead count
- Empty state

**Navigation Targets:**
- User Card → Admin Lead List Screen

---

### 13. Admin Lead List Screen

**File:** `lib/screens/adminlead/lead_list.dart`
**Route:** `/adminLeadList`

**Purpose:** Admin view of all leads created by a specific user.

**Parameters:**
- `userId` (int)

**UI Components:**
- AppBar with user name
- Lead statistics summary
- Filter options (Open/Closed/All)
- List of leads identical to Lead Screen
- Admin actions on leads

**User Flow:**
1. Navigate from All Lead Users Screen
2. View selected user's leads
3. Filter by status
4. View lead details
5. Take admin actions if needed

**API Calls:**
1. `getAllLeadsByUserId(userId)` - Loads user's leads

**Admin Actions:**
- View all lead details
- Add admin comments
- Mark leads for review
- Export lead data

---

### 14. Favourite Screen

**File:** `lib/screens/favourite/favourite_screen.dart`
**Route:** N/A (Tab 3 in Home Container)

**Purpose:** View and manage saved/favorited properties.

**UI Components:**
- AppBar with "Favorites" title
- Count of favorited properties
- Grid/List view toggle
- Property cards similar to Property Listing
- Remove from favorites button

**User Flow:**
1. Navigate from bottom navigation
2. View all favorited properties
3. Tap property → Property Detail Screen
4. Remove properties from favorites
5. Empty state when no favorites

**API Calls:**
1. `getAllFavProperties(ids)` - Loads all favorited properties

**Data Storage:**
- Favorite IDs stored in SharedPreferences
- Key: `favorite_properties`
- Value: List<int> of property IDs

**Features:**
- Local storage of favorites
- Batch fetch from API
- Quick remove from favorites
- Empty state with call-to-action
- Pull-to-refresh

**Navigation Targets:**
- Property Card → Property Detail Screen

---

### 15. Profile Screen

**File:** `lib/screens/profile/profile_screen.dart`
**Route:** N/A (Tab 4 in Home Container)

**Purpose:** User account management and app settings.

**UI Sections:**

#### User Profile Header
- Profile image
- Full name
- Email
- Phone number
- KYC status badge
- Edit profile button

#### Menu Options

**For All Users:**
- **KYC Verification** → KYC Screen
- **My Properties** → User's posted properties
- **Edit Profile** → Edit user details
- **Share App** → Share download link
- **Rate App** → Open Play Store/App Store
- **About Us** → App information
- **Privacy Policy** → Web view
- **Terms & Conditions** → Web view
- **Logout** → Clear data, go to Login

**For Admin Users:**
- **All Users** → User List Screen
- **All Leads** → All Lead Users Screen
- **System Reports** → Analytics (if implemented)

#### KYC Status Indicator
- **Not Verified** (Red badge) → KYC incomplete
- **Pending** (Yellow badge) → KYC under review
- **Verified** (Green badge) → KYC approved

**User Flow:**
1. Navigate from bottom navigation
2. View profile information
3. Check KYC status
4. Access various settings
5. Navigate to sub-screens
6. Logout when needed

**API Calls:**
1. `getUserById(userId)` - Refreshes user data
2. Called on screen focus

**Features:**
- Profile image display
- KYC status indicator
- Dynamic menu (admin vs regular user)
- Share app functionality
- App version display

**Navigation Targets:**
- KYC → KYC Screen
- My Properties → User's property list
- All Users → User List Screen (Admin)
- All Leads → All Lead Users Screen (Admin)

---

### 16. KYC Screen

**File:** `lib/screens/profile/kyc/kyc.dart`
**Route:** `/kyc`

**Purpose:** Upload KYC documents for verification.

**UI Components:**

#### Document Upload Sections
1. **Aadhar Card Front**
   - Image picker
   - Preview uploaded image
   - Upload to Firebase button
   - Status indicator

2. **Aadhar Card Back**
   - Image picker
   - Preview uploaded image
   - Upload to Firebase button
   - Status indicator

3. **PAN Card**
   - Image picker
   - Preview uploaded image
   - Upload to Firebase button
   - Status indicator

#### Submission
- Submit for Verification button
- Terms & conditions checkbox

**User Flow:**
1. Navigate from Profile or post-registration
2. Tap "Upload Aadhar Front"
3. Choose from camera/gallery
4. Preview selected image
5. Upload to Firebase Storage
6. Repeat for Aadhar Back and PAN
7. Check terms checkbox
8. Tap "Submit for Verification"
9. User status changes to "PENDING"
10. Wait for admin approval

**API Calls:**
1. `uploadImage()` (Storage Service) - Upload each document to Firebase
2. `updateUser()` - Update user with document URLs

**Update Data:**
```dart
{
  "aadharFront": "https://firebase-url/user123/aadhar-front.jpg",
  "aadharBack": "https://firebase-url/user123/aadhar-back.jpg",
  "pan": "https://firebase-url/user123/pan.jpg",
  "status": "PENDING",
  "isKycVerified": false
}
```

**Validations:**
- All three documents required
- Image size limits
- Accepted formats: JPG, PNG

**Features:**
- Image compression before upload
- Upload progress indicator
- Preview before submit
- Firebase Storage integration

**Navigation:**
- Success → Back to Profile
- Documents will be reviewed by admin

---

### 17. Post Property Screen

**File:** `lib/screens/profile/post_property/post_property_screen.dart`
**Route:** `/postProperty`

**Purpose:** Create new property listing.

**UI Sections:**

#### Basic Information
- Property title input
- Subtitle input
- Price input (numeric)
- Number of rooms input
- BHK input
- Property type dropdown
- Area input with unit selector

#### Location
- City autocomplete
- Location/Address input

#### Description
- Multi-line text input
- Character limit indicator (500 chars)

#### Contact
- Builder/Owner phone number

#### Media (Next Steps)
- Navigate to Image Picker
- Navigate to Video Picker

**User Flow - Multi-Step:**

**Step 1: Property Details**
1. Navigate from bottom navigation "Post" tab
2. Fill in property title
3. Enter subtitle
4. Enter price
5. Enter room details (total rooms, BHK)
6. Select property type
7. Enter area and select unit
8. Enter city and location
9. Add description
10. Enter contact number
11. Tap "Next"
12. Navigate to Pick Property Images

**Step 2: Add Images**
→ See Pick Property Images Screen

**Step 3: Add Videos**
→ See Pick Property Videos Screen

**Final Submission**
- Creates property with all data
- Uploads to backend

**API Calls:**
1. `createProperty(propertyModel)` - Called after all steps complete

**Validations:**
- Title: Required, 10-100 characters
- Price: Required, numeric, > 0
- Rooms: Required, numeric
- BHK: Required
- City: Required
- Location: Required
- Description: Max 500 characters
- Phone: 10 digits

**Features:**
- Form state preservation
- Step-by-step wizard
- Input validation
- Auto-save draft (optional)

**Navigation:**
- Next → Pick Property Images
- Cancel → Discard and go back

---

### 18. Pick Property Images

**File:** `lib/screens/profile/post_property/pick_propert_images.dart`
**Route:** `/pickPropertyImages`

**Purpose:** Select and upload property images.

**Parameters:**
- `propertyModel` (PropertyModel) - From previous step

**UI Components:**
- Preview grid of selected images
- Main image selector (required)
- Additional images selector (max 10)
- Upload progress indicator
- Next button

**User Flow:**
1. Arrive from Post Property Screen
2. Tap "Select Main Image"
3. Choose from gallery/camera
4. Preview main image
5. Tap "Add More Images"
6. Select multiple images
7. Preview all images in grid
8. Reorder images if needed
9. Delete unwanted images
10. Tap "Next"
11. Images upload to Firebase
12. Navigate to Pick Property Videos

**Storage Service Usage:**
```dart
// Upload main image
String mainImageUrl = await StorageProvider.uploadImage(
  mainImage,
  'properties/${propertyId}/main.jpg'
);

// Upload additional images
for (var image in images) {
  String url = await StorageProvider.uploadImage(
    image,
    'properties/${propertyId}/image_${index}.jpg'
  );
}
```

**Features:**
- Multi-image selection
- Image compression
- Upload progress
- Image reordering
- Delete images
- Preview before upload

**Validations:**
- Main image: Required
- Additional images: 0-10 images
- File size: Max 5MB per image
- Format: JPG, PNG

**Navigation:**
- Back → Post Property Screen (data saved)
- Next → Pick Property Videos

---

### 19. Pick Property Videos

**File:** `lib/screens/profile/post_property/pick_propert_video.dart`
**Route:** `/pickPropertyVideos`

**Purpose:** Select and upload property videos.

**Parameters:**
- `propertyModel` (PropertyModel) - From previous step

**UI Components:**
- Video thumbnail previews
- Add video button (max 3)
- Upload progress indicator
- Video player for preview
- Submit button

**User Flow:**
1. Arrive from Pick Property Images
2. Tap "Add Video"
3. Choose from gallery/camera
4. Preview video
5. Add more videos if needed (max 3)
6. Review all videos
7. Delete unwanted videos
8. Tap "Submit"
9. Videos upload to Firebase
10. Property created with all data
11. Success message
12. Navigate to Home

**Storage Service Usage:**
```dart
// Upload videos
for (var video in videos) {
  String url = await StorageProvider.uploadVideo(
    video,
    'properties/${propertyId}/video_${index}.mp4'
  );
}
```

**Final Property Submission:**
```dart
PropertyModel completeProperty = {
  // From Step 1
  "title": "Luxury Apartment",
  "price": "5000000",
  // ... other details

  // From Step 2
  "mainImage": mainImageUrl,
  "images": [
    {"link": imageUrl1, "isVideo": false},
    {"link": imageUrl2, "isVideo": false},
    // ...
  ],

  // From Step 3
  "images": [
    ... previous images,
    {"link": videoUrl1, "isVideo": true},
    {"link": videoUrl2, "isVideo": true}
  ]
};

await apiProvider.createProperty(completeProperty);
```

**Features:**
- Video preview playback
- Thumbnail generation
- Upload progress
- Video compression (optional)
- Delete videos

**Validations:**
- Optional (0-3 videos)
- Max size: 50MB per video
- Format: MP4, MOV

**Navigation:**
- Back → Pick Property Images (data saved)
- Submit → Home Screen (success)

---

### 20. User List Screen (Admin)

**File:** `lib/screens/profile/users/user_list.dart`
**Route:** `/userList`

**Purpose:** Admin interface to view and manage all users.

**Access:** Admin users only

**UI Components:**
- Search bar
- Filter options (All/Verified/Pending/Suspended)
- User list with cards showing:
  - Profile image
  - Full name
  - Email
  - Phone
  - User type badge
  - KYC status badge
  - Tap for details

**User Flow:**
1. Navigate from Profile (Admin)
2. View all registered users
3. Search users
4. Filter by status
5. Tap user → User Detail Screen
6. Pull to refresh

**API Calls:**
1. `getAllUsers()` - Loads all users

**Features:**
- Search by name/email/phone
- Status filtering
- Sort options
- User count display
- Export user list (if implemented)

**Navigation Targets:**
- User Card → User Detail Screen

---

### 21. User Detail Screen (Admin)

**File:** `lib/screens/profile/users/user_detail.dart`
**Route:** `/userDetail`

**Purpose:** View and manage individual user details.

**Parameters:**
- `userId` (int)

**UI Sections:**

#### User Information
- Profile image
- Full name
- Email
- Phone number
- User type
- KYC status
- Registration date
- Last updated

#### KYC Documents (If submitted)
- View Aadhar front
- View Aadhar back
- View PAN card
- Download buttons

#### User Statistics
- Total properties posted
- Total leads created
- Account status

#### Admin Actions
- **Approve KYC** - Verify documents
- **Reject KYC** - Request resubmission
- **Activate Account** - Change status to ACTIVE
- **Suspend Account** - Change status to SUSPENDED
- **Delete User** - Remove from system

**User Flow:**
1. Navigate from User List
2. View complete user profile
3. Review KYC documents
4. Check user activity
5. Take admin action
6. Update user status
7. Back to User List

**API Calls:**
1. `getUserById(userId)` - Load user details
2. `updateUser()` - Update user status after admin action

**Admin Actions Data:**

**Approve KYC:**
```dart
{
  "id": userId,
  "status": "ACTIVE",
  "isKycVerified": true
}
```

**Suspend Account:**
```dart
{
  "id": userId,
  "status": "SUSPENDED"
}
```

**Features:**
- Full KYC document viewer
- Activity timeline
- Status change with confirmation
- Audit log (if implemented)

---

### 22. Edit Property Text Screen

**File:** `lib/screens/edit_property.dart/edit_property_text.dart`
**Route:** `/editPropertyText`

**Purpose:** Edit text details of existing property.

**Parameters:**
- `propertyId` (int)

**Editable Fields:**
- Title
- Subtitle
- Price
- Number of rooms
- BHK
- City
- Location
- Area
- Area unit
- Description
- Builder phone number

**User Flow:**
1. Navigate from Property Detail (owner only)
2. Edit desired fields
3. Tap "Save Changes"
4. Property updated
5. Success message
6. Back to Property Detail

**API Calls:**
1. `getPropertyById(propertyId)` - Load current data
2. `updatePropety(updatedData, propertyId)` - Save changes

**Features:**
- Pre-filled form with current data
- Real-time validation
- Unsaved changes warning

---

### 23. Edit Property Images Screen

**File:** `lib/screens/edit_property.dart/edit_property_image.dart`
**Route:** `/editPropertyImage`

**Purpose:** Manage property images (add/remove).

**Parameters:**
- `propertyId` (int)

**UI Components:**
- Current images grid
- Add new images button
- Delete image buttons
- Change main image option
- Save button

**User Flow:**
1. Navigate from Property Detail
2. View current images
3. Delete unwanted images
4. Add new images
5. Select new main image
6. Tap "Save"
7. Images updated

**API Calls:**
1. `getPropertyById(propertyId)` - Load current images
2. Upload new images to Firebase
3. `updatePropety()` - Update image URLs

---

### 24. Edit Property Videos Screen

**File:** `lib/screens/edit_property.dart/edit_property_video.dart`
**Route:** `/editPropertyVideo`

**Purpose:** Manage property videos (add/remove).

**Parameters:**
- `propertyId` (int)

**UI Components:**
- Current videos list with thumbnails
- Add new video button
- Delete video buttons
- Video player for preview
- Save button

**User Flow:**
1. Navigate from Property Detail
2. View current videos
3. Delete unwanted videos
4. Add new videos
5. Preview videos
6. Tap "Save"
7. Videos updated

**API Calls:**
1. `getPropertyById(propertyId)` - Load current videos
2. Upload new videos to Firebase
3. `updatePropety()` - Update video URLs

---

### 25. Custom Image Viewer

**File:** `lib/widgets/custom_image_viewer.dart`
**Route:** `/imageViewer`

**Purpose:** Full-screen image viewer with zoom and swipe.

**Parameters:**
- `links` (List<String>) - Image URLs

**Features:**
- Full-screen display
- Pinch to zoom
- Swipe between images
- Image counter (1 of 5)
- Share image option
- Download image option

---

### 26. Custom Video Player

**File:** `lib/widgets/custom_video_player.dart`
**Route:** `/videoPlayer`

**Purpose:** Full-screen video player.

**Parameters:**
- `videoUrl` (String)

**Features:**
- Full-screen playback
- Play/pause controls
- Progress bar
- Volume control
- Fullscreen toggle

---

### 27. Video Gallery

**File:** `lib/widgets/video_gallery.dart`
**Route:** `/videoGallery`

**Purpose:** Browse and play multiple property videos.

**Parameters:**
- `videos` (List<PropertyMedia>)

**Features:**
- Video thumbnail grid
- Tap to play in full screen
- Video information overlay

---

## Navigation & Routing

### Router Configuration

**File:** `lib/utils/router.dart:29-139`

The app uses named route navigation with the `NavRoute.generatedRoute` method.

### Route Definitions

| Screen Name | Route Path | Parameters |
|------------|-----------|-----------|
| App Intro | `/appIntro` | None |
| Login | `/login` | None |
| Register | `/register` | None |
| Home Container | `/home` | None |
| Property Listing | `/propertyListing` | List<String?> params |
| Property Detail | `/propertyDetail` | int propertyId |
| Create Lead | `/createLead` | PropertyShortModel |
| Lead Comment | `/leadComment` | int leadId |
| KYC | `/kyc` | None |
| All Lead Users | `/allLeadUsers` | None |
| Admin Lead List | `/adminLeadList` | int userId |
| Post Property | `/postProperty` | None |
| Pick Images | `/pickPropertyImages` | PropertyModel |
| Pick Videos | `/pickPropertyVideos` | PropertyModel |
| User List | `/userList` | None |
| User Detail | `/userDetail` | int userId |
| Edit Property Text | `/editPropertyText` | int propertyId |
| Edit Property Image | `/editPropertyImage` | int propertyId |
| Edit Property Video | `/editPropertyVideo` | int propertyId |
| Custom Image Viewer | `/imageViewer` | List<String> links |
| Custom Video Player | `/videoPlayer` | String videoUrl |
| Video Gallery | `/videoGallery` | List<PropertyMedia> |

### Navigation Examples

```dart
// Navigate to Property Detail
Navigator.pushNamed(
  context,
  PropertyDetailScreen.routePath,
  arguments: propertyId
);

// Navigate to Create Lead with property
Navigator.pushNamed(
  context,
  CreateLead.routePath,
  arguments: propertyShortModel
);

// Navigate with replacement (Login to Home)
Navigator.pushReplacementNamed(
  context,
  HomeContainer.routePath
);

// Navigate and clear stack
Navigator.pushNamedAndRemoveUntil(
  context,
  LoginScreen.routePath,
  (route) => false
);
```

---

## State Management

### Provider Pattern

**Implementation:** The app uses the Provider package for state management.

**Providers:**

#### 1. ApiProvider
**File:** `lib/services/api_service.dart`

**Purpose:** Manages all API calls and loading states.

**State Properties:**
- `status` - Current API status (ideal, loading, success, failed)

**Usage:**
```dart
// In main.dart
MultiProvider(
  providers: [
    ChangeNotifierProvider(create: (context) => ApiProvider()),
  ]
)

// In screens
final apiProvider = Provider.of<ApiProvider>(context);
apiProvider.getAllProperties(city, type);

// Listen to status
if (apiProvider.status == ApiStatus.loading) {
  // Show loading indicator
}
```

#### 2. StorageProvider
**File:** `lib/services/storage_service.dart`

**Purpose:** Manages Firebase Storage operations.

**State Properties:**
- Upload progress tracking
- File upload status

---

### Local State Management

**SharedPreferences Keys:**
**File:** `lib/utils/preference_key.dart`

```dart
class SharedpreferenceKey {
  static const String firstTimeAppOpen = 'firstTimeAppOpen';
  static const String userId = 'userId';
  static const String favoriteProperties = 'favorite_properties';

  static int getUserId() {
    return prefs.getInt(userId) ?? 0;
  }
}
```

**Usage:**
```dart
// Save user ID on login
prefs.setInt(SharedpreferenceKey.userId, userModel.id);

// Get user ID
int userId = SharedpreferenceKey.getUserId();

// Save favorites
List<int> favorites = [1, 5, 8, 12];
prefs.setString(
  SharedpreferenceKey.favoriteProperties,
  json.encode(favorites)
);
```

---

## Third-Party Integrations

### 1. Firebase

**Setup File:** `lib/firebase_options.dart`

**Services Used:**
- **Firebase Storage** - Document and media uploads
  - KYC documents
  - Property images
  - Property videos
  - Profile pictures

**Configuration:**
- Initialize in `main.dart` before `runApp()`
- Platform-specific options for iOS and Android

### 2. Google Fonts

**Usage:** App-wide custom typography

```dart
textTheme: GoogleFonts.montserratTextTheme(
  Theme.of(context).textTheme
)
```

### 3. Image Picker

**Usage:** Camera and gallery access for:
- KYC documents
- Property images/videos
- Profile pictures

**Options:**
- Image quality compression
- Max width/height settings

### 4. URL Launcher

**Usage:**
- Phone calls to builder/customer
- Email actions
- External links (Privacy Policy, Terms)

**Example:**
```dart
final Uri phoneUri = Uri(scheme: 'tel', path: '9876543210');
await launchUrl(phoneUri);
```

### 5. WhatsApp Share

**Usage:** Direct WhatsApp messaging for:
- Contacting property builders
- Reaching out to lead customers
- Sharing properties

**Example:**
```dart
await WhatsappShare.share(
  phone: '919876543210',
  text: 'Interested in property: ${property.title}'
);
```

### 6. Share Plus

**Usage:** System share dialog for:
- Sharing property listings
- Sharing app download link
- Sharing lead information

### 7. Cached Network Image

**Usage:** Efficient image loading with:
- Automatic caching
- Placeholder support
- Error widgets
- Fade-in animations

**Example:**
```dart
CachedNetworkImage(
  imageUrl: property.mainImage,
  placeholder: (context, url) => CircularProgressIndicator(),
  errorWidget: (context, url, error) => Icon(Icons.error),
)
```

### 8. Dio HTTP Client

**Configuration:**
```dart
Dio _dio = Dio();

// Disable SSL certificate validation (for self-signed certs)
(_dio.httpClientAdapter as IOHttpClientAdapter).createHttpClient = () =>
    HttpClient()
      ..badCertificateCallback =
          (X509Certificate cert, String host, int port) => true;
```

**Features:**
- JSON serialization/deserialization
- Error handling
- Request/response interceptors
- Timeout configuration

### 9. Timeago

**Usage:** Human-readable time formatting

```dart
import 'package:timeago/timeago.dart' as timeago;

timeago.format(DateTime.parse(lead.createdDate))
// Output: "2 hours ago", "3 days ago"
```

---

## Assets & Resources

### Asset Configuration

**File:** `pubspec.yaml:55-59`

```yaml
flutter:
  uses-material-design: true
  assets:
    - assets/logos/
    - assets/images/
    - assets/svgs/
```

### Splash Screen

**Configuration:**
```yaml
flutter_native_splash:
  image: assets/logos/splash_with_branding.png
  color: "#ffffff"
  android_12:
    image: assets/images/logo_new.png
    color: "#ffffff"
  web_image_mode: cover
  android_gravity: fill
  ios_content_mode: scaleToFill
```

**Generate Command:**
```bash
flutter pub run flutter_native_splash:create
```

### App Icon

**Configuration:**
```yaml
flutter_icons:
  android: "launcher_icon"
  ios: true
  remove_alpha_ios: true
  image_path: "assets/images/logo_new.png"
  adaptive_icon_background: "#ffffff"
```

**Generate Command:**
```bash
flutter pub run flutter_launcher_icons:main
```

---

## App Colors & Theme

**File:** `lib/utils/colors.dart`

```dart
const Color primary = Color(0xFF1E88E5);          // Blue
const Color secondary = Color(0xFFFF9800);        // Orange
const Color scaffoldBackgroundColor = Color(0xFFF5F5F5);
const Color textColorDark = Color(0xFF212121);
const Color textColorLight = Color(0xFF757575);
```

### Theme Configuration

**File:** `lib/main.dart:55-73`

```dart
ThemeData(
  useMaterial3: false,
  colorScheme: ColorScheme.fromSeed(
    seedColor: primary,
    background: scaffoldBackgroundColor,
    primary: primary,
    secondary: secondary,
  ),
  textTheme: GoogleFonts.montserratTextTheme(
    Theme.of(context).textTheme
  ).apply(
    bodyColor: textColorDark,
    displayColor: textColorDark,
  ),
)
```

---

## User Status Flow

### Status Enum

**File:** `lib/utils/enum.dart`

```dart
enum UserStatus {
  CREATED,    // Just registered, needs KYC
  PENDING,    // KYC submitted, awaiting approval
  ACTIVE,     // KYC approved, full access
  SUSPENDED   // Account suspended by admin
}
```

### Status Flow Diagram

```
REGISTER
   ↓
CREATED (Login allowed, limited access)
   ↓
KYC_SUBMIT
   ↓
PENDING (Login allowed, awaiting approval)
   ↓
ADMIN_APPROVAL
   ↓
ACTIVE (Full access)

ADMIN_ACTION → SUSPENDED (Login blocked)
```

### Screen Access by Status

| Screen | CREATED | PENDING | ACTIVE | SUSPENDED |
|--------|---------|---------|--------|-----------|
| Login | ✓ | ✓ | ✓ | ✗ |
| Home | ✓ | ✓ | ✓ | ✗ |
| Browse Properties | ✓ | ✓ | ✓ | ✗ |
| Create Lead | ✓ | ✓ | ✓ | ✗ |
| Post Property | ✗ | ✗ | ✓ | ✗ |
| Edit Property | ✗ | ✗ | ✓ | ✗ |
| KYC | ✓ | ✗ | ✗ | ✗ |

---

## Error Handling & Validation

### API Error Handling

All API calls use try-catch with Dio exception handling:

```dart
try {
  Response response = await _dio.post(url, data: data);
  // Handle success
} on DioException catch (e) {
  var resBody = e.response?.data ?? {};
  SnackBarService.instance.showSnackBarError(
    'Error: ${resBody['message']}'
  );
} catch (e) {
  SnackBarService.instance.showSnackBarError(e.toString());
}
```

### Form Validation

**Phone Number:**
```dart
validator: (value) {
  if (value == null || value.length != 10) {
    return 'Enter valid 10-digit phone number';
  }
  return null;
}
```

**Email:**
```dart
import 'package:string_validator/string_validator.dart';

validator: (value) {
  if (value == null || !isEmail(value)) {
    return 'Enter valid email address';
  }
  return null;
}
```

**Price/Numeric:**
```dart
validator: (value) {
  if (value == null || int.tryParse(value) == null) {
    return 'Enter valid number';
  }
  return null;
}
```

---

## Performance Optimization

### Image Caching
- Uses `cached_network_image` for automatic caching
- Reduces network calls
- Improves scroll performance

### Lazy Loading
- Property lists load on-demand
- Pagination for large lists (if implemented)

### State Preservation
- Form state saved during navigation
- User session cached in SharedPreferences

### Firebase Storage
- Image compression before upload
- Thumbnail generation for videos

---

## Security Features

### SSL Certificate Handling
```dart
// Note: Currently allows self-signed certificates
// Production should use valid SSL certificates
badCertificateCallback = (cert, host, port) => true;
```

### Data Storage
- Sensitive user ID stored in SharedPreferences (encrypted recommended)
- No passwords stored locally
- OTP-based authentication (no password storage)

### API Security
**Current:** No authentication tokens
**Recommended:** Implement JWT tokens for API calls

---

## App Initialization Flow

**File:** `lib/main.dart:23-96`

```dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  // Initialize SharedPreferences
  prefs = await SharedPreferences.getInstance();

  // Check for cached user
  if (prefs.getInt(SharedpreferenceKey.userId) != null) {
    userModel = await ApiProvider().getUserById(
      SharedpreferenceKey.getUserId()
    );
  }

  // Initialize Firebase
  await Firebase.initializeApp(
    options: DefaultFirebaseOptions.currentPlatform,
  );

  runApp(const MyApp());
}

Widget getHomeScreen() {
  // First time app open
  if (prefs.getBool(SharedpreferenceKey.firstTimeAppOpen) ?? true) {
    prefs.setBool(SharedpreferenceKey.firstTimeAppOpen, false);
    return const AppIntroScreen();
  }

  // No user logged in
  if (userModel == null || userModel?.id == null) {
    return const LoginScreen();
  }

  // Check user status
  if (userModel!.status == UserStatus.SUSPENDED.name) {
    return const LoginScreen();
  }

  if (userModel!.status == UserStatus.CREATED.name ||
      userModel!.status == UserStatus.PENDING.name) {
    return const LoginScreen(); // Can login, limited access
  }

  // Active user
  return const HomeContainer();
}
```

---

## Complete User Flows

### Flow 1: New User Registration & KYC

1. **First Launch** → App Intro Screen
2. **Skip** → Login Screen
3. **Tap Register** → Register Screen
4. **Fill Details** → Submit
5. **Success** → Back to Login
6. **Enter Phone** → Send OTP
7. **Enter OTP** → Verify
8. **Status: CREATED** → Home Container (limited access)
9. **Profile** → KYC Screen
10. **Upload Documents** → Submit
11. **Status: PENDING** → Wait for approval
12. **Admin Approves** → Status: ACTIVE
13. **Full Access** → Can post properties

### Flow 2: Property Posting

1. **Bottom Nav** → Post Tab
2. **Post Property Screen** → Fill details
3. **Next** → Pick Property Images
4. **Select Images** → Upload to Firebase
5. **Next** → Pick Property Videos
6. **Select Videos** → Upload to Firebase
7. **Submit** → Create property API call
8. **Success** → Property listed
9. **Navigate** → Home Screen
10. **View** → Property appears in listings

### Flow 3: Lead Creation & Follow-up

1. **Home Screen** → Browse properties
2. **Tap Property** → Property Detail
3. **Interested** → Create Lead
4. **Fill Customer Details** → Submit
5. **Success** → Lead created with status "Open"
6. **Navigate** → Leads Tab
7. **View Lead** → Tap lead card
8. **Lead Comment Screen** → View details
9. **Add Comment** → "Customer wants to visit"
10. **Call/WhatsApp** → Contact customer
11. **Update Status** → Mark as "Closed" when deal done

### Flow 4: Admin User Management

1. **Admin Login** → Home Container
2. **Profile Tab** → Admin menu visible
3. **Tap All Users** → User List Screen
4. **View User** → User Detail Screen
5. **Review KYC** → View documents
6. **Approve/Reject** → Update user status
7. **Approved** → User status: ACTIVE
8. **Rejected** → User notified, resubmit KYC

### Flow 5: Property Search & Favorite

1. **Home Screen** → Enter city
2. **Select Type** → "Residential"
3. **Tap Search** → API call with filters
4. **View Results** → Property Listing
5. **Tap Property** → Property Detail
6. **Like Property** → Add to favorites (local)
7. **Navigate** → Favorites Tab
8. **View Favorites** → API call for favorited properties
9. **Remove** → Update local storage

---

## API Call Summary by Screen

| Screen | API Calls | Methods |
|--------|-----------|---------|
| Login | 2 | sendOtp(), getUserByPhone() |
| Register | 1 | createUser() |
| Home | 1-2 | getAllProperties() |
| Property Detail | 1 | getPropertyById() |
| Create Lead | 1 | createLead() |
| Lead Screen | 1 | getAllLeadsByUserId() |
| Lead Comment | 2 | getLeadsById(), updateLead() |
| KYC | 1 + Storage | uploadImage() × 3, updateUser() |
| Post Property | 1 + Storage | uploadImage/Video(), createProperty() |
| Favorites | 1 | getAllFavProperties() |
| Profile | 1 | getUserById() |
| User List | 1 | getAllUsers() |
| User Detail | 2 | getUserById(), updateUser() |
| All Lead Users | 1 | getAllLeads() |
| Admin Lead List | 1 | getAllLeadsByUserId() |
| Edit Property | 2 + Storage | getPropertyById(), updateProperty() |

---

## Constants & Enums

### Property Types
```dart
enum PropertyType {
  Property,      // General property
  Commercial,    // Commercial space
  Residential    // Residential property
}
```

### Lead Property Types
```dart
enum LeadPropertyType {
  Buy,   // Customer wants to buy
  Rent,  // Customer wants to rent
  Sell   // Customer wants to sell
}
```

### Area Units
```dart
enum AreaUnit {
  Sqft,    // Square feet
  Sqm,     // Square meters
  Acre,    // Acre
  Hectare  // Hectare
}
```

### User Types
```dart
enum UserType {
  Agent,   // Real estate agent
  Buyer,   // Property buyer
  Admin    // System administrator
}
```

---

## Build Configuration

### Android Build

**Min SDK:** 21 (Android 5.0)
**Target SDK:** 33 (Android 13)
**Compile SDK:** 33

### iOS Build

**Min iOS Version:** 12.0
**Target iOS Version:** 16.0

---

## Testing

### Manual Testing Checklist

#### Authentication
- ✓ Login with valid OTP
- ✓ Login with invalid OTP
- ✓ Register new user
- ✓ Logout

#### Properties
- ✓ Search properties
- ✓ View property details
- ✓ Post new property
- ✓ Edit property
- ✓ Delete property
- ✓ Add to favorites
- ✓ Remove from favorites

#### Leads
- ✓ Create lead
- ✓ View leads
- ✓ Add comment
- ✓ Change lead status

#### KYC
- ✓ Upload documents
- ✓ Submit for verification
- ✓ Admin approval/rejection

---

## Known Issues & Future Enhancements

### Current Limitations
1. No JWT authentication
2. Self-signed SSL certificate
3. No pagination for large lists
4. Limited offline support
5. No push notifications

### Planned Features
1. Property comparison
2. Property filters (price range, area, etc.)
3. Map integration for property locations
4. Scheduled property visits
5. In-app messaging between users
6. Property recommendations
7. Analytics dashboard
8. Mortgage calculator

---

## Troubleshooting

### Common Issues

**1. API Connection Error**
- Check internet connection
- Verify API base URL
- Check SSL certificate acceptance

**2. Image Upload Failure**
- Check file size (< 5MB for images)
- Verify Firebase Storage configuration
- Check storage permissions

**3. OTP Not Received**
- Check TextLocal API configuration
- Verify phone number format
- Check SMS service credits

**4. Login Failure**
- Verify user exists in database
- Check user status (not SUSPENDED)
- Clear app cache and retry

---

## Development Commands

### Run App
```bash
flutter run
```

### Build APK
```bash
flutter build apk --release
```

### Build iOS
```bash
flutter build ios --release
```

### Generate Splash Screen
```bash
flutter pub run flutter_native_splash:create
```

### Generate App Icon
```bash
flutter pub run flutter_launcher_icons:main
```

### Clean Build
```bash
flutter clean
flutter pub get
flutter run
```

---

## Summary

The PropertyCP Flutter app is a comprehensive real estate platform offering:

**Core Features:**
- Multi-role user system (Agents, Buyers, Admins)
- Property listing and management
- Lead generation and tracking
- KYC verification system
- Favorites management
- Rich media support (images, videos)

**Technical Highlights:**
- Modern Flutter 3.0+ architecture
- Provider state management
- Dio for HTTP requests
- Firebase Storage integration
- Clean code structure
- Responsive UI

**User Experience:**
- Intuitive navigation
- Smooth animations
- Image caching for performance
- Real-time updates
- Error handling with user feedback

**API Integration:**
- RESTful API communication
- Comprehensive error handling
- Optimized network calls
- Proper request/response models

---

**Document Version:** 1.0
**Last Updated:** 2023-12-21
**Maintained By:** Development Team
