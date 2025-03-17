package test;

import org.apache.commons.io.FileUtils;
import org.junit.jupiter.api.*;
import org.openqa.selenium.*;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import io.github.bonigarcia.wdm.WebDriverManager;

import java.io.File;
import java.io.IOException;
import java.nio.file.Paths;
import java.time.Duration;
import org.openqa.selenium.interactions.Actions;
import org.junit.jupiter.api.MethodOrderer.OrderAnnotation;

@TestMethodOrder(OrderAnnotation.class)

public class Test1 {

    private WebDriver driver;
    private WebDriverWait wait;
    
    @BeforeEach
    public void setUp() {
        System.out.println("🟢 Iniciando WebDriver...");
        WebDriverManager.firefoxdriver().setup();
        driver = new FirefoxDriver();
        driver.manage().window().maximize();
        driver.get("https://demo.testim.io/");
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        System.out.println("✅ WebDriver listo.");
    }
    
    public void tomarScreenshot(String nombreArchivo) {
     
        File srcFile = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
        
        // ✅ Ruta donde se guardará la captura (carpeta 'screenshots' en el proyecto)
        String rutaArchivo = "screenshots/" + nombreArchivo + ".png";
        
        try {
            // ✅ Guardar la imagen en la ruta especificada
            FileUtils.copyFile(srcFile, new File(rutaArchivo));
            System.out.println("✅ Captura de pantalla guardada: " + rutaArchivo);
        } catch (IOException e) {
            System.out.println("❌ ERROR al guardar la captura de pantalla: " + e.getMessage());
        }
    }
    
    
  private void FechaSalida() {
	  System.out.println("Seleccionando fecha actual y confirmando...");

	    // Paso 1: Hacer clic en el input de "Departing" para abrir el calendario
	    WebElement inputDeparting = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id='app']/div/section[1]/div[3]/div/div[1]/div/div/input")));
	    inputDeparting.click();
	    //Paso 2: Hacer clic en el botón "OK" para confirmar
	    WebElement botonOK = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='Ok']")));
	    botonOK.click();
	    System.out.println("✅ fecha Departing seleccionado.");
  }
  
  private void AdultosNinos() {
	  
	  System.out.println("Seleccionando 2 adultos con 1 niño");
	  WebElement inputAdults = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"app\"]/div/section[1]/div[3]/div/div[3]")));
	  inputAdults.click();
	  WebElement adultos = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class='theme__dropdown___co-4M WhiteDropDown__dropdown___2JJF3 theme__active___31xyK WhiteDropDown__active___3HcKK Hero__dropdown-size-2___2eNNl']//li[contains(text(),'2')]"))); 
	  adultos.click();
	  
	  WebElement inputnino = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"app\"]/div/section[1]/div[3]/div/div[4]")));
	  inputnino.click();
	  WebElement nino = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@class='theme__dropdown___co-4M WhiteDropDown__dropdown___2JJF3 theme__active___31xyK WhiteDropDown__active___3HcKK Hero__dropdown-size-2___2eNNl']//li[contains(text(),'1')]"))); 
	  nino.click();
	  System.out.println("✅ 2 adultos con 1 niño seleccionado.");
  }
    
    private void seleccionarColorAzul() {
        System.out.println("Seleccionando color azul...");

        WebElement dropdownBoton = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("(//div[@data-react-toolbox='dropdown'])[4]")));
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", dropdownBoton);
        dropdownBoton.click();

        WebElement opcionAzul = wait.until(ExpectedConditions.elementToBeClickable(
            By.xpath("//ul[contains(@class,'theme__values')]//li[text()='Blue']")));
        opcionAzul.click();

        System.out.println("✅ Color Azul seleccionado.");
    }
    
    private void ReservaTayabamba() {
    	WebElement estadoBooked = driver.findElement(By.xpath("//div[2]//div[4]//button[1]"));
    	estadoBooked.click();
    	wait.until(ExpectedConditions.urlContains("checkout"));
        System.out.println("✅ Página de checkout cargada.");
     // ✅ Volver a la página anterior
        driver.navigate().back();
        wait.until(ExpectedConditions.urlToBe("https://demo.testim.io/"));
        System.out.println("✅ Página recargada correctamente.");
        WebElement estadoBookedFinal = wait.until(ExpectedConditions.presenceOfElementLocated(
        	 By.xpath("//button[normalize-space()='Booked']"))); 
        
        wait.until(ExpectedConditions.textToBePresentInElement(estadoBookedFinal, "BOOKED"));
        System.out.println("✅ Confirmación: Tayabamba ahora está BOOKED.");
    }
    
    private void CheckoutFormulario() {
    	WebElement estadoBookedFinal = wait.until(ExpectedConditions.presenceOfElementLocated(
           	 By.xpath("//button[normalize-space()='Booked']"))); 
    	estadoBookedFinal.click();
    	System.out.println("✅ Página de checkout cargada.");
    	
    	WebElement nameInput = wait.until(ExpectedConditions.elementToBeClickable(By.cssSelector("form div:nth-child(1) input:nth-child(1)")));
    	nameInput.sendKeys("Marco");
    	
    	WebElement emailInput = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//input[@type='email']")));
    	emailInput.sendKeys("marco@gmail.com");
    	
    	// ✅ Ingresar Social Security Number
        WebElement ssnInput = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//*[@id=\"app\"]/div/div[2]/section[1]/div[3]/div[1]/form/div[3]/input")));
        ssnInput.sendKeys("111-11-1111");
        System.out.println("✅ SSN ingresado.");

        // ✅ Ingresar Teléfono
        WebElement phoneInput = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//input[@type='tel']")));
        phoneInput.sendKeys("2124567890");
        System.out.println("✅ Teléfono ingresado.");
    }
    
    private void CargarFoto() throws InterruptedException {
    	
    	 WebElement uploadInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//input[@type='file']")));
    	 String rutaImagen = Paths.get("src/test/resources/img.png").toAbsolutePath().toString();
    	 uploadInput.sendKeys(rutaImagen);
    	    System.out.println("✅ Imagen subida correctamente.");
    	    WebElement uploadedFileName = wait.until(ExpectedConditions.presenceOfElementLocated(
    	    		  By.xpath("//div[@class='CustomerInfo__dropzone___3tqul']//img")));
    	    Assertions.assertNotNull(uploadedFileName, "❌ ERROR: La imagen no se ha cargado correctamente.");
    	    System.out.println("✅ Verificación completada: Imagen 'img.png' subida y mostrada correctamente.");
    }
    
    private void CodigoPromocional() {
    	
    	WebElement codpromo = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//input[@name='promo']")));
    	codpromo.sendKeys("30076");
    	  System.out.println("✅ COdigo promocional ingresado.");
    	  WebElement applyButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[normalize-space()='Apply']")));
    	  applyButton.click();
    	  
    }
    
    private void RealizarPago() {
    	
    	WebElement Inputpagar = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//html/body/div/div/div[2]/section[1]/div[3]/div[2]/div[7]/div/button ")));
    	Inputpagar.click();
    	System.out.println("✅ Pago exitoso.");	  
    }
    
     
  @Test
  @Order(1)
    @DisplayName("Validar título de la página")
    public void testValidarTitulo() {
	  String tituloEsperado = "Space & Beyond";
      String tituloActual = driver.getTitle();
      
      Assertions.assertTrue(tituloActual.contains(tituloEsperado), 
          "❌ ERROR: El título de la página no es el esperado.");
      tomarScreenshot("test_validar_titulo");
    }
  
  
  @Test
  @Order(2)
  @DisplayName("Validar que 'Madan' existe en la lista de destinos")
  public void testValidarDestinoMadan() {
      System.out.println("Buscando 'Madan'...");
      WebElement destinoMadan = wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//h5[normalize-space()='Madan']")));
      Assertions.assertNotNull(destinoMadan, "ERROR: No se encontró 'Madan' en la lista de destinos.");
      tomarScreenshot("test Validar Destino Madan");
  }
  
  @Test
  @Order(3)
  @DisplayName ("Seleccion fecha actual como fecha de salida - en la prueba funcional del pdf enviado solicita fecha antigua 2023 lo cual no permite seleccionar fecha anterior")
  public void testSeleccionarFechaSalida() {
	  FechaSalida();
	  tomarScreenshot("test Validar Fecha de salida");
	}

  
  @Test
  @Order(4)
  @DisplayName ("Elige que el boleto sea para 2 adultos con 1 niño")
  public void testSeleccionarAdultosNino() {
	  FechaSalida();
	  AdultosNinos();
	  tomarScreenshot("testSeleccionarAdultosNino");
  }
 

  @Test
  @Order(5)
  @DisplayName("Seleccionar 'Blue'")
  public void testSeleccionarColorAzul() throws InterruptedException {
	  
	  FechaSalida();
	  AdultosNinos();
	  seleccionarColorAzul();
	  tomarScreenshot("testSeleccionarBlue");
  }
  
  
  @Test
  @Order(6)
  @DisplayName("Reservar Tayabamba")
  public void testReservarTayabamba() {
	  
	  FechaSalida();
	  AdultosNinos();
	  seleccionarColorAzul();
	  ReservaTayabamba();
	  tomarScreenshot("test Reservar Tayabamba");
      
  }
  
  @Test
  @Order(7)
  @DisplayName("Checkout")
  public void tesLLenarDatostCheckout() {
	  
	  FechaSalida();
	  AdultosNinos();
	  seleccionarColorAzul();
	  ReservaTayabamba();
	  CheckoutFormulario();
	  tomarScreenshot("Checkout Formulario");
  }
  
  @Test
  @Order(8)
  @DisplayName("Cargar Foto")
  public void testCargarFoto() throws InterruptedException {
	 
	  FechaSalida();
	  AdultosNinos();
	  seleccionarColorAzul();
	  ReservaTayabamba();
	  CheckoutFormulario();
	  CargarFoto();
	  tomarScreenshot("test Cargar Foto");
	  
  }
  
  @Test
  @Order(9)
  @DisplayName("Ingresar codigo promocional") 
  
  public void testCodigoPromocional() throws InterruptedException  {
	  
	  FechaSalida();
	  AdultosNinos();
	  seleccionarColorAzul();
	  ReservaTayabamba();
	  CheckoutFormulario();
	  CargarFoto();
	  CodigoPromocional();
	  tomarScreenshot("test codigo Promocional");
  }
  
  @Test
  @Order(10)
  @DisplayName("Ingresar pago") 
  
  public void testPagar() throws InterruptedException  {
	  
	  FechaSalida();
	  AdultosNinos();
	  seleccionarColorAzul();
	  ReservaTayabamba();
	  CheckoutFormulario();
	  CargarFoto();
	  CodigoPromocional();
	  RealizarPago();
	  tomarScreenshot("test pago");
	  
  }
  

	@AfterEach
	public void tearDown() {
	    if (driver != null) {
	        driver.quit();
	        System.out.println("🔴 Navegador cerrado.");
	    }
	    
	}
	
	}
