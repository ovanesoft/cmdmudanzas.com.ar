# Guía de Despliegue - CMD Mudanzas

## Opciones de Hosting

### Opción 1: Hosting Tradicional (cPanel/FTP)

#### Pasos:
1. **Contratar hosting web**
   - Recomendados: Hostinger, SiteGround, DonWeb (Argentina)
   - Requisitos mínimos:
     - PHP 7.4+ (para futuras funcionalidades)
     - SSL/HTTPS incluido
     - Dominio cmdmudanzas.com.ar

2. **Subir archivos vía FTP**
   - Cliente FTP: FileZilla, Cyberduck
   - Subir todos los archivos al directorio `/public_html/` o `/www/`
   - Estructura:
     ```
     public_html/
     ├── .htaccess
     ├── index.html
     ├── styles.css
     ├── script.js
     ├── robots.txt
     ├── sitemap.xml
     └── favicon.ico (agregar)
     ```

3. **Configurar dominio**
   - Apuntar DNS a los nameservers del hosting
   - Tiempo de propagación: 24-48 horas

4. **Verificar funcionamiento**
   - Probar todas las páginas
   - Verificar HTTPS activo
   - Probar formulario de contacto
   - Verificar chatbot de Claude

### Opción 2: GitHub Pages (Gratis)

#### Ventajas:
- ✅ Gratis
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Fácil actualización vía Git

#### Desventajas:
- ❌ No soporta procesamiento backend (formulario)
- ❌ Dominio personalizado requiere configuración DNS

#### Pasos:
```bash
# 1. Crear repositorio en GitHub
git init
git add .
git commit -m "Initial commit: CMD Mudanzas website"
git branch -M main
git remote add origin https://github.com/usuario/cmdmudanzas.git
git push -u origin main

# 2. Configurar GitHub Pages
# - Ve a Settings > Pages
# - Source: main branch
# - Selecciona / (root)
# - Save

# 3. Configurar dominio personalizado (opcional)
# - En Settings > Pages > Custom domain
# - Agregar: cmdmudanzas.com.ar
# - Configurar DNS con CNAME record
```

### Opción 3: Vercel (Recomendado - Gratis)

#### Ventajas:
- ✅ Gratis para proyectos personales
- ✅ HTTPS automático
- ✅ CDN global ultra rápido
- ✅ Deploy automático desde Git
- ✅ Dominios personalizados gratis
- ✅ Analytics incluido
- ✅ Serverless functions (para formulario)

#### Pasos:
```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Deploy
cd /Users/pablo/desarrollos/cmdmudanzas.com.ar
vercel

# Seguir instrucciones:
# - Login con GitHub/GitLab/Bitbucket
# - Set up and deploy? Y
# - Which scope? Tu cuenta
# - Link to existing project? N
# - What's your project's name? cmdmudanzas
# - In which directory is your code located? ./
# - Want to override settings? N

# 3. Deploy a producción
vercel --prod

# 4. Configurar dominio personalizado
# En dashboard de Vercel > Domains
# Agregar cmdmudanzas.com.ar
```

### Opción 4: Netlify (Alternativa a Vercel)

#### Pasos:
1. Crear cuenta en netlify.com
2. Drag & drop la carpeta del proyecto
3. Configurar dominio personalizado
4. Deploy automático

### Opción 5: AWS S3 + CloudFront (Avanzado)

Para grandes volúmenes de tráfico y máximo performance.

## Configuración de Dominio

### DNS Records Necesarios:

#### Para Hosting Tradicional:
```
Tipo: A
Host: @
Value: [IP del servidor]
TTL: 3600

Tipo: CNAME
Host: www
Value: cmdmudanzas.com.ar
TTL: 3600
```

#### Para Vercel/Netlify:
```
Tipo: CNAME
Host: @
Value: cname.vercel-dns.com
TTL: 3600

Tipo: CNAME
Host: www
Value: cname.vercel-dns.com
TTL: 3600
```

## Configuración del Formulario de Contacto

### Opción 1: EmailJS (Gratis - Sin Backend)

```javascript
// En script.js, reemplazar la función del formulario:

// 1. Registrarse en emailjs.com
// 2. Crear servicio de email
// 3. Agregar al HTML:
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

// 4. Inicializar:
emailjs.init("YOUR_PUBLIC_KEY");

// 5. Modificar submit handler:
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);

    emailjs.sendForm('service_id', 'template_id', contactForm)
        .then(() => {
            alert('¡Gracias por tu consulta!');
            contactForm.reset();
        })
        .catch((error) => {
            alert('Error al enviar. Intenta nuevamente.');
        });
});
```

### Opción 2: Formspree (Gratis hasta 50/mes)

```html
<!-- Modificar el form en index.html -->
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" id="contactForm">
    <!-- Mantener los campos existentes -->
</form>
```

### Opción 3: Backend Propio (PHP)

