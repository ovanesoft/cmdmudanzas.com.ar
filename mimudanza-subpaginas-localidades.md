# mimudanza.com.ar — Subpáginas de provincias y localidades (SEO local)

> Fuente: https://www.mimudanza.com.ar/ — relevado el 2026-08-06
> Estado: **solo recopilación**. NO replicar hasta que Pablo lo indique.
> **113 páginas de localidad** relevadas, todas con su copy local extraído (tablas completas más abajo).

---

## 1. Cómo están hechas — el mecanismo en una frase

**Cada página de localidad es una copia literal completa del `index.html`**, con exactamente **5 puntos de reemplazo** más **una sección extra** insertada justo debajo del hero. Nada más cambia: mismos servicios, mismos testimonios, mismo footer, mismo formulario.

- HTML plano, un archivo por localidad en la raíz: `mudanzas-{slug}.html`
- Peso de cada archivo: **~79 KB** (varía 79.180–79.569 bytes: solo por la longitud del nombre)
- Sin build, sin templating, sin CMS. Copiado y pegado.

### Los 5 reemplazos

| # | Dónde | Patrón |
|---|---|---|
| 1 | `<title>` | `Mudanzas en {NOMBRE}{ opcional: " (subzonas)"} \| Mi Mudanza` |
| 2 | `<meta name="description">` | `Mudanzas profesionales en {NOMBRE}. Más de 10 años de experiencia, seguros incluidos, personal capacitado y precio final garantizado. Cotizá gratis.` |
| 3 | `<link rel="canonical">` + `og:url` + `twitter:url` | `https://www.mimudanza.com.ar/mudanzas-{slug}.html` |
| 4 | `<h1 class="hero-title">` | `Mudanzas en <span class="highlight">{NOMBRE}</span>` |
| 5 | `<p class="hero-subtitle">` | `Servicio profesional de mudanzas en {NOMBRE}. Más de 10 años de experiencia, calidad, excelencia y precio final garantizado.` |

### La sección extra: `local-highlight`

Es **lo único realmente único** de cada página: un bloque oscuro con franja naranja a la izquierda, ícono de pin, un H2, un párrafo escrito a mano con color local, y un CTA a WhatsApp con texto pre-cargado.

```html
<!-- Sección Local Personalizada — {NOMBRE} -->
<section class="local-highlight">
    <div class="container">
        <div class="local-highlight-content">
            <div class="local-icon">
                <i class="fas fa-map-marker-alt"></i>
            </div>
            <div class="local-text">
                <h2>Mudanzas especializadas en <strong>{NOMBRE}</strong></h2>
                <p>{PÁRRAFO LOCAL ÚNICO}</p>
            </div>
            <div class="local-cta">
                <a href="https://wa.me/5491138961652?text=Hola%2C%20necesito%20una%20mudanza%20en%20{NOMBRE URL-ENCODED}"
                   target="_blank" rel="noopener" class="btn btn-primary btn-lg">
                    <i class="fab fa-whatsapp"></i> Cotizá en {NOMBRE}
                </a>
            </div>
        </div>
    </div>
</section>
```

Va inmediatamente después de `</section>` del hero y antes de `<section id="servicios" class="services">`.

### CSS de `local-highlight` (inline en el `<head>` de cada página)

```css
/* === Sección Local Personalizada === */
.local-highlight {
    background: linear-gradient(135deg, #2C3E50 0%, #1a252f 100%);
    padding: 2.5rem 0;
    position: relative;
    overflow: hidden;
}
.local-highlight::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 5px; height: 100%;
    background: var(--primary-color, #FF6B35);
}
.local-highlight-content {
    display: flex;
    align-items: center;
    gap: 2rem;
    flex-wrap: wrap;
}
.local-icon {
    flex-shrink: 0;
    width: 70px; height: 70px;
    border-radius: 50%;
    background: var(--primary-color, #FF6B35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.8rem;
    color: #fff;
}
.local-text { flex: 1; min-width: 250px; }
.local-text h2 { color: #fff; font-size: 1.5rem; margin-bottom: 0.5rem; }
.local-text strong { color: #FF6B35; text-shadow: 0 1px 3px rgba(0,0,0,0.4); }
.local-text p { color: rgba(255,255,255,0.85); font-size: 1rem; line-height: 1.6; margin: 0; }
.local-cta { flex-shrink: 0; }

@media (max-width: 768px) {
    .local-highlight-content { flex-direction: column; text-align: center; }
    .local-highlight::before { width: 100%; height: 4px; top: 0; left: 0; }
}
```

### Schema.org — idéntico en todas (NO se personaliza)

```json
{
    "@context": "https://schema.org",
    "@type": "MovingCompany",
    "name": "Mi Mudanza",
    "description": "Servicio profesional de mudanzas en Buenos Aires. Mudanzas locales, nacionales e internacionales.",
    "url": "https://www.mimudanza.com.ar",
    "telephone": "+54-11-3896-1652",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "Parral 61, Piso 3, Of. 8",
        "addressLocality": "Ciudad Autónoma de Buenos Aires",
        "addressRegion": "CABA",
        "addressCountry": "AR"
    },
    "areaServed": { "@type": "Country", "name": "Argentina" },
    "priceRange": "$$",
    "serviceType": ["Mudanzas Locales","Mudanzas Nacionales","Mudanzas Internacionales","Embalaje","Limpieza","Pintura"]
}
```

Otros metas fijos en todas: `robots: index, follow`, `keywords` genérico (siempre el mismo, sin la localidad), `og:image: /images/og-image.jpg`, `lang="es-AR"`, `favicon: images/favicon.png`.

