# Guía de Seguridad - CMD Mudanzas

## ⚠️ ADVERTENCIA IMPORTANTE: API Key de Claude

### Problema Actual

La API key de Claude está actualmente **expuesta en el código JavaScript del cliente** (`script.js`). Esto es un **riesgo de seguridad** porque:

1. ✅ Cualquiera puede ver el código fuente del sitio web
2. ✅ Cualquiera puede extraer la API key
3. ✅ Pueden usar tu API key en sus propios proyectos
4. ✅ Esto generará costos en tu cuenta de Anthropic

### Solución Recomendada: Backend Proxy

**NO** debes exponer la API key directamente en el frontend. En su lugar, crea un backend que actúe como proxy:

#### Opción 1: Serverless Function (Vercel/Netlify)

**Estructura recomendada:**
```
cmdmudanzas.com.ar/
├── api/
│   └── chat.js          # Serverless function
├── index.html
├── styles.css
└── script.js            # Sin API key
```

**api/chat.js** (Vercel):
```javascript
export default async function handler(req, res) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Verificar origen (CORS)
    const allowedOrigins = [
        'https://cmdmudanzas.com.ar',
        'https://www.cmdmudanzas.com.ar'
    ];

    const origin = req.headers.origin;
    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    // Rate limiting simple (opcional)
    // Implementar Redis o similar para producción

    try {
        const { messages } = req.body;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY, // Variable de entorno
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                system: `Eres un asistente virtual de CMD Mudanzas...`,
                messages: messages
            })
        });

        const data = await response.json();

        return res.status(200).json(data);
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
```

**script.js** (Modificado - Sin API key):
```javascript
// REMOVER estas líneas:
// const CLAUDE_API_KEY = 'sk-ant-api03-...';
// const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

// REEMPLAZAR con:
const CHAT_API_URL = '/api/chat'; // Tu endpoint backend

async function sendMessageToClaude(userMessage) {
    conversationHistory.push({
        role: 'user',
        content: userMessage
    });

    try {
        const response = await fetch(CHAT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: conversationHistory
            })
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        const assistantMessage = data.content[0].text;

        conversationHistory.push({
            role: 'assistant',
            content: assistantMessage
        });

        return assistantMessage;
    } catch (error) {
        console.error('Error:', error);
        return 'Lo siento, hubo un error. Intenta nuevamente.';
    }
}
```

**Configurar variable de entorno en Vercel:**
```bash
# Desde CLI
vercel env add CLAUDE_API_KEY

# O desde Dashboard:
# Project Settings > Environment Variables
# Name: CLAUDE_API_KEY
# Value: tu_clave_api_de_claude_aqui
```

#### Opción 2: Backend PHP

**api/chat.php**:
```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: https://cmdmudanzas.com.ar');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$messages = $input['messages'] ?? [];

$apiKey = getenv('CLAUDE_API_KEY'); // Variable de entorno
$apiUrl = 'https://api.anthropic.com/v1/messages';

$data = [
    'model' => 'claude-3-5-sonnet-20241022',
    'max_tokens' => 1024,
    'system' => 'Eres un asistente virtual de CMD Mudanzas...',
    'messages' => $messages
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'x-api-key: ' . $apiKey,
    'anthropic-version: 2023-06-01'
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo $response;
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Error communicating with AI']);
}
?>
```

**Configurar variable de entorno en cPanel:**
1. Panel de control > Select PHP Version
2. Switch to PHP Options
3. Agregar variable de entorno

#### Opción 3: Backend Node.js/Express

**server.js**:
```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(express.json());
app.use(cors({
    origin: ['https://cmdmudanzas.com.ar', 'https://www.cmdmudanzas.com.ar']
}));

app.post('/api/chat', async (req, res) => {
    try {
        const { messages } = req.body;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                system: 'Eres un asistente virtual de CMD Mudanzas...',
                messages
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

**.env**:
```
CLAUDE_API_KEY=tu_clave_api_de_claude_aqui
PORT=3000
```

**Asegurarse que .env está en .gitignore**

## Medidas de Seguridad Adicionales

### 1. Rate Limiting

Prevenir abuso del chatbot:

```javascript
// En tu backend
const rateLimit = require('express-rate-limit');

const chatLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 30, // 30 requests por IP
    message: 'Demasiadas solicitudes. Intenta en unos minutos.'
});

app.post('/api/chat', chatLimiter, async (req, res) => {
    // ... tu código
});
```

### 2. Validación de Input

```javascript
// Validar mensajes del usuario
function validateMessage(message) {
    if (!message || typeof message !== 'string') {
        return false;
    }
    if (message.length > 1000) { // Max 1000 caracteres
        return false;
    }
    return true;
}

