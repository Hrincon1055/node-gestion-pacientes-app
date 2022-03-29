import express from "express";
import {
  autenticar,
  comprovarToken,
  confirmar,
  nuevoPassword,
  olvidePassword,
  perfil,
  registrar,
} from "../controllers/veterinarioController.js";
import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();
// RUTAS PUBLICAS
router.get("/confirmar/:token", confirmar);
router.post("/", registrar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
// router.get("/olvide-password/:token", comprovarToken);
// router.post("/olvide-password/:token", nuevoPassword);
router.route("/olvide-password/:token").get(comprovarToken).post(nuevoPassword);
// RUTAS PRIVADAS
router.get("/perfil", checkAuth, perfil);

export default router;
