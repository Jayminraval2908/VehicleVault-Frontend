import API from "./api";

const offerService = {
  // POST: Send a new price offer
  sendOffer: async (offerData) => {
    const response = await API.post("/transactions/create", offerData);
    return response.data;
  },

  // GET: Fetch offers for a specific buyer
  getBuyerOffers: async (buyerId) => {
    const response = await API.get(`/transactions/buyer/${buyerId}`);
    return response.data;
  },

  // GET: Fetch offer by ID
  getOfferById: async (id) => {
    const response = await API.get(`/transactions/${id}`);
    return response.data;
  },

  // DELETE: Cancel/Remove an offer
  deleteOffer: async (id) => {
    const response = await API.delete(`/transactions/${id}`);
    return response.data;
  }
};

export default offerService;