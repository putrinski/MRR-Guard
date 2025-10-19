// =========================================================
// MRR Guard: Servidor Web para Aplicación Embebida (Serverless)
// =========================================================
import express from 'express';
import { WhopServerSdk } from '@whop/api';

const app = express();
const PORT = process.env.PORT || 3000;

// *********************************************************
//          CONFIGURACIÓN: LEE DESDE VARIABLES DE ENTORNO
// *********************************************************
const YOUR_APP_ID = process.env.WHOP_APP_ID;
const YOUR_API_KEY = process.env.WHOP_API_KEY;

const whop = new WhopServerSdk({
  appId: YOUR_APP_ID,
  apiKey: YOUR_API_KEY
});

// =========================================================
// RUTA PRINCIPAL DE TU APLICACIÓN EMBEBIDA
// =========================================================
app.get('/auditor', async (req, res) => {
  const companyId = req.query.whop_company_id;

  if (!companyId) {
    return res
      .status(400)
      .send("Error: Esta aplicación debe ser cargada desde el dashboard de Whop.");
  }

  let auditResults = "<div><h2>MRR Guard Content Auditor</h2>";

  try {
    // Ejemplo de llamada a la API usando el SDK actualizado
    const response = await whop.courseLessonInteractions.list({
      companyId: companyId,
      first: 50
    });

    const totalInteractions = response.data?.length || 0;

    auditResults += `<p>Auditoría para la Compañía ID: <strong>${companyId}</strong></p>`;
    auditResults += `<p>Total de Interacciones de Lecciones Encontradas: <strong>${totalInteractions}</strong></p>`;

    if (totalInteractions > 0) {
      auditResults += `<h3>Resultados Clave:</h3><ul>
        <li>La aplicación está funcionando correctamente ✅</li>
        <li>Estos datos pueden usarse para analizar puntos de fuga de contenido.</li>
      </ul>`;
    } else {
      auditResults += `<p>No se encontraron datos de interacción. ¿Tu curso tiene miembros activos?</p>`;
    }
  } catch (error) {
    console.error("Error al auditar contenido:", error);
    auditResults += `<p>❌ Error al cargar los datos. Revisa los permisos 'course_lesson_interaction:read'.</p>
    <p>Mensaje: ${error.message}</p>`;
  }

  auditResults += "</div>";
  res.send(auditResults);
});

// Iniciar el Servidor
app.listen(PORT, () => {
  console.log(`✅ MRR Guard Server running on port ${PORT}`);
});
