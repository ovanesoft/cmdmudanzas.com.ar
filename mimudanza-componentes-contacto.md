# mimudanza.com.ar — Componentes de contacto (banner WhatsApp, FAB abanico, modales, formulario)

> Fuente: https://www.mimudanza.com.ar/ — relevado el 2026-08-06
> Estado: **solo recopilación**. NO replicar hasta que Pablo lo indique.
> Referencia visual verificada por screenshot con el FAB abierto y el banner visible.

---

## 0. Stack y dependencias del sitio original

```
Fuentes:      Google Fonts — Poppins 300;400;500;600;700
Iconos:       Font Awesome 6.4.0 (CDN cdnjs) — usa fab/fas
CSS:          css/styles.css (89 KB) · css/chatbot.css · css/google-reviews.css
JS:           js/main.js · js/analytics.js · js/google-reviews.js · js/chatbot.js
              + widget externo https://truckdate.com/widget.js
Tracking:     GTM-5BSR3MXH · gtag AW-16992803900 (Google Ads)
Sin framework. HTML estático plano, un archivo por página.
```

**Variables CSS globales (`:root` de styles.css)**

```css
:root {
    --primary-color: #2C3E50;
    --secondary-color: #1A252F;
    --dark-color: #2C3E50;
    --light-color: #ECF0F1;
    --white: #FFFFFF;
    --gray: #7F8C8D;
    --gray-light: #BDC3C7;
    --success: #27AE60;
    --danger: #E74C3C;

    --logo-glow-primary: 44, 62, 80;
    --logo-glow-secondary: 26, 37, 47;
    --hero-bg-primary: 44, 62, 80;
    --hero-bg-secondary: 26, 37, 47;

    --font-primary: 'Poppins', sans-serif;
    --font-size-base: 17px;

    --spacing-xs: 0.5rem;  --spacing-sm: 1rem;  --spacing-md: 2rem;
    --spacing-lg: 3rem;    --spacing-xl: 4rem;

    --radius-sm: 8px;  --radius-md: 12px;  --radius-lg: 20px;

    --shadow-sm: 0 2px 8px rgba(0,0,0,0.1);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.1);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.15);

    --transition: all 0.3s ease;
}
```

**Datos de contacto usados en todos los componentes**

| Canal | Valor |
|---|---|
| WhatsApp | `https://wa.me/5491138961652` |
| Texto WA por defecto | `Hola, los contacto desde la web. Quiero hacer una consulta.` |
| Teléfono | `tel:+541138961652` → mostrado como `011 3896-1652` |
| Email | `info@mimudanza.com.ar` |
| Instagram | `https://www.instagram.com/mimudanzaok/` |
| Dirección | Parral 61, Piso 3, Of. 8, CABA |
| Horario | Lun a Vie 8:00 – 20:00 |
| CV / RRHH | `mimudanza@gestiongeneral.com` |

**Inventario de `@keyframes` del sitio**
`fadeInDown` · `logoGlow` · `vipPulse` · `vipShine` · `pulse` · `wa-pulse` · `wa-flash-zoom` · `wa-flash-glow` · `fab-ring` · `fab-ig-pulse` · `pulsePromo` · `heartbeat`

---

## ⚠️ Hallazgo importante

**El FAB abanico, el banner de WhatsApp y los modales de Instagram existen ÚNICAMENTE en `index.html`.**
Las 113 páginas de localidad, `empresas.html` y `ofertas.html` **no los tienen** (solo el chatbot, y `ofertas.html` ni eso).

Verificado por fetch en: `index.html`(✓ todos) · `mudanzas-cordoba.html`, `mudanzas-palermo.html`, `mudanzas-la-plata.html`, `mudanzas-villa-urquiza.html`, `empresas.html` (✗ ninguno) · `ofertas.html` (✗ ninguno, ni chatbot).

→ Al replicar, esto se debe corregir: los componentes tienen que ir en **todas** las páginas (idealmente como partial/include, no copiado a mano).

---

# 1. Banner WhatsApp inferior (`#wa-banner`)

Barra verde fija al pie de la pantalla, ancho completo. Aparece deslizándose desde abajo a los 8 s y **se queda para siempre** (no hay botón de cerrar). Cada 15 s hace un "destello" (zoom + brillo + saturación). El ícono late en loop permanente.

### 1.1 HTML

```html
<div id="wa-banner" class="wa-banner">
    <a href="https://wa.me/5491138961652?text=Hola%2C%20los%20contacto%20desde%20la%20web.%20Quiero%20hacer%20una%20consulta."
       target="_blank" rel="noopener" class="wa-banner-link" id="wa-banner-cta">
        <div class="wa-banner-text">
            <span class="wa-banner-title">¿Tenés dudas? Preguntá sin compromiso</span>
            <span class="wa-banner-sub">Te respondemos en minutos por WhatsApp</span>
        </div>
        <div class="wa-banner-icon">
            <i class="fab fa-whatsapp"></i>
        </div>
    </a>
</div>
```