---

## 2. Cómo se navega hacia ellas — footer colapsable

Las 113 páginas se enlazan **solo desde el footer**, en 4 acordeones colapsados por defecto.

```html
<div class="footer-provinces">
    <div class="footer-seo-group">
        <button class="footer-seo-toggle" onclick="toggleSeoGroup(this)" aria-expanded="false">
            <i class="fas fa-map-marked-alt"></i>
            Mudanzas por Provincia
            <i class="fas fa-chevron-down toggle-icon"></i>
        </button>
        <div class="provinces-grid footer-seo-content" style="display:none;">
            <a href="mudanzas-cordoba.html">Mudanzas en Córdoba</a>
            <!-- ... -->
        </div>
    </div>
    <!-- + 3 grupos más -->
</div>
```

Los 4 grupos: **Mudanzas por Provincia** · **Mudanzas en el Gran Buenos Aires** · **Mudanzas en el Partido de la Costa** · **Mudanzas por Barrio (CABA)**.

```js
function toggleSeoGroup(btn) {
    var content = btn.nextElementSibling;
    var expanded = btn.getAttribute('aria-expanded') === 'true';
    if (expanded) {
        content.style.display = 'none';
        btn.setAttribute('aria-expanded', 'false');
    } else {
        content.style.display = 'grid';
        btn.setAttribute('aria-expanded', 'true');
    }
}
```

```css
.footer-seo-group  { margin-bottom: 0.5rem; }
.footer-seo-toggle {
    display: flex; align-items: center; gap: 0.6rem;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.9);
    padding: 0.65rem 1.1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem; font-weight: 600;
    font-family: var(--font-primary);
    width: 100%; text-align: left;
    transition: background 0.2s, border-color 0.2s;
}
.footer-seo-toggle:hover { background: rgba(255,255,255,0.14); border-color: rgba(255,255,255,0.3); }
.footer-seo-toggle .toggle-icon { margin-left: auto; transition: transform 0.3s; }
.footer-seo-toggle[aria-expanded="true"] .toggle-icon { transform: rotate(180deg); }
.footer-seo-content { padding-top: 0.75rem; padding-bottom: 0.5rem; }

.footer-provinces {
    margin-top: 2rem; padding-top: 2rem;
    border-top: 1px solid rgba(255,255,255,0.1);
}
.provinces-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.5rem;
    font-size: 0.85rem;
}
.provinces-grid a {
    padding: 0.25rem 0;
    color: var(--gray-light);
    text-decoration: none;
    transition: var(--transition);
}
.provinces-grid a:hover { font-weight: 700; text-decoration: underline; }
```

---

## 3. Problemas del enfoque actual (a corregir al replicar)

1. **`sitemap.xml` tiene UNA sola URL** (`https://www.mimudanza.com.ar/`). Las 113 páginas de localidad **no están en el sitemap**. Se descubren solo por los links del footer.
2. **No tienen el FAB, ni el banner de WhatsApp, ni los modales de Instagram** (solo el chatbot). Se pierde toda la maquinaria de conversión justo en las páginas que capturan tráfico de búsqueda local.
3. **Contenido casi duplicado al 99%**: la única diferencia real es un párrafo de ~200 caracteres sobre ~79 KB de HTML. Riesgo alto de que Google las trate como thin/duplicate content.
4. **Schema.org sin personalizar**: `areaServed` siempre dice "Argentina" en lugar de la localidad, y `description` siempre dice "Buenos Aires".
5. **`keywords` idéntico en las 113** y sin mencionar la localidad.
6. **Sin breadcrumbs, sin interlinking entre localidades cercanas**, sin `og:image` local.
7. **La sección "Mudanzas Locales" sigue diciendo "Mudanzas en Buenos Aires y alrededores"** aunque la página sea de Tierra del Fuego.
8. **Sin `hreflang`, sin paginación, sin páginas índice** (`/provincias`, `/caba`, etc.) — todo cuelga del footer colapsado.
9. Mantenimiento: cambiar un teléfono implica editar 113 archivos a mano.

**Enfoque recomendado para el rediseño:** una plantilla + un archivo de datos (JSON/YAML) con `{slug, nombre, nombreEncoded, tituloSufijo, parrafoLocal, provincia, tipo}`, y generación estática. Más: sitemap completo, schema `MovingCompany` con `areaServed` real por localidad, y los componentes de contacto en todas.

---

## 4. Inventario completo — 113 páginas

### 4.1 Provincias (24)

