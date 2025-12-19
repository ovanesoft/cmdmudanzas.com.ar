# CMD Mudanzas - Sitio Web Profesional

Sitio web moderno y responsivo para CMD Mudanzas, empresa argentina de mudanzas y logística.

## Características

### Diseño y UX
- ✅ Diseño totalmente responsivo (mobile-first)
- ✅ 5 paletas de colores personalizables por el usuario
- ✅ Animaciones suaves y transiciones
- ✅ Interfaz limpia y moderna
- ✅ Navegación intuitiva con scroll suave

### SEO Optimizado
- ✅ Meta tags completos (description, keywords, author)
- ✅ Open Graph tags para redes sociales
- ✅ Twitter Card tags
- ✅ Schema.org structured data (MovingCompany)
- ✅ URLs canónicas
- ✅ Sitemap friendly
- ✅ Semántica HTML5

### Funcionalidades
- ✅ Chatbot integrado con Claude AI (serverless)
- ✅ Formulario de contacto
- ✅ Selector de temas de color persistente (22 temas)
- ✅ Navegación móvil optimizada
- ✅ Animaciones de scroll
- ✅ Contadores animados
- ✅ Validación de formularios
- ✅ Función serverless para seguridad de API keys

### Secciones
1. **Hero** - Presentación impactante con llamados a la acción
2. **Servicios** - 6 servicios principales con tarjetas detalladas
3. **Sobre Nosotros** - Historia y valores de la empresa
4. **Flota** - Información de vehículos disponibles
5. **Contacto** - Formulario y datos de contacto
6. **Footer** - Enlaces rápidos y cobertura

## Estructura de Archivos

```
cmdmudanzas.com.ar/
├── index.html          # Página principal
├── styles.css          # Estilos y temas
├── script.js           # Funcionalidad JavaScript
├── README.md           # Este archivo
└── .gitignore          # Archivos ignorados por Git
```

## Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con variables CSS
- **JavaScript (Vanilla)** - Funcionalidad sin dependencias
- **Claude AI API** - Chatbot inteligente
- **Schema.org** - Datos estructurados para SEO

## Temas de Color Disponibles

1. **Predeterminado** - Azul profesional
2. **Océano** - Tonos cyan/turquesa
3. **Bosque** - Verdes naturales
4. **Atardecer** - Rojos/naranjas cálidos
5. **Medianoche** - Púrpuras/magentas

## Configuración del Chatbot

El chatbot utiliza la API de Claude AI (Anthropic). La API key está configurada en `script.js`.

Para actualizar la API key:
1. Abre `script.js`
2. Busca la línea `const CLAUDE_API_KEY = '...'`
3. Reemplaza con tu nueva API key

## Optimizaciones SEO Implementadas

### Meta Tags
- Title optimizado con keywords principales
- Description atractiva de 155 caracteres
- Keywords relevantes para el negocio
- Robots meta para indexación

### Structured Data
- JSON-LD con schema MovingCompany
- Información de servicios
- Cobertura geográfica
- Datos de contacto

### Performance
- CSS minificable
- JavaScript optimizado
- Lazy loading preparado para imágenes
- Animaciones con CSS transforms

### Accesibilidad
- ARIA labels en botones interactivos
- Contraste de colores WCAG AA
- Navegación por teclado
- Semántica HTML correcta

## Responsividad

### Breakpoints
- **Desktop**: > 968px
- **Tablet**: 640px - 968px
- **Mobile**: < 640px

### Características Responsivas
- Grid adaptativo en servicios y flota
- Menú hamburguesa en móvil
- Chatbot adaptado a pantallas pequeñas
- Tipografía escalable
- Imágenes flexibles

## Instalación y Uso

### Desarrollo Local

1. Clona el repositorio:
```bash
git clone https://github.com/ovanesoft/cmdmudanzas.com.ar.git
cd cmdmudanzas.com.ar
```

2. Inicia un servidor local:
```bash
# Usando Python
python -m http.server 9090

# Usando Node.js (http-server)
npx http-server -p 9090
```

3. Abre en tu navegador: `http://localhost:9090`

**Nota**: El chatbot NO funcionará localmente ya que requiere la API key configurada en Vercel.

### Deploy en Vercel

1. **Conecta el repositorio de GitHub con Vercel**:
   - Ve a [vercel.com/new](https://vercel.com/new)
   - Importa el repositorio `cmdmudanzas.com.ar`
   - Click en "Import"

2. **Configura la variable de entorno** (⚠️ CRÍTICO):
   - En "Environment Variables" agrega:
     - **Name**: `CLAUDE_API_KEY`
     - **Value**: Tu API key de Anthropic Claude
   - Esta key se obtiene de: https://console.anthropic.com/

3. **Deploy**:
   - Click en "Deploy"
   - Vercel desplegará automáticamente

4. **Actualizaciones futuras**:
   - Cada `git push` a la rama `main` desplegará automáticamente

### Configurar dominio personalizado (Opcional)

1. Ve a Project Settings → Domains en Vercel
2. Agrega `cmdmudanzas.com.ar`
3. Sigue las instrucciones para configurar los DNS

## Navegadores Soportados

- Chrome/Edge (últimas 2 versiones)
- Firefox (últimas 2 versiones)
- Safari (últimas 2 versiones)
- Opera (últimas 2 versiones)

## Mejoras Futuras (Opcional)

- [ ] Agregar imágenes reales de la empresa
- [ ] Implementar backend para formulario de contacto
- [ ] Agregar galería de proyectos realizados
- [ ] Integrar sistema de reservas online
- [ ] Agregar testimonios de clientes
- [ ] Implementar PWA (Progressive Web App)
- [ ] Agregar Google Maps con ubicación
- [ ] Integrar Google Analytics
- [ ] Agregar blog de consejos para mudanzas

## Mantenimiento

### Actualizar Contenido
- Los textos se encuentran en `index.html`
- Los estilos en `styles.css`
- La lógica en `script.js`

### Agregar Nuevos Temas
1. Abre `styles.css`
2. Crea un nuevo selector `[data-theme="nombre"]`
3. Define las variables CSS
4. Agrega el botón en `index.html`

### Personalizar Chatbot
El sistema prompt del chatbot se encuentra en `script.js` en la función `sendMessageToClaude()`.

## Licencia

© 2024 CMD Mudanzas. Todos los derechos reservados.

## Contacto

Para soporte técnico o consultas sobre el sitio web, contactar al desarrollador.