> La clase `show` la agrega el JS a los 8 s. La clase `wa-flash` se agrega/quita cada 15 s.

### 1.2 CSS completo

```css
.wa-banner {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1050;
    transform: translateY(100%);
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
}

.wa-banner.show {
    transform: translateY(0);
    pointer-events: auto;
}

.wa-banner-link {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
    color: white;
    text-decoration: none;
    padding: 1rem 2rem;
    min-height: 64px;
    cursor: pointer;
    transition: filter 0.2s;
}

.wa-banner-link:hover { filter: brightness(1.08); }

.wa-banner-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
}

.wa-banner-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.15rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}

.wa-banner-sub {
    font-size: 0.82rem;
    font-weight: 400;
    opacity: 0.92;
}

.wa-banner-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    font-size: 1.6rem;
    flex-shrink: 0;
    animation: wa-pulse 2s ease infinite;
}

@keyframes wa-pulse {
    0%, 100% { transform: scale(1);    box-shadow: 0 0 0 0 rgba(255,255,255,0.3); }
    50%      { transform: scale(1.08); box-shadow: 0 0 0 8px rgba(255,255,255,0); }
}

/* Destello periódico del banner */
.wa-banner.wa-flash .wa-banner-link {
    animation: wa-flash-zoom 4s ease-in-out, wa-flash-glow 4s ease-in-out;
}

@keyframes wa-flash-zoom {
    0%   { transform: scale(1);   filter: brightness(1) saturate(1); }
    35%  { transform: scale(1.2); filter: brightness(1.6) saturate(2.5) hue-rotate(-15deg); }
    100% { transform: scale(1);   filter: brightness(1) saturate(1) hue-rotate(0deg); }
}

@keyframes wa-flash-glow {
    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0),     inset 0 0 0 rgba(255,255,255,0); }
    35%  { box-shadow: 0 0 12px 3px rgba(37,211,102,0.2), inset 0 0 30px rgba(255,255,255,0.2); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0),     inset 0 0 0 rgba(255,255,255,0); }
}

@media (max-width: 768px) {
    .wa-banner-link  { padding: 0.85rem 1rem; gap: 0.75rem; }
    .wa-banner-title { font-size: 0.95rem; }
    .wa-banner-sub   { font-size: 0.75rem; }
    .wa-banner-icon  { width: 40px; height: 40px; font-size: 1.3rem; }
}
```

### 1.3 Comportamiento (JS)

- `BANNER_DELAY = 8000` → a los **8 s** agrega `.show` y también `.fab-above-banner` al FAB.
- `setInterval` cada **15 s**: si el banner tiene `.show`, agrega `.wa-flash` y la quita a los **4200 ms**.
- Al hacer clic dispara tracking `wa_banner_click` + `gtag_report_conversion()`.
- Impresión trackeada como `wa_banner_impression`.

---

# 2. FAB de contacto "abanico" (`#fab-contact`)

Botón circular naranja fijo abajo a la derecha. Al abrirse, 4 botones salen en arco hacia arriba-izquierda, **escalonados**, con etiqueta de texto a la izquierda de cada uno. El botón principal rota 90° y cambia a violeta con ícono de X.

**Orden visual real (de más cerca del FAB a más lejos):**
`Llamar` → `Asistente IA` → `Instagram` → `WhatsApp` (el más lejano y el más grande, 62 px vs 52 px).

> ⚠️ El comentario en el CSS original dice "1=Instagram, 2=WhatsApp" — está **desactualizado**. El HTML real tiene el orden WA(1), IG(2), IA(3), Call(4), y como los `nth-child` mayores están más cerca del FAB, WhatsApp queda en el extremo del arco. Confirmado visualmente.

### 2.1 HTML

```html
<div id="fab-contact" class="fab-contact">
    <div class="fab-options" id="fab-options">
        <a href="https://wa.me/5491138961652?text=Hola%2C%20los%20contacto%20desde%20la%20web.%20Quiero%20hacer%20una%20consulta."
           target="_blank" rel="noopener" class="fab-option fab-whatsapp" id="fab-wa" data-label="WhatsApp">
            <i class="fab fa-whatsapp"></i>
        </a>
        <a href="https://www.instagram.com/mimudanzaok/"
           target="_blank" rel="noopener" class="fab-option fab-instagram" id="fab-ig" data-label="Instagram">
            <i class="fab fa-instagram"></i>
        </a>
        <button class="fab-option fab-ai" id="fab-ai" data-label="Asistente IA">
            <i class="fas fa-robot"></i>
        </button>
        <a href="tel:+541138961652" class="fab-option fab-call" id="fab-call" data-label="Llamar">
            <i class="fas fa-phone-alt"></i>
        </a>
    </div>
    <button class="fab-main" id="fab-main" aria-label="Contacto">
        <i class="fas fa-headset fab-icon-open"></i>
        <i class="fas fa-times fab-icon-close"></i>
    </button>
</div>
```

### 2.2 CSS completo

