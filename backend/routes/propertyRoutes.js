import express from 'express';

console.log("✅ propertyRoutes file loaded");

import {
  searchProperties,
  getLocationTrends
} from '../controller/propertyController.js';

const router = express.Router();

router.get('/test', (req, res) => {
  res.json({
    success: true,
    message: 'Property routes working'
  });
});

router.post('/search', searchProperties);

router.get('/:city/trends', getLocationTrends);

export default router;