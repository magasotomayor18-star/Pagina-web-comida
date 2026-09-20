# Auditoría de accesibilidad, UX y diseño responsive

**Alcance:** revisión no destructiva de `index.html`, `styles.css` y `script.js` frente a criterios relevantes de WCAG 2.2 AA, experiencia de usuario y comportamiento responsive.

**Archivos auditados:**

- `index.html`
- `styles.css`
- `script.js`

**Archivos modificados durante la auditoría:** ninguno de los archivos auditados. Solo se creó este informe.

## 1. Resumen ejecutivo

La primera versión presenta una base sólida: usa `lang="es"`, título y descripción, estructura con `header`, `nav`, `main` y `footer`, una jerarquía de encabezados coherente, controles nativos de HTML, textos alternativos descriptivos en todas las imágenes revisadas y una navegación móvil funcional. Las interacciones principales probadas funcionan: filtros, apertura del menú móvil, selección de productos, cantidades, total y simulación del pedido.

Se detectan **tres áreas prioritarias de corrección**:

1. Varios pares de colores no alcanzan el contraste mínimo AA para texto normal.
2. Los botones de incremento y decremento del pedido miden `22 x 22 px`, por debajo del mínimo de `24 x 24 px` de WCAG 2.2 AA para objetivos táctiles.
3. El estado del menú móvil cambia `aria-expanded`, pero su nombre visible para tecnologías de asistencia permanece como “Abrir menú de navegación” cuando ya está abierto.

También conviene mejorar los anuncios dinámicos del carrito, reforzar el indicador de foco sobre fondos claros y dar un rol semántico explícito a la galería. No se encontró un error de sintaxis JavaScript ni un overflow horizontal confirmado en las resoluciones probadas.

## 2. Hallazgos críticos, altos, medios y bajos

### Críticos

No se encontraron hallazgos críticos.

### Altos

No se encontraron hallazgos altos.

### Medios

#### M-01. Contraste insuficiente en colores de texto y botones

**Criterios relacionados:** WCAG 1.4.3 Contraste mínimo, WCAG 1.4.11 Contraste no textual.

**Evidencia concreta:**

- `styles.css`, variables `--orange`, `--yellow`, `--paper`, `--white` y `--green`.
- `styles.css`, reglas `.eyebrow`, `.brand strong`, `.text-link`, `.button-primary`, `.promo-card` y `.light .eyebrow`.
- `index.html`, textos como “Hecho al momento en Quito”, enlaces naranja, botones primarios y el contenido de promociones.

Mediciones calculadas sobre los colores declarados:

- `#ef5b32` sobre `#f7f4ef`: **3.08:1**, insuficiente para texto normal AA.
- `#ef5b32` sobre `#fffdf9`: **3.33:1**, insuficiente para texto normal AA.
- `#fffdf9` sobre `#ef5b32`: **3.33:1**, insuficiente para texto normal AA.
- `#f5c54b` sobre `#53685a`: **3.71:1**, insuficiente para texto normal de 12 px.
- `#736d66` sobre `#f7f4ef`: **4.66:1**, cumple el mínimo AA para texto normal.
- `#53685a` sobre `#fffdf9`: **5.91:1**, cumple.
- `#252321` sobre `#f5c54b`: **9.67:1**, cumple.

**Recomendación de corrección:** usar un naranja más oscuro para textos sobre fondos claros y para el texto de los botones naranjas, o cambiar el texto de los botones a un color oscuro. Recalcular cada combinación con una herramienta de contraste y asegurar al menos `4.5:1` para texto normal y `3:1` para texto grande. Revisar también el amarillo usado como texto pequeño sobre verde.

#### M-02. Objetivos táctiles de los controles de cantidad demasiado pequeños

**Criterios relacionados:** WCAG 2.5.8 Tamaño del objetivo, WCAG 2.5.5 Tamaño del objetivo táctil como buena práctica UX.

**Evidencia concreta:**

- `styles.css`, regla `.quantity-controls button`: `width: 22px; height: 22px;`.
- `script.js`, controles generados dinámicamente dentro de `renderCart()`.

Los botones `+` y `−` del resumen del pedido tienen un área de `22 x 22 px`. WCAG 2.2 AA establece un objetivo mínimo de `24 x 24 CSS px`, salvo excepciones específicas. Además, `44 x 44 px` ofrece una experiencia táctil más cómoda en móviles.

**Recomendación de corrección:** aumentar el área interactiva a por lo menos `24 x 24 px`; preferiblemente usar `44 x 44 px` y conservar un icono visual pequeño centrado. Verificar que el aumento no produzca overflow en 320 px.

#### M-03. Nombre accesible del botón de navegación móvil no refleja el estado

**Criterios relacionados:** WCAG 4.1.2 Nombre, función, valor; patrón de botón de menú accesible.

**Evidencia concreta:**