| Archivo | `<title>` | Párrafo local | CTA |
|---|---|---|---|
| `mudanzas-buenos-aires.html` | Mudanzas en la Provincia de Buenos Aires \| Mi Mudanza | Del Conurbano a la Costa, del Noroeste bonaerense a la Cuenca del Salado. Conocemos la provincia más grande del país palmo a palmo. Tu nueva etapa arranca con el mejor equipo de Buenos Aires. | Cotizá en Buenos Aires |
| `mudanzas-cordoba.html` | Mudanzas en Córdoba (Capital y Sierras) \| Mi Mudanza | Desde Nueva Córdoba hasta el Cerro, o cruzando las Altas Cumbres. Conocemos cada rincón de 'La Docta' y llevamos tus cosas con la tonada y el cuidado que nos caracteriza. | Cotizá en Córdoba |
| `mudanzas-santa-fe.html` | Mudanzas en Santa Fe y Rosario \| Mi Mudanza | Ya sea cerca del Monumento a la Bandera o en la capital provincial, conectamos el litoral con todo el país. Tu mudanza fluye tan segura como el Paraná. | Cotizá en Santa Fe |
| `mudanzas-mendoza.html` | Mudanzas en Mendoza y Cuyo \| Mi Mudanza | Entre viñedos y montañas, sabemos movernos. Cuidamos tus pertenencias como al mejor Malbec, conectando Cuyo con cualquier punto de Argentina. | Cotizá en Mendoza |
| `mudanzas-tucuman.html` | Mudanzas en San Miguel de Tucumán \| Mi Mudanza | En el Jardín de la República, hacemos florecer nuevos comienzos. Llegamos a cada rincón de San Miguel y alrededores con la calidez del norte. | Cotizá en Tucumán |
| `mudanzas-salta.html` | Mudanzas en Salta 'La Linda' \| Mi Mudanza | Tan linda que enamora, y nosotros te ayudamos a instalarte. Conocemos los caminos de los valles y la ciudad para que tu llegada sea una experiencia gaucha. | Cotizá en Salta |
| `mudanzas-neuquen.html` | Mudanzas en Neuquén y Patagonia \| Mi Mudanza | Donde confluyen los ríos y nace la energía del país. Somos expertos en rutas patagónicas, llevando tu hogar al sur con total seguridad frente al viento. | Cotizá en Neuquén |
| `mudanzas-rio-negro.html` | Mudanzas en Río Negro y Bariloche \| Mi Mudanza | Del Alto Valle a la Cordillera. Ya sea que te mudes a Bariloche o Viedma, nuestros camiones están preparados para la nieve, la ruta y la aventura. | Cotizá en Río Negro |
| `mudanzas-entre-rios.html` | Mudanzas en Entre Ríos \| Mi Mudanza | Tierra de palmares y carnavales. Cruzamos el puente y recorremos el litoral para llevarte a casa, disfrutando del verde entrerriano en cada kilómetro. | Cotizá en Entre Ríos |
| `mudanzas-corrientes.html` | Mudanzas en Corrientes \| Mi Mudanza | Porque Corrientes tiene payé, y nosotros tenemos la logística. Te acompañamos a instalarte en la tierra del chamamé con la mejor energía del litoral. | Cotizá en Corrientes |
| `mudanzas-misiones.html` | Mudanzas en Misiones \| Mi Mudanza | Tierra colorada y selva viva. Nuestros camiones llegan hasta la última curva de la ruta 12 o 14, llevando tus cosas seguras al corazón verde del país. | Cotizá en Misiones |
| `mudanzas-chaco.html` | Mudanzas en Resistencia y Chaco \| Mi Mudanza | En el corazón del noreste, conectamos Resistencia con el país. Sabemos movernos con el calor del norte para que tu mudanza sea rápida y sin estrés. | Cotizá en Chaco |
| `mudanzas-formosa.html` | Mudanzas en Formosa \| Mi Mudanza | Llegamos al norte profundo con la misma dedicación de siempre. Tu mudanza a Formosa está en manos de profesionales que conocen la ruta. | Cotizá en Formosa |
| `mudanzas-jujuy.html` | Mudanzas en Jujuy y la Quebrada \| Mi Mudanza | Entre cerros de siete colores y la puna. Respetamos la altura y los caminos sinuosos para que tus muebles lleguen intactos al norte argentino. | Cotizá en Jujuy |
| `mudanzas-catamarca.html` | Mudanzas en Catamarca \| Mi Mudanza | Valles, montañas y la Virgen del Valle. Conocemos la geografía catamarqueña para brindarte un servicio puerta a puerta seguro y confiable. | Cotizá en Catamarca |
| `mudanzas-la-rioja.html` | Mudanzas en La Rioja \| Mi Mudanza | Tierra de caudillos y buen vino. Llevamos tu hogar a los pies del Velasco con la fuerza y seguridad que tu familia necesita. | Cotizá en La Rioja |
| `mudanzas-san-juan.html` | Mudanzas en San Juan \| Mi Mudanza | Bajo el sol sanjuanino, tu mudanza brilla. Expertos en la región de Cuyo, garantizamos que tus pertenencias lleguen perfectas a la tierra del sol. | Cotizá en San Juan |
| `mudanzas-san-luis.html` | Mudanzas en San Luis \| Mi Mudanza | Autopistas iluminadas y sierras puntanas. Aprovechamos la conectividad de San Luis para ofrecerte una mudanza ágil, moderna y sin complicaciones. | Cotizá en San Luis |
| `mudanzas-la-pampa.html` | Mudanzas en La Pampa \| Mi Mudanza | En la inmensidad de la llanura, nosotros te acercamos. Conectamos Santa Rosa y General Pico con el resto de Argentina, acortando distancias. | Cotizá en La Pampa |
| `mudanzas-chubut.html` | Mudanzas en Chubut \| Mi Mudanza | Del valle a la costa, donde las ballenas saludan. Nuestros camiones recorren la estepa patagónica para llevarte a Trelew, Madryn o Comodoro. | Cotizá en Chubut |
| `mudanzas-santa-cruz.html` | Mudanzas en Santa Cruz \| Mi Mudanza | Tierra de glaciares y horizontes infinitos. Llegamos al sur profundo, desafiando las distancias para que te sientas en casa en la Patagonia austral. | Cotizá en Santa Cruz |
| `mudanzas-tierra-del-fuego.html` | Mudanzas en Tierra del Fuego \| Mi Mudanza | Llegamos al Fin del Mundo por vos. Cruzamos el estrecho y coordinamos la aduana para que mudarte a Ushuaia o Río Grande sea una aventura simple. | Cotizá en Tierra del Fuego |
| `mudanzas-santiago-del-estero.html` | Mudanzas en Santiago del Estero \| Mi Mudanza | Madre de ciudades, cuna de folklore. Llevamos tus cosas con el ritmo y la calidez santiagueña, asegurando que lleguen bien a pesar del calor de la siesta. | Cotizá en Santiago del Estero |

