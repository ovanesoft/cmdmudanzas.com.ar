#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Genera el CSV de importación para Google Ads Editor.

Un grupo de anuncios por localidad, tomando las localidades de data/*.json
para que campaña y sitio no se desincronicen: si mañana se agrega una
localidad al sitio, entra sola en la campaña al regenerar.

Valida antes de escribir. Si un título pasa de 30 caracteres o una descripción
de 90, Editor falla en la importación sin explicar bien por qué. Mejor romper acá.

Uso:  python3 build/campana.py
"""

import json, os, csv, sys, glob, unicodedata, collections

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG = os.path.join(RAIZ, 'ads', 'config.json')
HOST = 'https://www.cmdmudanzas.com'

MAX_TITULO, MAX_DESC = 30, 90

COLS = ['Campaign', 'Campaign Type', 'Campaign Daily Budget', 'Bid Strategy Type',
        'Networks', 'Languages', 'Location', 'Campaign Status',
        'Ad Group', 'Max CPC', 'Ad Group Status',
        'Keyword', 'Criterion Type', 'Keyword Status',
        'Ad Type', 'Final URL', 'Path 1', 'Path 2'] \
       + [f'Headline {i}' for i in range(1, 16)] \
       + [f'Description {i}' for i in range(1, 5)] + ['Ad Status']

COLS_ES = ['Campaña', 'Tipo de campaña', 'Presupuesto diario de la campaña',
           'Tipo de estrategia de puja', 'Redes', 'Idiomas', 'Ubicación',
           'Estado de la campaña', 'Grupo de anuncios', 'CPC máx.',
           'Estado del grupo de anuncios', 'Palabra clave',
           'Tipo de concordancia', 'Estado de la palabra clave',
           'Tipo de anuncio', 'URL final', 'Ruta 1', 'Ruta 2'] \
          + [f'Título {i}' for i in range(1, 16)] \
          + [f'Descripción {i}' for i in range(1, 5)] + ['Estado del anuncio']


def L(s):
    return len(unicodedata.normalize('NFC', s))


def sin_tildes(s):
    """La gente escribe sin tildes. Google las normaliza igual, pero la
    palabra clave sin tilde es la forma en que realmente se tipea."""
    n = unicodedata.normalize('NFD', s)
    return ''.join(c for c in n if unicodedata.category(c) != 'Mn').lower()


def cargar_localidades():
    locs = []
    for r in sorted(glob.glob(os.path.join(RAIZ, 'data', '*.json'))):
        with open(r, encoding='utf-8') as f:
            locs.extend(json.load(f)['localidades'])
    return locs


def keywords_localidad(nombre, tipo, largo_distancia=True, extra=None):
    """largo_distancia=False para Buenos Aires y CABA: no tiene sentido
    'mudanza de buenos aires a buenos aires', y esas claves además chocan
    con la campaña Interior."""
    n = sin_tildes(nombre)
    kws = [f'mudanzas {n}', f'mudanzas en {n}', f'empresa de mudanzas {n}',
           f'presupuesto mudanza {n}']
    if tipo == 'provincia' and largo_distancia:
        # la búsqueda de larga distancia sale del origen, no del destino
        kws += [f'mudanzas a {n}', f'mudanza de buenos aires a {n}']
    # Nada de "fletes {localidad}": CMD hace mudanzas, no fletes. El flete es
    # otro servicio, más chico y más barato, y esos clics no convierten.
    return kws + list(extra or [])


# Cómo busca la gente en realidad: sinónimos de alto volumen que la
# plantilla por nombre no genera sola.
SINONIMOS = {
    'caba': ['mudanzas capital federal', 'mudanzas en capital federal',
             'mudanzas ciudad de buenos aires', 'empresa de mudanzas capital federal',
             'mudanzas capital'],
    'buenos-aires': ['mudanzas gran buenos aires', 'mudanzas gba',
                     'mudanzas zona norte', 'mudanzas zona oeste', 'mudanzas zona sur',
                     'empresa de mudanzas gba'],
    'santa-fe': ['mudanzas rosario', 'mudanzas en rosario', 'empresa de mudanzas rosario'],
    'rio-negro': ['mudanzas bariloche', 'mudanzas en bariloche'],
    'tucuman': ['mudanzas san miguel de tucuman'],
    'chaco': ['mudanzas resistencia'],
    'misiones': ['mudanzas posadas', 'mudanzas iguazu'],
    'tierra-del-fuego': ['mudanzas ushuaia', 'mudanzas rio grande'],
    'chubut': ['mudanzas comodoro rivadavia', 'mudanzas puerto madryn', 'mudanzas trelew'],
    'santa-cruz': ['mudanzas rio gallegos', 'mudanzas el calafate'],
    'neuquen': ['mudanzas san martin de los andes', 'mudanzas anelo'],
}


def titulos(nombre, tipo, base, propios, err, ctx):
    if propios:
        out = list(propios)
    else:
        out = []
        for t in (f'Mudanzas en {nombre}', f'Mudanzas {nombre}',
                  f'Empresa de Mudanzas {nombre}'):
            if L(t) <= MAX_TITULO:
                out.append(t)
        if not out:                       # nombre muy largo: usar genéricos
            out = ['Mudanzas en Todo el País']
    out += [t for t in base if t not in out]
    out = out[:15]
    for t in out:
        if L(t) > MAX_TITULO:
            err.append(f'{ctx}: título de {L(t)} car. → "{t}"')
    if len(out) < 3:
        err.append(f'{ctx}: solo {len(out)} títulos (mínimo 3)')
    return out + [''] * (15 - len(out))


def descripciones(nombre, base, propia, err, ctx):
    out = []
    if propia and L(propia) <= MAX_DESC:
        out.append(propia)
    else:
        d = f'Mudanzas en {nombre} con camiones propios, plataforma elevadora y seguro.'
        if L(d) <= MAX_DESC:
            out.append(d)
    out += [x for x in base if x not in out]
    out = out[:4]
    for x in out:
        if L(x) > MAX_DESC:
            err.append(f'{ctx}: descripción de {L(x)} car. → "{x}"')
    if len(out) < 2:
        err.append(f'{ctx}: menos de 2 descripciones')
    return out + [''] * (4 - len(out))


def main():
    cfg = json.load(open(CFG, encoding='utf-8'))
    locs = cargar_localidades()
    por_slug = {l['slug']: l for l in locs}
    err, filas = [], []
    negativas_por_campana = {}
    stats = collections.OrderedDict()

    def fila(**kw):
        f = {c: '' for c in COLS}
        f.update(kw)
        filas.append(f)

    for clave, camp in cfg['campanas'].items():
        cn = camp['nombre']
        stats[cn] = {'grupos': 0, 'kw': 0, 'presu': camp['presupuesto']}

        fila(**{'Campaign': cn, 'Campaign Type': 'Search',
                'Campaign Daily Budget': camp['presupuesto'],
                'Bid Strategy Type': 'Maximize clicks',
                'Networks': 'Google Search',
                'Languages': 'es',
                'Location': '; '.join(camp['ubicaciones']),
                'Campaign Status': cfg['estado_inicial']})

        # --- negativas ---
        negs = list(cfg['negativas'])

        # Negativas cruzadas: sin esto, "mudanza de buenos aires a córdoba"
        # puede caer en Provincia por la clave de frase "mudanzas buenos aires",
        # y el usuario aterriza en la página genérica en vez de la de Córdoba.
        if clave in ('caba', 'provincia'):
            negs += [sin_tildes(l['nombre']) for l in locs
                     if l['tipo'] == 'provincia'
                     and l['slug'] not in ('caba', 'buenos-aires')]
        negativas_por_campana[cn] = negs

        # Van en el CSV, en la misma columna "Keyword" que las positivas.
        # "Campaign negative" es el valor exacto que documenta Editor para el
        # nivel de campaña; el intento anterior usaba "Campaign Negative Phrase",
        # que no existe y hacía fallar la importación entera.
        #
        # La concordancia NO se declara en una columna: se indica con puntuación
        # en el propio texto — sin nada = amplia, "comillas" = frase,
        # [corchetes] = exacta. Las queremos amplias, así que van en crudo.
        # Amplia es la que más bloquea: la negativa amplia "flete barato" frena
        # cualquier búsqueda que traiga ambas palabras, en cualquier orden.
        for n in negs:
            fila(**{'Campaign': cn, 'Keyword': n,
                    'Criterion Type': 'Campaign negative'})

        # --- grupos geográficos ---
        excl = set(camp.get('excluir_slugs', []))
        items = [l for l in locs if l['tipo'] in camp['tipos'] and l['slug'] not in excl]
        gen = camp.get('general')
        if gen and gen['slug'] in por_slug:
            items = [por_slug[gen['slug']]] + [i for i in items if i['slug'] != gen['slug']]

        for l in items:
            nombre, slug, tipo = l['nombre'], l['slug'], l['tipo']
            gn = f'{nombre}'
            url = f'{HOST}/mudanzas-{slug}'
            ctx = f'{cn} / {gn}'

            fila(**{'Campaign': cn, 'Ad Group': gn,
                    'Max CPC': cfg['cpc_max'], 'Ad Group Status': 'Enabled'})

            # Buenos Aires y CABA no llevan claves de larga distancia: chocarían
            # con la campaña Interior por la propia palabra "buenos aires".
            ld = slug not in ('buenos-aires', 'caba')
            for kw in keywords_localidad(nombre, tipo, ld, SINONIMOS.get(slug)):
                for t in ('Phrase', 'Exact'):
                    fila(**{'Campaign': cn, 'Ad Group': gn, 'Keyword': kw,
                            'Criterion Type': t, 'Keyword Status': 'Enabled'})
                    stats[cn]['kw'] += 1

            tt = titulos(nombre, tipo, cfg['titulos_base'], None, err, ctx)
            dd = descripciones(nombre, cfg['descripciones_base'], None, err, ctx)
            f = {'Campaign': cn, 'Ad Group': gn, 'Ad Type': 'Responsive search ad',
                 'Final URL': url, 'Path 1': 'mudanzas', 'Ad Status': 'Enabled'}
            f.update({f'Headline {i}': t for i, t in enumerate(tt, 1)})
            f.update({f'Description {i}': d for i, d in enumerate(dd, 1)})
            fila(**f)
            stats[cn]['grupos'] += 1

        # --- grupos de servicio ---
        for g in [x for x in cfg['grupos_servicio'] if x['campana'] == clave]:
            gn, url = g['nombre'], HOST + g['url']
            ctx = f'{cn} / {gn}'
            fila(**{'Campaign': cn, 'Ad Group': gn,
                    'Max CPC': cfg['cpc_max'], 'Ad Group Status': 'Enabled'})
            for kw in g['kw']:
                for t in ('Phrase', 'Exact'):
                    fila(**{'Campaign': cn, 'Ad Group': gn, 'Keyword': kw,
                            'Criterion Type': t, 'Keyword Status': 'Enabled'})
                    stats[cn]['kw'] += 1
            tt = titulos('', '', cfg['titulos_base'], g['titulos'], err, ctx)
            dd = descripciones('', cfg['descripciones_base'], g['desc'], err, ctx)
            f = {'Campaign': cn, 'Ad Group': gn, 'Ad Type': 'Responsive search ad',
                 'Final URL': url, 'Path 1': 'mudanzas', 'Ad Status': 'Enabled'}
            f.update({f'Headline {i}': t for i, t in enumerate(tt, 1)})
            f.update({f'Description {i}': d for i, d in enumerate(dd, 1)})
            fila(**f)
            stats[cn]['grupos'] += 1

    # Una negativa en concordancia amplia bloquea cualquier búsqueda que
    # contenga TODAS sus palabras, en cualquier orden. Así que si las palabras
    # de una negativa están todas dentro de una clave positiva de la misma
    # campaña, esa clave queda muerta y Editor no lo avisa: importa las dos y
    # el grupo simplemente nunca muestra.
    # Fue el caso de la negativa "deposito" contra "mudanza de deposito
    # industrial", que es un servicio que CMD sí presta.
    for cn, negs in negativas_por_campana.items():
        positivas = {f['Keyword'] for f in filas
                     if f['Campaign'] == cn and f['Criterion Type'] in ('Phrase', 'Exact')}
        for n in negs:
            pn = set(n.split())
            for p in positivas:
                if pn <= set(p.split()):
                    err.append(f'{cn}: la negativa "{n}" anula la clave "{p}"')

    if err:
        print('\nERRORES DE VALIDACIÓN — no se generó el CSV:\n')
        for e in err[:40]:
            print('  ✗ ' + e)
        sys.exit(1)

    for ruta, cols in ((os.path.join(RAIZ, 'ads', 'cmd-campana.csv'), COLS),
                       (os.path.join(RAIZ, 'ads', 'cmd-campana-es.csv'), COLS_ES)):
        with open(ruta, 'w', encoding='utf-8-sig', newline='') as fh:
            w = csv.writer(fh)
            w.writerow(cols)
            for f in filas:
                w.writerow([f[c] for c in COLS])

    # --- negativas, en archivos aparte para pegar en la interfaz ---
    for cn, negs in negativas_por_campana.items():
        nombre = cn.replace('CMD | ', '').replace(' ', '-').lower()
        ruta = os.path.join(RAIZ, 'ads', f'negativas-{nombre}.txt')
        with open(ruta, 'w', encoding='utf-8') as fh:
            fh.write('\n'.join(negs) + '\n')

    print('CSV generado — validación OK\n')
    print(f'{"Campaña":34s} {"Grupos":>7s} {"Palabras clave":>15s} {"Presup./día":>12s}')
    for cn, s in stats.items():
        print(f'{cn:34s} {s["grupos"]:7d} {s["kw"]:15d} {s["presu"]:12,d}')
    tg = sum(s['grupos'] for s in stats.values())
    tk = sum(s['kw'] for s in stats.values())
    tp = sum(s['presu'] for s in stats.values())
    print(f'{"TOTAL":34s} {tg:7d} {tk:15d} {tp:12,d}')
    print(f'\nfilas: {len(filas)}   negativas por campaña: {len(cfg["negativas"])}')


if __name__ == '__main__':
    main()
