import API from "./api";

const vehicleService = {
  // GET: All vehicles
  getAllVehicles: async () => {
    const response = await API.get("/vehicles");
    return response.data;
  },

  // GET: Single vehicle by ID
  getVehicleById: async (id) => {
    if (id === "add") return; // Stop the execution if the ID is literally "add"
    const response = await axios.get(`${API_URL}/vehicles/${id}`);
    return response.data;
},

  // POST: Create a new listing (Seller/Admin)
  addVehicle: async (vehicleData) => {
    const response = await API.post("/vehicles/add", vehicleData);
    return response.data;
  },

  // PUT: Update existing vehicle
  updateVehicle: async (id, updateData) => {
    const response = await API.put(`/vehicles/update/${id}`, updateData);
    return response.data;
  },

  // DELETE: Remove a vehicle
  deleteVehicle: async (id) => {
    const response = await API.delete(`/vehicles/delete/${id}`);
    return response.data;
  }
};

export default vehicleService;