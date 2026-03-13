from pathlib import Path

# 1. Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent

# 2. Security Settings
SECRET_KEY = 'django-insecure-oexi+59(jhv##m(1nv)w4t6mzq@b74-il*j^7)@q78ym*1s_60'
DEBUG = True
ALLOWED_HOSTS = ['*'] # Allows testing from your browser

# 3. Application Definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Required for AITS API & React connection
    'rest_framework',
    'corsheaders',
    
    # Your project app
    'aits_api',
]

# 4. Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # Must be at the top for React
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'AITS_Project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'AITS_Project.wsgi.application'

# 5. Database Configuration (Updated to PostgreSQL)
# REPLACE 'your_password' with your actual pgAdmin password!
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'aits_db',
        'USER': 'postgres',
        'PASSWORD': 'mukisa', 
        'HOST': '127.0.0.1',
        'PORT': '5432',
    }
}

# 6. Custom User Model Link (Week 2 Requirement)
AUTH_USER_MODEL = 'aits_api.User'

# 7. Password Validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# 8. Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Africa/Kampala' # Set to local time for Makerere University
USE_I18N = True
USE_TZ = True

# 9. Static Files
STATIC_URL = 'static/'

# 10. API & CORS Settings
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny', 
    ],
}

CORS_ALLOW_ALL_ORIGINS = True # Required for React to talk to Django