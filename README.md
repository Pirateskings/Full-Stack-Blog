# Full Stack Blog Project

## About

A modern, feature-rich blogging platform built using the MERN stack (MongoDB, Express.js, React.js, Node.js). This application allows users to create, read, update, and delete blog posts, manage user accounts, and interact with content through comments and likes.

## Features

### User Management

- User registration and authentication
- JWT-based authentication
- Profile management with avatar support
- Password reset functionality
- Social media login integration

### Blog Posts

- Create, read, update, and delete blog posts
- Rich text editor for content creation
- Image upload support
- Categories and tags for posts
- Draft saving functionality
- Post scheduling

### Interaction Features

- Comment system with nested replies
- Like/Unlike posts
- Share posts on social media
- Bookmark favorite posts
- Follow other users

### Additional Features

- Responsive design for all devices
- Search functionality with filters
- Trending posts section
- User notifications
- Admin dashboard
- SEO optimization

## Project Structure

```
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context
│   │   ├── hooks/        # Custom hooks
│   │   ├── utils/        # Utility functions
│   │   └── api/          # API integration
│
├── server/                # Backend Node.js/Express application
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   └── utils/           # Utility functions
```

## API Endpoints

### Authentication

```
POST   /api/auth/register     # Register new user
POST   /api/auth/login        # Login user
POST   /api/auth/logout       # Logout user
GET    /api/auth/me           # Get current user
POST   /api/auth/reset-password    # Reset password
```

### Users

```
GET    /api/users            # Get all users
GET    /api/users/:id        # Get user by ID
PUT    /api/users/:id        # Update user
DELETE /api/users/:id        # Delete user
PUT    /api/users/:id/follow # Follow user
```

### Posts

```
GET    /api/posts            # Get all posts
POST   /api/posts            # Create new post
GET    /api/posts/:id        # Get post by ID
PUT    /api/posts/:id        # Update post
DELETE /api/posts/:id        # Delete post
GET    /api/posts/user/:id   # Get user's posts
GET    /api/posts/trending   # Get trending posts
```

### Comments

```
GET    /api/posts/:id/comments     # Get post comments
POST   /api/posts/:id/comments     # Add comment
PUT    /api/comments/:id           # Update comment
DELETE /api/comments/:id           # Delete comment
```

### Categories

```
GET    /api/categories            # Get all categories
POST   /api/categories           # Create category
PUT    /api/categories/:id       # Update category
DELETE /api/categories/:id       # Delete category
```

## Tech Stack

- Frontend: React.js, Redux, Material-UI/Tailwind CSS
- Backend: Node.js, Express.js
- Database: MongoDB
- Authentication: JWT
- File Storage: AWS S3/Cloudinary
- Deployment: Docker, AWS/Heroku

## Getting Started

1. Clone the repository

```bash
git clone https://github.com/yourusername/full-stack-blog.git
```

2. Install dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd client
npm install
```

3. Set up environment variables
   Create `.env` files in both client and server directories with necessary environment variables.

4. Run the application

```bash
# Run backend
cd server
npm run dev

# Run frontend
cd client
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
