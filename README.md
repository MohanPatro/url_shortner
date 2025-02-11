# url_shortner

**URL Shortener API**

**Overview**

The URL Shortener API allows users to shorten long URLs, retrieve original URLs, and analyze usage statistics. It also includes Google authentication for secure access.

**Features**

Generate short URLs from long URLs.

Redirect users to the original URL using the short code.

Track analytics for shortened URLs.

Google authentication with JWT token generation.

Rate limiting to prevent excessive API calls.

**Tech Stack**

Backend: Node.js, Express.js

Database: MongoDB

Authentication: Google OAuth, JWT

Security: Rate limiting, JWT-based authentication

**Installation**

Prerequisites

Docker



**Steps**

**Clone the repository:**

git clone -b master (https://github.com/MohanPatro/url_shortner.git)


cd url-shortener



**Install dependencies:**

install docker in your system



**Set up environment variables in .env:**

PORT=3000

DATABASE_URL=mongodb://localhost:27017/urlshortener

BASE_URL=http://localhost:3000

JWT_SECRET=your_secret_key

GOOGLE_CLIENT_ID=your_google_client_id

GOOGLE_CLIENT_SECRET=your_google_client_secret



**Start the server:**

docker-compose up --build

**API Endpoints**


**1. Google Authentication**


Endpoint: GET /auth/google

Description: Redirects the user to Google for authentication.

Usage: Open in a browser.

Endpoint: GET /auth/google/callback

Description: Callback for Google authentication. Upon successful login, it provides a JWT token displayed in an HTML page.

Usage: After Google authentication, users are redirected to a page displaying their token and API usage guide.


**USE POSTMAN FOR TESTING**

**2. Shorten URL**


Endpoint: POST /shorten

Description: Takes a long URL and returns a shortened version.

Headers:

Authorization: Bearer <JWT_TOKEN>

Request Body:

{
  "longUrl": "https://example.com/some-long-url"
  "alias":"your _alias"
  "topic":"topic"
}

**3. Retrieve Original URL**


Endpoint: GET /shorten/:alias

Description: Redirects the user to the original long URL.

Usage: Open the short URL in a browser.


**4. Get URL Analytics**


Endpoint: GET /analytics/:alias

Description: Returns analytics about the short URL, such as click count.

Headers:

Authorization: Bearer <JWT_TOKEN>




**5. Get Topic Analytics**

Endpoint: GET /analytics/topic/:topic

Description: Returns analytics related to a specific topic.

Headers:

Authorization: Bearer <JWT_TOKEN>



**6. Get Overall User Analytics**


Endpoint: GET /analytic/user/overall

Description: Returns overall analytics for a user.

**Headers:**

Authorization: Bearer <JWT_TOKEN>

Authentication & Token Usage



Navigate to /auth/google in a browser and log in with your Google account.

After successful authentication, you will be redirected to a page displaying your JWT token.

Use this token in the Authorization header for protected API endpoints.
