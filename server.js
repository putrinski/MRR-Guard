try {
    const response = await client.courseLessonInteractions.list({
        companyId: companyId,
        first: 50 
    });

    const interactionCount = response.data?.length || 0;

    const htmlOutput = displayResults(companyId, interactionCount);
    res.send(htmlOutput);

} catch (error) {
    console.error("Error al auditar contenido:", error.message);
    res.status(500).send(`
        <div style="font-family: sans-serif; padding: 20px; background: #fdd; color: #a00;">
            <h2 style="color:red;">❌ ERROR CRÍTICO EN LA AUDITORÍA</h2>
            <p>Could not connect to Whop API or retrieve data. This usually indicates a problem with permissions or