- `index.html`, botón `.menu-toggle`: contiene el texto oculto “Abrir menú de navegación” y `aria-expanded="false"`.
- `script.js`, manejador del botón `.menu-toggle`: cambia `aria-expanded` y la clase `.is-open`, pero no cambia el texto accesible.

Cuando el menú está abierto, el botón sigue anunciándose como “Abrir menú de navegación”. `aria-expanded` comunica el estado, pero un nombre que también indique “Cerrar” reduce ambigüedad y mejora la UX con lector de pantalla.

**Recomendación de corrección:** usar un elemento oculto reutilizable cuyo texto cambie entre “Abrir menú de navegación” y “Cerrar menú de navegación”, o aplicar un nombre accesible equivalente al cambiar el estado. Mantener `aria-expanded` y `aria-controls`.

#### M-04. Indicador de foco amarillo con contraste débil sobre fondos claros

**Criterios relacionados:** WCAG 2.4.7 Foco visible, WCAG 2.4.11 Foco no oculto, WCAG 1.4.11 Contraste no textual.

**Evidencia concreta:**

- `styles.css`, regla global `:focus-visible { outline: 3px solid var(--yellow); outline-offset: 4px; }`.
- `styles.css`, `--yellow: #f5c54b` y fondos `--white: #fffdf9`, `--paper: #f7f4ef`.

El foco está definido y es visible en principio, pero el amarillo tiene poco contraste contra los fondos blancos o crema y puede no alcanzar el contraste requerido como indicador no textual en botones claros y filtros.

**Recomendación de corrección:** usar un color de foco oscuro o un doble anillo con un color oscuro y uno claro, y comprobarlo sobre todos los fondos. Mantener `:focus-visible` para no eliminar el foco del teclado.

### Bajos

#### B-01. Actualizaciones del pedido no se anuncian completamente

**Criterios relacionados:** WCAG 4.1.3 Mensajes de estado.

**Evidencia concreta:**

- `index.html`, `#order-message` tiene `role="status"` y `aria-live="polite"`.
- `script.js`, `addToCart()` actualiza el mensaje al agregar un producto.
- `script.js`, `changeQuantity()` actualiza cantidades y total, pero no actualiza `#order-message`.
- `script.js`, `renderCart()` actualiza `#nav-count`, `#order-count` y `#order-total` sin una región viva asociada.

Agregar un producto sí produce un mensaje de estado. Quitar, incrementar o disminuir cantidades cambia información importante visualmente, pero no siempre genera un anuncio para lector de pantalla.

**Recomendación de corrección:** emitir un mensaje breve en `#order-message` después de cualquier cambio de cantidad y, si se requiere mayor claridad, asociar una región viva específica al resumen o etiquetar adecuadamente los totales dinámicos.

#### B-02. `aria-label` aplicado sobre elementos genéricos sin rol específico

**Criterios relacionados:** WCAG 4.1.2 y semántica ARIA.

**Evidencia concreta:**

- `index.html`, `.hero-notes` usa `aria-label="Características del restaurante"` sobre un `div` genérico.
- `index.html`, `.gallery` usa `aria-label="Galería de comida rápida"` sobre un `div` genérico.

Un nombre ARIA sobre un elemento genérico no siempre crea una experiencia consistente en tecnologías de asistencia. Las imágenes sí tienen `alt` descriptivo, por lo que el impacto es bajo.

**Recomendación de corrección:** convertir la galería en `<section aria-labelledby="...">` con un encabezado, o usar un rol apropiado solo si es realmente necesario. Para las características, usar una lista (`ul`/`li`) o una sección con encabezado visible.

#### B-03. Dependencia de imágenes y fuentes externas

**Evidencia concreta:**

- `index.html`, enlaces a `images.unsplash.com` para todas las imágenes.
- `index.html`, hoja de fuentes de Google Fonts.

La página funciona con un servidor local, pero la apariencia y el contenido visual dependen de red. Si Unsplash o Google Fonts no responden, el navegador mostrará imágenes rotas o fuentes de respaldo. No es un incumplimiento WCAG por sí mismo, pero sí un riesgo de robustez y rendimiento.

**Recomendación de corrección:** alojar los recursos en el proyecto cuando el sitio pase a producción, o agregar una estrategia de fallback. Mantener `alt` descriptivos y probar la experiencia con imágenes bloqueadas.

## 3. Evidencia de criterios cumplidos

### Estructura y contenido

- **Cumple:** `index.html` declara `lang="es"`, `charset`, viewport, descripción y un `<title>` descriptivo.
- **Cumple:** existen `header`, `nav`, `main` y `footer`.
- **Cumple:** la jerarquía principal es `h1` para la portada, `h2` para secciones y `h3` para productos/promociones. No se observaron saltos estructurales graves.
- **Cumple:** la navegación interna usa enlaces reales con destinos `#inicio`, `#menu`, `#promociones`, `#historia`, `#contacto` y `#pedido`.
- **Cumple:** teléfono y correo usan enlaces `tel:` y `mailto:`; los enlaces externos incluyen `target="_blank"` y `rel="noopener noreferrer"`.

