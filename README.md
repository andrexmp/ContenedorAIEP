# Sistema de Gestión de Contenedores

## Descripción
Sistema web para la gestión y control de contenedores de carga, permitiendo el registro de usuarios, administración de contenedores y seguimiento de viajes.

## Requisitos Previos
- Node.js (versión 14 o superior)
- NPM (Node Package Manager)
- SQLite3

## Instalación

1. Clonar el repositorio:
```bash
git clone <URL_DEL_REPOSITORIO>
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar la base de datos:
- La base de datos SQLite3 se creará automáticamente al iniciar el servidor.
- El esquema de la base de datos se encuentra en `/database/schema.sql`.

## Índice
- [Instalación y Configuración](#instalación)
- [Configuración](#configuración)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Ejecución](#ejecución)
- [Pruebas](#pruebas)
- [Características Principales](#características-principales)
- [Roles de Usuario](#roles-de-usuario)
- [Notas Adicionales](#notas-adicionales)

## Instalación y Configuración

### Instalar dependencias
```bash
npm install
```

### Configurar la base de datos
- La base de datos SQLite3 se creará automáticamente al iniciar el servidor.
- El esquema de la base de datos se encuentra en:
```bash
/database/schema.sql
```

## Configuración

### Variables de entorno
- El servidor utiliza el puerto 3000 por defecto.
- La clave secreta para JWT está configurada en el archivo:
```bash
server.js
```

## Estructura del Proyecto
```bash
Container_Beta/
├── database/
│   └── schema.sql
├── js/
│   ├── containerService.js
│   ├── database.js
│   └── validation.js
├── public/
│   ├── admin-dashboard.html
│   ├── client-dashboard.html
│   ├── index.html
│   ├── manual-load.html
│   └── js/
│       ├── auth.js
│       └── server.js
├── tests/
│   ├── functional.test.js
│   ├── integration.test.js
│   ├── system.test.js
│   └── unit.test.js
├── server.js
└── package.json
```
## Ejecución

### Iniciar el servidor
```bash
npm start
```

O si usas nodemon:
```bash
npm run dev
```

### Acceder a la aplicación
- Abrir el navegador y visitar:
```bash
http://localhost:3000
```

## Pruebas

Para ejecutar las pruebas:
```bash
npm test
```

## Características Principales
- Registro y autenticación de usuarios
- Panel de administración
- Panel de cliente
- Gestión de contenedores
- Seguimiento de viajes
- Generación de informes

## Roles de Usuario

### Administrador
- Gestión completa de contenedores
- Visualización de estadísticas
- Administración de usuarios

### Cliente
- Visualización de informes
- Seguimiento de envíos

## Notas Adicionales

Este proyecto fue desarrollado como parte de un ejercicio académico orientado a la simulación de un sistema real de gestión de contenedores marítimos.
Nos permitió comprender y aplicar conceptos como la arquitectura modular, la conexión a bases de datos, la creación de rutas y controladores, y el uso de pruebas automatizadas en un entorno realista.

## Agradecimientos
Queremos agradecer especialmente al profesor Ricardo Martínez por la propuesta de un ejercicio tan práctico y realista.
Gracias a este desafío, tuvimos la oportunidad de explorar áreas que desconocíamos, como la estructuración profesional de un backend completo, la importancia de los flujos de carga de datos, y la validación de procesos a través de pruebas automatizadas.

Su enfoque práctico nos ayudó a entender mejor la dinámica de proyectos de desarrollo reales y nos motivó a profundizar en el uso de tecnologías como Node.js y SQLite3.