> Faltan Misiones ✓ (está) — las ausentes respecto de las 24 provincias: **CABA** no tiene página propia (se cubre con los 40 barrios).

### 4.2 Gran Buenos Aires y ciudades bonaerenses (28)

| Archivo | `<title>` | Párrafo local |
|---|---|---|
| `mudanzas-tigre.html` | Mudanzas en Tigre y el Delta | Ríos, islas y el Delta más hermoso del mundo a la vuelta de casa. Mudarse a Tigre es elegir la naturaleza sin alejarse de la ciudad. Coordinamos acceso en lancha o en tierra, según lo que necesites. |
| `mudanzas-san-isidro.html` | Mudanzas en San Isidro | El casco histórico, la Catedral, el hipódromo y la costanera del Plata. San Isidro combina historia, elegancia y calidad de vida como pocos lugares del país. Tu mudanza en el norte premium merece el mejor equipo. |
| `mudanzas-vicente-lopez.html` | Mudanzas en Vicente López y Olivos | La Quinta de Olivos, la costanera y avenidas arboladas que respiran jerarquía. Vicente López es el primer corredor norte y nosotros lo conocemos bien, desde La Lucila hasta Florida. |
| `mudanzas-pilar.html` | Mudanzas en Pilar y Countries | Countries, barrios cerrados y una ciudad que no para de crecer. Pilar es el destino favorito de las familias que buscan espacio y verde. Somos expertos en mudanzas con acceso a portería, guardias y reglamentos de consorcio. |
| `mudanzas-san-fernando.html` | Mudanzas en San Fernando | Entre el río y el Delta, San Fernando tiene el alma náutica del norte bonaerense. Te ayudamos a llegar a tu nuevo hogar, sea en tierra firme o en una hermosa isla del Paraná. |
| `mudanzas-escobar.html` | Mudanzas en Escobar (El Pueblo de las Flores) | La capital de las flores de Argentina, con el aroma y el color que la hacen única. Escobar crece y se moderniza, y nosotros acompañamos cada mudanza con la misma frescura que el campo bonaerense. |
| `mudanzas-campana.html` | Mudanzas en Campana | A orillas del Paraná, con la energía industrial y la tranquilidad del interior. Campana es una ciudad que tiene de todo, y nosotros llegamos hasta cada rincón con puntualidad y cuidado. |
| `mudanzas-zarate.html` | Mudanzas en Zárate | Los puentes más importantes del país arrancan desde acá. Zárate conecta el norte con el litoral, y nosotros conectamos tus pertenencias con tu nuevo hogar en esta ciudad orgullo del Paraná. |
| `mudanzas-san-martin-gba.html` | Mudanzas en San Martín (Gran Buenos Aires) | En el corazón del primer cordón, San Martín tiene una conectividad imbatible. Fácil acceso, rutas y ferrocarril: las ventajas que también aprovechamos para que tu mudanza llegue rápido y seguro. |
| `mudanzas-tres-de-febrero.html` | Mudanzas en Tres de Febrero (Caseros, Ciudadela) | De Ciudadela a Pablo Podestá, Tres de Febrero es un mosaico de barrios con identidad propia. Te acompañamos a instalarte en cualquier rincón de este municipio bien conectado con la ciudad. |
| `mudanzas-moron.html` | Mudanzas en Morón | El centro del oeste bonaerense, con historia, cultura y una plaza que vale la pena. Morón tiene todo cerca y nosotros lo sabemos: coordinamos tu mudanza en el municipio más conectado del corredor oeste. |
| `mudanzas-ramos-mejia.html` | Mudanzas en Ramos Mejía | Elegante, arbolado y con una vida comercial envidiable. Ramos Mejía es la joya del oeste y sus vecinos lo saben. Te ayudamos a instalarte en este rincón querido del conurbano con el cuidado que se merece. |
| `mudanzas-haedo.html` | Mudanzas en Haedo | Barrio tranquilo, familia a familia, con calles que todavía se caminan de noche sin apuro. Haedo es uno de esos lugares donde la gente echa raíces. Te ayudamos a echar las tuyas. |
| `mudanzas-castelar.html` | Mudanzas en Castelar | Arbolado, residencial y con todo lo necesario a la vuelta de la esquina. Castelar es el equilibrio perfecto entre el verde del interior y la comodidad del Gran Buenos Aires. |
| `mudanzas-ituzaingo.html` | Mudanzas en Ituzaingó | Un nombre con historia patria y un barrio con futuro. Ituzaingó crece ordenado y tranquilo, con calles limpias y familias que eligen quedarse. Tu mudanza acá merece el mismo orden. |
| `mudanzas-merlo.html` | Mudanzas en Merlo | Popular, comercial y con una energía que no para. Merlo es uno de los municipios más grandes del conurbano y lo conocemos bien. Llegamos a cada barrio con experiencia y sin complicaciones. |
| `mudanzas-moreno.html` | Mudanzas en Moreno | Una ciudad que crece a toda velocidad, con familias que apuestan al oeste bonaerense. Moreno tiene mucho para dar, y nosotros llegamos hasta el último barrio con el mismo profesionalismo de siempre. |
| `mudanzas-la-matanza.html` | Mudanzas en La Matanza (San Justo, Ramos Mejía, González Catán) | El municipio más grande del país en población, con una diversidad que lo hace único. De San Justo a González Catán, conocemos La Matanza de punta a punta para que tu mudanza llegue a donde tiene que llegar. |
| `mudanzas-lujan.html` | Mudanzas en Luján | La Virgen, la Basílica y el río Luján como testigos eternos. Mudarse a Luján es llegar a una ciudad con alma propia, historia profunda y una paz que pocas ciudades del país tienen. |
| `mudanzas-avellaneda.html` | Mudanzas en Avellaneda | Cruzando el Puente Pueyrredón, tierra de Independiente y Racing. Avellaneda es el sur orgulloso del conurbano, con historia industrial y gente de trabajo. Llegamos con el mismo espíritu. |
| `mudanzas-lanus.html` | Mudanzas en Lanús | Cuna de Lanús Fútbol Club y de barrios que se cuidan entre sí. El orgullo del sur bonaerense tiene en cada esquina una historia de trabajo y familia. Te ayudamos a seguir escribiendo la tuya. |
| `mudanzas-lomas-de-zamora.html` | Mudanzas en Lomas de Zamora | Universidad, comercio y la vida del sur bonaerense en su máxima expresión. Lomas de Zamora es una ciudad completa, y nosotros la conocemos barrio por barrio para llevarte a donde quieras. |
| `mudanzas-quilmes.html` | Mudanzas en Quilmes | La cerveza más famosa del país nació acá, pero Quilmes es mucho más: río, costanera, fútbol y una identidad bonaerense inconfundible. Brindamos por tu nuevo comienzo con una mudanza impecable. |
| `mudanzas-berazategui.html` | Mudanzas en Berazategui | Capital del vidrio y la cerámica en Argentina. Berazategui tiene industria, familia y calidad de vida al sur del Conurbano. Llevamos tus cosas con la misma precisión artesanal que caracteriza al barrio. |
| `mudanzas-florencio-varela.html` | Mudanzas en Florencio Varela | El sur más profundo del Gran Buenos Aires, donde las familias eligen vivir tranquilas y cerca de la tierra. Llegamos hasta Florencio Varela con el mismo profesionalismo que al centro de CABA. |
| `mudanzas-almirante-brown.html` | Mudanzas en Almirante Brown (Adrogué, Burzaco, Longchamps) | De Adrogué —con su historia de casonas y aromas a jazmín— hasta Longchamps, Almirante Brown es un municipio extenso y diverso. Conocemos cada rincón para que llegues a casa sin rodeos. |
| `mudanzas-ezeiza.html` | Mudanzas en Ezeiza | Los bosques, el aeropuerto y los nuevos barrios que eligen el verde del sur. Ezeiza creció y se transformó en destino de familias que buscan espacio y tranquilidad. Te ayudamos a aterrizar en tu nuevo hogar. |
| `mudanzas-la-plata.html` | Mudanzas en La Plata (Capital Bonaerense) | La ciudad de las diagonales, el Bosque y la Universidad más grande del país. La Plata tiene una energía estudiantil y cultural única. Mudarse a la capital bonaerense es apostar a una ciudad que nunca deja de crecer. |
| `mudanzas-mar-del-plata.html` | Mudanzas en Mar del Plata | La perla del Atlántico, donde el mar y la ciudad se abrazan todo el año. Mudarse a Mar del Plata es elegir calidad de vida, fresco del mar y una ciudad que vibra en cada estación. |
| `mudanzas-bahia-blanca.html` | Mudanzas en Bahía Blanca | La puerta del sur argentino, con puerto, universidad y una identidad bonaerense fuerte. Bahía Blanca es una ciudad que crece y se consolida. Llegamos hasta acá con la misma puntualidad que a cualquier punto del país. |