```css
.fab-contact {
    position: fixed;
    bottom: 2rem;
    right: 1rem;
    z-index: 1100;
    width: 64px;
    height: 64px;
}

/* --- Botón principal --- */
.fab-main {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: none;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 50%, #FFD23F 100%);
    color: #fff;
    font-size: 1.7rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 3;
    transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s;
    animation: fab-ring 2.5s ease-in-out infinite;
}

@keyframes fab-ring {
    0%, 100% { box-shadow: 0 0 0 0    rgba(255,107,53,0.45), 0 4px 18px rgba(255,107,53,0.35); }
    50%      { box-shadow: 0 0 0 10px rgba(255,107,53,0),    0 4px 22px rgba(255,107,53,0.5); }
}

.fab-main:hover { transform: scale(1.1); }

.fab-main .fab-icon-close { display: none; }
.fab-contact.open .fab-main .fab-icon-open  { display: none; }
.fab-contact.open .fab-main .fab-icon-close { display: inline; }

.fab-contact.open .fab-main {
    background: linear-gradient(135deg, #E040FB, #7C4DFF);
    animation: none;
    box-shadow: 0 4px 20px rgba(224,64,251,0.45);
    transform: rotate(90deg);
}

/* --- Contenedor de opciones (ancla en el centro del botón principal) --- */
.fab-options {
    position: absolute;
    bottom: 32px;
    right: 32px;
    width: 0;
    height: 0;
    pointer-events: none;
    z-index: 2;
}

.fab-contact.open .fab-options { pointer-events: auto; }

/* --- Opciones individuales --- */
.fab-option {
    position: absolute;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.9);
    color: #fff;
    font-size: 1.3rem;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    text-decoration: none;
    opacity: 0;
    transform: scale(0) translate(0, 0);
    transition: opacity 0.6s ease,
                transform 0.7s cubic-bezier(0.4, 0, 0.2, 1),
                box-shadow 0.3s;
    left: -26px;
    top: -26px;
}

/* Etiqueta de texto a la izquierda de cada botón */
.fab-option::after {
    content: attr(data-label);
    position: absolute;
    right: calc(100% + 8px);
    top: 50%;
    transform: translateY(-50%);
    white-space: nowrap;
    background: rgba(0,0,0,0.85);
    color: #fff;
    font-size: 0.68rem;
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.25s 0.15s;
    letter-spacing: 0.02em;
}

.fab-contact.open .fab-option::after { opacity: 1; }

/* --- Colores vibrantes con glow --- */
.fab-whatsapp {
    background: linear-gradient(135deg, #25D366, #128C7E);
    box-shadow: 0 4px 16px rgba(37,211,102,0.5);
    /* WhatsApp es más grande que el resto */
    width: 62px;
    height: 62px;
    font-size: 1.55rem;
    left: -31px;
    top: -31px;
}
.fab-whatsapp:hover { box-shadow: 0 4px 24px rgba(37,211,102,0.7); filter: brightness(1.1); }

.fab-ai {
    background: linear-gradient(135deg, #E53935, #C62828);
    box-shadow: 0 4px 16px rgba(229,57,53,0.5);
}
.fab-ai:hover { box-shadow: 0 4px 24px rgba(229,57,53,0.7); filter: brightness(1.1); }

.fab-call {
    background: linear-gradient(135deg, #00B4D8, #0077B6);
    box-shadow: 0 4px 16px rgba(0,180,216,0.5);
}
.fab-call:hover { box-shadow: 0 4px 24px rgba(0,180,216,0.7); filter: brightness(1.1); }

.fab-instagram {
    background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    box-shadow: 0 4px 16px rgba(220,39,67,0.5);
}
.fab-instagram:hover { box-shadow: 0 4px 24px rgba(220,39,67,0.7); filter: brightness(1.1); }

/* Pulso de destaque (se usa al cerrar el modal de Instagram) */
.fab-option.fab-highlight {
    animation: fab-ig-pulse 1.5s ease-in-out;
    z-index: 10;
}

@keyframes fab-ig-pulse {
    0%   { transform: scale(1)   translate(var(--tx,0), var(--ty,0)); filter: brightness(1);
           box-shadow: 0 4px 16px rgba(220,39,67,0.5); }
    35%  { transform: scale(1.8) translate(var(--tx,0), var(--ty,0)); filter: brightness(1.4);
           box-shadow: 0 8px 40px rgba(220,39,67,0.8), 0 0 30px 10px rgba(240,148,51,0.5); }
    100% { transform: scale(1)   translate(var(--tx,0), var(--ty,0)); filter: brightness(1);
           box-shadow: 0 4px 16px rgba(220,39,67,0.5); }
}

/* --- Retracción escalonada: IG(1) primero → Call(4) último --- */
.fab-option:nth-child(1) { transition-delay: 0s; }
.fab-option:nth-child(2) { transition-delay: 0.12s; }
.fab-option:nth-child(3) { transition-delay: 0.24s; }
.fab-option:nth-child(4) { transition-delay: 0.36s; }

/* Al abrir cambia la curva a un "overshoot" elástico */
.fab-contact.open .fab-option {
    transition: opacity 0.45s,
                transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1),
                box-shadow 0.3s;
}

/* --- Despliegue del abanico: Call(4) primero → WA(1) último --- */
.fab-contact.open .fab-option:nth-child(4) {
    opacity: 1; transform: scale(1) translate(-14px, -84px);  transition-delay: 0.06s;
}
.fab-contact.open .fab-option:nth-child(3) {
    opacity: 1; transform: scale(1) translate(-48px, -140px); transition-delay: 0.15s;
}
.fab-contact.open .fab-option:nth-child(2) {
    opacity: 1; transform: scale(1) translate(-95px, -185px); transition-delay: 0.24s;
}
.fab-contact.open .fab-option:nth-child(1) {
    opacity: 1; transform: scale(1) translate(-160px, -240px); transition-delay: 0.33s;
}

/* Hover: escala sin perder la posición del arco (por eso los --tx/--ty) */
.fab-option:hover {
    transform: scale(1.15) translate(var(--tx, 0), var(--ty, 0)) !important;
}
.fab-contact.open .fab-option:nth-child(4) { --tx: -14px;  --ty: -84px; }
.fab-contact.open .fab-option:nth-child(3) { --tx: -48px;  --ty: -140px; }
.fab-contact.open .fab-option:nth-child(2) { --tx: -95px;  --ty: -185px; }
.fab-contact.open .fab-option:nth-child(1) { --tx: -160px; --ty: -240px; }

/* --- Mobile --- */
@media (max-width: 768px) {
    .fab-contact { bottom: 1.2rem; right: 0.6rem; width: 58px; height: 58px; }
    .fab-main    { width: 58px; height: 58px; font-size: 1.5rem; }
    .fab-options { bottom: 29px; right: 29px; }
    .fab-option  { width: 46px; height: 46px; font-size: 1.1rem; left: -23px; top: -23px; }
    .fab-whatsapp{ width: 52px; height: 52px; font-size: 1.25rem; left: -26px; top: -26px; }

    .fab-contact.open .fab-option:nth-child(4) { transform: scale(1) translate(-10px, -66px); }
    .fab-contact.open .fab-option:nth-child(3) { transform: scale(1) translate(-38px, -112px); }
    .fab-contact.open .fab-option:nth-child(2) { transform: scale(1) translate(-76px, -148px); }
    .fab-contact.open .fab-option:nth-child(1) { transform: scale(1) translate(-130px, -195px); }

    .fab-contact.open .fab-option:nth-child(4) { --tx: -10px;  --ty: -66px; }
    .fab-contact.open .fab-option:nth-child(3) { --tx: -38px;  --ty: -112px; }
    .fab-contact.open .fab-option:nth-child(2) { --tx: -76px;  --ty: -148px; }
    .fab-contact.open .fab-option:nth-child(1) { --tx: -130px; --ty: -195px; }
}

/* --- Offset cuando el banner de WA está visible --- */
.fab-contact.fab-above-banner { bottom: calc(2rem + 68px); }
@media (max-width: 768px) {
    .fab-contact.fab-above-banner { bottom: calc(1.2rem + 60px); }
}
```

