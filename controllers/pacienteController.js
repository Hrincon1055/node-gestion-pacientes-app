import Paciente from "../models/Paciente.js";
const agregarPaciente = async (req, res) => {
  try {
    const paciente = new Paciente(req.body);
    paciente.veterinario = req.veterinario._id;
    const pacienteSave = await paciente.save();
    return res.status(200).json({
      susecces: true,
      pacienteSave,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
const obtenerPacientes = async (req, res) => {
  try {
    const pacientes = await Paciente.find()
      .where("veterinario")
      .equals(req.veterinario);
    return res.status(200).json({
      susecces: true,
      pacientes,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
const obtenerPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({
        susecces: false,
        msg: "Pacienye no encontrado.",
      });
    }
    if (
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.status(401).json({
        susecces: false,
        msg: "Accion no valida.",
      });
    }
    return res.status(200).json({
      susecces: true,
      paciente,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
const actualizarPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({
        susecces: false,
        msg: "Pacienye no encontrado.",
      });
    }
    if (
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.status(401).json({
        susecces: false,
        msg: "Accion no valida.",
      });
    }
    paciente.nombre = req.body.nombre || paciente.nombre;
    paciente.propietario = req.body.propietario || paciente.propietario;
    paciente.email = req.body.email || paciente.email;
    paciente.fecha = req.body.fecha || paciente.fecha;
    paciente.sintomas = req.body.sintomas || paciente.sintomas;
    const pacienteUpdate = await paciente.save();
    return res.status(200).json({
      susecces: true,
      pacienteUpdate,
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
const eliminarPaciente = async (req, res) => {
  const { id } = req.params;
  try {
    const paciente = await Paciente.findById(id);
    if (!paciente) {
      return res.status(404).json({
        susecces: false,
        msg: "Pacienye no encontrado.",
      });
    }
    if (
      paciente.veterinario._id.toString() !== req.veterinario._id.toString()
    ) {
      return res.status(401).json({
        susecces: false,
        msg: "Accion no valida.",
      });
    }
    await paciente.deleteOne();
    return res.status(200).json({
      susecces: true,
      msg: "Paciente eliminado correctamente.",
    });
  } catch (error) {
    console.log(`ERROR: ${error}`);
    return res.status(500).json({
      susecces: false,
      msg: "Ha ocurrido un error.",
    });
  }
};
export {
  agregarPaciente,
  obtenerPacientes,
  obtenerPaciente,
  actualizarPaciente,
  eliminarPaciente,
};
