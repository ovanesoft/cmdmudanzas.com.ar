# 🚀 Inicio Rápido - Servidor Local

## Opción 1: Python (Recomendado - Más Simple)

### Python 3.x:
```bash
cd /Users/pablo/desarrollos/cmdmudanzas.com.ar
python3 -m http.server 8000
```

### Python 2.x:
```bash
cd /Users/pablo/desarrollos/cmdmudanzas.com.ar
python -m SimpleHTTPServer 8000
```

Luego abre en tu navegador: **http://localhost:8000**

## Opción 2: Node.js

### Instalar http-server (una sola vez):
```bash
npm install -g http-server
```

### Iniciar servidor:
```bash
cd /Users/pablo/desarrollos/cmdmudanzas.com.ar
http-server -p 8000
```

Luego abre en tu navegador: **http://localhost:8000**

## Opción 3: PHP

```bash
cd /Users/pablo/desarrollos/cmdmudanzas.com.ar
php -S localhost:8000
```

Luego abre en tu navegador: **http://localhost:8000**

## Opción 4: Live Server (VS Code Extension)

1. Instalar extensión "Live Server" en VS Code
2. Abrir la carpeta del proyecto en VS Code
3. Click derecho en `index.html`
4. Seleccionar "Open with Live Server"

## ¿Qué Puedes Probar?

### ✅ Funcionalidades que Funcionan Localmente:
- Navegación entre secciones
- Menú móvil (reducir el navegador)
- Selector de temas (5 colores diferentes)
- Animaciones de scroll
- Validación de formulario
- Diseño responsivo

### ⚠️ Requiere Configuración Adicional:
- **Chatbot de Claude**: Requiere conexión a internet y la API key está expuesta (ver SECURITY.md)
- **Formulario de contacto**: Solo valida, no envía (ver DEPLOYMENT.md para configuración)

## Probar Responsividad

### En Chrome/Edge:
1. F12 para abrir DevTools
2. Ctrl+Shift+M (o Cmd+Shift+M en Mac) para modo responsive
3. Probar diferentes dispositivos:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad Air (820px)
   - Desktop (1920px)

### Breakpoints a Probar:
- **Mobile**: 320px - 640px
- **Tablet**: 640px - 968px
- **Desktop**: > 968px

## Verificar Funcionalidades

### 1. Navegación
- [ ] Click en logo lleva a inicio
- [ ] Click en enlaces del menú navega suavemente
- [ ] Links del footer funcionan
- [ ] Menú móvil se abre/cierra (< 968px)

### 2. Selector de Temas
- [ ] Click en botón circular abre opciones
- [ ] Cada tema cambia los colores
- [ ] Tema persiste al recargar página
- [ ] Funciona en todos los dispositivos

### 3. Chatbot
- [ ] Botón flotante abre/cierra chatbot
- [ ] Input acepta texto
- [ ] Enter envía mensaje
- [ ] Botón X cierra chatbot
- [ ] Escape cierra chatbot

### 4. Formulario de Contacto
- [ ] Campos requeridos muestran validación
- [ ] Email valida formato
- [ ] Select muestra opciones
- [ ] Botón enviar funciona

### 5. Animaciones
- [ ] Hero tiene fade in
- [ ] Cards aparecen al hacer scroll
- [ ] Hover effects en tarjetas
- [ ] Botones tienen hover states

## Consejos de Testing

### Performance:
```bash
# Lighthouse en Chrome DevTools
1. F12
2. Tab "Lighthouse"
3. Seleccionar "Desktop" o "Mobile"
4. Click "Generate report"
```

### Validación HTML:
```bash
# Online: https://validator.w3.org/
# Upload: index.html
```

### Validación CSS:
```bash
# Online: https://jigsaw.w3.org/css-validator/
# Upload: styles.css
```

## Problemas Comunes

### Error de CORS con Chatbot:
**Síntoma**: Chatbot no funciona localmente
**Causa**: Restricciones CORS de la API de Claude
**Solución**: Implementar backend proxy (ver SECURITY.md)

### Tema No Persiste:
**Síntoma**: Al recargar vuelve al tema predeterminado
**Causa**: LocalStorage no funciona con file://
**Solución**: Usar servidor local (http://localhost)

### Imágenes No Cargan:
**Síntoma**: Espacios vacíos donde irían imágenes
**Causa**: No hay imágenes en el proyecto actual
**Solución**: Agregar imágenes reales (ver README.md)

## Siguientes Pasos

Después de probar localmente:

1. ✅ Verificar todas las funcionalidades
2. ✅ Probar en diferentes navegadores
3. ✅ Probar en diferentes dispositivos
4. ✅ Leer SECURITY.md para proteger API key
5. ✅ Leer DEPLOYMENT.md para publicar
6. ✅ Configurar backend para chatbot
7. ✅ Agregar imágenes reales
8. ✅ Actualizar información de contacto
9. ✅ Hacer deploy

## Comandos Útiles

### Ver tamaño de archivos:
```bash
du -sh *
```

### Buscar texto en todos los archivos:
```bash
grep -r "texto a buscar" .
```

### Validar sintaxis JavaScript:
```bash
node --check script.js
```

### Minificar CSS (requiere Node.js):
```bash
npx clean-css-cli styles.css -o styles.min.css
```

### Minificar JavaScript (requiere Node.js):
```bash
npx terser script.js -o script.min.js -c -m
```

## Recursos

- [Mozilla Developer Network](https://developer.mozilla.org/)
- [Google PageSpeed Insights](https://pagespeed.web.dev/)
- [W3C Validator](https://validator.w3.org/)
- [Can I Use](https://caniuse.com/)

---

**¡Listo para comenzar! 🚀**

Ejecuta uno de los comandos de servidor local y abre http://localhost:8000 en tu navegador.
