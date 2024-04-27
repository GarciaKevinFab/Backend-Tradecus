import Tour from "../models/Tour.js";
import fs from "fs";
import { promisify } from "util";
import { uploadImages } from "../utils/cloudinary.js";

const unlinkAsync = promisify(fs.unlink);

// create new tour
export const createTour = async (req, res) => {
  try {
    // Obtener paths de las imágenes desde multer

    console.log("Datos de los Archivos:", req.files);
    const localPaths = req.files.map((file) => file.path);
    console.log("Paths de imágenes locales:", localPaths);

    // Subir imágenes a Cloudinary
    const cloudinaryData = await uploadImages(localPaths);

    console.log("Respuesta de Cloudinary:", cloudinaryData);

    // Eliminar imágenes locales después de subirlas a Cloudinary
    await Promise.all(localPaths.map(async (path) => await unlinkAsync(path)));

    const tourData = {
      ...req.body,
      photos: cloudinaryData,
    };

    // Crear instancia del modelo Tour
    const newTour = new Tour(tourData);

    // Guardar el nuevo tour en la base de datos
    const savedTour = await newTour.save();

    // Enviar respuesta al cliente
    res.status(201).json({
      success: true,
      tour: savedTour, // Cambiado de product a tour
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el tour" });
  }
};

//update tour
export const updateTour = async (req, res) => {
  const id = req.params.id;

  try {
    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Successfully updated",
      data: updatedTour,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to updated",
    });
  }
};

//delete tour
export const deleteTour = async (req, res) => {
  const id = req.params.id;
  try {
    await Tour.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Successfully deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to deleted",
    });
  }
};

//getSingle tour
export const getSingleTour = async (req, res) => {
  const id = req.params.id;
  try {
    const tour = await Tour.findById(id).populate("reviews");

    res.status(200).json({
      success: true,
      message: "Successful",
      data: tour,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

//getAll tour
export const getAllTour = async (req, res) => {
  try {
    const tours = await Tour.find({}).populate("reviews");
    res.status(200).json({
      success: true,
      count: tours.length,
      message: "Successful",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

//getr tour by search
export const getTourBySearch = async (req, res) => {
  //here 'i' means case sensitive
  const city = new RegExp(req.query.city, "i");
  const duration = parseInt(req.query.duration);
  const maxGroupSize = parseInt(req.query.maxGroupSize);

  try {
    //gte means greater than equal
    const tours = await Tour.find({
      city,
      duration: { $gte: duration },
      maxGroupSize: { $gte: maxGroupSize },
    }).populate("reviews");

    res.status(200).json({
      success: true,
      message: "Successful",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

//get featured tour
export const getFeaturedTour = async (req, res) => {
  try {
    const tours = await Tour.find({ featured: true })
      .populate("reviews")
      .limit(8);

    res.status(200).json({
      success: true,
      message: "Successful",
      data: tours,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};

//get tour counts
export const getTourCount = async (req, res) => {
  try {
    const tourCount = await Tour.estimatedDocumentCount();

    res.status(200).json({ success: true, data: tourCount });
  } catch (err) {
    res.status(500).json({ success: false, message: "failed to fetch" });
  }
};

//recien agregado
export const getTourById = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params._id);
    if (!tour) {
      return res
        .status(404)
        .json({ message: "No tour found with the given ID" });
    }
    res.json(tour);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};