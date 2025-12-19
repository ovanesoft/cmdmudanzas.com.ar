/**
 * Vercel Serverless Function para el Chatbot
 * Este endpoint actúa como proxy entre el frontend y la API de Anthropic
 * protegiendo la API key en el servidor
 */

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Manejar preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Solo aceptar POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, systemPrompt, model = 'claude-3-5-sonnet-20241022', maxTokens = 1024 } = req.body;

        // Validar que tenemos mensajes
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ error: 'Messages array is required' });
        }

        // Validar API key
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            console.error('ANTHROPIC_API_KEY no está configurada en las variables de entorno');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        // Llamar a la API de Anthropic
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: maxTokens,
                system: systemPrompt,
                messages: messages
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error de Anthropic API:', errorData);
            return res.status(response.status).json({
                error: errorData.error?.message || 'Error calling Claude API'
            });
        }

        const data = await response.json();

        // Devolver la respuesta completa de Anthropic
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error en el endpoint de chat:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
}
