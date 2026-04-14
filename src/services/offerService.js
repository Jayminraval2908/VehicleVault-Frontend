import API from "./api";


const offerService = {
  // Matches OfferController.createOffer (POST /offer/create)
  createOffer: async (offerData) => {
    const response = await API.post("/offer/create", offerData);
    return response.data;
  },

  // Matches OfferController.getVehicleOffers (GET /offer/vehicle/:vehicleId)
  getVehicleOffers: async (vehicleId) => {
    const response = await API.get(`/offer/vehicle/${vehicleId}`);
    return response.data;
  },

  // Matches OfferController.getBuyerOffers (GET /offer/my-offers)
  // Ensure your backend route for this is router.get("/my-offers", ...)
  getBuyerOffers: async () => {
    const response = await API.get("/offer/my-offers");
    return response.data.data || response.data;
  },

  // Matches OfferController.getOfferById (GET /offer/:id)
  getOfferById: async (id) => {
    const response = await API.get(`/offer/${id}`);
    return response.data;
  },

  // Matches OfferController.deleteOffer (DELETE /offer/:id)
  deleteOffer: async (id) => {
    const response = await API.delete(`/offer/${id}`);
    return response.data;
  },

  // Added: Update Offer Status (Accept/Reject)
  updateOfferStatus: async (id, statusData) => {
    const response = await API.put(`/offer/${id}`, statusData);
    return response.data;
  },

  getSellerOffers: async () => {
  const response = await API.get("/offer/seller");
  return response.data.data || response.data;
},

confirmDeal: (id) => {
  return API.put(`/offer/confirm/${id}`);
},




};

export default offerService;