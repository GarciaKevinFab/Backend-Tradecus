import express from 'express';
import { createTour, deleteTour, getTourById , getAllTour, getFeaturedTour, getSingleTour, getTourBySearch, getTourCount, updateTour } from './../controllers/tourController.js';
import {upload } from '../utils/multer.js';
//import { verifyAdmin } from '../utils/verifyToken.js';

const router = express.Router();

// create new tour
router.post('/', upload.array('photos', 3), createTour);

//update tour
router.put('/:id',  updateTour);

//delete tour
router.delete('/:id',  deleteTour);

//get single tour
router.get('/:id', getSingleTour);

//get all tours
router.get('/', getAllTour);

//get tour by search
router.get('/search/getTourBySearch', getTourBySearch);
router.get('/search/getFeaturedTours', getFeaturedTour);
router.get('/search/getTourCount', getTourCount);

export default router;