### 2.3 Comportamiento (JS)

- **Auto-apertura:** a los **1,5 s** de cargar se abre solo y se cierra a los **3 s**. Luego se repite cada **25 s**.
- **Auto-cierre manual:** si el usuario lo abre con clic, se cierra solo a los **5 s**.
- **Clic fuera:** cierra el abanico.
- **`fab-ai`** no navega: cierra el abanico y dispara `document.getElementById('chatbot-toggle').click()`.
- Cada opción trackea evento (`fab_whatsapp`, `fab_instagram`, `fab_ai`, `fab_call`); WhatsApp además dispara `gtag_report_conversion()`.

---

# 3. Script inline unificado (FAB + banner + modales IG)

Va al final del `<body>` de `index.html`, tal cual:

```html
<script>
(function(){
    var fab = document.getElementById('fab-contact');
    var fabMain = document.getElementById('fab-main');
    var fabIg = document.getElementById('fab-ig');
    var fabWa = document.getElementById('fab-wa');
    var fabAi = document.getElementById('fab-ai');
    var fabCall = document.getElementById('fab-call');
    var banner = document.getElementById('wa-banner');
    var bannerCta = document.getElementById('wa-banner-cta');
    var chatToggle = document.getElementById('chatbot-toggle');
    var igModal = document.getElementById('ig-modal');
    var igClose = document.getElementById('ig-modal-close');
    var igBtn = document.getElementById('ig-modal-btn');
    var igModal2 = document.getElementById('ig-modal-2');
    var igClose2 = document.getElementById('ig-modal-2-close');
    var igBtn2 = document.getElementById('ig-modal-2-btn');
    var autoCloseTimer;
    var isOpen = false;

    function t(type, el, text){ if(typeof window.__mm_track==='function') window.__mm_track(type, el, text); }

    function toggleFab(){
        isOpen = !isOpen;
        fab.classList.toggle('open', isOpen);
        clearTimeout(autoCloseTimer);
        if(isOpen){
            t('engagement','fab_open','fab');
            autoCloseTimer = setTimeout(function(){ closeFab(); }, 5000);
        }
    }
    function closeFab(){
        isOpen = false;
        fab.classList.remove('open');
        clearTimeout(autoCloseTimer);
    }

    fabMain.addEventListener('click', toggleFab);

    document.addEventListener('click', function(e){
        if(isOpen && !fab.contains(e.target)) closeFab();
    });

    /* Auto-despliegue al cargar y cada 25s */
    var autoOpen = false;
    function autoShowFab(){
        if(!isOpen && !autoOpen){
            autoOpen = true;
            fab.classList.add('open');
            isOpen = true;
            setTimeout(function(){ closeFab(); autoOpen = false; }, 3000);
        }
    }
    setTimeout(autoShowFab, 1500);
    setInterval(function(){ autoShowFab(); }, 25000);

    fabIg.addEventListener('click', function(){ t('click','fab_instagram','fab'); closeFab(); });

    fabWa.addEventListener('click', function(){
        t('click','fab_whatsapp','fab');
        if(typeof gtag_report_conversion==='function') gtag_report_conversion();
        closeFab();
    });

    fabAi.addEventListener('click', function(){
        t('click','fab_ai','fab');
        closeFab();
        if(chatToggle) chatToggle.click();
    });

    fabCall.addEventListener('click', function(){ t('click','fab_call','fab'); closeFab(); });

    /* --- Banner WA (siempre visible) --- */
    var BANNER_DELAY = 8000;
    if(banner){
        setTimeout(function(){
            banner.classList.add('show');
            fab.classList.add('fab-above-banner');
            t('engagement','wa_banner_impression','wa_banner');
        }, BANNER_DELAY);

        /* Destello cada 15s */
        setInterval(function(){
            if(banner.classList.contains('show')){
                banner.classList.add('wa-flash');
                setTimeout(function(){ banner.classList.remove('wa-flash'); }, 4200);
            }
        }, 15000);
    }

    if(bannerCta) bannerCta.addEventListener('click', function(){
        t('click','wa_banner_click','wa_banner');
        if(typeof gtag_report_conversion==='function') gtag_report_conversion();
    });

    /* --- Modal Instagram (30s, una vez por visita) --- */
    var igShown = false;
    if(igModal){
        setTimeout(function(){
            if(!igShown){
                igShown = true;
                igModal.classList.add('show');
                t('engagement','ig_modal_impression','ig_modal');
            }
        }, 30000);
    }

    function highlightIgInFab(){
        igModal.classList.remove('show');
        setTimeout(function(){
            fab.classList.add('open');
            isOpen = true;
            setTimeout(function(){
                fabIg.classList.add('fab-highlight');
                setTimeout(function(){
                    fabIg.classList.remove('fab-highlight');
                    setTimeout(function(){ closeFab(); }, 800);
                }, 1500);
            }, 600);
        }, 400);
    }

    if(igClose) igClose.addEventListener('click', function(){
        t('click','ig_modal_close','ig_modal'); highlightIgInFab();
    });

    if(igModal) igModal.addEventListener('click', function(e){
        if(e.target === igModal){ t('click','ig_modal_close','ig_modal'); highlightIgInFab(); }
    });

    if(igBtn) igBtn.addEventListener('click', function(){ t('click','ig_modal_follow','ig_modal'); });

    /* --- Modal Instagram Recordatorio (3 min) --- */
    if(igModal2){
        setTimeout(function(){
            igModal2.classList.add('show');
            t('engagement','ig_modal2_impression','ig_modal_reminder');
        }, 180000);
    }

    if(igClose2) igClose2.addEventListener('click', function(){
        igModal2.classList.remove('show');
        t('click','ig_modal2_close','ig_modal_reminder');
        highlightIgInFab();
    });

    if(igModal2) igModal2.addEventListener('click', function(e){
        if(e.target === igModal2){
            igModal2.classList.remove('show');
            t('click','ig_modal2_close','ig_modal_reminder');
            highlightIgInFab();
        }
    });

    if(igBtn2) igBtn2.addEventListener('click', function(){ t('click','ig_modal2_follow','ig_modal_reminder'); });
})();
</script>
```