### Nombres accesibles, imágenes y ARIA

- **Cumple:** las 11 imágenes detectadas tienen texto `alt` no vacío y describen su contenido visual.
- **Cumple:** los botones de agregar producto tienen `aria-label` con el nombre del producto.
- **Cumple:** los controles dinámicos de cantidad reciben nombres como “Agregar una unidad de La Urbana” y “Quitar una unidad de La Urbana”.
- **Cumple:** el botón de menú tiene `aria-controls` y `aria-expanded`.
- **Cumple parcialmente:** se usa `role="status"` con `aria-live="polite"` para el mensaje de pedido, aunque no cubre todos los cambios del carrito.

### Teclado y foco

- **Cumple parcialmente:** los controles son enlaces o botones nativos y, por tanto, son alcanzables mediante teclado.
- **Cumple parcialmente:** existe una regla global `:focus-visible` de 3 px y un enlace “Saltar al contenido principal”. El contraste del anillo sobre fondos claros debe corregirse según M-04.
- **Cumple:** el menú móvil se puede abrir con un botón y no depende exclusivamente de hover.

### Responsive y overflow

- **Cumple:** existen media queries para `950 px`, `720 px`, `430 px` y `prefers-reduced-motion`.
- **Cumple:** en las pruebas del navegador se cargó la página en `320 px`, `398 px`, `768 px` y `1280 px`.
- **Cumple:** a `320 px` y `398 px` el botón del menú móvil aparece; a `768 px` y `1280 px` se muestra la navegación de escritorio.
- **Cumple:** el menú móvil abrió correctamente en `398 px`.
- **Cumple:** no se confirmó overflow horizontal real. La primera medición comparando `scrollWidth` con `clientWidth` en `320 px` quedó afectada por el ancho reservado para la barra vertical; la inspección posterior de los límites de los elementos no encontró contenido que excediera el ancho del viewport de `320 px`.
- **Pendiente de revisión visual:** no se puede certificar desde una prueba automatizada que no exista solapamiento visual en todos los navegadores y niveles de zoom.

### JavaScript e interacciones

- **Cumple:** `node --check script.js` terminó sin errores.
- **Cumple:** no se reportaron errores de diagnóstico en los archivos auditados.
- **Cumple:** el filtro “Bebidas” dejó visible una tarjeta.
- **Cumple:** el menú móvil cambió a estado abierto.
- **Cumple:** el carrito sumó dos unidades (`$15.00`), disminuyó a una (`$7.50`) y mostró el mensaje de simulación al confirmar.
- **Cumple:** los elementos del DOM requeridos por `script.js` existen en `index.html` durante las pruebas realizadas.

## 4. Recomendación de corrección para cada hallazgo

Orden recomendado:

1. Corregir M-01 con una paleta AA comprobada para texto, botones, etiquetas y enlaces.
2. Corregir M-02 aumentando los controles de cantidad a un objetivo mínimo de `24 x 24 px`, preferiblemente `44 x 44 px`.
3. Corregir M-03 actualizando el nombre accesible del botón al abrir y cerrar el menú.
4. Corregir M-04 con un anillo de foco que conserve al menos `3:1` de contraste en fondos claros y de color.
5. Corregir B-01 anunciando cambios de cantidad y total mediante una región de estado.
6. Corregir B-02 usando una sección o lista semántica para las agrupaciones etiquetadas.
7. Evaluar B-03 antes de publicar: descargar recursos o definir fallbacks y estrategia de rendimiento.

## 5. Pruebas que deberían repetirse después de corregir los problemas

1. Ejecutar una comprobación de contraste para cada combinación de texto, fondo, botón, etiqueta y foco con WCAG 2.2 AA.
2. Navegar toda la página únicamente con `Tab`, `Shift+Tab`, `Enter` y `Space`, comprobando orden, foco visible, enlace de salto y apertura/cierre del menú.
3. Probar el menú móvil con lector de pantalla y confirmar que anuncia “Abrir” y “Cerrar” según corresponda.
4. Añadir, incrementar, disminuir y eliminar productos usando teclado y lector de pantalla; confirmar que se anuncien cantidades y total.
5. Repetir pruebas visuales en `320 px`, `398 px`, `768 px` y escritorio, además de zoom del navegador al `200%` y `400%`.
6. Confirmar que `document.documentElement.scrollWidth` no exceda el ancho del viewport en cada resolución.
7. Ejecutar `node --check script.js` y revisar la consola del navegador para errores y advertencias.
8. Probar con imágenes externas bloqueadas y con fuentes externas no disponibles para comprobar fallbacks y textos alternativos.
9. Verificar objetivos táctiles reales en móvil, especialmente los controles de cantidad y el botón del menú.
10. Validar nuevamente los enlaces internos, teléfono, correo, enlaces externos, filtros, selección, cantidades y simulación del pedido.