// En el endpoint
const { messages } = req.body;
if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Invalid messages' });
}

// Validar cada mensaje
for (const msg of messages) {
    if (!validateMessage(msg.content)) {
        return res.status(400).json({ error: 'Invalid message content' });
    }
}
```

### 3. Monitoreo de Costos

```javascript
// Registrar uso de la API
const fs = require('fs');

function logAPIUsage(tokens, cost) {
    const log = {
        timestamp: new Date().toISOString(),
        tokens,
        cost,
        model: 'claude-3-5-sonnet-20241022'
    };

    fs.appendFileSync('api-usage.log', JSON.stringify(log) + '\n');
}

// Después de cada llamada exitosa
const tokensUsed = data.usage.input_tokens + data.usage.output_tokens;
const estimatedCost = (tokensUsed / 1000000) * 15; // $15 per 1M tokens (ejemplo)
logAPIUsage(tokensUsed, estimatedCost);
```

### 4. Implementar Caché

Reducir llamadas a la API con respuestas frecuentes:

```javascript
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 3600 }); // 1 hora

app.post('/api/chat', async (req, res) => {
    const { messages } = req.body;

    // Generar key único para el mensaje
    const cacheKey = JSON.stringify(messages);

    // Verificar cache
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
        return res.json(cachedResponse);
    }

    // Si no está en cache, llamar a la API
    const response = await fetch(/* ... */);
    const data = await response.json();

    // Guardar en cache
    cache.set(cacheKey, data);

    res.json(data);
});
```

### 5. Rotación de API Keys

Crear script para rotar keys regularmente:

```bash
#!/bin/bash
# rotate-api-key.sh

# 1. Generar nueva key en Anthropic console
# 2. Actualizar variable de entorno
vercel env rm CLAUDE_API_KEY production
vercel env add CLAUDE_API_KEY production

# 3. Redesplegar
vercel --prod

# 4. Esperar 24h y revocar key antigua
```

### 6. Alertas de Uso Anómalo

```javascript
// Enviar alerta si el uso es inusual
const USAGE_THRESHOLD = 100; // 100 requests por hora

let requestCount = 0;
setInterval(() => {
    if (requestCount > USAGE_THRESHOLD) {
        sendAlert(`Uso anómalo detectado: ${requestCount} requests en la última hora`);
    }
    requestCount = 0;
}, 60 * 60 * 1000); // Reset cada hora

app.post('/api/chat', (req, res) => {
    requestCount++;
    // ... resto del código
});
```

## Headers de Seguridad

Ya implementados en `.htaccess`, pero verificar:

```apache
# Prevenir clickjacking
Header always set X-Frame-Options "SAMEORIGIN"

# XSS Protection
Header always set X-XSS-Protection "1; mode=block"

# Prevenir MIME sniffing
Header always set X-Content-Type-Options "nosniff"

# Content Security Policy
Header always set Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://cmdmudanzas.com.ar"
```

## Checklist de Seguridad

### Antes de Deploy:
- [ ] Remover API key del código frontend
- [ ] Implementar backend proxy
- [ ] Configurar variables de entorno
- [ ] Implementar rate limiting
- [ ] Validar inputs
- [ ] Configurar CORS correctamente
- [ ] Habilitar HTTPS
- [ ] Verificar headers de seguridad

### Después de Deploy:
- [ ] Probar que el chatbot funciona
- [ ] Verificar logs de uso
- [ ] Configurar alertas
- [ ] Monitorear costos en Anthropic
- [ ] Documentar configuración
- [ ] Backup de configuración

### Mantenimiento Continuo:
- [ ] Revisar logs semanalmente
- [ ] Monitorear costos mensualmente
- [ ] Rotar API keys cada 3 meses
- [ ] Actualizar dependencias
- [ ] Revisar intentos de abuso

## Contacto en Caso de Incidente

Si detectas uso no autorizado de la API:

1. **Inmediatamente**:
   - Revocar la API key en console.anthropic.com
   - Generar nueva key
   - Actualizar variables de entorno
   - Redesplegar

2. **Investigar**:
   - Revisar logs de acceso
   - Identificar origen del problema
   - Implementar medidas adicionales

3. **Reportar**:
   - Contactar a Anthropic si hay cargos fraudulentos
   - Documentar el incidente

## Recursos Adicionales

- [Anthropic API Best Practices](https://docs.anthropic.com/claude/docs/api-best-practices)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Security Headers](https://securityheaders.com/)

---

**⚠️ ACCIÓN INMEDIATA REQUERIDA**: Antes de hacer el sitio público, implementar una de las soluciones de backend descritas arriba para proteger la API key.

**Última actualización**: Diciembre 2024
