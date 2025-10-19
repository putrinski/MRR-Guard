// =========================================================
// MRR Guard: Servidor Web para Aplicación Embebida (Serverless)
// =========================================================
import express from 'express';
import Whop from "@whop/sdk";

const app = express();
const PORT = process.env.PORT || 3000;

// *********************************************************
//          CONFIGURACIÓN: LEE DESDE VARIABLES DE ENTORNO
// *********************************************************
// ESTO ES CLAVE para la seguridad y el despliegue en Render/Railway
const YOUR_APP_ID = process.env.WHOP_APP_ID; 
const YOUR_API_KEY = process.env.WHOP_API_KEY; 

const client = new Whop({
    appID: YOUR_APP_ID,
    apiKey: YOUR_API_KEY
});

// =========================================================
// RUTA PRINCIPAL DE TU APLICACIÓN EMBEBIDA
// =========================================================
// Whop cargará tu aplicación en esta ruta (por ejemplo, /auditor)
app.get('/auditor', async (req, res) => {
    
    // 1. EL SECRETO DE LA MULTI-COMPAÑÍA: Leer la URL
    // Whop inyecta el ID de la compañía en los parámetros de la URL (query parameters)
    const companyId = req.query.whop_company_id;
    
    if (!companyId) {
        // Si no se encuentra el ID, no fue cargado correctamente por Whop
        return res.status(400).send("Error: Esta aplicación debe ser cargada a través del dashboard de Whop.");
    }
    
    // 2. Ejecutar la Lógica de Negocio (El Contenido del Content Auditor)
    let auditResults = "<div><h2>MRR Guard Content Auditor</h2>";

    // Nota: El código de tu Content Auditor va aquí, usando 'companyId'.
    // Ahora, en lugar de imprimir con console.log, devuelves HTML/JSON al cliente (el Creador).
    try {
        // --- AQUÍ VA LA LÓGICA DE TU runContentAuditor(companyId) ---
        // Simulación de llamada a la API:
        const response = await client.courseLessonInteractions.list({
             companyId: companyId,
             first: 50
        });
        
        // Simulación de procesamiento de datos:
        const totalInteractions = response.data.length;

        auditResults += `<p>Auditoría para la Compañía ID: <strong>${companyId}</strong></p>`;
        auditResults += `<p>Total de Interacciones de Lecciones Encontradas: <strong>${totalInteractions}</strong></p>`;
        
        if (totalInteractions > 0) {
            // En un caso real, aquí procesarías los datos en una tabla o gráfico
            auditResults += `<h3>Resultados Clave:</h3><ul>
            <li>La aplicación está funcionando.</li>
            <li>Ahora procesamos estos datos para mostrarte tus "puntos de fuga" de contenido.</li>
            </ul>`;
        } else {
            auditResults += `<p>No se encontraron datos de interacción. ¿Tu curso tiene miembros?</p>`;
        }
        
    } catch (error) {
        console.error("Error al auditar contenido:", error.message);
        auditResults += `<p>❌ **ERROR:** No se pudieron cargar los datos. Asegúrate de que los permisos 'course_lesson_interaction:read' están activados. Mensaje: ${error.message}</p>`;
    }
    // -------------------------------------------------------------------
    
    auditResults += "</div>";
    
    // 3. Devolver el resultado (HTML) al Creador
    res.send(auditResults);
});

// Iniciar el Servidor
app.listen(PORT, () => {
    console.log(`MRR Guard Server running on port ${PORT}`);
});