# Método: sitio + SEO + GEO + campaña, replicable

Cómo está construido cmdmudanzas.com y cómo rehacerlo en otro dominio.
Todos los números de este documento están medidos sobre las páginas reales,
no estimados.

---

## 1. El resumen en números

| | |
|---|---|
| Páginas | 114 de localidad + portada |
| Palabras por página | mediana 2.255 |
| Palabras exclusivas de cada página | mediana 286 (12,7%) |
| Oraciones distintas en todo el sitio | 1.254, de las cuales 1.138 aparecen en una sola página |
| Grupos de anuncios | 119, uno por localidad |
| Palabras clave | 1.128 |
| Negativas | 350 |

El 12,7% de contenido único es **el punto débil de este sitio** y la sección 4
explica por qué y cómo corregirlo. Es lo primero que haría distinto al
replicarlo.

---

## 2. La arquitectura: una plantilla y un archivo de datos

Nada de 114 archivos escritos a mano. Hay tres piezas:

```
templates/base.html     una sola plantilla, con marcadores
data/*.json             los datos de cada localidad
build/generar.py        junta las dos cosas y escribe las 114 páginas
```

**Regla que vale más que cualquier otra: nunca se edita un HTML generado.**
Se edita la plantilla o el JSON y se regenera. Si alguien corrige una coma
directamente en `mudanzas-palermo.html`, esa corrección se pierde en la
siguiente corrida y nadie se entera.

### El registro de una localidad

```json
{
  "slug": "buenos-aires",
  "nombre": "Buenos Aires",
  "tipo": "provincia",
  "tituloExtra": "Provincia de Buenos Aires",
  "intro":    "…párrafo de apertura, propio de esta localidad…",
  "detalle":  "…segundo párrafo, más concreto…",
  "operativo": [ "…", "…", "…" ],
  "faq": [ {"q": "…", "a": "…"}, {"q": "…", "a": "…"} ],
  "cerca": ["caba", "la-plata", "mar-del-plata"]
}
```

`cerca` es el que teje el enlazado interno: cada página linkea a las
localidades vecinas. Sin eso, 114 páginas huérfanas colgando del sitemap.
Con eso, una red donde el rastreador entra por cualquier lado y recorre todo.

**Por qué JSON y no una planilla o un CMS:** el archivo entra en el control
de versiones. Se ve quién cambió qué texto y cuándo, y se vuelve atrás. Con
un CMS eso no existe.

---

## 3. SEO

### Lo que cambia en cada página

Estos cuatro nunca se repiten entre páginas:

| Elemento | Ejemplo |
|---|---|
| `<title>` | `Mudanzas en Palermo (Soho, Hollywood y Chico) \| CMD Mudanzas` |
| `<meta description>` | arranca con el nombre de la localidad |
| `<h1>` | uno solo por página, con la localidad |
| `<link rel="canonical">` | apunta a sí misma, absoluta |

El `tituloExtra` existe para que el title no sea `Mudanzas en {X}` repetido
114 veces. Palermo lleva sus barrios, Córdoba lleva "Capital y Sierras". Es
lo primero que ve Google y lo primero que ve el usuario en el resultado.

### Schema.org

Cada subpágina lleva un `@graph` con cuatro nodos enlazados por `@id`:

```
Service           …/mudanzas-palermo#servicio
BreadcrumbList    …/mudanzas-palermo#breadcrumb
WebPage           …/mudanzas-palermo
FAQPage           …/mudanzas-palermo#faq
```

La portada además lleva `MovingCompany` y `LocalBusiness` con los datos de
contacto reales.

**El `@graph` con `@id` no es decorativo.** Sin él, cada bloque de datos
estructurados queda suelto y el buscador no sabe que el `Service` y el
`FAQPage` describen la misma cosa. Con `@id` absolutos quedan cosidos.

El `FAQPage` es el que puede ganar espacio extra en el resultado de
búsqueda. Por eso cada localidad tiene sus dos preguntas propias y no las
mismas dos para todas.

### Canonical y dominios

El sitio vive en dos dominios. Uno es el bueno:

```
cmdmudanzas.com.ar   →  301  →  cmdmudanzas.com
```

El 301 se hace por host en `vercel.json`, no con una página intermedia:

