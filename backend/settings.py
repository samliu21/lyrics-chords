from django.core.management.utils import get_random_secret_key

import dj_database_url
import django_heroku
import dotenv
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get('SECRET_KEY')
API_KEY = os.environ.get('API_KEY')
PASSWORD = os.environ.get('PASSWORD')
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
BACKEND = os.environ.get('BACKEND')
FRONTEND = os.environ.get('FRONTEND')

if BACKEND is None:
	BACKEND = "https://lyrics-chords-herokuapp.com"
if FRONTEND is None:
	FRONTEND = "https://lyrics-chords-herokuapp.com/#"

if SECRET_KEY == None or API_KEY == None:
	dotenv_file = BASE_DIR / '.env'
	if dotenv_file.is_file():
		dotenv.load_dotenv(dotenv_file)
		SECRET_KEY = os.environ.get('SECRET_KEY')
		API_KEY = os.environ.get('API_KEY')
	if SECRET_KEY == None:
		SECRET_KEY = get_random_secret_key()

DEBUG = False

ALLOWED_HOSTS = [
	'127.0.0.1',
	'localhost',
	'lyrics-chords.herokuapp.com',
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
	'corsheaders',
	'rest_framework',
	'whitenoise.runserver_nostatic',
	'app',
	'authentication',
	'songviews'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
	'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'build')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

PASSWORD_RESET_TIMEOUT = 1800

WSGI_APPLICATION = 'backend.wsgi.application'

DATABASES = {
    'new': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    },
	'local_psql': {
		'ENGINE': 'django.db.backends.postgresql_psycopg2',
		'NAME': 'lyrics_chords',
		'USER': 'SamRoo',
		'PASSWORD': PASSWORD,
		'HOST': 'localhost',
		'PORT': 5432,
	}
}

DATABASES['default'] = dj_database_url.config(conn_max_age=600, ssl_require=True)

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True

django_heroku.settings(locals())

STATIC_URL = '/static/'
# Place static in the same location as webpack build files
STATIC_ROOT = os.path.join(BASE_DIR, 'build', 'static')
STATICFILES_DIRS = []

STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ]
}

CORS_ALLOW_CREDENTIALS = True

CORS_ORIGIN_WHITELIST = (
	'http://127.0.0.1:3000',
	'http://localhost:3000',
	'https://lyrics-chords.herokuapp.com',
)

CSRF_COOKIE_SECURE = True 

AUTH_USER_MODEL = 'authentication.User'

AUTHENTICATION_BACKENDS = ['authentication.backend.CustomBackend']

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
# EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_USE_TLS = True
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_HOST_USER = EMAIL_HOST_USER
EMAIL_HOST_PASSWORD = EMAIL_HOST_PASSWORD
