#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera las subpáginas de localidad a partir de index.html + data/localidades.json.

Criterio: reutilizar toda la estructura del home y reemplazar/insertar solo los
bloques que son propios de cada lugar, para que cada página tenga contenido
único real y no sea un duplicado con una frase cambiada.

Bloques únicos por página:
  1. head completo (title, description, canonical, og, Schema)
  2. hero (H1 + bajada)
  3. bloque de color local (H2 + dos párrafos)
  4. bloque operativo (3 puntos concretos de cómo se trabaja en esa zona)
  5. dos preguntas frecuentes propias del lugar
  6. enlaces a zonas cercanas (interlinking)
  7. breadcrumb visible + BreadcrumbList en Schema

Uso:  python3 build/generar.py
"""

import json, os, re, sys, html
from datetime import date

RAIZ   = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE   = os.path.join(RAIZ, 'templates', 'base.html')
DATOS  = os.path.join(RAIZ, 'data', 'localidades.json')
HOST   = 'https://www.cmdmudanzas.com'

TIPO_LABEL = {
    'provincia': 'Provincia',
    'gba':       'Gran Buenos Aires',
    'costa':     'Partido de la Costa',
    'barrio':    'Barrio de CABA',
}


def esc(s):
    return html.escape(s, quote=True)


def cargar():
    """Junta todos los data/*.json en un solo listado."""
    import glob as _g
    with open(BASE, encoding='utf-8') as f:
        base = f.read()
    locs = []
    for ruta in sorted(_g.glob(os.path.join(RAIZ, 'data', '*.json'))):
        with open(ruta, encoding='utf-8') as f:
            locs.extend(json.load(f)['localidades'])
    # slug duplicado = error de datos, mejor romper que publicar dos canonical iguales
    vistos = {}
    for l in locs:
        if l['slug'] in vistos:
            raise SystemExit(f"ERROR: slug duplicado -> {l['slug']}")
        vistos[l['slug']] = True
    return base, locs


# ---------------------------------------------------------------- head

def bloque_head(loc, url):
    nombre = loc['nombre']
    extra  = loc.get('tituloExtra')
    titulo = f"Mudanzas en {nombre}" + (f" ({extra})" if extra else "")
    titulo_full = f"{titulo} | CMD Mudanzas"
    desc = (f"Mudanzas en {nombre} con camiones de 20 a 50 m³, plataforma elevadora "
            f"de 1.200 kg y seguro incluido. Cotizá tu mudanza sin cargo.")
    return titulo_full, desc


def schema_localidad(loc, url, titulo, desc):
    """Service + areaServed real + BreadcrumbList + FAQ propia de la localidad."""
    nombre = loc['nombre']
    tipo = loc['tipo']
    area_tipo = 'State' if tipo == 'provincia' else 'City'

    faqs = [{
        "@type": "Question",
        "name": f["q"],
        "acceptedAnswer": {"@type": "Answer", "text": f["a"]}
    } for f in loc.get('faq', [])]

    grafo = [
        {
            "@type": "Service",
            "@id": f"{url}#servicio",
            "name": f"Mudanzas en {nombre}",
            "description": desc,
            "serviceType": "Servicio de mudanzas",
            "provider": {"@id": f"{HOST}/#empresa"},
            "areaServed": {"@type": area_tipo, "name": nombre, "containedInPlace": {
                "@type": "Country", "name": "Argentina"}},
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": f"Servicios de mudanza en {nombre}",
                "itemListElement": [
                    {"@type": "Offer", "itemOffered": {"@type": "Service", "name": n}}
                    for n in ["Mudanzas particulares", "Mudanzas empresariales",
                              "Mudanzas compartidas", "Camión con plataforma elevadora",
                              "Embalaje y desembalaje"]
                ]
            }
        },
        {
            "@type": "BreadcrumbList",
            "@id": f"{url}#breadcrumb",
            "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": "Inicio", "item": f"{HOST}/"},
                {"@type": "ListItem", "position": 2, "name": "Cobertura", "item": f"{HOST}/#cobertura"},
                {"@type": "ListItem", "position": 3, "name": f"Mudanzas en {nombre}", "item": url},
            ]
        },
        {
            "@type": "WebPage",
            "@id": url,
            "url": url,
            "name": titulo,
            "description": desc,
            "isPartOf": {"@id": f"{HOST}/#sitio"},
            "about": {"@id": f"{url}#servicio"},
            "breadcrumb": {"@id": f"{url}#breadcrumb"},
            "inLanguage": "es-AR"
        },
    ]
    if faqs:
        grafo.append({"@type": "FAQPage", "@id": f"{url}#faq", "mainEntity": faqs})

    return json.dumps({"@context": "https://schema.org", "@graph": grafo},
                      ensure_ascii=False, indent=2)


# ---------------------------------------------------------------- bloques visibles

def bloque_local(loc, indice):
    """Color local + puntos operativos. Va inmediatamente después del hero."""
    nombre = esc(loc['nombre'])
    tipo_lbl = TIPO_LABEL.get(loc['tipo'], 'Cobertura')
    pts = '\n'.join(
        f'          <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" '
        f'stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="m5 13 4 4L19 7"/></svg>'
        f'<span>{esc(p)}</span></li>'
        for p in loc.get('operativo', []))

    vecinos = ''.join(
        f'<a href="/mudanzas-{v}">{esc(indice[v]["nombre"])}</a>'
        for v in loc.get('cerca', []) if v in indice)

    return f'''
<!-- ============ BLOQUE LOCAL: {nombre} ============ -->
<section class="section section--tight local" id="zona">
  <div class="wrap">
    <nav class="crumb" aria-label="Ruta de navegación">
      <a href="/">Inicio</a>
      <span aria-hidden="true">/</span>
      <a href="/#cobertura">Cobertura</a>
      <span aria-hidden="true">/</span>
      <span aria-current="page">{nombre}</span>
    </nav>

    <div class="local__in">
      <div class="rv">
        <span class="eyebrow">{tipo_lbl}</span>
        <h2>Mudanzas en {nombre}</h2>
        <p class="lede">{esc(loc['intro'])}</p>
        <p class="measure" style="margin-top:var(--s-4);color:var(--ink-500)">{esc(loc['detalle'])}</p>
      </div>

      <div class="local__ops rv rv-2">
        <h3>Cómo lo resolvemos acá</h3>
        <ul class="ticks">
{pts}
        </ul>
        <a class="btn btn--wa" href="https://wa.me/5491127142006?text={loc['_wa']}" target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-1.7-.9-2.9-1.6-4-3.6-.3-.5.3-.5.9-1.6.1-.2 0-.4 0-.5 0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 1.9.8 2.7.9 3.6.8.6-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2Z"/></svg>
          Consultar por {nombre}
        </a>
      </div>
    </div>

    {f'<div class="cerca rv rv-3"><span>Zonas cercanas</span><div class="cerca__links">{vecinos}</div></div>' if vecinos else ''}
  </div>
</section>
'''


def faq_local(loc):
    """Dos preguntas propias del lugar, para insertar arriba del FAQ general."""
    items = []
    for f in loc.get('faq', []):
        items.append(f'''      <details>
        <summary>{esc(f['q'])} <span class="faq__x"></span></summary>
        <div class="faq__a"><p>{esc(f['a'])}</p></div>
      </details>''')
    return '\n'.join(items)


# ---------------------------------------------------------------- índices

GRUPOS = [
    ('provincia', 'Mudanzas por provincia'),
    ('gba',       'Mudanzas en el Gran Buenos Aires'),
    ('costa',     'Mudanzas en el Partido de la Costa'),
    ('barrio',    'Mudanzas por barrio de CABA'),
]

ICONO_PIN = ('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" '
             'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
             '<path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"/>'
             '<circle cx="12" cy="10" r="2.6"/></svg>')
ICONO_CHEV = ('<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
              'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'
              '<path d="m6 9 6 6 6-6"/></svg>')


def _enlace(l, actual):
    """La localidad actual no se enlaza a sí misma: se muestra como texto."""
    txt = 'Mudanzas en ' + esc(l['nombre'])
    if l['slug'] == actual:
        return '<span aria-current="page">' + txt + '</span>'
    return '<a href="/mudanzas-' + l['slug'] + '">' + txt + '</a>'


def indice_footer(locs, actual=None):
    """Acordeones por grupo. Se emite como HTML para que sea rastreable."""
    out = ['    <div class="seo-fold">']
    for tipo, titulo in GRUPOS:
        items = [l for l in locs if l['tipo'] == tipo]
        if not items:
            continue
        enlaces = ''.join(_enlace(l, actual) for l in items)
        out.append('      <details>')
        out.append('        <summary>' + ICONO_PIN + titulo +
                   '<span class="cnt">' + str(len(items)) + '</span>' + ICONO_CHEV + '</summary>')
        out.append('        <div class="prov-grid">' + enlaces + '</div>')
        out.append('      </details>')
    out.append('    </div>')
    return '\n'.join(out)


def indice_cobertura(locs, actual=None):
    """Grid de la sección Cobertura: solo provincias, para no saturar."""
    items = [l for l in locs if l['tipo'] == 'provincia']
    return '<div class="prov-grid">' + ''.join(_enlace(l, actual) for l in items) + '</div>'


# ---------------------------------------------------------------- armado

def generar(base, loc, indice, todas):
    nombre = loc['nombre']
    slug = loc['slug']
    url = f"{HOST}/mudanzas-{slug}"
    loc['_wa'] = re.sub(r'\s+', '%20', f"Hola, quiero cotizar una mudanza en {nombre}.")

    titulo, desc = bloque_head(loc, url)
    s = base

    # --- head ---
    s = re.sub(r'<title>.*?</title>', f'<title>{esc(titulo)}</title>', s, count=1, flags=re.S)
    s = re.sub(r'<meta name="description" content=".*?">',
               f'<meta name="description" content="{esc(desc)}">', s, count=1, flags=re.S)
    s = s.replace('<link rel="canonical" href="https://www.cmdmudanzas.com/">',
                  f'<link rel="canonical" href="{url}">', 1)
    s = s.replace('<meta property="og:url" content="https://www.cmdmudanzas.com/">',
                  f'<meta property="og:url" content="{url}">', 1)
    s = re.sub(r'<meta property="og:title" content=".*?">',
               f'<meta property="og:title" content="{esc(titulo)}">', s, count=1, flags=re.S)
    s = re.sub(r'<meta property="og:description" content=".*?">',
               f'<meta property="og:description" content="{esc(desc)}">', s, count=1, flags=re.S)
    s = re.sub(r'<meta name="twitter:card" content="summary_large_image">',
               '<meta name="twitter:card" content="summary_large_image">\n'
               f'<meta name="geo.region" content="AR">\n'
               f'<meta name="geo.placename" content="{esc(nombre)}">', s, count=1)

    # --- Schema: reemplaza los dos bloques del home por el grafo de la localidad ---
    bloques = list(re.finditer(r'<script type="application/ld\+json">.*?</script>', s, flags=re.S))
    if len(bloques) >= 2:
        nuevo = ('<script type="application/ld+json">\n'
                 + schema_localidad(loc, url, titulo, desc) + '\n</script>')
        s = s[:bloques[0].start()] + nuevo + s[bloques[-1].end():]

    # --- hero ---
    h1_nuevo = (f'      <h1>\n        Mudanzas en <em>{esc(nombre)}</em>.\n      </h1>')
    s = re.sub(r'      <h1>.*?</h1>', h1_nuevo, s, count=1, flags=re.S)
    lede_nuevo = (f'<p class="lede">Camiones propios de 20 a 50 m³, plataforma elevadora de '
                  f'1.200 kg y seguro incluido. Cotizamos tu mudanza en {esc(nombre)} sin cargo '
                  f'y sin compromiso.</p>')
    s = re.sub(r'<p class="lede">Somos una empresa de mudanzas.*?</p>', lede_nuevo, s,
               count=1, flags=re.S)

    # --- bloque local, justo después del hero ---
    marca = '<!-- ============ MARQUEE ============ -->'
    s = s.replace(marca, bloque_local(loc, indice) + '\n' + marca, 1)

    # --- FAQ propia de la localidad, arriba del FAQ general ---
    fq = faq_local(loc)
    if fq:
        ancla = '    <div class="faq rv rv-1">\n'
        s = s.replace(ancla, ancla + fq + '\n', 1)

    # --- título de la sección de preguntas ---
    s = s.replace('<h2>Lo que más nos preguntan.</h2>',
                  f'<h2>Preguntas sobre mudanzas en {esc(nombre)}.</h2>', 1)

    # --- índices de localidades ---
    s = s.replace('<!--#LOCALIDADES#-->', indice_footer(todas, loc['slug']))
    s = s.replace('<!--#COBERTURA#-->',  indice_cobertura(todas, loc['slug']))

    return s


def main():
    base, locs = cargar()
    indice = {l['slug']: l for l in locs}
    salida = []

    # home, desde la misma plantilla
    home = base.replace('<!--#LOCALIDADES#-->', indice_footer(locs))
    home = home.replace('<!--#COBERTURA#-->',  indice_cobertura(locs))
    with open(os.path.join(RAIZ, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(home)

    for loc in locs:
        pagina = generar(base, loc, indice, locs)
        destino = os.path.join(RAIZ, f"mudanzas-{loc['slug']}.html")
        with open(destino, 'w', encoding='utf-8') as f:
            f.write(pagina)
        salida.append((loc['slug'], loc['nombre'], len(pagina)))

    # ---- sitemap ----
    hoy = date.today().isoformat()
    urls = [f'''  <url>
    <loc>{HOST}/</loc>
    <lastmod>{hoy}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>''']
    for slug, _n, _b in salida:
        urls.append(f'''  <url>
    <loc>{HOST}/mudanzas-{slug}</loc>
    <lastmod>{hoy}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>''')
    with open(os.path.join(RAIZ, 'sitemap.xml'), 'w', encoding='utf-8') as f:
        f.write('<?xml version="1.0" encoding="UTF-8"?>\n'
                '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
                + '\n'.join(urls) + '\n</urlset>\n')

    print(f"{len(salida)} páginas generadas")
    print(f"sitemap.xml con {len(salida)+1} URLs")
    prom = sum(b for _s, _n, b in salida) / max(len(salida), 1)
    print(f"peso promedio: {prom/1024:.0f} KB")


if __name__ == '__main__':
    main()
