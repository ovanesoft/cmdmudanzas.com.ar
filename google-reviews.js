// Google Reviews Manager
// Gestiona la obtención y cache de reseñas de Google Places API

const GoogleReviewsManager = {
    placeId: 'ChIJv7PkEUe_vJURAgTi_Rr6W0o', // Place ID de CMD Mudanzas
    apiKey: 'AIzaSyDiiiYShByY7he2SeXwh9DMKY5FfMfg3o4',
    cacheFile: 'data/google-reviews-cache.json',
    cacheExpiry: 24 * 60 * 60 * 1000, // 24 horas en milisegundos

    // Cache embebido como fallback (actualizado: 2025-01-04)
    fallbackCache: {
        "timestamp": 1736008800000,
        "name": "Mi Mudanza",
        "rating": 5,
        "totalReviews": 11,
        "googleUrl": "https://maps.google.com/?cid=5053437360425719522",
        "reviews": [
            {
                "author_name": "Luciano Cordoba",
                "author_url": "https://www.google.com/maps/contrib/112749757936604201750/reviews",
                "profile_photo_url": "https://lh3.googleusercontent.com/a/ACg8ocKiE6aAIvVK1YKPevy5Q3ZuELV9oWZ0jwbYT-cxB34UFec0mg=s128-c0x00000000-cc-rp-mo",
                "rating": 5,
                "text": "Gracias por los servicios recomiendo no solo por la responsabilidad si no también la dedicación y compromiso con mis cosas me me dude a un 9' piso y ni un solo detalle los muebles.\nEl personal una maravilla la calidad de todos los detalles muy recomendable.",
                "time": 1766862531
            },
            {
                "author_name": "Alejandro Ramirez",
                "author_url": "https://www.google.com/maps/contrib/114294777029796099998/reviews",
                "profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjVa69muGHTZ25VfoJqX411oOedweHHyY2-MrL2U1GGBr36I0uJOnA=s128-c0x00000000-cc-rp-mo",
                "rating": 5,
                "text": "Excelente servicio, mudanzas en tiempo y forma, y el personal excelente trato y cuidado con las cosas.",
                "time": 1766862417
            },
            {
                "author_name": "Michelle Denise Guzmán",
                "author_url": "https://www.google.com/maps/contrib/101710621253232719153/reviews",
                "profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjVygtmlL8TrVtFFktWgR-Awku7eao4EHkSlW5RE1poOa-Nt2F8=s128-c0x00000000-cc-rp-mo",
                "rating": 5,
                "text": "Altamente recomendable, cumplieron en tiempo y forma y cuidaron cada detalle de la mudanza.Rápidos, prolijos y muy responsables.",
                "time": 1766862303
            },
            {
                "author_name": "Leandro Romero",
                "author_url": "https://www.google.com/maps/contrib/111361231319912499797/reviews",
                "profile_photo_url": "https://lh3.googleusercontent.com/a-/ALV-UjWN3dSrO9aeb07xPqSO8ZoaN0nOrnyXDLA63PxQ809XTsBm0Xtd=s128-c0x00000000-cc-rp-mo",
                "rating": 5,
                "text": "Impecable trabajo como siempre en cada una de mis mudanzas, volveria a contratarlos.",
                "time": 1766862249
            },
            {
                "author_name": "CMD Mudanzas y Bauleras Privadas",
                "author_url": "https://www.google.com/maps/contrib/112801016387938050173/reviews",
                "profile_photo_url": "https://lh3.googleusercontent.com/a/ACg8ocJRfFwyrD50Mh2CbwGtUcTGpA5eO_k85cgqaX9U9O7q8qI52w=s128-c0x00000000-cc-rp-mo-ba2",
                "rating": 5,
                "text": "Contrate a esta empresa porque nos superó el trabajo y realmente son para recomendar me hicieron quedar muy bien y trabajaron como profesionales",
                "time": 1749507600
            }
        ]
    },

    // Inicializar y mostrar reseñas
    async init() {
        console.log('Iniciando carga de reseñas de Google...');
        try {
            const reviews = await this.getReviews();
            if (reviews && reviews.reviews && reviews.reviews.length > 0) {
                console.log('Reseñas obtenidas:', reviews.reviews.length);
                this.renderReviews(reviews);
            } else {
                console.warn('No se encontraron reseñas');
                this.renderError();
            }
        } catch (error) {
            console.error('Error al cargar reseñas:', error);
            this.renderError();
        }
    },

    // Obtener reseñas (desde cache o API)
    async getReviews() {
        // Primero intentar cargar desde localStorage
        const localData = this.loadFromLocalStorage();
        if (localData && this.isCacheValid(localData)) {
            console.log('Usando reseñas desde localStorage');
            return localData;
        }

        // Intentar cargar desde cache local en servidor (como fallback)
        const cachedData = await this.loadFromCache();

        // Si tenemos cache del servidor (aunque esté expirado), usarlo como fallback
        // mientras intentamos actualizar desde la API
        if (cachedData) {
            console.log('Cache del servidor encontrado (edad: ' +
                Math.floor((Date.now() - cachedData.timestamp) / (1000 * 60 * 60)) + ' horas)');

            // Si el cache es muy viejo (más de 30 días), intentar API primero
            const cacheAge = Date.now() - cachedData.timestamp;
            const thirtyDays = 30 * 24 * 60 * 60 * 1000;

            if (cacheAge > thirtyDays) {
                console.log('Cache muy antiguo (>30 días), intentando actualizar desde API...');
                try {
                    const freshData = await this.fetchFromAPI();
                    return freshData;
                } catch (error) {
                    console.warn('Error al actualizar desde API, usando cache antiguo:', error);
                    this.saveToLocalStorage(cachedData);
                    return cachedData;
                }
            } else {
                // Cache relativamente fresco, usarlo
                this.saveToLocalStorage(cachedData);

                // Actualizar en segundo plano si tiene más de 24 horas
                if (cacheAge > this.cacheExpiry) {
                    console.log('Actualizando cache en segundo plano...');
                    this.fetchFromAPI().then(freshData => {
                        this.saveToLocalStorage(freshData);
                        console.log('Cache actualizado en segundo plano');
                    }).catch(err => console.warn('Error al actualizar en segundo plano:', err));
                }

                return cachedData;
            }
        }

        // Si no hay cache del servidor, intentar API
        console.log('No hay cache del servidor disponible');
        try {
            console.log('Intentando cargar desde Google API...');
            const freshData = await this.fetchFromAPI();
            return freshData;
        } catch (error) {
            console.warn('Error al cargar desde API, usando fallback embebido:', error);
            // Último recurso: usar datos embebidos en el código
            this.saveToLocalStorage(this.fallbackCache);
            return this.fallbackCache;
        }
    },

    // Cargar desde localStorage
    loadFromLocalStorage() {
        try {
            const data = localStorage.getItem('google_reviews_cache');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.log('No hay cache en localStorage');
            return null;
        }
    },

    // Cargar reseñas desde cache local
    async loadFromCache() {
        try {
            console.log('Intentando cargar desde:', this.cacheFile);
            const response = await fetch(this.cacheFile);
            if (!response.ok) {
                console.error('Error al cargar cache:', response.status, response.statusText);
                return null;
            }
            const data = await response.json();
            console.log('Cache cargado exitosamente desde servidor');
            return data;
        } catch (error) {
            console.error('Error al cargar cache del servidor:', error);
            return null;
        }
    },

    // Verificar si el cache es válido (menos de 24 horas)
    isCacheValid(cachedData) {
        if (!cachedData || !cachedData.timestamp) {
            console.log('Cache inválido: no tiene timestamp');
            return false;
        }
        const now = Date.now();
        const age = now - cachedData.timestamp;
        const isValid = age < this.cacheExpiry;
        const hours = Math.floor(age / (1000 * 60 * 60));
        console.log(`Cache tiene ${hours} horas. Válido: ${isValid}`);

        return isValid;
    },

    // Obtener reseñas desde Google Places API
    async fetchFromAPI() {
        return new Promise((resolve, reject) => {
            // Verificar que Google Maps API esté disponible
            if (typeof google === 'undefined' || !google.maps || !google.maps.places) {
                console.error('Google Maps API no está disponible');
                reject(new Error('Google Maps API no está disponible'));
                return;
            }

            try {
                const service = new google.maps.places.PlacesService(
                    document.createElement('div')
                );

                const request = {
                    placeId: this.placeId,
                    fields: ['name', 'rating', 'user_ratings_total', 'reviews', 'url']
                };

                console.log('Solicitando datos a Google Places API...');

                service.getDetails(request, (place, status) => {
                    console.log('Respuesta de Google Places:', status);

                    if (status === google.maps.places.PlacesServiceStatus.OK && place) {
                        const data = {
                            timestamp: Date.now(),
                            name: place.name || 'Mi Mudanza',
                            rating: place.rating || 5,
                            totalReviews: place.user_ratings_total || 0,
                            googleUrl: place.url || `https://maps.google.com/?cid=5053437360425719522`,
                            reviews: place.reviews || []
                        };

                        console.log('✅ Datos obtenidos exitosamente:', data.reviews.length, 'reseñas');

                        // Guardar en localStorage como fallback
                        this.saveToLocalStorage(data);

                        resolve(data);
                    } else {
                        const errorMsg = `Error de Google Places API: ${status}`;
                        console.error(errorMsg);
                        reject(new Error(errorMsg));
                    }
                });
            } catch (error) {
                console.error('Error al llamar a Google Places API:', error);
                reject(error);
            }
        });
    },

    // Guardar en localStorage
    saveToLocalStorage(data) {
        try {
            localStorage.setItem('google_reviews_cache', JSON.stringify(data));
            console.log('Cache guardado en localStorage');
        } catch (error) {
            console.error('Error al guardar en localStorage:', error);
        }
    },

    // Renderizar reseñas en el DOM
    renderReviews(data) {
        const container = document.getElementById('google-reviews-container');
        if (!container) return;

        const starsHTML = this.getStarsHTML(data.rating);

        const html = `
            <div class="google-reviews-widget">
                <!-- Header con calificación -->
                <div class="reviews-header">
                    <div class="reviews-rating">
                        <div class="rating-number">${data.rating}</div>
                        <div class="rating-details">
                            <div class="stars">${starsHTML}</div>
                            <div class="reviews-count">
                                Basado en ${data.totalReviews} reseñas de Google
                            </div>
                        </div>
                    </div>
                    <a href="${data.googleUrl}" target="_blank" rel="noopener" class="google-logo">
                        <img src="https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_92x30dp.png" alt="Google">
                    </a>
                </div>

                <!-- Lista de reseñas -->
                <div class="reviews-list">
                    ${this.sortReviewsByDate(data.reviews).slice(0, 5).map(review => this.renderReview(review)).join('')}
                </div>

                <!-- Botón para ver más -->
                <div class="reviews-footer">
                    <a href="${data.googleUrl}" target="_blank" rel="noopener" class="btn btn-outline">
                        Ver todas las reseñas en Google
                    </a>
                </div>
            </div>
        `;

        container.innerHTML = html;
    },

    // Renderizar una reseña individual
    renderReview(review) {
        const starsHTML = this.getStarsHTML(review.rating);
        const text = review.text || '';
        const shortText = text.length > 200 ? text.substring(0, 200) + '...' : text;

        return `
            <div class="review-item">
                <div class="review-header">
                    <img src="${review.profile_photo_url}" alt="${review.author_name}" class="review-avatar">
                    <div class="review-author">
                        <div class="author-name">${review.author_name}</div>
                        <div class="review-meta">
                            <div class="stars">${starsHTML}</div>
                        </div>
                    </div>
                </div>
                ${text ? `<div class="review-text">${shortText}</div>` : ''}
            </div>
        `;
    },

    // Ordenar reseñas por fecha (más recientes primero)
    sortReviewsByDate(reviews) {
        return reviews.sort((a, b) => b.time - a.time);
    },

    // Generar HTML de estrellas
    getStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let html = '';

        // Estrellas completas
        for (let i = 0; i < fullStars; i++) {
            html += '<i class="fas fa-star"></i>';
        }

        // Media estrella
        if (hasHalfStar) {
            html += '<i class="fas fa-star-half-alt"></i>';
        }

        // Estrellas vacías
        for (let i = 0; i < emptyStars; i++) {
            html += '<i class="far fa-star"></i>';
        }

        return html;
    },

    // Calcular tiempo transcurrido
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - (timestamp * 1000);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (years > 0) return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
        if (months > 0) return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
        if (days > 0) return `Hace ${days} ${days === 1 ? 'día' : 'días'}`;
        return 'Hace poco';
    },

    // Renderizar error
    renderError() {
        const container = document.getElementById('google-reviews-container');
        if (!container) return;

        container.innerHTML = `
            <div class="reviews-error">
                <i class="fas fa-exclamation-circle"></i>
                <p>No se pudieron cargar las reseñas en este momento.</p>
                <a href="https://www.google.com/maps/place/?q=place_id:${this.placeId}"
                   target="_blank"
                   rel="noopener"
                   class="btn btn-primary">
                    Ver reseñas en Google Maps
                </a>
            </div>
        `;
    }
};