### 4.3 Partido de la Costa (11)

| Archivo | `<title>` | Párrafo local |
|---|---|---|
| `mudanzas-partido-de-la-costa.html` | Mudanzas en el Partido de la Costa | Desde San Clemente hasta Mar de Ajó, el Partido de la Costa es el sueño costero bonaerense. Si decidiste dar el gran paso y instalarte todo el año frente al mar, nosotros te ayudamos a llegar con todo tu hogar a la costa atlántica. |
| `mudanzas-san-clemente-del-tuyu.html` | Mudanzas en San Clemente del Tuyú | La primera parada de la costa atlántica bonaerense. San Clemente tiene ballenas, Mundo Marino y el encanto del balneario familiar que no grita pero siempre enamora. Mudarse acá es encontrar la calma frente al mar. |
| `mudanzas-las-toninas.html` | Mudanzas en Las Toninas | Un pueblo chico con corazón grande y playa ancha. Las Toninas tiene esa intimidad costera que los que la conocen cuidan como un secreto. Llegamos con tu mudanza para que puedas empezar a disfrutarla. |
| `mudanzas-santa-teresita.html` | Mudanzas en Santa Teresita | La ciudad más dinámica del Partido de la Costa, con vida comercial, gastronomía y playa todo el año. Santa Teresita creció y se consolidó como un destino para quedarse, no solo para el verano. |
| `mudanzas-mar-del-tuyu.html` | Mudanzas en Mar del Tuyú | Tranquila, familiar y con una playa que parece reservada para los que saben encontrarla. Mar del Tuyú es el destino de quienes eligen la costa sin el ruido de los balnearios masivos. Llegamos a tu nuevo hogar frente al mar. |
| `mudanzas-costa-del-este.html` | Mudanzas en Costa del Este | Lagunas, naturaleza y el mar al fondo. Costa del Este combina la tranquilidad del interior bonaerense con la brisa atlántica. Un destino para quienes buscan vivir rodeados de naturaleza sin renunciar a la comodidad. |
| `mudanzas-aguas-verdes.html` | Mudanzas en Aguas Verdes | El nombre lo dice todo: aguas limpias, arena fina y un horizonte que despeja la mente. Aguas Verdes es el balneario íntimo de la costa atlántica. Tu mudanza hacia acá merece llegar con la misma paz que el lugar transmite. |
| `mudanzas-la-lucila-del-mar.html` | Mudanzas en La Lucila del Mar | Un rincón costero discreto y encantador, donde los vecinos se conocen y las puertas se abren. La Lucila del Mar tiene ese sabor a pueblo de costa que cada vez se encuentra menos. Llegamos hasta la última médano para instalarte. |
| `mudanzas-san-bernardo.html` | Mudanzas en San Bernardo del Tuyú | El balneario familiar por excelencia de la costa bonaerense. San Bernardo tiene esa magia de las vacaciones de toda la vida, pero cada vez más gente elige quedarse todo el año. Y nosotros los ayudamos a hacer ese salto. |
| `mudanzas-mar-de-ajo.html` | Mudanzas en Mar de Ajó | La ciudad más grande del Partido de la Costa, con servicios, comercio y la mejor ola del sur bonaerense. Mar de Ajó tiene todo para vivir todo el año frente al mar. Tu nueva vida costera arranca con la mudanza. |
| `mudanzas-nueva-atlantis.html` | Mudanzas en Nueva Atlantis | Pequeña, tranquila y con la playa prácticamente para vos. Nueva Atlantis es el destino de quienes buscan la costa sin multitudes. Llegamos hasta los confines del Partido de la Costa para que tu hogar esté donde tu corazón lo eligió. |
| `mudanzas-costa-azul.html` | Mudanzas en Costa Azul | Azul como el cielo, azul como el mar. Costa Azul es uno de los balnearios más pintorescos de la costa bonaerense, con médanos y naturaleza que hacen de cada día algo especial. Te ayudamos a instalarte en ese paisaje. |

