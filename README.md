TP de metodología de sistemas 2\.

# **¿Qué cambió y por qué? (puntos clave)**

* **Abstracción del acceso a datos**: implementé repositorios (`PortfolioRepository`, `AssetRepository`, `UserRepository`, `MarketDataRepository`, `TransactionRepository`) y una **fachada** `FacadeRepository` que centraliza llamadas. Este cambio es importante ya que cada una de estas podría representar lógica de acceso a una base de datos.

* **Listeners**: Utilizamos el patron observer para quitar logica en el servicio, y delegar la responsabilidad de actualizar información,  la interfaz ISimulationListener se encarga de encapsular los actualizadores, luego habrá más detalles sobre la implementación

* **Interfaces y clases abstractas**: se añadieron interfaces (`IMarketSimulationService`, `ISimulationListener`, `IListenerPortfolio`, `IListenerAsset`) y clases base para normalizar contratos.

* **ResponseService**: esta clase con sus métodos se encarga de enviar una respuesta con información correspondiente en formato JSON, en caso de error lanzar el error con su código. Aunque en algunos lugares hay mal manero de errores por la falta de tipificación. Estaría bueno implementar clases como error 404, error 401 y en los catch llamar a response Service dependiendo el tipo del error.  
  ![][image1]

**Patrones de diseño aplicados**

### **Repository:**

Se utilizó repository ya que la clase InMemoryStorage era una superclase que centralizaba toda la lógica de almacenamiento de datos, creando un Diccionario para almacenar cada tipo de dato, lo cual es demasiado complejo para un futuro migrar o simular una base de datos real con encapsulamiento.

* **Dónde:** `*Repository.ts` (Portfolio, Asset, User, MarketData, Transaction).

* **Cómo:** cada repo encapsula `findById`, `getAll`, `update`, `save`, etc. Servicios consumen repos a través de la fachada o con inyección.

* **Qué mejora:** desacopla lógica de negocio de persistencia; facilita tests y cambios de backend.

### **![][image2]**

### **Facade (Fachada):**

Opte por fachada ya que tenia problema con muchas inyecciones de dependencias para metodos unicos que necesitaba en los servicios, como getUserById, getAssetById, getPortfolioById, para poder usar estos 3 métodos necesitaba inyectar 3 repositorios, a lo que mi fachada resolvió el problema.

* **Dónde:** `FacadeRepository.ts`.

* **Cómo:** expone métodos combinados (`getPortfolioById`, `getAssetBySymbol`, `updatePortfolio`, `saveTransaction`, etc.) que internamente llaman a repos.

* **Qué mejora:** simplifica llamadas desde clientes que necesitaban varios repos; reduce cantidad de parámetros en servicios o controladores.

* **Nota:** al principio soluciono el problema de inyectar muchos repositorios en servicios, luego se hizo una clase muy grande que acopla muchos métodos, por lo que quizás era mejor implementar un mediador en lugar de una fachada.

![][image3]

### **Observer (Observador):**

Aquí reconocí útil un observer ya que MarketSimulationService tenía metodos como UpdatePortfolios, UpdateMarketData, UpdateAssets que rompen por completo el principio de responsabilidad única por lo que era mejor hacer una clase que esté esperando los cambios y los listeners que se encarguen de actualizar su entidad, sin involucrarse en lugares donde no corresponden

* **Dónde:** `MarketSimulationService` (publicador) y listeners (suscriptores).

* **Cómo:** el simulador produce ticks; los listeners reaccionan y actualizan portafolios/activos.

* **Qué mejora:** desacopla productor/consumidor; facilita extensión (métricas, notificaciones, logs).

![][image4]

### **Singleton:**

Aunque quizás un abuse un poco de este patrón lo considere fundamental en cada repositorio ya que cada uno de estos podría ser una conexión a una base de datos, servidor, etc. Simplemente no quiero instancias de bases de datos por cualquier lado en mi sistema, que sea una única instancia y acceder para utilizar los métodos.

* **Dónde:** `*Repository.ts`(uso actual).

* **Cómo:** instancia única accesible globalmente.

* **Qué mejora:** conveniencia en proyectos chicos; permite usar un único estado.  
  ![][image5]

### **Strategy:**

Antes la clase MarketAnalysisService se encargaba de analizar cada usuario con su portfolio, calcular su total y dar la recomendación según distintos factores. Ahora delegamos las tareas para dar un analisis a distintas clases como calculadoras(technical Analyst), Generador de recomendaciones y Analizador de riesgo y su clase market Analysis Service que actúa como una fachada entre estas 3 clases.

* **Dónde:** `RiskGenerator.ts`(Clase Contexto)

* **Cómo:**Cada clase `*Risk Strategy` se encarga de implementar la estrategia para generar la recomendación de forma correcta y Risk Generator se encarga de cambiar de forma dinámica cada estrategia

* **Qué mejora:** El contexto Risk Generator permite cambiar dinámicamente entre estrategias

* **Nota:** En base repository encontramos un mini Strategy implícito en donde el Map\<string, T\> de entidades cambia de forma dinámica en cada repositorio y como lo utilice evitando asi un diccionario por cada repositorio.

![][image6]

**Template method:**

Este patrón se encarga de diseñar varios métodos o algoritmos en una clase padre (en este caso BaseRepository)  donde declaramos la lógica sobre findById, save y probablemente en un futuro se puedan implementar más métodos.

* **Donde:** `BaseRepository` (Clase Abstracta)
* **Cómo:**

`findById(id: string): T { const entity = this.entities.get(id); if (!entity) throw new Error(this.getNotFoundMessage(id)); return entity;}`

`save(entity: T): void { this.entities.set(entity.id, entity) }`

* **Qué mejora**: Unifica la lógica sobre encontrar un objeto por su id o guardar un nuevo objeto.
