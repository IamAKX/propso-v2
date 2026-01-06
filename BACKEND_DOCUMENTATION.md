# Real Estate Backend API Documentation (C#)

## Project Overview

**Project Name:** PropertyApp - Real Estate Backend API
**Technology Stack:** ASP.NET Core 6.0 Web API
**Architecture Pattern:** Repository Pattern with Generic Repository
**Database:** SQL Server
**ORM:** Entity Framework Core 7.0.12

---

## Table of Contents

1. [Environment & Configuration](#environment--configuration)
2. [Project Structure](#project-structure)
3. [Database Models](#database-models)
4. [API Endpoints](#api-endpoints)
5. [Repositories](#repositories)
6. [DTOs](#dtos)
7. [Constants & Enums](#constants--enums)

---

## Environment & Configuration

### Versions & Dependencies

```xml
Target Framework: .NET 6.0
Entity Framework Core: 7.0.12
Entity Framework Core SQL Server: 7.0.12
Entity Framework Core Tools: 7.0.12
Newtonsoft.Json: 13.0.3
Swashbuckle.AspNetCore (Swagger): 6.5.0
```

### Connection String

**Location:** `appsettings.json`

```json
{
  "ConnectionStrings": {
    "RealEstateConnectionString": "Server=localhost;Database=realestatenew;User Id=sa;Password=property@123;TrustServerCertificate=True;"
  }
}
```

### CORS Configuration

**File:** `Program.cs`

The API is configured with a permissive CORS policy allowing all origins:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.WithOrigins("*")
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});
```

### Swagger Configuration

Swagger UI is enabled only in Development environment for API documentation and testing.

---

## Project Structure

```
propertyapp/
├── RealEstate/
│   ├── Controllers/
│   │   ├── UsersController.cs
│   │   ├── PropertiesController.cs
│   │   ├── LeadsController.cs
│   │   └── WeatherForecastController.cs
│   ├── Models/
│   │   ├── User.cs
│   │   ├── Property.cs
│   │   ├── Lead.cs
│   │   ├── PropertyImage.cs
│   │   ├── LeadCommentModel.cs
│   │   ├── IAuditable.cs
│   │   └── DTO/
│   │       ├── ApiResponse.cs
│   │       ├── PropertyDTO.cs
│   │       ├── PropertyImageDTO.cs
│   │       ├── UserWithFavoriteProperties.cs
│   │       └── IDList.cs
│   ├── Repositories/
│   │   ├── IRepository.cs
│   │   ├── GenericRepository.cs
│   │   ├── UserRepository.cs
│   │   ├── PropertyRepository.cs
│   │   └── LeadRepository.cs
│   ├── Constants/
│   │   ├── PropertyType.cs
│   │   ├── LeadPropertyType.cs
│   │   ├── UserType.cs
│   │   └── AreaUnit.cs
│   ├── Data/
│   │   └── ApplicationDbContext.cs
│   ├── Migrations/
│   ├── Program.cs
│   ├── appsettings.json
│   └── RealEstate.csproj
```

---

## Database Models

### 1. User Model

**File:** `Models/User.cs`

**Purpose:** Represents users in the real estate system including agents, buyers, and administrators.

```csharp
public class User : IAuditable
{
    public int Id { get; set; }                      // Primary Key
    public string? FullName { get; set; }            // User's full name
    public string MobileNo { get; set; }             // Mobile number (required)
    public string Email { get; set; }                // Email address (required)
    public string Status { get; set; }               // User status (CREATED, PENDING, ACTIVE, SUSPENDED)
    public string? AadharFront { get; set; }         // Aadhar card front image URL
    public string? AadharBack { get; set; }          // Aadhar card back image URL
    public string? PAN { get; set; }                 // PAN card image URL
    public string? VPA { get; set; }                 // UPI VPA for payments
    public UserType UserType { get; set; }           // Type of user (Agent, Buyer, Admin)
    public string? Image { get; set; }               // Profile image URL
    public string? ReferralCode { get; set; }        // Referral code for user
    public bool? IsKycVerified { get; set; }         // KYC verification status
    public DateTimeOffset CreatedDate { get; set; }  // Audit: Creation timestamp
    public DateTimeOffset UpdatedDate { get; set; }  // Audit: Last update timestamp
}
```

**Key Features:**
- Implements IAuditable interface for automatic timestamp management
- Stores KYC documents (Aadhar, PAN)
- Supports referral system
- Includes payment VPA for transactions

---

### 2. Property Model

**File:** `Models/Property.cs`

**Purpose:** Represents real estate properties listed on the platform.

```csharp
public class Property : IAuditable
{
    public int Id { get; set; }                      // Primary Key
    public string? Title { get; set; }               // Property title
    public string? SubTitle { get; set; }            // Property subtitle/tagline
    public string? Price { get; set; }               // Property price (stored as string)
    public string? NumberOfRooms { get; set; }       // Total number of rooms
    public string? BHK { get; set; }                 // Bedroom configuration (1BHK, 2BHK, etc.)
    public string? Location { get; set; }            // Detailed location/address
    public string? City { get; set; }                // City name
    public string? MainImage { get; set; }           // Main property image URL
    public List<PropertyImage> Images { get; set; }  // Collection of property images
    public PropertyType Type { get; set; }           // Property type enum
    public string? Area { get; set; }                // Property area (stored as string)
    public AreaUnit AreaUnit { get; set; }           // Unit of area measurement
    public string? Description { get; set; }         // Property description (max 500 chars)
    public string? BuilderPhoneNumber { get; set; }  // Builder/owner contact number
    public DateTimeOffset CreatedDate { get; set; }  // Audit: Creation timestamp
    public DateTimeOffset UpdatedDate { get; set; }  // Audit: Last update timestamp
}
```

**Relationships:**
- One-to-Many with PropertyImage

**Validations:**
- Description: Max 500 characters

---

### 3. Lead Model

**File:** `Models/Lead.cs`

**Purpose:** Represents customer inquiries and leads generated from property listings.

```csharp
public class Lead : IAuditable
{
    public int Id { get; set; }                               // Primary Key
    public LeadPropertyType? LeadPropertyType { get; set; }   // Type of lead
    public PropertyType? PropertyType { get; set; }           // Property type interested in
    public string MobileNo { get; set; }                      // Customer mobile number
    public string FullName { get; set; }                      // Customer full name
    public string Status { get; set; }                        // Lead status (Open/Closed)
    public List<LeadCommentModel> LeadCommentModel { get; set; } // Comments on lead
    public User? CreatedBy { get; set; }                      // User who created lead
    public int CreatedById { get; set; }                      // Foreign Key to User
    public int? PropertyId { get; set; }                      // Associated property ID
    public DateTimeOffset CreatedDate { get; set; }           // Audit: Creation timestamp
    public DateTimeOffset UpdatedDate { get; set; }           // Audit: Last update timestamp
}
```

**Relationships:**
- Many-to-One with User (CreatedBy)
- One-to-Many with LeadCommentModel

**Key Features:**
- Tracks lead status (Open/Closed)
- Associates leads with properties
- Links leads to the user who created them

---

### 4. PropertyImage Model

**File:** `Models/PropertyImage.cs`

**Purpose:** Stores multiple images and videos for a property.

```csharp
public class PropertyImage
{
    public int Id { get; set; }           // Primary Key
    public string Link { get; set; }      // URL of the image/video
    public bool IsVideo { get; set; }     // True if video, false if image
    public int PropertyId { get; set; }   // Foreign Key to Property
}
```

**Relationships:**
- Many-to-One with Property

---

### 5. LeadCommentModel

**File:** `Models/LeadCommentModel.cs`

**Purpose:** Stores comments and follow-up notes on leads.

```csharp
public class LeadCommentModel
{
    public int Id { get; set; }               // Primary Key
    public string Comment { get; set; }       // Comment text
    public int LeadId { get; set; }           // Foreign Key to Lead
    public DateTimeOffset CreatedDate { get; set; }  // Comment timestamp
}
```

**Relationships:**
- Many-to-One with Lead

---

## API Endpoints

### Base URL

```
Production: https://13.48.104.206:7240/api
```

---

## 1. Users API

**Base Route:** `/api/users`
**Controller:** `UsersController.cs`

### 1.1 Get All Users

**Endpoint:** `GET /api/users`

**Description:** Retrieves all users from the system.

**Request:**
- Method: GET
- Headers: None
- Body: None

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Users retrieved successfully.",
  "data": [
    {
      "id": 1,
      "fullName": "John Doe",
      "mobileNo": "9876543210",
      "email": "john@example.com",
      "status": "ACTIVE",
      "aadharFront": "https://url-to-aadhar-front.jpg",
      "aadharBack": "https://url-to-aadhar-back.jpg",
      "pan": "https://url-to-pan.jpg",
      "vpa": "john@upi",
      "userType": 0,
      "image": "https://url-to-profile-image.jpg",
      "referralCode": "REF123",
      "isKycVerified": true,
      "createdDate": "2023-10-01T10:00:00Z",
      "updatedDate": "2023-10-15T10:00:00Z"
    }
  ]
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "No Users found.",
  "data": null
}
```

---

### 1.2 Get User by ID

**Endpoint:** `GET /api/users/{id}`

**Description:** Retrieves a specific user by their ID.

**Request:**
- Method: GET
- URL Parameter: `id` (int) - User ID
- Headers: None
- Body: None

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "id": 1,
    "fullName": "John Doe",
    "mobileNo": "9876543210",
    "email": "john@example.com",
    "status": "ACTIVE",
    "aadharFront": "https://url-to-aadhar-front.jpg",
    "aadharBack": "https://url-to-aadhar-back.jpg",
    "pan": "https://url-to-pan.jpg",
    "vpa": "john@upi",
    "userType": 0,
    "image": "https://url-to-profile-image.jpg",
    "referralCode": "REF123",
    "isKycVerified": true,
    "createdDate": "2023-10-01T10:00:00Z",
    "updatedDate": "2023-10-15T10:00:00Z"
  }
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "User not found",
  "data": null
}
```

---

### 1.3 Get User by Mobile Number

**Endpoint:** `GET /api/users/mobileNo/{mobileNo}`

**Description:** Retrieves a user by their mobile number.

**Request:**
- Method: GET
- URL Parameter: `mobileNo` (string) - Mobile number
- Headers: None
- Body: None

**Response:** Same format as Get User by ID

---

### 1.4 Get User by Email

**Endpoint:** `GET /api/users/email?email={email}`

**Description:** Retrieves a user by their email address.

**Request:**
- Method: GET
- Query Parameter: `email` (string) - Email address
- Headers: None
- Body: None

**Response:** Same format as Get User by ID

---

### 1.5 Create User

**Endpoint:** `POST /api/users`

**Description:** Creates a new user in the system.

**Request:**
- Method: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "fullName": "John Doe",
  "mobileNo": "9876543210",
  "email": "john@example.com",
  "status": "CREATED",
  "aadharFront": null,
  "aadharBack": null,
  "pan": null,
  "vpa": null,
  "userType": 0,
  "image": null,
  "referralCode": "REF123",
  "isKycVerified": false
}
```

**Response:**

Success (201 Created):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 10,
    "fullName": "John Doe",
    "mobileNo": "9876543210",
    "email": "john@example.com",
    "status": "CREATED",
    "aadharFront": null,
    "aadharBack": null,
    "pan": null,
    "vpa": null,
    "userType": 0,
    "image": null,
    "referralCode": "REF123",
    "isKycVerified": false,
    "createdDate": "2023-10-21T10:00:00Z",
    "updatedDate": "2023-10-21T10:00:00Z"
  }
}
```

Bad Request (400):
```json
{
  "success": false,
  "message": "Invalid request data. User object is null.",
  "data": null
}
```

---

### 1.6 Update User

**Endpoint:** `PUT /api/users/{id}`

**Description:** Updates an existing user's information.

**Request:**
- Method: PUT
- URL Parameter: `id` (int) - User ID
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "id": 10,
  "fullName": "John Doe Updated",
  "mobileNo": "9876543210",
  "email": "john.updated@example.com",
  "status": "ACTIVE",
  "aadharFront": "https://url-to-aadhar-front.jpg",
  "aadharBack": "https://url-to-aadhar-back.jpg",
  "pan": "https://url-to-pan.jpg",
  "vpa": "john@upi",
  "userType": 0,
  "image": "https://url-to-profile-image.jpg",
  "referralCode": "REF123",
  "isKycVerified": true
}
```

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "User updated successfully.",
  "data": {
    // Updated user object
  }
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "User not found or update failed.",
  "data": null
}
```

---

### 1.7 Delete User

**Endpoint:** `DELETE /api/users/{id}`

**Description:** Deletes a user from the system.

**Request:**
- Method: DELETE
- URL Parameter: `id` (int) - User ID
- Headers: None
- Body: None

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "User deleted successfully.",
  "data": true
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "User not found or deletion failed.",
  "data": false
}
```