### 4.4 Barrios de CABA (40)

| Archivo | `<title>` | Párrafo local |
|---|---|---|
| `mudanzas-agronomia.html` | Mudanzas en Agronomía | Un barrio tranquilo y verde, con la energía universitaria del Agronomía-Exactas. Sus calles arboladas y casas bajas hacen que mudarse acá sea un placer. Nosotros lo hacemos fácil. |
| `mudanzas-almagro.html` | Mudanzas en Almagro | Tango, bohemia y ubicación estratégica. Te ayudamos a instalarte en el alma porteña, en uno de los barrios más vivos y culturalmente ricos de Buenos Aires. |
| `mudanzas-balvanera.html` | Mudanzas en Balvanera (Once y Abasto) | El Once que late sin parar, el Abasto que renació. Un barrio de comunidades, comercio y cultura vibrante. Conocemos cada calle del mercado para que tu mudanza en Balvanera sea ágil. |
| `mudanzas-barracas.html` | Mudanzas en Barracas | Historia industrial, murales gigantes y un barrio que se reinventa. Barracas tiene mucho carácter, y nosotros tenemos la experiencia para mover tu hogar con el mismo. |
| `mudanzas-belgrano.html` | Mudanzas en Belgrano (C y R) | Desde las casonas de Belgrano R hasta los modernos edificios de Cabildo. Conocemos el barrio y sus ritmos para que tu mudanza sea tan residencial y tranquila como la zona. |
| `mudanzas-boedo.html` | Mudanzas en Boedo | El barrio del tango, el café y la poesía del Sur porteño. Instalarte en Boedo es comenzar una historia con sabor a Buenos Aires profundo. Nosotros llevamos tus cosas, vos poné el alma. |
| `mudanzas-caballito.html` | Mudanzas en Caballito | El corazón geográfico de Buenos Aires. Nos movemos expertos entre el Parque Rivadavia y Pedro Goyena para que tu llegada al barrio más conectado de la ciudad sea perfecta. |
| `mudanzas-chacarita.html` | Mudanzas en Chacarita | El barrio donde nació Gardel y que hoy renace con bares, música en vivo y cultura joven. Mudarte a Chacarita es apostar a lo mejor de la noche y el día porteño. |
| `mudanzas-coghlan.html` | Mudanzas en Coghlan | Un secreto bien guardado del norte porteño. Coghlan combina la tranquilidad de pueblo con la comodidad de la ciudad. Mudarse acá es encontrar el equilibrio perfecto. |
| `mudanzas-colegiales.html` | Mudanzas en Colegiales | Entre Palermo y Belgrano, con identidad propia. Bicicletas, cafés con onda y casas bajas con jardín. Colegiales crece y nosotros acompañamos cada mudanza con la misma frescura del barrio. |
| `mudanzas-constitucion.html` | Mudanzas en Constitución | El barrio que nunca duerme, nexo del transporte porteño. Sabemos movernos en la intensidad de Constitución para que tu mudanza sea rápida, puntual y sin sorpresas. |
| `mudanzas-devoto.html` | Mudanzas en Villa Devoto | El jardín de Buenos Aires. Cuidamos la tranquilidad de sus calles arboladas y sus casas bajas, realizando mudanzas silenciosas y respetuosas en este oasis residencial. |
| `mudanzas-floresta.html` | Mudanzas en Floresta | Familiar, tranquilo y con todo cerca. Floresta es ese barrio donde la gente se queda y echa raíces. Te ayudamos a echar las tuyas con un servicio de mudanza cálido y confiable. |
| `mudanzas-flores.html` | Mudanzas en Flores | Barrio comercial y familiar, con el movimiento de Rivadavia y la tranquilidad de sus calles internas. Nos adaptamos al ritmo de uno de los barrios con más historia y diversidad. |
| `mudanzas-la-boca.html` | Mudanzas en La Boca | Caminito, el Riachuelo y los colores que enamoraron al mundo. La Boca tiene una energía única. Nuestro equipo conoce sus calles y la pasión del barrio para llevar tus cosas con el mismo amor. |
| `mudanzas-liniers.html` | Mudanzas en Liniers | Comunidades, sabores y la puerta de salida al Oeste. Liniers es un barrio rico en cultura y diversidad. Conocemos su movimiento para hacer tu mudanza rápida y sin complicaciones. |
| `mudanzas-mataderos.html` | Mudanzas en Mataderos | La Feria de Mataderos, el espíritu gaucho en plena ciudad. Un barrio con identidad propia y gente de verdad. Llevamos tus pertenencias con el mismo respeto y trabajo duro que caracteriza al barrio. |
| `mudanzas-monte-castro.html` | Mudanzas en Monte Castro | Residencial, silencioso y con casas con historia. Monte Castro es un barrio que se siente como provincia dentro de la ciudad. Tu mudanza acá merece la misma tranquilidad que el barrio. |
| `mudanzas-montserrat.html` | Mudanzas en Montserrat | El barrio fundacional de Buenos Aires, con la Casa Rosada y el Cabildo a la vuelta. Mudarse al corazón histórico de la ciudad requiere precisión y experiencia. Nosotros las tenemos. |
| `mudanzas-nueva-pompeya.html` | Mudanzas en Nueva Pompeya | Orillas del Riachuelo, murga y barrio obrero con orgullo. Nueva Pompeya tiene historia en cada baldosa. Te acompañamos a instalarte con el mismo carácter y fuerza del barrio. |
| `mudanzas-nunez.html` | Mudanzas en Núñez | Aire del río, estadios y espíritu joven. Mudate cerca del Barrancas o del Monumental con la tranquilidad de un servicio que entiende la dinámica activa de Núñez. |
| `mudanzas-palermo.html` | Mudanzas en Palermo (Soho, Hollywood, Chico) | Sabemos que Palermo no para. Coordinamos permisos de estacionamiento y horarios para que mudarte entre bares, bosques y calles arboladas sea ágil y moderno. |
| `mudanzas-parque-avellaneda.html` | Mudanzas en Parque Avellaneda | El verde del sur porteño, con el Parque Avellaneda como pulmón del barrio. Un lugar familiar y tranquilo donde echar raíces. Te ayudamos a llegar con todo listo para disfrutarlo. |
| `mudanzas-parque-chacabuco.html` | Mudanzas en Parque Chacabuco | Murga, vecinos que se conocen y un parque hermoso. Parque Chacabuco tiene la calidez de los barrios que todavía tienen alma. Nosotros cuidamos tus cosas como el barrio cuida a su gente. |
| `mudanzas-parque-chas.html` | Mudanzas en Parque Chas | El barrio laberíntico que enamora a todos los que lo descubren. Sus calles circulares tienen nombre de ciudades del mundo, y nosotros te ayudamos a encontrar tu lugar en este rincón único de CABA. |
| `mudanzas-parque-patricios.html` | Mudanzas en Parque Patricios | El Distrito Tecnológico de Buenos Aires, donde conviven la innovación y la historia del fútbol de Huracán. Instalarte en el barrio del futuro con el servicio de mudanzas que se lo merece. |
| `mudanzas-paternal.html` | Mudanzas en Paternal | Barrio chico, grande en identidad. La Paternal combina la pasión por Vélez con calles tranquilas y vecinos de toda la vida. Mudarse acá es llegar a un lugar que ya se siente hogar. |
| `mudanzas-puerto-madero.html` | Mudanzas en Puerto Madero | Altura, lujo y vista al río. Somos expertos en mudanzas en torres de alta gama, cumpliendo con los exigentes reglamentos de los consorcios de Madero sin contratiempos. |
| `mudanzas-recoleta.html` | Mudanzas en Recoleta | Elegancia y estilo clásico entre sus avenidas y edificios históricos. Tratamos tus muebles con la distinción que Recoleta exige, cuidando cada detalle en sus imponentes edificios. |
| `mudanzas-retiro.html` | Mudanzas en Retiro | La Plaza San Martín, la Torre de los Ingleses y el cruce de todos los caminos. Retiro es el nudo de la ciudad. Te llevamos a instalarte en este enclave histórico con la precisión que merece. |
| `mudanzas-saavedra.html` | Mudanzas en Saavedra | El norte verde y tranquilo, con el parque Saavedra como corazón del barrio. Casas bajas, silencio y calidad de vida. Te ayudamos a llegar al barrio que parece sacado de otra época, pero en plena CABA. |
| `mudanzas-san-cristobal.html` | Mudanzas en San Cristóbal | Entre el centro y el sur, San Cristóbal tiene la humildad y el sabor de los barrios porteños de verdad. Te acompañamos a instalarte con eficiencia, respeto y precio justo. |
| `mudanzas-san-nicolas.html` | Mudanzas en San Nicolás (El Centro) | El Obelisco, el Teatro Colón y la avenida Corrientes que nunca duerme. Mudarse al centro de Buenos Aires exige organización y experiencia. Tenemos ambas para que tu llegada sea perfecta. |
| `mudanzas-san-telmo.html` | Mudanzas en San Telmo | Calles empedradas, casas coloniales y mucha historia. Nuestros operarios tienen la destreza para maniobrar en el casco histórico, protegiendo tus muebles en cada adoquín. |
| `mudanzas-tribunales.html` | Mudanzas en Tribunales | Los grandes teatros, los juzgados y el pulso del centro porteño. Mudarse al barrio de Tribunales es estar en el epicentro de la ciudad. Te llevamos con la seriedad y precisión que el barrio exige. |
| `mudanzas-versalles.html` | Mudanzas en Versalles | El barrio más pequeño de CABA, con la magia de lo exclusivo. Sus calles con nombres de ciudades europeas tienen personalidad propia. Mudarse a Versalles es elegir distinción dentro de la ciudad. |
| `mudanzas-villa-crespo.html` | Mudanzas en Villa Crespo | Arte, outlets, gastronomía y la comunidad armenia como telón de fondo. Villa Crespo es el barrio más creativo de CABA. Llegar con tus cosas en orden es el primer paso para disfrutar todo lo que ofrece. |
| `mudanzas-villa-del-parque.html` | Mudanzas en Villa del Parque | Casas con jardín, calles con árboles centenarios y una calidad de vida que enamora. Villa del Parque es el refugio de familias que quieren Buenos Aires sin el ruido. Te ayudamos a llegar y quedarte. |
| `mudanzas-villa-general-mitre.html` | Mudanzas en Villa General Mitre *(H1: "Villa Gral. Mitre")* | Un barrio tranquilo y bien conectado, ideal para familias que buscan calidad de vida sin salir de la ciudad. Tu nueva etapa en Villa General Mitre empieza con la mudanza más cuidadosa. |
| `mudanzas-villa-lugano.html` | Mudanzas en Villa Lugano | Orgullo del sur porteño. Villa Lugano tiene comunidad, identidad y gente de trabajo. Llegamos a cada rincón del barrio con el mismo respeto y profesionalismo que su gente se merece. |
| `mudanzas-villa-luro.html` | Mudanzas en Villa Luro | Tranquilo, bien ubicado y con todo lo necesario a mano. Villa Luro es el barrio perfecto para quien quiere vivir cómodo sin complicaciones. Nosotros llevamos tus cosas con la misma simpleza. |
| `mudanzas-villa-ortuzar.html` | Mudanzas en Villa Ortúzar | El barrio joven que crece con fuerza entre Chacarita y Colegiales. Villa Ortúzar se está transformando, y nosotros acompañamos cada nueva llegada con un servicio moderno y confiable. |
| `mudanzas-villa-pueyrredon.html` | Mudanzas en Villa Pueyrredón | Norte tranquilo, casas con historia y vecinos de toda la vida. Villa Pueyrredón tiene la calidez de los barrios que todavía se saludan en la vereda. Mudarte acá es volver a lo esencial. |
| `mudanzas-villa-real.html` | Mudanzas en Villa Real | Uno de los barrios más pequeños y tranquilos del oeste porteño. Villa Real es un secreto que sus vecinos cuidan con cariño. Nosotros llegamos con discreción y cuidado, como el barrio lo pide. |
| `mudanzas-villa-riachuelo.html` | Mudanzas en Villa Riachuelo | A orillas del Riachuelo, en el sur más profundo de la ciudad. Un barrio con identidad obrera y corazón grande. Tu mudanza a Villa Riachuelo llega con el respeto que merece su historia. |
| `mudanzas-villa-santa-rita.html` | Mudanzas en Villa Santa Rita | Tranquilo y seguro, a un paso de Flores y con personalidad propia. Villa Santa Rita es el barrio donde la gente se queda. Te ayudamos a instalarte y entender por qué. |
| `mudanzas-villa-soldati.html` | Mudanzas en Villa Soldati | Sur porteño con mucha vida comunitaria. Villa Soldati tiene gente trabajadora y barrios que se ayudan. Llegamos con el mejor servicio porque cada familia merece una mudanza profesional, sin importar el barrio. |
| `mudanzas-villa-urquiza.html` | Mudanzas en Villa Urquiza | El barrio que más crece. Acompañamos el boom de Villa Urquiza con mudanzas rápidas, ideales para los nuevos departamentos y la creciente vida de barrio moderna. |

