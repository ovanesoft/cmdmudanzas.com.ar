# CMD Mudanzas — Relevamiento de dominios e infraestructura

> Fecha: 2026-08-12
> Hecho antes de montar el sistema SEO/GEO, para no construir sobre supuestos.

---

## 1. DNS

| Dominio | Nameservers | Resuelve a |
|---|---|---|
| `cmdmudanzas.com` | **ns0.wixdns.net / ns1.wixdns.net** | `76.76.21.21` (IP apex de Vercel) |
| `www.cmdmudanzas.com` | — | `1d2ff77bae0beab5.vercel-dns-017.com` |
| `cmdmudanzas.com.ar` | **ns1.vercel-dns.com / ns2.vercel-dns.com** | `216.150.1.129`, `216.150.16.1` |

> ⚠️ **La zona DNS del dominio principal está en Wix, no en Vercel.**
> Despublicar el sitio de Wix no debería tocarla, pero *desconectar el dominio*
> o *eliminar el sitio* sí la rompe, y con ella se cae `cmdmudanzas.com` entero.
> Nunca tocar el dominio desde el panel de Wix sin migrar antes la zona.
>
> **Pendiente recomendado:** migrar el DNS de `.com` a Vercel para que la
> infraestructura quede en un solo lugar y no dependa de una cuenta de Wix
> que ya no se paga.

## 2. Qué sirve cada URL

| URL | Código | Destino final |
|---|---|---|
| `cmdmudanzas.com` | 308 | `www.cmdmudanzas.com` |
| `www.cmdmudanzas.com` | **200** | — (host canónico) |
| `cmdmudanzas.com.ar` | 307 | `www.cmdmudanzas.com.ar` |
| `www.cmdmudanzas.com.ar` | **200** | — |

**Host canónico definido: `https://www.cmdmudanzas.com/`**
Se eligió `www` porque es lo que Vercel efectivamente sirve. Si se prefiere el
apex, hay que cambiarlo en Vercel y dar vuelta el canonical del HTML.

## 3. Problemas encontrados y su estado

| # | Problema | Estado |
|---|---|---|
| 1 | Los dos dominios servían **contenido idéntico** (mismo MD5 `0689774e…`), sin canonical cruzado. Duplicado puro. | ✅ Resuelto: redirect 301 de `.com.ar` a `.com` por `host` en `vercel.json` |
| 2 | El canonical apuntaba a `cmdmudanzas.com.ar` — dominio equivocado **y** URL que redirige | ✅ Resuelto: apunta a `https://www.cmdmudanzas.com/` |
| 3 | `sitemap.xml` y `robots.txt` declaraban el dominio viejo | ✅ Resuelto |
| 4 | El mensaje de WhatsApp del cotizador decía `cmdmudanzas.com.ar` | ✅ Resuelto |
| 5 | Sitio de Wix (`perezledesmamariu.wixsite.com/cmdmudanzas`) vivo, indexable y con canonical propio | 🔻 Pablo lo despublica |
| 6 | DNS del `.com` alojado en Wix | ⏳ Pendiente: migrar a Vercel |

## 4. Google Ads — cuenta 573-915-0215

Cuenta de CMD, confirmada. **No es la de MiMudanza**, que es otra cuenta aparte.

**Hallazgo: las campañas corrieron sin medir conversiones.**

Se verificó el sitio de Wix leyendo su endpoint interno de tag manager
(`/_api/tag-manager/api/v1/tags/sites/…`). Devuelve solo tres etiquetas:

- `visitor-analytics.io` (app de Wix) ×2
- Widget de reseñas de Google

No hay `AW-`, ni `G-`, ni `GTM-`. En el DOM renderizado: `gtag` es `undefined`,
`dataLayer` vacío, cero scripts de `googletagmanager` o `googleadservices`.

**Causa:** la integración nativa de Google Ads venía con Wix Premium. Al dar de
baja la suscripción se cayó la etiqueta, pero las acciones de conversión
quedaron huérfanas en la cuenta de Ads. Eso explica los estados
*"Configuración errónea"* y *"Requiere atención"*.

### Estado de la cuenta

13 acciones de conversión principales en 9 categorías, varias rotas:

| Categoría | Acciones principales | Estado |
|---|---|---|
| Contacto | **5** | ⚠️ Requiere atención |
| Cómo llegar | 2 | Activa |
| Compra | 1 | ❌ Configuración errónea |
| Descarga | 0 | ❌ Configuración errónea |
| Cliente potencial por teléfono | 1 | Activa |
| Solicitud de presupuesto | 1 | Activa |
| Interacción | 1 | Activa |
| Mensajes | 1 | Activa |
| YouTube | 1 | Activa |

### Plan para la campaña nueva

1. Crear tres acciones limpias: `CMD – WhatsApp`, `CMD – Cotizador`, `CMD – Llamada`.
2. Recuento **"Una"**, no "Todas" (un lead es un lead aunque clickee tres veces).
3. Conversiones mejoradas activadas (ya lo está).
4. Usar **objetivos a nivel de campaña**, no los predeterminados de la cuenta,
   para aislarse de las 13 acciones heredadas.
5. Limpiar lo viejo después, sin frenar el lanzamiento.

### Datos que faltan

```
AW-              → AW-_________
CMD – WhatsApp   → AW-_________/__________________
CMD – Cotizador  → AW-_________/__________________
CMD – Llamada    → AW-_________/__________________
GA4              → G-_________
GTM (alternativa)→ GTM-_______
```

> El informe de términos de búsqueda sirve para saber **qué busca la gente**,
> pero no qué convierte: nunca hubo medición. El aprendizaje de conversión
> empieza de cero con la campaña nueva.

## 5. Imágenes

Se descargaron las del sitio de Wix a `images/originales-wix/` **y se
descartaron**: son todas de banco de imágenes.

- La del camión es una ruta de montaña norteamericana con el logo pegado
  encima, y encima es un tractor con semirremolque, no un camión de mudanzas
  argentino.
- La del "equipo trabajando" son modelos de stock, sin uniforme ni logo.
- Los nombres de archivo lo confirman: `…_236854-48514.jpg` es patrón de ID de
  Freepik; `van-3676.jpg` es de banco.

**No existe ni una foto real de la operación de CMD.**

Pendiente con Pablo, por orden de impacto para SEO local y GEO:

1. Camiones propios con el logo, incluida la plataforma elevadora en uso
2. Equipo trabajando, con uniforme
3. Una mudanza real terminada

Alcanza con un celular. Las señales de negocio real pesan más que cualquier
texto, sobre todo para los sistemas de IA que recomiendan proveedores.
