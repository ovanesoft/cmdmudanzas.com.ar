# CMD Mudanzas — Medición de conversiones

> Actualizado: 2026-08-12
> Cuenta de Google Ads: **573-915-0215** (`pfaranna@gestiongeneral.com`)
> Etiqueta de Google: **AW-11228584141** (ID genérico `GT-5DH5MGK3`)

---

## Cómo está montado

Etiqueta base `gtag` en las 115 páginas, emitida desde `templates/base.html`.
Los eventos se disparan por código desde `js/cmd.js`.

**Por qué por código y no con detección automática:** el sitio es una sola
página. Cuando alguien envía el cotizador o toca WhatsApp no cambia la URL:
se abre WhatsApp en otra pestaña. La detección automática de Google no vería
nada y las conversiones marcarían cero para siempre.

## Las tres acciones

| Acción | Cómo se mide | Estado |
|---|---|---|
| `CMD – Cotizador` | `AW-11228584141/laW7CJ7p1uAcEM2xmuop` | ✅ midiendo |
| `CMD – WhatsApp` | `AW-11228584141/iEFNCLjj1-AcEM2xmuop` | ✅ midiendo |
| `CMD – Llamada` | Sin código. Fuente "Llamadas desde anuncios" | ⏳ requiere recurso de llamada |

Las tres con recuento **Una conversión** y valor **1 ARS**.

### CMD – Cotizador
Se dispara **al pasar la validación**, no al apretar el botón. Un envío con
campos vacíos no es un lead, y contarlo ensuciaría el CPA.

### CMD – WhatsApp
Delegación de clics sobre cualquier enlace a `wa.me` o `api.whatsapp.com`.
Cubre banner inferior, FAB, botones del hero, bloques de localidad y footer,
en las 115 páginas, sin enganchar cada enlace.

### CMD – Llamada
Decisión tomada: se mide con la fuente **"Llamadas desde anuncios"** de Google,
no con código.

Ventaja: cuenta llamadas reales de más de 60 segundos, no clics. Alguien que
toca el número y corta a los 3 segundos no cuenta. Es mejor señal que la que
puede dar el código, que solo ve el clic.

Limitación: no mide los clics al teléfono **dentro del sitio** (FAB, barra
superior, footer). Se asume aceptable porque el sitio empuja fuerte a WhatsApp.

> ⚠️ **Requiere agregar un recurso de llamada a la campaña** con
> `11 2714-2006`. Sin eso marca cero para siempre.

El disparador de `tel:` quedó cableado en `cmd.js` pero **inerte**: la clave
`llamada` está vacía y no dispara nada. Si algún día se quiere medir también
el clic en el sitio, se crea una cuarta acción con fuente `CMDMUDANZAS.COM` y
se completa esa línea.

## Decisiones técnicas

**Una conversión por sesión y por acción.** Alguien que toca WhatsApp en el
banner y después en el FAB sigue siendo un lead. Contarlo dos veces infla las
conversiones y hace que la puja automática crea que rinde el doble.

**`transport_type: beacon`.** Cuando el usuario se va a WhatsApp, el navegador
puede matar la petición antes de que salga. Con beacon el evento se envía
igual. Sin esto se pierden conversiones reales, sobre todo en móvil.

**gtag directo, no GTM.** El sitio carga muy rápido y GTM sumaría ~50 KB más
una petición. Las conversiones son tres clics y un formulario, no un embudo
complejo. Migrar a GTM después es sencillo si aparece un chatbot, un CRM o un
píxel de Meta.

## El desorden heredado de la cuenta

La cuenta tiene **14 acciones de conversión** en 9 categorías. Solo 3 son
nuestras. Varias de las heredadas están en *Configuración errónea*.

Caso particular: **"Calls from Smart Campaign Ads"**, creada por Google en
junio de 2023, es del sistema y **no se puede editar ni borrar**. Solo dispara
en campañas inteligentes, así que no interfiere con una campaña de Búsqueda
estándar.

> ⚠️ **Al armar la campaña: usar objetivos a nivel de campaña**, no los
> predeterminados de la cuenta. Elegir manualmente solo las tres `CMD –`.
>
> Si no se hace, la puja optimiza hacia una mezcla de las 14, incluidas las
> rotas. Es la forma más silenciosa de quemar presupuesto: la campaña parece
> andar y los números no cierran nunca.

## Recomendación de campaña

**Búsqueda estándar, no Campaña inteligente.** Las inteligentes son las que
dejaron este desorden: no permiten ver ni controlar palabras clave, las
negativas funcionan a medias y el reporte no deja aprender nada.

Con Búsqueda estándar se puede mandar cada anuncio a su página de localidad,
que es donde está el salto de conversión que justifica las 114 páginas.

## Historial

Las campañas anteriores corrieron **sin medir conversiones**. La integración
venía con Wix Premium; al darse de baja la suscripción se cayó la etiqueta y
las acciones quedaron huérfanas. Verificado leyendo el endpoint de tag manager
del sitio de Wix: solo tenía Visitor Analytics y un widget de reseñas, ningún
`AW-`, `G-` ni `GTM-`.

Consecuencia práctica: **el informe de términos de búsqueda tiene clics pero
cero conversiones**. Sirve para saber qué busca la gente, no qué convierte. El
aprendizaje de conversión empieza de cero con la campaña nueva.

## Cómo verificar que sigue midiendo

En la consola del navegador, sobre el sitio en producción:

```js
// Intercepta gtag y muestra qué se dispara
const ev=[]; const real=window.gtag;
window.gtag=function(){ ev.push([...arguments]); real.apply(null,arguments); };
// Después tocá WhatsApp o enviá el cotizador y mirá:
ev.filter(e=>e[0]==='event').map(e=>e[2].send_to);
```
