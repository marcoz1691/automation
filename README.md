
# Automatización de Pruebas con Selenium (JUnit 5 + Maven)

Este proyecto contiene pruebas automatizadas para la página [Testim Demo](https://demo.testim.io/), simulando la compra de boletos para viajes espaciales.

Todas las pruebas están implementadas en **JUnit 5** y se ejecutan utilizando **Maven**. Además, el código incluye **mensajes en consola claros** para verificar el seguimiento de la ejecución de los casos.

---

## ✅ 1. Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente:

### Sistema Operativo
- Windows / Linux / macOS

### Software Necesario
- **Java 17+**: Descargar desde [Oracle JDK](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html) o instalar con:
  ```sh
  sudo apt install openjdk-17-jdk   # Ubuntu/Debian
  brew install openjdk@17           # macOS
Puedes descargar el proyecto como .zip
Antes de ejecutar las pruebas, asegúrate de:

Abrir el proyecto en Eclipse o cualquier IDE compatible con Maven.
Actualizar dependencias Maven (si es necesario):

mvn clean install
✅ 4. Estructura del Proyecto
El código está organizado de la siguiente manera:


SeleniumTest/
│── src/
│   ├── main/ (Código principal, si aplica)
│   ├── test/
│       ├── java/
│       │   ├── test/
│       │   │   ├── Test1.java  (Clase con los casos de prueba)
│       ├── resources/
│       │   ├── img.png  (Imagen de prueba para carga de archivos)
│── pom.xml  (Configuración de Maven y dependencias)
│── screenshots/  (Capturas de pantalla generadas)
│── readme.txt  (Instrucciones de instalación y ejecución)
│── informe.txt  (Hallazgos, conclusiones y recomendaciones)
✅ 5. Ejecución de Pruebas
📌 Ejecutar todas las pruebas
Desde la terminal dentro del proyecto:

sh
Copy
Edit
mvn test
Ejecutar una prueba específica
Ejemplo: Para ejecutar solo la prueba de cargar foto:

sh
Copy
Edit
mvn -Dtest=Test1#testCargarFoto test
Ver errores detallados
sh
Copy
Edit
mvn test -e
✅ 6. Seguimiento en Consola
Cada prueba incluye mensajes detallados en la consola, lo que facilita el seguimiento de la ejecución.

Ejemplo de mensajes en consola:

Iniciando WebDriver...
WebDriver listo.
Seleccionando fecha actual y confirmando...
Fecha Departing seleccionada.
Seleccionando color azul...
Color Azul seleccionado.
Reservando Tayabamba...
Página de checkout cargada.
Captura de pantalla guardada: screenshots/testReservarTayabamba.png
Navegador cerrado.
Estos mensajes aparecen en la consola al ejecutar las pruebas, lo que permite verificar cada paso del flujo de trabajo.

✅ 7. Capturas de Pantalla
Todas las capturas de pantalla generadas durante las pruebas se guardan en la carpeta:

bash
Copy
Edit
SeleniumTest/screenshots/
Puedes verificar las imágenes con:

sh
Copy
Edit
ls screenshots/
O abrir la carpeta manualmente en tu explorador de archivos.

✅ 8. Posibles Errores y Soluciones
Error	🛠 Solución
java.lang.NoClassDefFoundError	Ejecutar mvn clean install para descargar dependencias faltantes.
org.openqa.selenium.NoSuchElementException	Verificar si los elementos de la página han cambiado.
org.openqa.selenium.TimeoutException	Aumentar el tiempo de espera (WebDriverWait) en los ExpectedConditions.
NoSuchSessionException: Session ID is null	Asegurarse de que WebDriver no se cierre antes de tiempo (driver.quit()).
mvn command not found	Instalar Maven (sudo apt install maven en Linux).
✅ 9. Notas Finales
Este proyecto usa Selenium con JUnit 5 para pruebas funcionales automatizadas.
WebDriverManager maneja automáticamente los drivers de navegador.
Si deseas ejecutar en Chrome, puedes modificar FirefoxDriver() por ChromeDriver() en setUp().
¡Ahora puedes ejecutar las pruebas en cualquier computadora con estos pasos! 🚀


### **Cómo Guardar el Archivo `readme.txt`**
1. **Abre un editor de texto**:
   - En **Windows**, abre el Bloc de notas (`Win + R`, escribe `notepad` y presiona `Enter`).
   - En **Linux/macOS**, usa `nano` o `vim`:
     ```sh
     nano readme.txt
     ```
2. **Copia y pega** todo el contenido anterior.
3. **Guárdalo como `readme.txt`** en la carpeta de tu proyecto.

---

¡Listo! Ya tienes el archivo `readme.txt` con todo lo necesario. 