---

## 5. Patrón del copy local (para escribir los nuestros)

Los 113 párrafos siguen la misma receta de 3 movimientos, en 25–45 palabras:

1. **Un ancla emocional/geográfica concreta** — un hito, un apodo, un paisaje, un club, una calle.
   *("Caminito, el Riachuelo y los colores…", "La Quinta de Olivos, la costanera…", "Cuna de Lanús Fútbol Club…")*
2. **Una afirmación de identidad del lugar** — qué se siente vivir ahí.
   *("Un barrio que se reinventa", "El destino favorito de las familias que buscan espacio")*
3. **El puente al servicio** — cómo esa característica se traduce en una ventaja operativa concreta.
   *("Coordinamos permisos de estacionamiento y horarios", "Cumpliendo con los exigentes reglamentos de los consorcios", "Coordinamos acceso en lancha o en tierra")*

El movimiento 3 es el que más valor SEO y comercial aporta y es el que **más se diluye** en los párrafos flojos (varios terminan en un genérico "con el mismo profesionalismo de siempre"). Al replicar conviene que **todos** cierren con un dato operativo real y verificable.

**Tono:** voseo argentino consistente ("mudarte", "cotizá", "elegís"), oraciones cortas, cero jerga técnica, referencias locales que solo entiende un local.