// Inicializar cuando la API de Google Maps esté lista
function initGoogleReviews() {
    console.log('🚀 Callback de Google Maps ejecutado');
    GoogleReviewsManager.init();
}

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM cargado');

    // Si Google Maps ya está disponible, inicializar inmediatamente
    if (typeof google !== 'undefined' && google.maps && google.maps.places) {
        console.log('✅ Google Maps ya disponible, iniciando...');
        GoogleReviewsManager.init();
    } else {
        console.log('⏳ Esperando que Google Maps se cargue...');
        // Si no está disponible, el callback initGoogleReviews lo hará
    }

    // Inicializar carrusel de reseñas
    initReviewsCarousel();
});

// ========================================
// Carrusel de Reseñas
// ========================================
function initReviewsCarousel() {
    const reviewsContainer = document.querySelector('.reviews-slider');
    const prevBtn = document.querySelector('.review-nav-prev');
    const nextBtn = document.querySelector('.review-nav-next');
    const dotsContainer = document.querySelector('.review-dots');

    if (!reviewsContainer || !prevBtn || !nextBtn || !dotsContainer) {
        console.log('Elementos del carrusel no encontrados, esperando...');
        return;
    }

    const reviews = reviewsContainer.querySelectorAll('.review-card');
    if (reviews.length === 0) {
        console.log('No hay tarjetas de reseñas para mostrar');
        return;
    }

    let currentIndex = 0;
    let autoplayInterval;
    const autoplayDelay = 5000; // 5 segundos

    // Create dots
    function createDots() {
        dotsContainer.innerHTML = '';
        reviews.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('review-dot');
            dot.setAttribute('aria-label', `Ir a reseña ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Update active states
    function updateActiveStates() {
        // Update cards
        reviews.forEach((review, index) => {
            review.classList.remove('active', 'prev', 'next');

            if (index === currentIndex) {
                review.classList.add('active');
            } else if (index === (currentIndex - 1 + reviews.length) % reviews.length) {
                review.classList.add('prev');
            } else if (index === (currentIndex + 1) % reviews.length) {
                review.classList.add('next');
            }
        });

        // Update dots
        const dots = dotsContainer.querySelectorAll('.review-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    // Go to specific slide
    function goToSlide(index) {
        currentIndex = index;
        updateActiveStates();
        resetAutoplay();
    }

    // Next slide
    function nextSlide() {
        currentIndex = (currentIndex + 1) % reviews.length;
        updateActiveStates();
    }

    // Previous slide
    function prevSlide() {
        currentIndex = (currentIndex - 1 + reviews.length) % reviews.length;
        updateActiveStates();
    }

    // Autoplay functionality
    function startAutoplay() {
        autoplayInterval = setInterval(nextSlide, autoplayDelay);
    }

    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }

    function resetAutoplay() {
        stopAutoplay();
        startAutoplay();
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoplay();
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoplay();
    });

    // Pause autoplay on hover
    reviewsContainer.addEventListener('mouseenter', stopAutoplay);
    reviewsContainer.addEventListener('mouseleave', startAutoplay);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    reviewsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        stopAutoplay();
    });

    reviewsContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
        startAutoplay();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide(); // Swipe left
            } else {
                prevSlide(); // Swipe right
            }
        }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            resetAutoplay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            resetAutoplay();
        }
    });

    // Initialize
    createDots();
    updateActiveStates();
    startAutoplay();

    // Pause autoplay when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    console.log('✅ Carrusel de reseñas inicializado');
}
