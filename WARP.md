# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

PRISM DSS is a Django-based Decision Support System that integrates Google's Gemini AI API for construction project risk management. The system allows users to analyze construction projects and receive AI-powered risk assessments with mitigation strategies.

## Essential Commands

### Environment Setup
```bash
# Install dependencies
pip install -r requirements.txt

# Create and apply migrations (if needed)
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### Development Server
```bash
# Run development server
python manage.py runserver

# Run on specific port
python manage.py runserver 8080
```

### Database Operations
```bash
# Run migrations
python manage.py migrate

# Create migrations for app
python manage.py makemigrations <app_name>

# Access Django shell
python manage.py shell

# Collect static files
python manage.py collectstatic
```

### Testing
```bash
# Run all tests
python manage.py test

# Run tests for specific app
python manage.py test <app_name>

# Run specific test class
python manage.py test <app_name>.tests.<TestClass>
```

## Architecture Overview

### Core Structure
The application follows Django's MVT (Model-View-Template) pattern with modular apps:

- **PRISM_DSS/**: Main Django project configuration
- **shared/**: Contains shared models (`dss_models.py`) used across apps
- **dashboard/**: Project visualization and data display
- **projects/**: AI-powered project analysis functionality
- **register/**: User registration functionality  
- **login/**: Authentication and login management
- **static/**: CSS, JavaScript, and static assets
- **templates/**: HTML templates for the application

### Database Architecture
Uses MySQL database with auto-generated models in `shared/models/dss_models.py`:

- **Proyectos**: Core project data (name, type, budget, duration, etc.)
- **Riesgos**: Project risks with probability and impact scores
- **AccionesMitigacion**: Risk mitigation actions
- **TipoProyecto**: Project type categorization
- **Categorias**: Risk categories for classification

### AI Integration Architecture
The AI analysis workflow (`projects/` app):

1. **Form Processing**: `FormAnalyze` captures project details
2. **Database Query**: `get_database_data.py` retrieves similar historical projects
3. **API Call**: `api.py` sends prompt to Gemini 2.0 Flash model
4. **Response Processing**: Returns structured JSON with risks and mitigations

Key files:
- `projects/services/api.py`: Gemini API integration
- `projects/utils/get_database_data.py`: Historical data retrieval
- `projects/forms.py`: Project analysis form with validation

### Frontend Architecture
- **Static Assets**: Organized in `/static/css/` and `/static/js/`
- **Analysis Module**: Modular JavaScript in `/static/js/analysis/`
  - `analysis.js`: Main analysis controller
  - `handleEvents.js`: User interaction handling
  - `showResult.js`, `showRisks.js`, `showMitigation.js`: Result display
- **Templates**: Django templates in `/templates/` with base template system

## Key Configuration

### Environment Variables Required
```bash
# Database configuration
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_HOST=your_database_host
DB_PORT=your_database_port

# Google Gemini API
API_KEY=your_gemini_api_key
```

### URL Routing
Main URL configuration includes all app routes:
- Dashboard: `/` (protected, login required)
- Project analysis: `/projects/` routes
- Registration: `/register/` routes  
- Authentication: `/login/` routes
- Admin: `/admin/`

### Database Connection
- **Production**: MySQL with credentials from environment variables
- **Development**: SQLite fallback available (db.sqlite3 exists)
- Models use `managed = False` (auto-generated from existing database)

## Development Patterns

### Form Validation
- Custom validators for project names and descriptions
- Regex validation for allowed characters
- Cross-field validation in `clean()` methods
- Structured error handling with JSON responses

### Error Handling in AI Integration
- Connection checking before API calls
- Structured exception handling for API errors
- JSON validation for AI responses
- Fallback mechanisms for service unavailability

### Security Considerations
- Login required decorators on sensitive views
- CSRF protection enabled
- Input sanitization with `django.utils.html.escape`
- Environment-based configuration for sensitive data

### Database Queries
- Raw SQL queries for complex data aggregation
- Django ORM for standard operations
- Connection management with context managers
- Optimized queries with JOINs and GROUP BY for performance