**Línea de tiempo completa de un usuario en el home**

| t | Qué pasa |
|---|---|
| 0 s | Carga |
| 1,5 s | El FAB se abre solo (abanico) |
| 4,5 s | El FAB se cierra solo |
| 8 s | Sube el banner de WhatsApp; el FAB se desplaza hacia arriba (`fab-above-banner`) |
| 23 s | Primer destello del banner (y cada 15 s) |
| 26,5 s | El FAB se vuelve a abrir solo (cada 25 s) |
| 30 s | Modal Instagram #1 |
| al cerrarlo | El abanico se abre y el botón de IG hace un pulso gigante (`fab-ig-pulse`) para "enseñar dónde está" |
| 180 s | Modal Instagram #2 (recordatorio) |

---

# 4. Modales de Instagram

Dos modales idénticos en estructura, distinto copy. Entrada con overlay + `scale(0.85) translateY(20px)` → `scale(1)` con curva elástica.

### 4.1 HTML

```html
<!-- Modal 1: a los 30 s -->
<div id="ig-modal" class="ig-modal">
    <div class="ig-modal-content">
        <button class="ig-modal-close" id="ig-modal-close">&times;</button>
        <div class="ig-modal-icon"><i class="fab fa-instagram"></i></div>
        <h3 class="ig-modal-title">Seguinos en Instagram</h3>
        <p class="ig-modal-text">Para conocer cómo trabajamos y conseguir un <strong>REGALO ESPECIAL</strong> luego de mudarte con nosotros</p>
        <a href="https://www.instagram.com/mimudanzaok/" target="_blank" rel="noopener"
           class="ig-modal-btn" id="ig-modal-btn">
            <i class="fab fa-instagram"></i> @mimudanzaok
        </a>
    </div>
</div>

<!-- Modal 2: a los 3 min -->
<div id="ig-modal-2" class="ig-modal">
    <div class="ig-modal-content">
        <button class="ig-modal-close" id="ig-modal-2-close">&times;</button>
        <div class="ig-modal-icon"><i class="fab fa-instagram"></i></div>
        <h3 class="ig-modal-title">No te olvides de seguirnos</h3>
        <p class="ig-modal-text">Para conocer cómo trabajamos y conseguir un <strong>REGALO ESPECIAL</strong> luego de mudarte con nosotros</p>
        <a href="https://www.instagram.com/mimudanzaok/" target="_blank" rel="noopener"
           class="ig-modal-btn" id="ig-modal-2-btn">
            <i class="fab fa-instagram"></i> @mimudanzaok
        </a>
    </div>
</div>
```

