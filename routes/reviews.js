const express = require('express');
const router = express.Router();
const reviewsController = require('../controllers/reviewsController');
router.get('/', reviewsController.getAllReviews);
router.get('/getReviewByplaceId/:placeId', reviewsController.getReviewsByplaceId);

                 

router.post('/', reviewsController.addReview);

router.put('/:id', reviewsController.updateReview);

router.delete('/:id', reviewsController.deleteReview);

module.exports = router;
