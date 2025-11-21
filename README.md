# HealthConnect

A comprehensive healthcare management system that connects patients and healthcare providers, built with a Django REST API backend and React frontend.

## Features

- **User Management**: Supports both patient and doctor accounts
- **Authentication**: Secure login with both username and email support
- **User Dashboard**: Role-specific dashboards for patients and doctors
- **User Management**: Doctors can view all users in the system
- **Profile Management**: Users can manage their personal and medical information
- **CORS Support**: Full API support for frontend integration
- **RESTful API**: Clean and scalable API architecture

## Tech Stack

- **Backend**: Django, Django REST Framework
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: SQLite3 (production ready)
- **Authentication**: Token-based authentication
- **API Communication**: REST API with JSON responses

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yashandhale9/Health-Connect.git
   cd Health-Connect
   ```

2. Navigate to the backend directory:
   ```bash
   cd HealthConnect
   ```

3. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```

4. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *Note: If requirements.txt doesn't exist, install the required packages manually:*
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

5. Run database migrations:
   ```bash
   python manage.py migrate
   ```

6. Start the backend server:
   ```bash
   python manage.py runserver 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend/health-connect-portal
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. Create a `.env` file with the API base URL:
   ```
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

## API Endpoints

### Authentication
- `POST /api/login/` - User login (accepts both username and email)
- `POST /api/signup/` - User registration

### Users
- `GET /api/users/` - Get all users (doctor access only)
- `GET /api/users/current_user/` - Get current authenticated user
- `GET /api/users/me/` - Get current user details

### Patients
- `GET /api/patients/` - Get all patients
- `GET /api/patients/me/` - Get current patient's profile
- `PUT/PATCH /api/patients/update_profile/` - Update patient profile

### Doctors
- `GET /api/doctors/` - Get all doctors
- `GET /api/doctors/me/` - Get current doctor's profile
- `PUT/PATCH /api/doctors/update_profile/` - Update doctor profile

## User Accounts (Pre-configured)

The system comes with pre-configured accounts for testing:

### Doctor Account
- **Username**: `dr_yashandhale`
- **Email**: `yash@123`
- **Password**: `yash@123`

### Patient Accounts
- **Vedant**:
  - Username: `vedant_p`
  - Email: `vedant@123`
  - Password: `vedant@123`
  
- **Yogesh**:
  - Username: `yogesh_p`
  - Email: `yogesh@123`
  - Password: `yogesh@123`
  
- **Atharva**:
  - Username: `atharva_p`
  - Email: `atharva@123`
  - Password: `atharva@123`

## Usage

1. Start both backend and frontend servers
2. Access the frontend at `http://localhost:5173`
3. Register a new account or use the pre-configured accounts
4. Patients can manage their profiles and view their information
5. Doctors can view all users in the system, manage their profiles, and access specialized features

## Key Improvements

- **Dual Login Support**: Users can now login with either username or email
- **CORS Configuration**: Fixed to allow seamless frontend-backend communication
- **User Management**: Doctors can now view all users in the system
- **Security**: Proper permission checks to ensure only doctors can view all users
- **Filtering & Pagination**: Built-in support for filtering users by type and pagination

## Project Structure

```
HealthConnect/
├── frontend/
│   └── health-connect-portal/     # React frontend
│       ├── src/
│       │   ├── components/        # Reusable components
│       │   ├── contexts/          # React contexts
│       │   ├── hooks/             # Custom hooks
│       │   ├── lib/               # API and utilities
│       │   └── pages/             # Page components
│       └── ...
├── HealthConnect/                 # Django backend
│   ├── core/                      # Core application
│   │   ├── models.py              # Data models
│   │   ├── views.py               # API views
│   │   ├── serializers.py         # Data serializers
│   │   └── urls.py                # URL patterns
│   ├── HealthConnect/             # Django settings
│   │   ├── settings.py            # Configuration
│   │   └── urls.py                # Main URL configuration
│   └── manage.py                  # Django management script
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

If you encounter any issues or have questions, please open an issue in the GitHub repository.