---

## 2. Properties API

**Base Route:** `/api/properties`
**Controller:** `PropertiesController.cs`

### 2.1 Get All Properties

**Endpoint:** `GET /api/properties`

**Description:** Retrieves all properties from the system.

**Request:**
- Method: GET
- Headers: None
- Body: None

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Properties retrieved successfully.",
  "data": [
    {
      "id": 1,
      "title": "Luxury Apartment",
      "subTitle": "Near City Center",
      "price": "5000000",
      "numberOfRooms": "5",
      "bhk": "3",
      "location": "MG Road, Bangalore",
      "city": "Bangalore",
      "mainImage": "https://url-to-main-image.jpg",
      "images": [
        {
          "id": 1,
          "link": "https://url-to-image-1.jpg",
          "isVideo": false,
          "propertyId": 1
        }
      ],
      "type": 0,
      "area": "1500",
      "areaUnit": 0,
      "description": "Beautiful apartment with modern amenities",
      "builderPhoneNumber": "9876543210",
      "createdDate": "2023-10-01T10:00:00Z",
      "updatedDate": "2023-10-15T10:00:00Z"
    }
  ]
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "No properties found.",
  "data": null
}
```

---

### 2.2 Get Property by ID

**Endpoint:** `GET /api/properties/{id}`

**Description:** Retrieves a specific property by its ID.

**Request:**
- Method: GET
- URL Parameter: `id` (int) - Property ID
- Headers: None
- Body: None

**Response:** Same format as Get All Properties (single object)

---

### 2.3 Get Properties by City and Type

**Endpoint:** `GET /api/properties/city?city={city}&propertyType={propertyType}`

**Description:** Retrieves properties filtered by city and property type.

**Request:**
- Method: GET
- Query Parameters:
  - `city` (string) - City name
  - `propertyType` (int) - Property type enum value
- Headers: None
- Body: None

**PropertyType Enum Values:**
- 0 = Property (General)
- 1 = Commercial
- 2 = Residential

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Properties for Bangalore with type Property retrieved successfully",
  "data": [
    // Array of property objects
  ]
}
```

