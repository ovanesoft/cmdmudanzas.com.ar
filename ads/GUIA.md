# Campaña de Google Ads — importación y puesta en marcha

> Cuenta: **573-915-0215** · Etiqueta: **AW-11228584141**
> Archivos: `cmd-campana.csv` (encabezados en inglés) y `cmd-campana-es.csv` (en español)
> Se regenera con: `python3 build/campana.py`

---

## Qué contiene

| Campaña | Grupos | Palabras clave | Negativas | Presupuesto/día | Segmentación |
|---|---|---|---|---|---|
| CMD \| CABA | 51 | 434 | 124 | $35.000 | Ciudad de Buenos Aires |
| CMD \| Provincia de Buenos Aires | 43 | 356 | 124 | $35.000 | Provincia de Buenos Aires |
| CMD \| Interior | 25 | 338 | 102 | $35.000 | Argentina |
| **Total** | **119** | **1.128** | **350** | **$105.000** | |

Las negativas **van dentro del CSV**, no aparte. Ver más abajo por qué el
primer intento falló.

Un grupo por localidad, cada uno apuntando a **su propia página**. 118 URLs de
destino distintas, todas verificadas con respuesta 200.

Se generan desde `data/*.json`, las mismas 114 localidades del sitio. Si mañana
se agrega una localidad al sitio, entra sola a la campaña al regenerar.

## Cómo importar

1. Abrir **Google Ads Editor** y bajar la cuenta 573-915-0215
2. **Cuenta → Importar → Desde archivo**
3. Elegir `cmd-campana.csv`. Si los encabezados no se reconocen porque el
   Editor está en español, usar `cmd-campana-es.csv`. Si aun así falla, Editor
   ofrece **mapear las columnas a mano** en el paso siguiente
4. Revisar la vista previa de cambios
5. **Publicar**

> Las tres campañas se importan **en pausa** a propósito. Nada empieza a gastar
> hasta que se revise y se activen a mano.

---

## Lo que NO entra por CSV y hay que cargar en la interfaz

### 1. Objetivos a nivel de campaña ← lo más importante

En cada campaña: **Configuración → Objetivos de conversión → Usar objetivos a
nivel de campaña** y marcar únicamente:

- `CMD – Cotizador`
- `CMD – WhatsApp`
- `CMD – Llamada`

**Por qué importa tanto:** la cuenta tiene 14 acciones de conversión heredadas,
varias en estado *Configuración errónea*. Si se dejan los objetivos
predeterminados de la cuenta, la puja optimiza hacia la mezcla de las 14. La
campaña parece funcionar y los números no cierran nunca.

### 2. Recurso de llamada

**Recursos → Recurso de llamada** → `11 2714-2006`

Sin esto, `CMD – Llamada` marca cero para siempre, porque esa conversión mide
llamadas originadas en el anuncio.

### 3. Opción de ubicación

**Configuración → Ubicaciones → Opciones de ubicación** → elegir
**"Presencia: personas que se encuentran habitualmente en las ubicaciones
segmentadas"**.

El valor por omisión es *"Presencia o interés"*, que muestra los avisos a
gente de otros países que busca información sobre Argentina. Es de los ajustes
que más presupuesto desperdicia y viene mal por defecto.

---

## Decisiones tomadas y por qué

**Maximizar clics con tope de CPC, no Maximizar conversiones.**
La cuenta tiene cero historial de conversiones: las campañas anteriores
corrieron sin medición. Una puja por conversiones no tendría de dónde aprender.
Cambiar a CPA objetivo cuando haya 15–30 conversiones al mes.

**Concordancia de frase y exacta, sin amplia.**
La amplia sin datos de conversión gasta en búsquedas irrelevantes. Se suma
después, cuando la puja inteligente tenga con qué filtrar.

**Solo Búsqueda de Google, sin Socios de búsqueda.**
Los socios traen tráfico más barato y bastante peor. Se puede activar más
adelante y comparar por separado.

**La campaña Interior NO excluye Buenos Aires.**
En larga distancia la búsqueda sale del **origen**, no del destino. Alguien en
Palermo que se muda a Córdoba busca *"mudanzas a Córdoba"*. Si se excluyera
CABA, ese cliente —el de mayor valor— no vería ningún anuncio.

Por eso cada provincia tiene además las claves `mudanzas a {provincia}` y
`mudanza de buenos aires a {provincia}`.

**Negativas en concordancia amplia, dentro del CSV.**
Las decisivas no son las obvias: **guardamuebles, baulera, limpieza y pintura**
están bloqueadas porque **CMD no presta esos servicios**. Sin eso se paga por
clics imposibles de convertir. Ídem países fuera de Chile, Uruguay y Brasil, y
todo el bloque de **fletes**, que es otro servicio y no convierte en mudanza.

Van en la columna `Keyword`, con `Campaign negative` en `Criterion Type`. Ese
es el valor exacto que documenta Editor. El primer intento usó
`Campaign Negative Phrase` —que no existe— y hacía fallar la importación
entera con un error de criterios.

**La concordancia de una negativa no se declara en una columna.** Se indica con
puntuación en el propio texto: sin nada = amplia, `"comillas"` = frase,
`[corchetes]` = exacta. Van sin puntuación, o sea **amplias**, que es la que más
bloquea: la negativa amplia `flete barato` frena cualquier búsqueda que traiga
las dos palabras en cualquier orden, mientras que en exacta solo frenaría a
quien busque literalmente esas dos palabras y nada más.

**Cuidado con las negativas de una sola palabra genérica.** `deposito` en
amplia parecía razonable para bloquear guardamuebles, pero mataba la clave
`mudanza de deposito industrial`, que es un servicio real. Se reemplazó por
`alquiler de deposito`, `deposito de muebles` y `guardar muebles`. El generador
verifica este choque automáticamente en cada corrida.

**Presupuesto igual en las tres.**
Es un punto de partida, no una conclusión. Las tres campañas tienen demanda y
valor por mudanza muy distintos: Interior tendrá menos búsquedas pero cada
mudanza vale bastante más. Revisar a las dos semanas la columna **"% de
impresiones perdidas por presupuesto"** y reasignar con datos.

---

## Primeras dos semanas

**Todos los días, los primeros días:** *Estadísticas → Términos de búsqueda*.
Ahí se ve por qué búsquedas reales aparecieron los avisos. Todo lo que no
corresponda, agregarlo como negativa. Es lo que más baja el costo por lead al
principio.

**A los 7 días:** revisar qué grupos no tuvieron ni una impresión. Con 119
grupos va a haber varios sin volumen; no molestan ni gastan, pero conviene
saber cuáles son.

**A los 14 días:** mirar % de impresiones perdidas por presupuesto y reasignar
entre las tres campañas.

**Al llegar a 15–30 conversiones mensuales:** cambiar a CPA objetivo.

> El informe de términos de búsqueda de las campañas viejas sirve para saber
> qué busca la gente, pero **no qué convierte**: nunca hubo medición. El
> aprendizaje de conversión arranca de cero con esta campaña.