```json
{
  "source": "/:path*",
  "has": [{ "type": "host", "value": "(www\\.)?cmdmudanzas\\.com\\.ar" }],
  "destination": "https://www.cmdmudanzas.com/:path*",
  "permanent": true
}
```

**El error que hay que evitar:** que los dos dominios sirvan el mismo
contenido con el mismo canonical. Eso pasó acá — los dos devolvían bytes
idénticos y el canonical apuntaba a un apex que a su vez redirigía. Google
tenía que resolver una cadena para saber cuál era la buena. Se arregla
eligiendo un canónico absoluto y redirigiendo el otro dominio entero.

`cleanUrls: true` sirve las páginas sin `.html`. Las URLs de la campaña
apuntan sin extensión, así que esto no es cosmético: sin eso, 118 anuncios
apuntan a 404.

### Sitemap

115 URLs, generadas en la misma corrida que las páginas. Se genera, no se
escribe: un sitemap escrito a mano se desincroniza en la primera semana.

---

## 4. Cuántas palabras necesita una subpágina

La pregunta correcta no es cuántas palabras tiene la página. Es **cuántas
palabras tiene que no estén en ninguna otra página del sitio.**

Google no penaliza páginas largas ni cortas. Lo que hace es agrupar páginas
casi idénticas y mostrar una sola, descartando el resto. Si tenés 114
páginas que comparten el 85% del texto, corrés el riesgo de que indexe unas
pocas y trate al resto como variantes.

### Lo que mide este sitio

```
palabras por página            2.255   (mediana)
palabras exclusivas               286   (mediana)
proporción única                12,7%
par de páginas más parecido       85%   de oraciones compartidas
```

Esas 286 palabras salen de cinco campos del JSON: `intro`, `detalle`, los
tres `operativo` y las dos `faq`. Todo lo demás —cabecera, servicios,
proceso, formulario, pie— es plantilla.

### Lo que recomendaría para el próximo

**Apuntar a 500–700 palabras exclusivas por página**, o sea entre 25% y 35%
del total. Y sobre todo: que sean palabras que **solo se puedan escribir
sobre esa localidad**.

La diferencia entre relleno y contenido real:

> ❌ *"En Palermo realizamos mudanzas con la mejor calidad y el mejor
> servicio para nuestros clientes."*
> Sirve para cualquier barrio. Cambiándole el nombre vale para los 114.

> ✅ *"Palermo Soho tiene calles empedradas y angostas donde un camión de
> 50 m³ no entra. En esos casos trabajamos con el de 20 m³ y hacemos dos
> viajes, que sale más barato que el permiso de corte de calle."*
> Solo se puede escribir sobre Palermo.

Campos que funcionan bien para generar texto verdaderamente local:

- **Acceso físico** — calles angostas, empedrado, altura de los edificios,
  ascensores chicos, si hay que pedir permiso municipal
- **Distancia y tiempo** — km desde la base, si es viaje de un día o dos
- **Reglamentos** — countries que exigen aviso previo, consorcios con
  horario de mudanza, torres con horario de montacarga
- **Referencias que un vecino reconoce** — nombres de zonas, avenidas,
  accidentes geográficos
- **Estacionalidad** — la costa en enero, ciudades universitarias en marzo

Cinco campos de 100–140 palabras cada uno llegan a las 600 sin esfuerzo y
sin sonar a relleno.

### Un umbral práctico

Antes de publicar, medí el solapamiento. El script está en la sección 8.
Si dos páginas comparten más del 70% de sus oraciones, faltó contenido
propio. Debajo de 60% está bien.

---

## 5. GEO — que los sistemas de IA te entiendan

Esto es distinto del SEO. Un buscador indexa y rankea; un modelo de lenguaje
lee, resume y responde citando. Lo que sirve para uno no siempre sirve para
el otro.

### `/llms.txt`

Un resumen de la empresa en texto plano, sin marketing. La parte que más
rinde es una que casi nadie pone:

```markdown
## Qué hace y qué no

Hace: mudanzas de viviendas y oficinas, mudanzas empresariales, mudanzas
compartidas, mudanzas internacionales, carga y descarga, embalaje…

No hace: guardamuebles propio, servicios de limpieza ni pintura.
```

