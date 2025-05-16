import http.client

def check_internet_connection()-> None:
    conn = http.client.HTTPConnection("www.google.com", timeout=5)
    try:
        conn.request("HEAD", "/")
        response = conn.getresponse()
        if response.status != 200:
            raise ConnectionError("No se pudo establecer conexión a Internet. Verifica tu conexión.")
    except Exception:
        raise ConnectionError(f"Error de conexión. Verifique su conexión a Internet.")
    finally:
        conn.close()