Not Found (404):
```json
{
  "success": true,
  "message": "Properties for Bangalore with type Property not Found",
  "data": null
}
```

---

### 2.4 Get Multiple Properties by IDs

**Endpoint:** `POST /api/properties/get-multiple`

**Description:** Retrieves multiple properties by their IDs (useful for favorites).

**Request:**
- Method: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "ids": [1, 2, 3, 5, 8]
}
```

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Properties retrieved successfully.",
  "data": [
    // Array of property objects matching the provided IDs
  ]
}
```

Bad Request (400):
```json
{
  "success": false,
  "message": "Invalid input.",
  "data": null
}
```

---

### 2.5 Create Property

**Endpoint:** `POST /api/properties`

**Description:** Creates a new property listing.

**Request:**
- Method: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "title": "Luxury Apartment",
  "subTitle": "Near City Center",
  "price": "5000000",
  "numberOfRooms": "5",
  "bhk": "3",
  "location": "MG Road, Bangalore",
  "city": "Bangalore",
  "mainImage": "https://url-to-main-image.jpg",
  "images": [
    {
      "link": "https://url-to-image-1.jpg",
      "isVideo": false
    },
    {
      "link": "https://url-to-video-1.mp4",
      "isVideo": true
    }
  ],
  "type": 0,
  "area": "1500",
  "areaUnit": 0,
  "description": "Beautiful apartment with modern amenities",
  "builderPhoneNumber": "9876543210"
}
```

**Response:**

Success (201 Created):
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": 25,
    // Complete property object with generated ID and timestamps
  }
}
```

