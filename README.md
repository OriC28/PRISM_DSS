# Configuración  

### Archivo .env: 

Es un archivo de configuración que almacena variables de entorno (credenciales, claves API, configuraciones sensibles) para aplicaciones.

``` env
#DATABASE CONNECTION
DB_HOST = localhost  
DB_PORT = 3306  
DB_NAME = dss  
DB_USER = root  
DB_PASSWORD = ""  

#DEEPSEEK API KEY
API_KEY = ""  
```
### Archivo requirements.txt:

Es un archivo de texto que lista las dependencias (paquetes de Python) necesarias para que un proyecto funcione.

```txt
Django == 5.2
python-dotenv == 1.1.0
sqlparse == 0.5.3
```
### Archivo .gitignore:  

Es un archivo de texto que le indica a Git qué archivos o carpetas debe ignorar y no subir al repositorio.  
```txt
# Variables de entorno
.env
# Dependencias
/.venv
```
>[!IMPORTANT]
>+ En el archivo requirements.txt están las dependencias a instalar. Utiliza el siguiente comando: `pip install -r requirements.txt`
>+ Para iniciar el proyecto instala todas las dependencias necesarias y utiliza el comando `python manage.py runserver` , luego dirígete a **http://127.0.0.1:8000/**
