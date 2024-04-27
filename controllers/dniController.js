import axios from 'axios';

const getDniData = async (req, res) => {
    const { dni } = req.params;
    const token = process.env.APISPERU_TOKEN;  // Asegúrate de tener tu token aquí

    try {
        const response = await axios.get(`https://dniruc.apisperu.com/api/v1/dni/${dni}?token=${token}`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los datos del DNI" });
    }
};

export { getDniData };