### 4.2 CSS completo

```css
.ig-modal {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0,0,0,0.55);
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s, visibility 0.4s;
}

.ig-modal.show { opacity: 1; visibility: visible; }

.ig-modal-content {
    background: #fff;
    border-radius: 20px;
    padding: 2.5rem 2rem;
    max-width: 360px;
    width: 90%;
    text-align: center;
    position: relative;
    transform: scale(0.85) translateY(20px);
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 20px 60px rgba(0,0,0,0.25);
}

.ig-modal.show .ig-modal-content { transform: scale(1) translateY(0); }

.ig-modal-close {
    position: absolute;
    top: 12px; right: 16px;
    width: 32px; height: 32px;
    border: none; background: none;
    font-size: 1.5rem; color: #999;
    cursor: pointer; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    transition: color 0.2s, background 0.2s;
    line-height: 1;
}
.ig-modal-close:hover { color: #333; background: #f0f0f0; }

.ig-modal-icon {
    width: 72px; height: 72px;
    margin: 0 auto 1rem;
    border-radius: 18px;
    background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    display: flex; align-items: center; justify-content: center;
    font-size: 2.2rem; color: #fff;
}

.ig-modal-title {
    font-family: 'Poppins', sans-serif;
    font-size: 1.4rem; font-weight: 700;
    color: #222; margin-bottom: 0.5rem;
}

.ig-modal-text {
    font-size: 0.95rem; color: #555;
    margin-bottom: 1.5rem; line-height: 1.5;
}

.ig-modal-btn {
    display: inline-flex; align-items: center; gap: 0.5rem;
    padding: 0.85rem 1.8rem;
    border-radius: 12px;
    background: linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
    color: #fff;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem; font-weight: 600;
    text-decoration: none;
    transition: filter 0.2s, transform 0.2s;
    box-shadow: 0 4px 15px rgba(220,39,67,0.35);
}
.ig-modal-btn:hover { filter: brightness(1.1); transform: scale(1.03); }

@media (max-width: 480px) {
    .ig-modal-content { padding: 2rem 1.25rem; }
    .ig-modal-title   { font-size: 1.2rem; }
    .ig-modal-btn     { padding: 0.75rem 1.4rem; font-size: 0.9rem; }
}
```

---

# 5. Formulario de contacto / cotización (`#contactForm`)

**No envía a un servidor: arma un mensaje formateado y abre WhatsApp.**

### 5.1 HTML

