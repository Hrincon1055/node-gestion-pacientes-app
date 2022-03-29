import express from "express";
import dotenv from "dotenv";
import cors from "cors";
// Mis componentes
import conectarDB from "./config/db.js";
import veterinarioRoutes from "./routes/veterinarioRoutes.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
// CONFIGURAR EXPRES
const app = express();
app.use(express.json());
// DOTENV
dotenv.config();
// CONECTAR DB
conectarDB();
// CORS
const dominiosPermitidos = [process.env.FRONTEND_URL];
const corsOptions = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por cors"));
    }
  },
};
// app.use(cors(corsOptions));
app.use(cors());
// RUTAS
app.use("/api/veterinarios", veterinarioRoutes);
app.use("/api/pacientes", pacienteRoutes);
// PORT
const PORT = process.env.PORT || 4000;
// CONFIGURAR PUERTO
app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});
