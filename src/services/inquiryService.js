import API from "./api";

const inquiryService = {
  // POST: Send a new inquiry (Buyer only)
  sendInquiry: async (inquiryData) => {
    const token = localStorage.getItem("token")
    const response = await API.post("/inquiries/send", inquiryData,{
      headers:{
        Authorization: `Bearer ${token}`,
      }
    });
    return response.data;
  },

  // GET: Fetch all inquiries (Admin only)
  getAllInquiries: async () => {
    const response = await API.get("/inquiries");
    return response.data;
  },

  // GET: Fetch inquiries for a specific buyer
  getInquiriesByBuyer: async (buyerId) => {
    const response = await API.get(`/inquiries/buyer/${buyerId}`);
    return response.data;
  },

  // GET: Fetch inquiries for a specific vehicle (Seller/Admin)
  getInquiriesByVehicle: async (vehicleId) => {
    const response = await API.get(`/inquiries/vehicle/${vehicleId}`);
    return response.data;
  },

  // GET: Fetch a single inquiry by ID
  getInquiryById: async (id) => {
    const response = await API.get(`/inquiries/${id}`);
    return response.data;
  },

  // PUT: Update inquiry (e.g., status or message)
  updateInquiry: async (id, updateData) => {
    const response = await API.put(`/inquiries/${id}`, updateData);
    return response.data;
  },

  // DELETE: Remove an inquiry
  deleteInquiry: async (id) => {
    const response = await API.delete(`/inquiries/${id}`);
    return response.data;
  },

  getBuyerInquiries: async () => {
  const response = await API.get("/inquiries/my-inquiries");
  return response.data.data || response.data;
},

getSellerInquiries: async () => {
    const response = await API.get("/inquiries/seller");
    return response.data.data || response.data;
  },

  replyToInquiry: async (id, message) => {
  const token = localStorage.getItem("token");

  const response = await API.put(
    `/inquiries/reply/${id}`,
    { message },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
},
};



export default inquiryService;