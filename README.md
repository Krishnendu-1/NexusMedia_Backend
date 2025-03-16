## 🚀 NexusMedia - Scalable Multimedia Content Hosting Platform

![image](https://github.com/user-attachments/assets/03cbd841-1bdc-44c2-81fa-794551c1b8ad)

## Overview

NexusMedia is a robust cutting-edge **Backend** project designed with Node.js, Express, and MongoDB to provide developers and content platforms with a powerful, flexible, and secure infrastructure for building sophisticated digital experiences. It provides a RESTful API for user management, including registration, login, and profile management, along with features such as JWT-based authentication, video and image uploads to Cloudinary, and user subscriptions, likes, playlist and many more similar to **Youtube**.

Tagline: *Bridging Digital Experiences*

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Detailed Code Architecture and Advanced Implementations](#detailed-code-architecture-and-advanced-implementations)
- [Key Advanced Architectural Patterns](#key-advanced-architectural-patterns)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- JWT authentication for secure access
- Profile management including avatar and cover photo updates
- Subscription management between users
- Watch history tracking
- Image uploads to Cloudinary
- Error handling with custom error responses

## Technologies Used

- Node.js
- Express.js
- MongoDB (with Mongoose)
- cloudinary (for image,video storage)
- bcrypt
- cookie-parser
- cors
- jsonwebtoken (for authentication)
- multer (for file uploads)
- mongoose (Object Data Model)
- mongoose-aggregate-paginate-v2 (to implement mongodb aggregation, sub-aggregation pipelines)
- dotenv (for environment variable management)
- Postman (for testing all the API endpoints without frontend)\
- nodemon 
- prettier

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Krishnendu-1/NexusMedia_Backend.git
   cd NexusMedia_Backend
2. Install the dependencies:
   ```bash
   npm install
3. Create a .env file in the root directory and configure the following environment variables:
   ```bash
   MONGODB_URL=your_mongodb_connection_string
   CLOUDNARY_NAME=your_cloudinary_name
   CLOUDNARY_API_KEY=your_cloudinary_api_key
   CLOUDNARY_API_SECRET=your_cloudinary_api_secret
   SECRET_REFRESH_TOKEN=your_secret_key
   PORT=3000

## Usage

  1. To start the server, run:
     ```bash
     npm run dev
The server will be running on http://localhost:3000 (or the port specified in your .env file).

## Detailed Code Architecture and Advanced Implementations

1. User Model (`user.model.js`):

 **Advanced Concepts:**
- Mongoose pre-save middleware for automatic password hashing
- Custom method generation for token creation
- Secure password handling
- Dynamic token generation with environment variable

2. Authentication Middleware (`auth.middleware.js`):

**Advanced Concepts:** 
- Multiple token extraction methods
- Secure token verification
- Middleware-based authentication
- Selective data retrieval

3. Cloudinary Upload Utility (`Cloudnary.js`):

**Advanced Concepts:** 
- Automatic resource type detection
- Fail-safe error handling
- Automatic file system cleanup

4. Subscription Details Aggregation (`Register.controller.js`):

**Advanced Concepts:** 
- Complex MongoDB Aggregation Pipeline
- Dynamic field generation
- Conditional logic in aggregation
- Selective data projection

5. Async Handler Utility (`asyncHandler.js`):

**Advanced Concepts:** 
- Higher-order function
- Promise resolution
- Centralized error handling

6. Multer Middleware (`multer.middleware.js`):

**Advanced Concepts:** 
- Dynamic file storage configuration
- Flexible file naming strategy

## Key Advanced Architectural Patterns:

**Middleware-Driven Architecture**
- Authentication middleware
- Error handling middleware
- File upload middleware

**Aggregation-Based Data Retrieval**
- Complex MongoDB aggregation pipelines
- Dynamic data transformation
- Efficient querying strategies

**Secure Token Management**
- JWT-based authentication
- Refresh token mechanism
- Secure token generation and verification

**Modular Design**
- Separation of concerns
- Utility-based approach
- Reusable components

**Performance Optimization Techniques**
- Mongoose Indexing
- Selective Data Projection
- Efficient Aggregation Pipelines
- Caching Strategies
- Minimal Data Transfer

**Security Implementations**
- Password Hashing
- JWT Token Verification
- Environment-Based Configuration
- Secure Cookie Management
- Input Validation

## API Endpoints

**The following are the main API endpoints available:**

**User Registration**
- POST `/api/users/register`
  - Registers a new user with avatar and cover photo uploads.
  
**User Login**
- POST `/api/users/login`
  - Authenticates a user and returns access and refresh tokens.
    
**User Logout**
- POST `/api/users/logout`
  - Logs out the user and invalidates the refresh token.
    
**Refresh Access Token**
- POST `/api/users/refreshAccessToken`
  - Refreshes the access token using the refresh token.
    
**Update Password**
- POST `/api/users/passwordUpdate`
  - Updates the user's password (authenticated users only).
    
**Get Current User**
- GET `/api/users/cuurentUser`
  - Retrieves the current user's profile (authenticated users only).
    
**Update User Details**
- PATCH `/api/users/detailsUpdate`
  - Updates user details like fullname and email (authenticated users only).
    
**Update Avatar**
- PATCH `/api/users/avatarUpdate`
  - Updates the user's avatar (authenticated users only).
    
**Update Cover Photo**
- PATCH `/api/users/coverphotoUpdate`
  - Updates the user's cover photo (authenticated users only).
    
**Get User Subscription Details**
- GET `/api/users/c/:username`
  - Retrieves subscription details for a given user.
    
**Get User Watch History**
- GET `/api/users/history`
  - Retrieves the watch history for the authenticated user.
    
## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue to discuss changes.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
   
