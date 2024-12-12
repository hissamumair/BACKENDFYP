const express = require("express");
const {
  createGadget,
  getAllGadgets,
  getGadgetById,
  deleteGadgetById,
  updateGadgetById,
  getGadgetByPlaceId,
} = require("../controllers/gadgetController");

const router = express.Router();

// Gadget Routes
router.post("/create", createGadget); // Create a new gadget
router.get("/all", getAllGadgets); // Get all gadgets
router.get("/:id", getGadgetById); // Get a gadget by ID
router.put('/:id/update', updateGadgetById);   
router.get('/getGadgetByPlaceId/:placeId', getGadgetByPlaceId);                  
router.delete("/:id/delete", deleteGadgetById); // Delete a gadget by ID

module.exports = router;