Crear `contact.php`:
```php
<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_STRING);
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $phone = filter_input(INPUT_POST, 'phone', FILTER_SANITIZE_STRING);
    $service = filter_input(INPUT_POST, 'service', FILTER_SANITIZE_STRING);
    $message = filter_input(INPUT_POST, 'message', FILTER_SANITIZE_STRING);

    $to = 'info@cmdmudanzas.com.ar';
    $subject = 'Nueva consulta desde el sitio web';
    $body = "Nombre: $name\nEmail: $email\nTeléfono: $phone\nServicio: $service\n\nMensaje:\n$message";
    $headers = "From: $email\r\nReply-To: $email";

    if (mail($to, $subject, $body, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
}
?>
```

Actualizar `script.js`:
```javascript
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const response = await fetch('contact.php', {
        method: 'POST',
        body: new FormData(contactForm)
    });

    const result = await response.json();

    if (result.success) {
        alert('¡Gracias por tu consulta!');
        contactForm.reset();
    } else {
        alert('Error. Intenta nuevamente.');
    }
});
```

## Configuración de Google Analytics

1. Crear cuenta en analytics.google.com
2. Crear propiedad (cmdmudanzas.com.ar)
3. Obtener ID de medición (G-XXXXXXXXXX)
4. Agregar al `<head>` de index.html:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Configuración de Google Search Console

1. Ir a search.google.com/search-console
2. Agregar propiedad (cmdmudanzas.com.ar)
3. Verificar propiedad:
   - Método 1: Archivo HTML
   - Método 2: Meta tag
   - Método 3: Google Analytics
4. Enviar sitemap:
   - URL: https://cmdmudanzas.com.ar/sitemap.xml

## Optimizaciones Post-Deployment

### 1. Comprimir Archivos

```bash
# CSS
npx clean-css-cli styles.css -o styles.min.css

# JavaScript
npx terser script.js -o script.min.js -c -m

# Actualizar referencias en index.html
<link rel="stylesheet" href="styles.min.css">
<script src="script.min.js"></script>
```

### 2. Configurar CDN (Opcional)

- Cloudflare (Gratis)
  - Registrar dominio en Cloudflare
  - Cambiar nameservers
  - Activar CDN y cache
  - Configurar reglas de cache

### 3. Favicon

Crear favicon.ico y agregarlo al `<head>`:
```html
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
```

Generar en: favicon.io

### 4. Open Graph Image

Crear imagen 1200x630px para redes sociales:
```html
<meta property="og:image" content="https://cmdmudanzas.com.ar/images/og-image.jpg">
```

## Checklist Pre-Deployment

- [ ] Actualizar información de contacto real
- [ ] Configurar API key de Claude (verificar que funcione)
- [ ] Agregar imágenes reales
- [ ] Comprimir CSS y JS
- [ ] Crear favicon
- [ ] Crear OG image
- [ ] Probar en todos los navegadores
- [ ] Probar en móvil/tablet/desktop
- [ ] Verificar todos los enlaces
- [ ] Revisar ortografía
- [ ] Configurar formulario de contacto
- [ ] Configurar Google Analytics
- [ ] Preparar sitemap.xml
- [ ] Configurar robots.txt

## Checklist Post-Deployment

- [ ] Verificar HTTPS funciona
- [ ] Verificar redirección www <-> no-www
- [ ] Probar formulario de contacto
- [ ] Probar chatbot de Claude
- [ ] Enviar sitemap a Google Search Console
- [ ] Verificar indexación en Google
- [ ] Configurar Google My Business
- [ ] Probar velocidad con PageSpeed Insights
- [ ] Verificar mobile-friendly con Google
- [ ] Configurar backups automáticos
- [ ] Monitorear errores 404
- [ ] Configurar monitoreo de uptime

## Mantenimiento Continuo

### Diario:
- Revisar funcionamiento del chatbot
- Responder consultas del formulario

### Semanal:
- Revisar Google Analytics
- Actualizar Google My Business
- Responder reseñas

### Mensual:
- Publicar contenido de blog
- Revisar keywords en GSC
- Actualizar contenido si es necesario
- Revisar y optimizar conversiones
- Backup completo del sitio

### Trimestral:
- Auditoría SEO completa
- Actualizar dependencias
- Revisar y mejorar UX
- A/B testing de elementos clave

## Soporte y Troubleshooting

### Problema: Chatbot no funciona
- Verificar API key de Claude
- Verificar CORS en el servidor
- Revisar console del navegador

### Problema: Formulario no envía
- Verificar configuración de EmailJS/Formspree
- Verificar permisos PHP (si usa backend)
- Revisar logs del servidor

### Problema: Sitio lento
- Comprimir imágenes
- Activar GZIP
- Usar CDN
- Minificar CSS/JS

### Problema: No indexa en Google
- Verificar robots.txt
- Enviar sitemap en GSC
- Verificar errores en GSC
- Esperar 2-4 semanas para indexación completa

## Contacto de Soporte Técnico

Para problemas de deployment o configuración, contactar al equipo de desarrollo.

---

**Última actualización**: Diciembre 2024