```html
<form id="contactForm" class="contact-form">
    <div class="form-row">
        <div class="form-group">
            <label for="nombre">Nombre *</label>
            <input type="text" id="nombre" name="nombre" required>
        </div>
        <div class="form-group">
            <label for="telefono">Teléfono *</label>
            <input type="tel" id="telefono" name="telefono" required>
        </div>
    </div>

    <div class="form-group">
        <label for="email">Email *</label>
        <input type="email" id="email" name="email" required>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label for="origen">Origen *</label>
            <input type="text" id="origen" name="origen" placeholder="Ej: Palermo, CABA" required>
        </div>
        <div class="form-group">
            <label for="destino">Destino *</label>
            <input type="text" id="destino" name="destino" placeholder="Ej: Belgrano, CABA" required>
        </div>
    </div>

    <div class="form-row">
        <div class="form-group">
            <label for="fecha">Fecha estimada</label>
            <input type="date" id="fecha" name="fecha" min="<!-- hoy -->">
        </div>
        <div class="form-group">
            <label for="tipo">Tipo de mudanza *</label>
            <select id="tipo" name="tipo" required>
                <option value="">Seleccionar</option>
                <option value="local">Mudanza Local</option>
                <option value="nacional">Mudanza Nacional</option>
                <option value="internacional">Mudanza Internacional</option>
            </select>
        </div>
    </div>

    <div class="form-group">
        <label for="mensaje">Detalles de tu mudanza</label>
        <textarea id="mensaje" name="mensaje" rows="4"
                  placeholder="Ej: Departamento de 2 ambientes, 3er piso sin ascensor..."></textarea>
    </div>

    <button type="submit" class="btn btn-primary btn-lg btn-block">
        <i class="fas fa-paper-plane"></i> Solicitar Presupuesto
    </button>

    <p class="form-note">* Campos obligatorios. Tu información está segura con nosotros.</p>
</form>
```

### 5.2 JS (de `js/main.js`)

```js
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        if (!validateForm(data)) return;

        // Estado de carga
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('¡Redirigiendo a WhatsApp para completar tu solicitud!', 'success');

            const whatsappMessage = generateWhatsAppMessage(data);
            const whatsappUrl = `https://wa.me/5491138961652?text=${encodeURIComponent(whatsappMessage)}`;

            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-16992803900/tGEJCNuOqbYaELy45qY_',
                    'value': 1.0,
                    'currency': 'ARS'
                });
            }

            contactForm.reset();
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            window.open(whatsappUrl, '_blank');
        }, 1000);
    });
}

function validateForm(data) {
    const requiredFields = ['nombre','telefono','email','origen','destino','tipo'];
    let isValid = true;

    requiredFields.forEach(field => {
        const input = document.getElementById(field);
        if (!data[field] || data[field].trim() === '') {
            showError(input, 'Este campo es obligatorio');
            isValid = false;
        } else {
            clearError(input);
        }
    });

    if (data.email && !isValidEmail(data.email)) {
        showError(document.getElementById('email'), 'Por favor ingrese un email válido');
        isValid = false;
    }
    if (data.telefono && !isValidPhone(data.telefono)) {
        showError(document.getElementById('telefono'), 'Por favor ingrese un teléfono válido');
        isValid = false;
    }
    return isValid;
}

function showError(input, message) {
    const formGroup = input.closest('.form-group');
    clearError(input);
    input.style.borderColor = '#E74C3C';
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.color = '#E74C3C';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    formGroup.appendChild(errorDiv);
}

function generateWhatsAppMessage(data) {
    return `🏠 *Nueva Consulta de Mudanza*\n\n` +
           `*Nombre:* ${data.nombre}\n` +
           `*Teléfono:* ${data.telefono}\n` +
           `*Email:* ${data.email}\n` +
           `*Origen:* ${data.origen}\n` +
           `*Destino:* ${data.destino}\n` +
           `*Tipo:* ${data.tipo}\n` +
           `${data.fecha ? `*Fecha:* ${data.fecha}\n` : ''}` +
           `${data.mensaje ? `*Mensaje:* ${data.mensaje}` : ''}`;
}
```

### 5.3 Sistema de notificaciones toast

Aparece arriba a la derecha, se autodestruye a los 4 s.

```js
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#27AE60' : type === 'error' ? '#E74C3C' : '#3498DB'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 350px;
    `;
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}
```

```css
@keyframes slideInRight  { from { transform: translateX(400px); opacity: 0; }
                           to   { transform: translateX(0);     opacity: 1; } }
@keyframes slideOutRight { from { transform: translateX(0);     opacity: 1; }
                           to   { transform: translateX(400px); opacity: 0; } }
```

### 5.4 CSS del bloque de contacto

