export abstract class BaseRepository<T> {
  protected entities: Map<string, T> = new Map();

  getOneById(id: string): T | null {
    return this.findById(id);
  }
  constructor() {
    this.initializeDefaultData();
  }

  getOneByIdOrFail(id: string): T {
    const entity = this.getOneById(id);
    if (!entity) {
      throw new Error(this.getNotFoundMessage(id));
    }
    return entity;
  }
  abstract initializeDefaultData(): void;

  protected getNotFoundMessage(id: string): string {
    return "Recurso no encontrado";
  }

  abstract findById(id: string): T | null;
}

/*
 El patrón repository es un patrón de diseño para ubicar el acceso a datos en la capa externa de la aplicación y así mantener el dominio agnóstico a sus fuentes de datos (y sobre todo a su implementación).

https://platzi.com/blog/patron-repository/

Esto es importante por principalmente 3 motivos:

Migraciones: No es frecuente, pero es común que las aplicaciones deban migrar su base de datos. El proceso se complica si hay código específico de la fuente de datos en toda la aplicación o atado a las reglas de negocio.

Múltiples fuentes de datos: Es frecuente tener varias fuentes de datos en una aplicación. Puede haber diferentes bases de datos, almacenamiento de archivos o sistemas de terceros como CRM o motores de búsqueda.

Facilitar el testing: Las pruebas de bases de datos requieren un entorno separado. Separar el acceso a datos del dominio ahorra configuración en la mayoría de pruebas.

*/
/*
El patrón de repositorio es una abstracción de la capa de datos.
En esencia, un repositorio es como una caja negra que puede recibir y enviar datos de y a tu base de datos.
Lo bueno del  patrón repositorio es que, desde la perspectiva del resto de tu código, no importa qué tipo de base de datos estés utilizando o cómo esté implementada.
 O en otras palabras, estamos abstrayendo la implementación.
* */
