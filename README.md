# Synergia Event Booking API (MongoDB Edition)

## Overview
This is a Node.js + Express REST API for managing event bookings (Synergia). Data is stored in MongoDB using Mongoose.

## Features
- Create, Read, Update, Delete bookings
- Search bookings by email
- Filter bookings by event
- Input validation for required fields (name, email, event)
- Proper HTTP status codes

## Endpoints
1. GET `/api/bookings` - Get all bookings  
2. POST `/api/bookings` - Create a new booking (JSON body: `name`, `email`, `event`, `ticketType`)  
3. GET `/api/bookings/:id` - Get booking by ID  
4. PUT `/api/bookings/:id` - Update booking by ID  
5. DELETE `/api/bookings/:id` - Delete booking by ID  
6. GET `/api/bookings/search?email=xyz` - Search booking by email  
7. GET `/api/bookings/filter?event=Synergia` - Filter booking by event

## Setup (local)
1. Clone repository:
   ```bash
   git clone <your-repo-url>
   cd <repo-folder>
