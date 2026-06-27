import { getApiDocs } from '@/lib/swagger';

/**
 * @swagger
 * /api:
 *   get:
 *     tags:
 *       - Dokumentation
 *     summary: OpenAPI Spezifikation abrufen
 *     description: Gibt die vollständige OpenAPI 3.0 JSON-Spezifikation der EpiLog API zurück
 *     responses:
 *       200:
 *         description: OpenAPI Spezifikation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export async function GET() {
    return Response.json(getApiDocs());
}
