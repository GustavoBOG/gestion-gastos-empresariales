# 📊 Sistema de Gestión de Gastos Empresariales

Sistema profesional de registro de gastos por voz y manual con reconocimiento de voz en español, diseñado para facilitar la gestión de gastos de equipos de trabajo.

## ✨ Características

- **🎤 Reconocimiento de Voz**: Dicta facturas completas y el sistema extrae automáticamente todos los items
- **✏️ Entrada Manual**: Opción de introducir datos manualmente
- **👥 Gestión de Trabajadores**: Selección múltiple de trabajadores y agregado personalizado
- **📅 Control de Fechas**: Asigna fechas específicas a cada registro
- **✍️ Edición en Línea**: Todos los campos son editables directamente
- **📥 Exportación CSV**: Descarga datos en formato Excel
- **💬 WhatsApp**: Copia resúmenes formateados para compartir
- **💾 Persistencia**: Los datos se guardan automáticamente en el navegador

## 📁 Estructura del Proyecto

```
pulsing-magnetar/
├── index.html          # Interfaz de usuario
├── css/
│   └── styles.css      # Estilos personalizados
├── js/
│   ├── config.js       # Constantes y configuración
│   ├── storage.js      # Gestión de localStorage
│   ├── workers.js      # Gestión de trabajadores
│   ├── voice.js        # Reconocimiento de voz
│   ├── tickets.js      # CRUD de tickets
│   ├── export.js       # Exportación (CSV/WhatsApp)
│   └── app.js          # Inicialización y coordinación
└── README.md           # Este archivo
```

## 🚀 Uso

1. **Abrir** `index.html` en un navegador moderno (Chrome, Edge, Safari)
2. **Seleccionar** trabajadores y fecha de los gastos
3. **Registrar gastos** por voz o manualmente:
   - **Voz**: Pulsa "Iniciar Grabación" y dicta: *"Restaurante La Bodega, coca cola seis euros, arroz doce euros, café uno con ochenta"*
   - **Manual**: Rellena los campos y pulsa "Añadir"
4. **Revisar y editar** los tickets directamente en la lista
5. **Exportar** a CSV o copiar resumen para WhatsApp

## 🔧 Tecnologías

- **HTML5** - Estructura
- **Tailwind CSS** - Framework de estilos
- **Vanilla JavaScript** - Lógica (ES6 Classes)
- **Web Speech API** - Reconocimiento de voz
- **LocalStorage** - Persistencia de datos

## 📱 Compatibilidad

- ✅ Chrome/Edge (recomendado para voz)
- ✅ Safari (iOS/macOS)
- ⚠️ Firefox (sin soporte de voz)

## 🎯 Funcionalidades del Reconocimiento de Voz

- Conversión de números hablados a dígitos
- Extracción automática de restaurante
- Detección de múltiples items con precios
- Grabación continua sin límite de tiempo
- Soporte para decimales ("uno con ochenta" = 1.80€)

## 👨‍💻 Desarrollador

Sistema desarrollado para facilitar la gestión de gastos empresariales de equipos de trabajo móviles.

---

**Versión**: 2.0  
**Última actualización**: Diciembre 2024
