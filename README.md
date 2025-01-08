# Project Routes Documentation

## Description

This project is designed to manage user bookings, and authentication for a ride-sharing platform. It includes features for booking rides, handling driver and user registrations, and reviewing ride experiences.

---

## Contents

- [Description](#description)
- [Routes](#routes)
  - [/bookings Routes](#bookings-routes)
  - [/user Routes](#user-routes)
- [Schema Design](#schema-design)
  - [User Schema](#user-schema)
  - [Driver Schema](#driver-schema)
  - [Order Schema](#order-schema)
  - [Review Schema](#review-schema)
  - [BookedOrder Schema](#bookedorder-schema)
- [Clone and Run Locally](#clone-and-run-locally)
  - [Without Docker](#without-docker)
  - [With Docker](#with-docker)

---

## Routes

### `/bookings` Routes

These routes manage bookings, reviews, and ride statuses.

1. **GET `/bookings/`**

   - **Description**: Fetch all bookings or related data.
   - **Handler**: `handleBooking`.

2. **POST `/bookings/reviews`**

   - **Description**: Submit a review (accessible by drivers and users).
   - **Middleware**: `restrictTo(["driver", "user"])`.
   - **Handler**: `handleReviews`.

3. **GET `/bookings/new`**

   - **Description**: Get details for creating a new booking (for drivers only).
   - **Middleware**: `restrictTo(["driver"])`.
   - **Handler**: `addNewBooking`.

4. **POST `/bookings/`**

   - **Description**: Create a new booking.
   - **Middleware**: `restrictTo(["driver"])`, `validateOrder`.
   - **Handler**: `handleNewBooking`.

5. **GET `/bookings/myorders`**

   - **Description**: Fetch all orders for the authenticated driver or user.
   - **Middleware**: `restrictTo(["driver", "user"])`.
   - **Handler**: `handleMyOrders`.

6. **POST `/bookings/cancelride`**

   - **Description**: Cancel a ride (for users only).
   - **Middleware**: `restrictTo(["user"])`.
   - **Handlers**: `cancelRide`, `handleCancelRide`.

7. **POST `/bookings/success`**

   - **Description**: Mark a ride as completed (for drivers only).
   - **Middleware**: `restrictTo(["driver"])`.
   - **Handlers**: `cancelRide`, `handleCompleteRide`.

8. **GET `/bookings/:id`**
   - **Description**: Fetch booking details by ID (for users only).
   - **Middleware**: `restrictTo("user")`.
   - **Handler**: `handleBookingDetails`.

---

### `/user` Routes

These routes handle user registration, login, profiles, and ratings.

1. **GET `/user/register`**

   - **Description**: Display the registration page for users and drivers.
   - **Middleware**: `denyAccessTo(["user", "driver"])`.
   - **Handler**: Renders `register.ejs`.

2. **POST `/user/driver/successfull`**

   - **Description**: Handles driver registration and signup.
   - **Middleware**: `denyAccessTo(["user", "driver"])`.
   - **Handler**: `handleDriverSignUp`.

3. **POST `/user/user/successfull`**

   - **Description**: Handles user registration and signup.
   - **Middleware**: `denyAccessTo(["user", "driver"])`.
   - **Handler**: `handleUserSignUp`.

4. **GET `/user/register/driver`**

   - **Description**: Displays the registration page specifically for drivers.
   - **Middleware**: `denyAccessTo(["user", "driver"])`.
   - **Handler**: Renders `driverRegister.ejs`.

5. **GET `/user/register/user`**

   - **Description**: Displays the registration page specifically for users.
   - **Middleware**: `denyAccessTo(["user", "driver"])`.
   - **Handler**: Renders `userRegister.ejs`.

6. **GET `/user/login`**

   - **Description**: Displays the login page.
   - **Handler**: Renders `login.ejs`.

7. **GET `/user/logOut`**

   - **Description**: Logs out the current user, clears the session cookie, and redirects to the homepage.
   - **Handler**: Clears `uid` cookie, flashes a success message, and redirects.

8. **GET `/user/profile`**

   - **Description**: Displays the profile page of the authenticated user.
   - **Middleware**: `restrictTo(["driver", "user"])`.
   - **Handler**: Renders `profile.ejs` with the current user.

9. **POST `/user/rating/:id`**

   - **Description**: Allows a user to rate another entity (e.g., driver) by ID.
   - **Middleware**: `restrictTo(["user"])`.
   - **Handler**: `handleRating`.

10. **POST `/user/login/successfull`**
    - **Description**: Handles user login.
    - **Handler**: `handlelogin`.

---

## Schema Design

### User Schema

```javascript
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "user",
    required: true,
  },
  image: {
    type: String,
    default:
      "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/173502583/original/6a346e0505fac7746ebd790a5de335221c42a4a5/draw-a-simple-big-head-cartoon-from-your-photo.png",
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "BookedOrder" },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});
```

### Driver Schema

```javascript
const DriverSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  phone: {
    type: Number,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
  },
  bikeNum: {
    type: String,
    unique: true,
  },
  bikeDesc: {
    type: String,
  },
  role: {
    type: String,
    default: "driver",
    required: true,
  },
  rating: {
    type: Number,
    default: 5,
  },
  image: {
    type: String,
    default:
      "https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs2/173502583/original/6a346e0505fac7746ebd790a5de335221c42a4a5/draw-a-simple-big-head-cartoon-from-your-photo.png",
  },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "BookedOrder" },
  review: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});
```

### Order Schema

```javascript
const OrderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  pickUp: {
    type: String,
  },
  dropIn: {
    type: String,
  },
  time: {
    type: String,
  },
  isBooked: {
    type: Boolean,
  },
  image: {
    type: String,
  },
  driverData: [{ type: mongoose.Schema.Types.ObjectId, ref: "Driver" }],
  userData: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
```

### Review Schema

```javascript
const ReviewSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  comment: {
    type: String,
  },
  rating: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  showIn: {
    type: Boolean,
    required: true,
  },
});
```

### BookedOrder Schema

```javascript
const BookedOrderSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  pickUp

```

## Clone and Run Locally

- fork the repository into your github account
- clone it into your local system `git clone <repository-url>`

## With Docker

    docker compose up --watch

## Without Docker

- Install the dependicies `npm install `
- Add the env variables `MONGO_URL="add-your-mongo-url" SECRET_CODE="ETsledjf340854"`
- Start the server ` node app.js` or `nodemon app.js`