Bad Request (400):
```json
{
  "success": false,
  "message": "Invalid request data. Property object is null.",
  "data": null
}
```

---

### 2.6 Update Property

**Endpoint:** `PUT /api/properties/{id}`

**Description:** Updates an existing property listing.

**Request:**
- Method: PUT
- URL Parameter: `id` (int) - Property ID
- Headers: `Content-Type: application/json`
- Body: Same as Create Property with all fields

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Property updated successfully.",
  "data": {
    // Updated property object
  }
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "Property not found or update failed.",
  "data": null
}
```

---

### 2.7 Delete Property

**Endpoint:** `DELETE /api/properties/{id}`

**Description:** Deletes a property from the system.

**Request:**
- Method: DELETE
- URL Parameter: `id` (int) - Property ID
- Headers: None
- Body: None

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Property deleted successfully.",
  "data": true
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "Property not found or deletion failed.",
  "data": false
}
```

---

## 3. Leads API

**Base Route:** `/api/leads`
**Controller:** `LeadsController.cs`

### 3.1 Get All Leads

**Endpoint:** `GET /api/leads`

**Description:** Retrieves all leads with user information.

**Request:**
- Method: GET
- Headers: None
- Body: None

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Leads retrieved successfully.",
  "data": [
    {
      "id": 1,
      "leadPropertyType": 0,
      "propertyType": 0,
      "mobileNo": "9876543210",
      "fullName": "Jane Smith",
      "status": "Open",
      "leadCommentModel": [
        {
          "id": 1,
          "comment": "Interested in viewing the property",
          "leadId": 1,
          "createdDate": "2023-10-21T10:00:00Z"
        }
      ],
      "createdBy": {
        "id": 5,
        "fullName": "Agent John",
        "mobileNo": "9876543211",
        "email": "agent@example.com"
        // Other user fields
      },
      "createdById": 5,
      "propertyId": 10,
      "createdDate": "2023-10-20T10:00:00Z",
      "updatedDate": "2023-10-21T10:00:00Z"
    }
  ]
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "No leads found.",
  "data": null
}
```

---

### 3.2 Get Lead by ID

**Endpoint:** `GET /api/leads/{id}`

**Description:** Retrieves a specific lead by its ID.

**Request:**
- Method: GET
- URL Parameter: `id` (int) - Lead ID
- Headers: None
- Body: None

**Response:** Same format as Get All Leads (single object)

---

### 3.3 Get Leads by Created By User ID

**Endpoint:** `GET /api/leads/createdby/{createdById}`

**Description:** Retrieves all leads created by a specific user.

**Request:**
- Method: GET
- URL Parameter: `createdById` (int) - User ID who created the leads
- Headers: None
- Body: None

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Leads retrieved successfully for the specified CreatedById.",
  "data": [
    // Array of lead objects created by the specified user
  ]
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "No leads found for the specified CreatedById.",
  "data": null
}
```

