// =========================================================
// Content Focus: Servidor Web para Aplicación Embebida
// Versión que corrige el nombre de la función para el SDK @whop/api.
// =========================================================
import 'dotenv/config'; 
import express from 'express';
import { WhopServerSdk } from "@whop/api";

const app = express();
const PORT = process.env.PORT || 3000;

// *********************************************************
//          CONFIGURACIÓN: LEE DESDE VARIABLES DE ENTORNO
// *********************************************************
const YOUR_APP_ID = process.env.WHOP_APP_ID; 
const YOUR_API_KEY = process.env.WHOP_API_KEY; 

// Inicialización del cliente con el SDK correcto
const client = new WhopServerSdk({
    appId: YOUR_APP_ID, 
    apiKey: YOUR_API_KEY
});

// Función para generar la salida HTML de la auditoría
function displayResults(companyId, interactionCount) {
    let auditResults = `
        <style>
            body { font-family: sans-serif; background-color: #1a1a1a; color: #f0f0f0; padding: 20px; }
            .container { max-width: 800px; margin: 0 auto; background: #222; padding: 30px; border-radius: 8px; }
            h2 { color: #4CAF50; border-bottom: 2px solid #444; padding-bottom: 10px; }
            strong { color: #fff; }
            .success { color: #76FF03; }
        </style>
        <div class="container">
            <h2>Content Focus: Course Retention Audit</h2>
            <p class="success">✅ API Connection: Success</p>
            <p>Auditing data for Company ID: <strong>${companyId}</strong></p>
            <hr>
    `;

    if (interactionCount > 0) {
        auditResults += `
            <h3>Analysis Summary:</h3>
            <p>The app found **${interactionCount}** lesson interactions! This confirms your course has active users.</p>
            <p>You now have the data needed to analyze which lessons are causing members to leave and fix them.</p>
            <p style="color: #4CAF50;">✅ Status: READY TO ANALYZE.</p>
        `;
    } else {
        auditResults += `<p>ℹ️ **INFO:** No course lesson interaction data found for this company. Please ensure you have an active course with members viewing content, or check your Whop settings.</p>`;
    }
    
    auditResults += "</div>";
    return auditResults;
}


// =========================================================
// RUTA PRINCIPAL DE TU APLICACIÓN EMBEBIDA (Lo que Whop carga)
// =========================================================
app.get('/auditor', async (req, res) => {
    
    const companyId = req.query.whop_company_id;
    
    if (!companyId) {
        return res.status(400).send("Error: Application must be loaded by Whop's dashboard (Missing whop_company_id parameter).");
    }
    
    try {
        // CORRECCIÓN FINAL: Usamos el nombre de función correcto: listCourseLessonInteractionsConnection
        const { listCourseLessonInteractionsConnection } = client;
        
        const response = await listCourseLessonInteractionsConnection({
             companyId: companyId,
             first: 50 
        });
        
        // Contamos las interacciones usando el campo 'data' (patrón de 'Connection')
        const interactionCount = response.data.length;

        // 3. Devolver el resultado (HTML) al Creador
        const htmlOutput = displayResults(companyId, interactionCount);
        res.send(htmlOutput);
        
    } catch (error) {
        console.error("Error al auditar contenido:", error.message);
        // Devuelve un mensaje de error legible al usuario
        res.status(500).send(`
            <div style="font-family: sans-serif; padding: 20px; background: #fdd; color: #a00;">
                <h2 style="color:red;">❌ ERROR CRÍTICO EN LA AUDITORÍA</h2>
                <p>Could not connect to Whop API or retrieve data. This usually indicates a problem with permissions or API keys.</p>
                <p><strong>REASON:</strong> ${error.message}</p>
                <p>Please check your application permissions on Whop (Developer Settings).</p>
            </div>
        `);
    }
});

// Iniciar el Servidor
app.listen(PORT, () => {
    console.log(`Content Focus Server running on port ${PORT}`);
});