```css
.contact { padding: var(--spacing-xl) 0; background: var(--light-color); }

.contact-wrapper {
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: var(--spacing-xl);
}

.contact-info {
    background: var(--dark-color);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    color: var(--white);
}
.contact-info h3 { font-size: 2rem; margin-bottom: var(--spacing-sm); }
.contact-info > p { margin-bottom: var(--spacing-lg); opacity: 0.9; }

.contact-methods { display: grid; gap: var(--spacing-md); }
.contact-method  { display: flex; gap: var(--spacing-sm); }

.method-icon {
    width: 50px; height: 50px;
    background: var(--primary-color);
    border-radius: var(--radius-sm);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
}
.method-icon i { font-size: 1.5rem; color: var(--white); }

.method-content h4   { font-size: 1rem; margin-bottom: 0.25rem; color: var(--white); }
.method-content a    { color: var(--white); font-weight: 600; }
.method-content a:hover { font-weight: 700; }
.method-content span { font-size: 0.875rem; color: var(--white); display: block; margin-top: 0.25rem; }
.method-content p    { color: var(--white); }

.badge-online {
    background: var(--success); color: var(--white);
    padding: 0.25rem 0.75rem; border-radius: var(--radius-sm);
    font-size: 0.75rem; display: inline-block; margin-top: 0.25rem;
}

/* Formulario */
.contact-form-container {
    background: var(--white);
    padding: var(--spacing-lg);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-md);
}
.contact-form { display: grid; gap: var(--spacing-sm); }
.form-row     { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-sm); }
.form-group   { display: flex; flex-direction: column; }
.form-group label { font-weight: 600; margin-bottom: 0.5rem; color: var(--dark-color); }

.form-group input,
.form-group select,
.form-group textarea {
    padding: 0.875rem;
    border: 2px solid var(--gray-light);
    border-radius: var(--radius-sm);
    font-family: var(--font-primary);
    font-size: 1rem;
    transition: var(--transition);
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { outline: none; border-color: var(--primary-color); }

.form-group textarea { resize: vertical; }
.form-note { text-align: center; font-size: 0.875rem; color: var(--gray); margin-top: var(--spacing-sm); }
```

### 5.5 Bloque "Contactanos Ahora" (contenido)

| Ícono | Título | Valor | Subtítulo |
|---|---|---|---|
| `fab fa-whatsapp` | WhatsApp | +54 9 11 3896-1652 | Respuesta inmediata |
| `fas fa-phone` | Teléfono | 011 3896-1652 | Lun a Vie: 8:00 - 20:00 |
| `fas fa-envelope` | Email | info@mimudanza.com.ar | Respondemos en 24hs |
| `fas fa-map-marker-alt` | Ubicación | Parral 61, Piso 3, Of. 8, CABA | Cobertura nacional |

---

# 6. Chatbot (`js/chatbot.js` + `css/chatbot.css`)

- El botón propio del chatbot (`.chatbot-toggle`) está **oculto** (`display: none`) — se dispara exclusivamente desde el botón "Asistente IA" del FAB.
- Ventana: `position: fixed; bottom: 120px; right: 20px; width: 380px; height: 600px;` con `max-width: calc(100vw - 40px)` y `max-height: calc(100vh - 200px)`.
- Clases disponibles: `.chatbot-toggle` `.chatbot-window` `.chatbot-header` `.chatbot-header-content` `.chatbot-avatar` `.chatbot-info` `.chatbot-status` `.chatbot-close-btn` `.chatbot-messages` `.chatbot-message` `.user-message` `.message-avatar` `.message-content` `.message-time` `.quick-actions` `.quick-action-btn` `.chatbot-typing` `.chatbot-input-area` `.chatbot-form` `.chatbot-input` `.chatbot-send-btn` `.error-message`.
- CSS total: 7,2 KB.

---

# 7. Otros canales de contacto del sitio

| Elemento | Dónde | Destino |
|---|---|---|
| Botón "Consultar" en el navbar | Header fijo (`z-index: 1000`, altura 59–70 px) | WhatsApp |
| Botón "Ingresar" en el navbar | Header | Portal de clientes |
| Botón "Cotizar Gratis" del hero | Hero | `#contacto` (ancla interna) |
| "Obtener Presupuesto Gratis" | Sección precios | `#contacto` |
| CTA local "Cotizá en {Localidad}" | Bloque `local-highlight` de cada subpágina | WhatsApp con texto pre-cargado |
| Footer: teléfono, WhatsApp, email | Columna "Contacto" | `tel:` / `wa.me` / `mailto:` |
| CV | Sección "Trabaja con Nosotros" | `mimudanza@gestiongeneral.com` |
| Widget externo | `truckdate.com/widget.js` | Sistema propio "GoodTruck" |

---

# 8. Notas para cuando repliquemos

1. **Poner los componentes en TODAS las páginas**, no solo en el home (bug del original).
2. Si el sitio nuevo usa build/templating, esto va como partial único (`_contacto-flotante.html`) y no copiado 113 veces.
3. El banner **no tiene botón de cerrar** — decidir si lo dejamos así (más agresivo, más conversión) o le agregamos cierre con memoria en `localStorage`.
4. La combinación auto-apertura del FAB cada 25 s + destello del banner cada 15 s + 2 modales de Instagram es **muy insistente**. Hay que decidir cuánta de esa agresividad queremos.
5. `prefers-reduced-motion`: el original no lo contempla. Convendría agregar un bloque que desactive `fab-ring`, `wa-pulse` y `wa-flash-*`.
6. Los `translate()` del abanico están hardcodeados por breakpoint. Se puede parametrizar con variables CSS o generar el arco por trigonometría si queremos N botones.
7. El label del `::after` usa `data-label` — se mantiene accesible con `aria-label` en el botón principal, pero los `<a>` de opción no tienen texto accesible propio (solo el ícono). **Agregar `aria-label` a cada opción.**
8. Font Awesome completo desde CDN es pesado (~100 KB). Para el rediseño conviene SVG inline de los 6–8 íconos que realmente usamos.
