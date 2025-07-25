import axios from 'axios';

const getCeeData = async (req, res) => {
    const { number } = req.params;
    const token = process.env.FACTILIZA_TOKEN;

    try {
        const response = await axios.get(`https://api.factiliza.com/v1/cee/info/${number}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        console.log("✅ Datos recibidos de Factiliza:", response.data);
        res.json(response.data); // 👈 mantener estructura completa

    } catch (error) {
        console.error("❌ Error al consultar Factiliza:", error.response?.data || error.message);
        res.status(500).json({
            error: "Error al obtener los datos del CEE",
            detail: error.response?.data || error.message
        });
    }
};

export { getCeeData };
