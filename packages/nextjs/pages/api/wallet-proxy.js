// pages/api/proxy.js
export default async function handler(req, res) {
    const cpf = req.query.cpf;
    const apiUrl = `https://bacen-api.vercel.app/wallets/cpf/${cpf}`;
  
    try {
      const apiResponse = await fetch(apiUrl);
      const data = await apiResponse.json();
      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching data from external API:", error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  