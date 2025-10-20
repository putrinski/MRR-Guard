// =========================================================
// MRR Guard: Servidor Web para Aplicación Embebida (Serverless)
// =========================================================
import express from "express";
import "dotenv/config";
import { WhopServerSdk } from "@whop/api";

const app = express();
const PORT = process.env.PORT || 3000;

// *********************************************************
//          CONFIGURACIÓN: VARIABLES DE ENTORNO
// *********************************************************
const YOUR_APP_ID = process.env.WHOP_APP_ID;
const YOUR_API_KEY = process.env.WHOP_API_KEY;

if (!YOUR_APP_ID || !YOUR_API_KEY) {
  console.warn("⚠️  Falta configurar WHOP_APP_ID o WHOP_API_KEY en el archivo .env");
}

const client = new WhopServerSdk({
  appId: YOUR_APP_ID,
  apiKey: YOUR_API_KEY,
});

// =========================================================
// RUTA PRINCIPAL DE TU APLICACIÓN EMBEBIDA
// =========================================================
app.get("/auditor", async (req, res) => {
  const companyId = req.query.whop_company_id;

  if (!companyId) {
    return res
      .status(400)
      .send("Error: Esta aplicación debe ser cargada a través del dashboard de Whop.");
  }

  let auditResults = "<div><h2>MRR Guard Content Auditor</h2>";

  try {
    // Llamada de ejemplo a la API Whop
    const response = await client.courseLessonInteractions.list({
      companyId: companyId,
      first: 50,
    });

    const totalInteractions = response.data?.length || 0;

    auditResults += `<p>Auditoría para la Compañía ID: <strong>${companyId}</strong></p>`;
    auditResults += `<p>Total de Interacciones de Lecciones Encontradas: <strong>${totalInteractions}</strong></p>`;

    if (totalInteractions > 0) {
      auditResults += `<h3>Resultados Clave:</h3><ul>
        <li>✅ La aplicación está funcionando correctamente.</li>
        <li>Procesa los datos para detectar puntos de fuga de contenido.</li>
      </ul>`;
    } else {
      auditResults += `<p>No se encontraron datos de interacción. ¿Tu curso tiene miembros activos?</p>`;
    }
  } catch (error) {
    console.error("Error al auditar contenido:", error);
    auditResults += `<p>❌ Error al cargar datos. Verifica los permisos 'course_lesson_interaction:read'.</p>
    <p>Mensaje: ${error.message}</p>`;
  }

  auditResults += "</div>";
  res.send(auditResults);
});

// =========================================================
// INICIAR SERVIDOR
// =========================================================
app.listen(PORT, () => {
  console.log(`✅ MRR Guard Server corriendo en el puerto ${PORT}`);
});
