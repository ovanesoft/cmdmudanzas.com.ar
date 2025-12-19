// Vercel Serverless Function para manejar el chatbot de Claude
export default async function handler(req, res) {
    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const { messages } = req.body;

        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Obtener API key desde variable de entorno
        const apiKey = process.env.CLAUDE_API_KEY;

        if (!apiKey) {
            console.error('CLAUDE_API_KEY not configured');
            return res.status(500).json({ error: 'API key not configured' });
        }

        // Llamar a la API de Claude
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 1024,
                system: `Eres un asistente virtual de CMD Mudanzas, una empresa de mudanzas profesional en Argentina.

Tu objetivo es ayudar a los clientes con:
- Información sobre servicios de mudanzas (locales, nacionales, internacionales, empresariales)
- Presupuestos y cotizaciones
- Zonas de cobertura (todas las provincias argentinas)
- Servicios adicionales (embalaje, limpieza, pintura, elevación con soga, transporte de vehículos)
- Datos de contacto y horarios

Información de contacto:
- Teléfono/WhatsApp: +54 9 11 2714-2006
- Email: consultas@cmdmudanzas.com
- Dirección: Antártida Argentina 7155, Martín Coronado, Buenos Aires

Sé amable, profesional y directo. Invita a los clientes a solicitar presupuestos sin compromiso.`,
                messages: messages
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Claude API error:', errorData);
            return res.status(response.status).json({
                error: 'Error calling Claude API',
                details: errorData
            });
        }

        const data = await response.json();

        // Devolver la respuesta de Claude
        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
