import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
const registrar = async (req, res) => {
  const { email, nombre } = req.body;
  try {
    // USUARIOS DUPLICADOS
    const existeUsuario = await Veterinario.findOne({ email });
    if (existeUsuario) {
      const error = new Error("Usuario ya esta registrado.");
      return res.status(400).json({
        susecces: false,
        msg: error.message,
      });
    }
    const veterinario = new Veterinario(req.body);
    const veterinarioSave = await veterinario.save();
    // ENVIAR EMAIL
    emailRegistro({ email, nombre, token: veterinarioSave.token });
    return res.status(200).json({
      susecces: true,
      veterinarioSave,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  try {
    const usuarioConfirmar = await Veterinario.findOne({ token });
    if (!usuarioConfirmar) {
      const error = new Error("Token no válido.");
      return res.status(404).json({
        susecces: false,
        msg: error.message,
      });
    }
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    return res.status(200).json({
      susecces: true,
      msg: "Usuario confirmado Correctamente.",
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
const autenticar = async (req, res) => {
  const { email, password } = req.body;
  try {
    // COMPROBAR SI EL USUARIO EXISTE.
    const usuario = await Veterinario.findOne({ email });
    if (!usuario) {
      const error = new Error("El usuario no existe.");
      return res.status(403).json({
        susecces: false,
        msg: error.message,
      });
    }
    // COMPROBAR SI EL USUARIO ESTA CONFIRMADO.
    if (!usuario.confirmado) {
      const error = new Error("Tu cuenta no esta confirmada.");
      return res.status(403).json({
        susecces: false,
        msg: error.message,
      });
    }
    // REVISAR PASSWORD
    if (await usuario.comprobarPassword(password)) {
      // AUTENTICAR
      return res.status(200).json({
        susecces: true,
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id),
      });
    } else {
      const error = new Error("El password es incorrecto.");
      return res.status(403).json({
        susecces: false,
        msg: error.message,
      });
    }
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
const perfil = (req, res) => {
  const { veterinario } = req;
  return res.status(200).json({
    susecces: true,
    veterinario,
  });
};
const olvidePassword = async (req, res) => {
  const { email } = req.body;
  try {
    const existeVeterinario = await Veterinario.findOne({ email });
    if (!existeVeterinario) {
      const error = new Error("El usuario no existe.");
      return res.status(400).json({
        susecces: false,
        msg: error.message,
      });
    }
    existeVeterinario.token = generarId();
    await existeVeterinario.save();
    // ENVIAR EMAIL
    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });
    return res.status(200).json({
      susecces: true,
      msg: "Se ha enviado un email con las instrucciones.",
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};

const comprovarToken = async (req, res) => {
  const { token } = req.params;
  try {
    const tokenValido = await Veterinario.findOne({ token });
    if (!tokenValido) {
      const error = new Error("Token no valido.");
      return res.status(400).json({
        susecces: false,
        msg: error.message,
      });
    }
    return res.status(200).json({
      susecces: true,
      msg: "Token valido y el usuario existe.",
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const veterinario = await Veterinario.findOne({ token });
    if (!veterinario) {
      const error = new Error("Hubo un error.");
      return res.status(400).json({
        susecces: false,
        msg: error.message,
      });
    }
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    return res.status(200).json({
      susecces: true,
      msg: "Password modificado correctamente.",
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
const actualizarPerfil = async (req, res) => {
  try {
    const veterinario = await Veterinario.findById(req.params.id);
    if (!veterinario) {
      const error = new Error("Usuario no encontrado.");
      return res.status(400).json({
        susecces: false,
        msg: error.message,
      });
    }
    const { email } = req.body;
    if (veterinario.email !== req.body.email) {
      const existeEmail = await Veterinario.findOne({ email });
      if (existeEmail) {
        const error = new Error("El email ya esta en uso.");
        return res.status(400).json({
          susecces: false,
          msg: error.message,
        });
      }
    }
    veterinario.nombre = req.body.nombre;
    veterinario.email = req.body.email;
    veterinario.telefono = req.body.telefono;
    veterinario.web = req.body.web;
    const veterinarioActulaizado = await veterinario.save();
    return res.status(200).json({
      susecces: true,
      veterinarioActulaizado,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
// EXPORT FUNCTIONS
export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprovarToken,
  nuevoPassword,
  actualizarPerfil,
};