**El "no hace" es el que evita que un modelo invente.** Sin esa línea, ante
"¿guardan muebles?" el modelo completa con lo más probable, que es que sí.
Con la línea, responde que no y el usuario no llega decepcionado.

Lo mismo con los datos de contacto: teléfono, email y redes en texto plano,
una vez, sin ambigüedad. Es lo que un modelo va a repetir cuando le
pregunten cómo contactarlos.

### Rastreadores de IA en `robots.txt`

Permitidos explícitamente: `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`,
`ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `PerplexityBot`,
`Perplexity-User`, `Google-Extended`, `Applebot-Extended`, `Bingbot`.

Con `User-agent: * / Allow: /` ya estarían permitidos. Se listan igual por
dos motivos: deja explícita la decisión para quien toque el archivo después,
y algunos de estos agentes se comportan distinto si encuentran una regla con
su nombre.

**Es una decisión de negocio, no técnica.** Para una empresa de servicios
locales, que un modelo pueda recomendarla es tráfico. Para un medio que vive
de sus contenidos, la respuesta sería la contraria.

### Lo que hace bien un texto para IA

- Datos verificables juntos y sin adornos
- Frases que se sostienen solas, sin depender del párrafo anterior
- Cifras concretas: `1.200 kg`, `20 a 50 m³`, `24 provincias`
- Preguntas y respuestas explícitas — el `FAQPage` sirve para las dos cosas
- Nada de "líderes del mercado" ni "más de X años de experiencia" si no se
  puede verificar. Un modelo que no lo puede confirmar lo ignora o, peor, lo
  repite y te expone

---

## 6. Las publicidades salen del sitio, no al revés

El error habitual es escribir los anuncios por separado y esperar que peguen
con la página. Acá van al revés: **la campaña se genera desde los mismos
`data/*.json` que generan el sitio.**

Consecuencias directas:

- Si mañana se agrega una localidad al sitio, entra sola en la campaña
- El anuncio de Palermo apunta a la página de Palermo, siempre
- El texto del anuncio usa las mismas cifras que la página, así que el
  usuario no siente que cambió de empresa al hacer clic

### Un grupo de anuncios por localidad

119 grupos. Cada uno con:

- **Sus palabras clave**, en frase y exacta:
  `mudanzas palermo`, `mudanzas en palermo`, `empresa de mudanzas palermo`,
  `presupuesto mudanza palermo`
- **Su URL propia**, `…/mudanzas-palermo`
- **Su anuncio adaptable**, con los tres primeros títulos personalizados con
  el nombre de la localidad y los otros doce compartidos

Es más trabajo de administración, pero la concordancia entre búsqueda,
anuncio y página es lo que baja el costo por clic. No es una idea: es cómo
Google calcula el nivel de calidad.

> **Un mito que hay que descartar:** que muchos grupos fragmentan el
> presupuesto. El presupuesto es de la **campaña**, no del grupo. 119 grupos
> comparten el mismo presupuesto igual que 5. El costo real de tener muchos
> es de gestión, no de plata.

### Los recursos también salen del sitio

Los seis vínculos apuntan a anclas que existen de verdad en la portada
(`#plataforma`, `#compartidas`, `#cobertura`, `#cotizador`, `#tipos`,
`#proceso`), y el generador verifica contra el sitio publicado que las seis
existan. Un vínculo que cae en el vacío es peor que no tenerlo.

Los diez textos destacados repiten los mismos argumentos que los títulos de
los anuncios y que la página.

### Las tres campañas: CABA, Provincia e Interior

**Esta división no es opcional y se replica tal cual.** No es una preferencia
de organización: responde a que en Argentina hay tres mercados de mudanza
que se comportan distinto y que, mezclados en una sola campaña, se comen
entre sí.

| Campaña | Qué contiene | Grupos | Claves | Segmentación |
|---|---|---|---|---|
| **CMD \| CABA** | los 48 barrios porteños + un grupo general | 51 | 434 | Ciudad Autónoma de Buenos Aires |
| **CMD \| Provincia de Buenos Aires** | 30 localidades del GBA + 12 de la costa atlántica | 43 | 356 | Provincia de Buenos Aires |
| **CMD \| Interior** | las 22 provincias restantes + servicios de larga distancia | 25 | 338 | Argentina |

Suman las mismas 114 localidades del sitio. Cada grupo apunta a su página.

#### Por qué separarlas y no hacer una sola

Son tres negocios distintos disfrazados del mismo:

- **CABA** — mucho volumen de búsqueda, distancias cortas, ticket bajo. El
  problema es el acceso: edificios, ascensores, permisos.
- **Provincia** — volumen medio, distancias medias, ticket medio. Countries,
  barrios cerrados, y la costa que se mueve por temporada.
- **Interior** — poco volumen, pero cada mudanza vale varias veces más que
  una de CABA. Es larga distancia.

Si van juntas en una campaña, el presupuesto se lo lleva CABA, que es donde
está el volumen de búsqueda, y las mudanzas de mayor valor nunca se muestran.
**Separarlas es la única forma de poder asignarle plata propia a cada
mercado.** El presupuesto es de la campaña: si comparten campaña, no hay
manera de proteger al interior del volumen porteño.

Lo mismo con la segmentación geográfica: cada una necesita la suya, y eso
también se define a nivel de campaña.

#### El problema que aparece al separarlas

Alguien en Palermo que se muda a Córdoba busca *"mudanzas a Córdoba"*. Esa
búsqueda tiene que caer en Interior, pero la clave de frase
`mudanzas buenos aires` de la campaña Provincia puede capturarla, y el
usuario aterriza en la página genérica.

Se resuelve con **negativas cruzadas**: los nombres de las 22 provincias del
interior van como negativas en CABA y en Provincia. Ahí no son basura que
filtrar, son un enrutador.

Y la campaña Interior **no excluye Buenos Aires**, aunque parezca lógico:
en larga distancia la búsqueda sale del **origen**, y el origen suele ser
Buenos Aires. Excluir CABA sería dejar afuera al cliente más valioso.

Por eso cada provincia del interior lleva además las claves
`mudanzas a {provincia}` y `mudanza de buenos aires a {provincia}`, que CABA
y Provincia no tienen.

#### El presupuesto

Arrancó en $35.000 por día en cada una, $105.000 en total. **Es un punto de
partida, no una conclusión.** Igualarlas al principio es lo razonable cuando
no hay datos: las tres tienen demanda y valor por operación muy distintos,
pero todavía no se sabe cuánto.

A las dos semanas se mira la columna **"% de impresiones perdidas por
presupuesto"** en cada campaña y se reasigna. Esa columna dice literalmente
cuánta demanda te estás perdiendo por no tener plata puesta ahí. Es el único
dato que justifica mover el reparto.

Lo probable es que Interior pida más de lo que parece: menos búsquedas, pero
cada una vale mucho más.

---

## 7. La estructura del CSV de Google Ads Editor

Esto es lo que más vueltas costó, así que va con los nombres exactos.

### Un solo archivo lleva todos los tipos de fila

**Editor decide qué representa cada fila según qué columnas estén
completas.** No hay una columna "tipo de fila".

| Tipo de fila | Se reconoce porque tiene | Cantidad |
|---|---|---|
| Campaña | `Campaign Type` | 3 |
| Grupo de anuncios | `Ad Group Status` | 119 |
| Palabra clave | `Criterion Type` = `Phrase` / `Exact` | 1.128 |
| Negativa de campaña | `Criterion Type` = `Campaign negative` | 350 |
| Anuncio | `Ad Type` = `Responsive search ad` | 119 |
| Vínculo a sitio | `Link text` | 18 |
| Texto destacado | `Callout text` | 30 |

Total 1.767 filas en un archivo. Se importa con
**Cuenta → Importar → Desde archivo**.

### Las columnas

```
Campaign, Campaign Type, Campaign Daily Budget, Bid Strategy Type,
Networks, Languages, Location, Campaign Status,
Ad Group, Max CPC, Ad Group Status,
Keyword, Criterion Type, Keyword Status,
Ad Type, Final URL, Path 1, Path 2,
Headline 1..15, Description 1..4, Ad Status,
Link text, Description line 1, Description line 2, Callout text
```

Mayúsculas y espacios no importan. El presupuesto acepta
`Campaign daily budget`, `Daily budget`, `Campaign budget` o `Budget`
indistintamente.

### Las cuatro trampas

**1. `Campaign negative` es el valor exacto.**
No `Campaign Negative Phrase`, que no existe y hace fallar la importación
entera con un error de criterios sin decir cuál es el problema.

**2. La concordancia de una negativa no va en ninguna columna.**
Se indica con puntuación en el propio texto de la palabra:

| Escrito así | Concordancia |
|---|---|
| `flete barato` | amplia |
| `"flete barato"` | de frase |
| `[flete barato]` | exacta |

Para negativas conviene **amplia**, al revés de lo que uno intuye con las
positivas: la negativa amplia `flete barato` frena cualquier búsqueda que
traiga las dos palabras en cualquier orden, mientras que en exacta solo
frena a quien busque literalmente esas dos palabras y nada más.

**3. `Description line 1` y `Description 1` son columnas distintas.**
La primera es la descripción de un vínculo a sitio (máx. 35). La segunda es
la descripción de un anuncio (máx. 90). Se parecen lo suficiente como para
mezclarlas.

**4. Los límites de caracteres los rechaza Editor, fila por fila.**

| Campo | Máximo |
|---|---|
| Título de anuncio | 30 |
| Descripción de anuncio | 90 |
| Texto de vínculo | 25 |
| Descripción de vínculo (cada línea) | 35 |
| Texto destacado | 25 |

Se validan en el generador y se aborta antes de escribir. Contarlos a ojo
no funciona: el problema aparece recién en la importación y sobre 1.767
filas no hay forma de saber cuál falló.

### Lo que no entra por CSV

Tres ajustes que hay que hacer sí o sí en la interfaz web:

1. **Objetivos de conversión a nivel campaña.** Si se dejan los
   predeterminados de la cuenta, la puja optimiza hacia todas las acciones
   heredadas, incluidas las mal configuradas.
2. **Recurso de llamada** con el teléfono.
3. **Opción de ubicación en "Presencia"**, no "Presencia o interés". El
   valor por omisión muestra los avisos a gente de otros países que busca
   información sobre Argentina.

Y la declaración de anuncios políticos de la UE, en
**Facturación → Verificación del anunciante**, que le aparece a todas las
cuentas del mundo aunque no tengan nada que ver con Europa.

---

## 8. El script para medir solapamiento

Antes de publicar, correlo sobre las páginas generadas:

```python
import re, glob, collections, statistics

def texto(p):
    h = open(p, encoding='utf-8').read()
    h = re.sub(r'(?is)<(script|style|svg)[^>]*>.*?</\1>', ' ', h)
    h = re.sub(r'(?s)<!--.*?-->', ' ', h)
    h = re.sub(r'<[^>]+>', ' ', h)
    return re.sub(r'\s+', ' ', h).strip()

paginas = sorted(glob.glob('mudanzas-*.html'))
docs = {p: texto(p) for p in paginas}
frases = {p: [f.strip() for f in re.split(r'(?<=[.!?])\s+', t) if len(f.strip()) > 25]
          for p, t in docs.items()}
cuenta = collections.Counter(f for fs in frases.values() for f in fs)

tot, uni = [], []
for p, fs in frases.items():
    tot.append(len(docs[p].split()))
    uni.append(sum(len(f.split()) for f in fs if cuenta[f] == 1))

print(f'palabras/página  {statistics.median(tot):.0f}')
print(f'exclusivas       {statistics.median(uni):.0f}')
print(f'proporción única {statistics.median(uni)/statistics.median(tot)*100:.1f}%')
```

Objetivo: proporción única por encima de **25%**.

---

## 9. Cómo replicarlo en otro dominio

### Orden de trabajo

1. **Relevar el sitio actual antes de tocar nada.** Textos, datos de
   contacto, URLs que ya están indexadas. Guardarlo en un archivo. Cualquier
   URL viva que desaparezca necesita un 301, y la lista hay que tenerla
   antes, no después.

2. **Escribir la plantilla, una sola.** Con marcadores donde entra lo
   variable.

3. **Llenar el JSON.** Es el 80% del trabajo real y no se puede apurar: acá
   se decide si el sitio tiene contenido propio o relleno. Cinco campos de
   100–140 palabras por localidad.

4. **Generar y medir el solapamiento.** Si da menos de 25% único, volver al
   punto 3. No sirve seguir.

5. **Schema, sitemap, canonical, `llms.txt`, `robots.txt`.**

6. **Redirecciones y dominio canónico** en `vercel.json`.

7. **Verificar las 3 cosas que rompen todo:** que todas las URLs devuelvan
   200, que el canonical de cada página apunte a sí misma, y que el dominio
   viejo redirija con 301.

8. **Generar la campaña desde los mismos datos.**

9. **Importar, y hacer a mano los tres ajustes de interfaz.**

### Qué se puede reusar tal cual

`build/generar.py`, `build/campana.py` y `templates/base.html` son casi
independientes del negocio. Lo que hay que cambiar:

- `HOST` en los dos scripts
- Los datos de contacto en la plantilla y en `llms.txt`
- `data/*.json` entero
- `ads/config.json`: presupuestos, ubicaciones, negativas, textos base

### Lo que hay que decidir de nuevo, no copiar

- **Las negativas.** Las de acá bloquean guardamuebles, baulera, limpieza y
  pintura porque CMD **no presta esos servicios**. Otra empresa quizá sí los
  presta, y copiarlas sería bloquearse el negocio. Lo mismo con todo el
  bloque de fletes.
- **El reparto del presupuesto** entre las tres campañas. La división en
  CABA / Provincia / Interior sí se replica tal cual —ver sección 6—, pero
  cuánta plata va a cada una depende de los datos de cada empresa.
- **Qué rastreadores de IA permitir.**

---

## 10. Los errores que cometí, para que no se repitan

Van con el síntoma, porque el síntoma es lo que se ve primero.

**Texto invisible sobre fondo oscuro.** Pasó dos veces. La causa siempre fue
la misma: un componente que hereda tokens de color de un contenedor
invertido y nunca los redefine. Cuando un bloque va sobre fondo oscuro, hay
que redefinirle los tokens explícitamente.

**Dos elementos SVG con el mismo `id` de gradiente.** El segundo gana en
silencio. En una página aislada se veía bien; en la real, no. Prefijar los
ids por escena.

**Validar con cálculos en vez de mirar.** Estuve corrigiendo posiciones de
un SVG con aritmética sobre el DOM mientras el resultado visible era otro.
Se resolvió sacando capturas y mirándolas. Para cualquier cosa visual,
mirarla.

**Muestreo con aliasing.** Verificando la dirección de una animación, mis
mediciones daban resultados contradictorios porque el intervalo de muestreo
entraba en resonancia con el ciclo. Se resuelve pausando la animación y
avanzando el tiempo a mano.

**Citar rutas de interfaz de memoria.** Google Ads mueve los menús seguido y
la ayuda en español va atrasada respecto de la aplicación. Verificar contra
la documentación, y aun así contrastar con lo que el usuario ve en pantalla:
en este caso la app decía *"Palabras clave, Negativo"* donde la ayuda decía
*"Palabras clave, Elementos negativos"*.

**Suponer que algo no se podía hacer.** Di por cierto que los recursos no
podían ir en el mismo CSV que las campañas y partí el archivo en tres.
Sí se podía. Verificar antes de partir la solución.

**Una negativa amplia que mata una palabra clave propia.** `deposito` como
negativa anulaba la clave `mudanza de deposito industrial`, que es un
servicio real. **Editor no avisa**: importa las dos y el grupo simplemente
nunca muestra. Está el control automático en `build/campana.py`.

**Duplicar el proyecto en dos carpetas.** Editaba en una y copiaba a la
otra. Una sola carpeta, versionada.

---

## 11. Lo que quedó pendiente acá

Para no arrastrarlo al próximo:

- **Contenido único por página al 12,7%.** Es lo primero de la lista.
- **Sin fotos reales.** Las del sitio anterior eran de stock —montañas
  canadienses con el logo encima—. Por eso la campaña no lleva recursos de
  imagen: una foto genérica no aporta y puede restar.
- **Sin página de política de privacidad.** El pie enlaza a `#`.
- **Datos de flota contradictorios** entre "20 a 50 m³" y "8 a 90 metros
  cuadrados". La campaña usa el primero.
- **Sin informe de términos de búsqueda todavía.** Es lo que más va a
  afinar tanto las negativas como los textos de las 114 páginas, y recién
  se puede leer con la campaña andando.
