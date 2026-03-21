import API from "./api";

const inquiryService = {
  // POST: Send a new inquiry (Buyer only)
  sendInquiry: async (inquiryData) => {
    const response = await API.post("/inquiry/send", inquiryData);
    return response.data;
  },

  // GET: Fetch all inquiries (Admin only)
  getAllInquiries: async () => {
    const response = await API.get("/inquiry");
    return response.data;
  },

  // GET: Fetch inquiries for a specific buyer
  getInquiriesByBuyer: async (buyerId) => {
    const response = await API.get(`/inquiry/buyer/${buyerId}`);
    return response.data;
  },

  // GET: Fetch inquiries for a specific vehicle (Seller/Admin)
  getInquiriesByVehicle: async (vehicleId) => {
    const response = await API.get(`/inquiry/vehicle/${vehicleId}`);
    return response.data;
  },

  // GET: Fetch a single inquiry by ID
  getInquiryById: async (id) => {
    const response = await API.get(`/inquiry/${id}`);
    return response.data;
  },

  // PUT: Update inquiry (e.g., status or message)
  updateInquiry: async (id, updateData) => {
    const response = await API.put(`/inquiry/${id}`, updateData);
    return response.data;
  },

  // DELETE: Remove an inquiry
  deleteInquiry: async (id) => {
    const response = await API.delete(`/inquiry/${id}`);
    return response.data;
  },
};

export default inquiryService;