---

### 3.4 Create Lead

**Endpoint:** `POST /api/leads`

**Description:** Creates a new lead in the system.

**Request:**
- Method: POST
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "leadPropertyType": 0,
  "propertyType": 0,
  "mobileNo": "9876543210",
  "fullName": "Jane Smith",
  "status": "Open",
  "leadCommentModel": [],
  "createdById": 5,
  "propertyId": 10
}
```

**Response:**

Success (201 Created):
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "id": 50,
    // Complete lead object with generated ID and timestamps
  }
}
```

Bad Request (400):
```json
{
  "success": false,
  "message": "Invalid request data. Lead object is null.",
  "data": null
}
```

---

### 3.5 Update Lead

**Endpoint:** `PUT /api/leads/{id}`

**Description:** Updates an existing lead (typically to change status or add comments).

**Request:**
- Method: PUT
- URL Parameter: `id` (int) - Lead ID
- Headers: `Content-Type: application/json`
- Body:
```json
{
  "id": 50,
  "leadPropertyType": 0,
  "propertyType": 0,
  "mobileNo": "9876543210",
  "fullName": "Jane Smith",
  "status": "Closed",
  "leadCommentModel": [
    {
      "comment": "Deal closed successfully",
      "leadId": 50
    }
  ],
  "createdById": 5,
  "propertyId": 10
}
```

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Lead updated successfully.",
  "data": {
    // Updated lead object
  }
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "Lead not found or update failed.",
  "data": null
}
```

---

### 3.6 Delete Lead

**Endpoint:** `DELETE /api/leads/{id}`

**Description:** Deletes a lead from the system.

**Request:**
- Method: DELETE
- URL Parameter: `id` (int) - Lead ID
- Headers: None
- Body: None

**Response:**

Success (200 OK):
```json
{
  "success": true,
  "message": "Lead deleted successfully.",
  "data": true
}
```

Not Found (404):
```json
{
  "success": false,
  "message": "Lead not found or deletion failed.",
  "data": false
}
```

---

## Repositories

### 1. IRepository Interface

**File:** `Repositories/IRepository.cs`

Generic repository interface defining CRUD operations:

```csharp
public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> GetByIdAsync(int id);
    Task<T> CreateAsync(T entity);
    Task<T> UpdateAsync(int id, T entity);
    Task<bool> DeleteAsync(int id);
}
```

---

### 2. GenericRepository

**File:** `Repositories/GenericRepository.cs`

Base implementation of IRepository using Entity Framework Core:

**Key Methods:**
- `GetAllAsync()` - Retrieves all entities
- `GetByIdAsync(int id)` - Retrieves single entity by ID
- `CreateAsync(T entity)` - Creates new entity
- `UpdateAsync(int id, T entity)` - Updates existing entity
- `DeleteAsync(int id)` - Deletes entity

**Features:**
- Automatic timestamp management (CreatedDate, UpdatedDate) for IAuditable entities
- Transaction support via SaveChangesAsync()

---

### 3. UserRepository

**File:** `Repositories/UserRepository.cs`

Extends GenericRepository with user-specific methods:

```csharp
public class UserRepository : GenericRepository<User>
{
    Task<User> GetUserByMobileNoAsync(string mobileNo);
    Task<User> GetUserByEmailAsync(string email);
}
```

**Additional Methods:**
- `GetUserByMobileNoAsync(string mobileNo)` - Find user by mobile number
- `GetUserByEmailAsync(string email)` - Find user by email address

---

### 4. PropertyRepository

**File:** `Repositories/PropertyRepository.cs`

Extends GenericRepository with property-specific methods:

```csharp
public class PropertyRepository : GenericRepository<Property>
{
    Task<IEnumerable<Property>> GetPropertiesByCityAndTypeAsync(string city, PropertyType type);
    Task<IEnumerable<Property>> GetPropertiesByIds(List<int> ids);
}
```

**Additional Methods:**
- `GetPropertiesByCityAndTypeAsync(string city, PropertyType type)` - Filter properties by city and type
- `GetPropertiesByIds(List<int> ids)` - Get multiple properties by IDs

**Note:** Includes related PropertyImage entities in queries

---

### 5. LeadRepository

**File:** `Repositories/LeadRepository.cs`

Extends GenericRepository with lead-specific methods:

```csharp
public class LeadRepository : GenericRepository<Lead>
{
    Task<IEnumerable<Lead>> GetAllLeadsByCreatedById(int createdById);
    // Override GetAllAsync to include related User and Comments
}
```

**Additional Methods:**
- `GetAllLeadsByCreatedById(int createdById)` - Get all leads created by specific user

**Features:**
- Automatically includes CreatedBy user information
- Includes LeadCommentModel collection

---

## DTOs

### 1. ApiResponse<T>

**File:** `Models/DTO/ApiResponse.cs`

Generic wrapper for all API responses:

```csharp
public class ApiResponse<T>
{
    public bool Success { get; set; }     // Operation success status
    public string Message { get; set; }   // Human-readable message
    public T Data { get; set; }           // Response data
}
```

**Usage:** All controller endpoints return data wrapped in ApiResponse

---

### 2. IDList

**File:** `Models/DTO/IDList.cs`

Used for batch operations:

```csharp
public class IDList
{
    public List<int> Ids { get; set; }
}
```

**Usage:** GET multiple properties endpoint

---

### 3. PropertyDTO

**File:** `Models/DTO/PropertyDTO.cs`

Simplified property representation (if different from main model).

---

### 4. PropertyImageDTO

**File:** `Models/DTO/PropertyImageDTO.cs`

Simplified property image representation (if different from main model).

---

### 5. UserWithFavoriteProperties

**File:** `Models/DTO/UserWithFavoriteProperties.cs`

Combines user information with their favorite properties.

---

## Constants & Enums

### 1. UserType

**File:** `Constants/UserType.cs`

```csharp
public enum UserType
{
    Agent = 0,
    Buyer = 1,
    Admin = 2
}
```

---

### 2. PropertyType

**File:** `Constants/PropertyType.cs`

```csharp
public enum PropertyType
{
    Property = 0,
    Commercial = 1,
    Residential = 2
}
```

---

### 3. LeadPropertyType

**File:** `Constants/LeadPropertyType.cs`

```csharp
public enum LeadPropertyType
{
    Buy = 0,
    Rent = 1,
    Sell = 2
}
```

---

### 4. AreaUnit

**File:** `Constants/AreaUnit.cs`

```csharp
public enum AreaUnit
{
    Sqft = 0,
    Sqm = 1,
    Acre = 2,
    Hectare = 3
}
```

---

## Database Context

**File:** `Data/ApplicationDbContext.cs`

Entity Framework Core DbContext configuration:

```csharp
public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Property> Properties { get; set; }
    public DbSet<Lead> Leads { get; set; }
    public DbSet<PropertyImage> PropertyImages { get; set; }
    public DbSet<LeadCommentModel> LeadComments { get; set; }

    // Connection string configured in appsettings.json
    // Uses SQL Server provider
}
```

---

## Migrations

**Location:** `Migrations/`

**Initial Migration:** `20231021194245_InitialCreate.cs`

This migration creates the initial database schema with all tables, relationships, and constraints.

---

## Authentication & Authorization

**Current Status:** No authentication/authorization middleware is currently implemented.

**CORS:** Configured to allow all origins (suitable for development, should be restricted in production).

**Recommendations for Production:**
- Implement JWT-based authentication
- Add role-based authorization
- Restrict CORS to specific origins
- Add API rate limiting
- Implement input validation middleware

---

## Error Handling

All endpoints return standardized ApiResponse<T> with:
- `success`: Boolean indicating operation success
- `message`: Descriptive error or success message
- `data`: Null on error, actual data on success

HTTP Status Codes:
- 200: Success (GET, PUT, DELETE)
- 201: Created (POST)
- 400: Bad Request (invalid input)
- 404: Not Found (entity doesn't exist)

---

## Testing

**Swagger UI Available:** Yes (Development environment only)
**Swagger URL:** `https://13.48.104.206:7240/swagger`

---

## Deployment Information

**Hosting:** AWS EC2 or similar (based on IP: 13.48.104.206)
**Port:** 7240
**Protocol:** HTTPS with self-signed certificate (TrustServerCertificate=True)

---

## Summary

This Real Estate backend API provides comprehensive functionality for:
- User management with KYC support
- Property listing and search
- Lead generation and tracking
- Comment system for lead follow-ups
- Image and video support for properties

The architecture follows best practices with:
- Repository pattern for data access
- Generic repository for code reuse
- DTO pattern for API responses
- Entity Framework Core for ORM
- SQL Server for database
- RESTful API design

---

**Document Version:** 1.0
**Last Updated:** 2023-12-21
**Maintained By:** Development Team
