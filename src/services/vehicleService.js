import { header } from "framer-motion/m";
import API from "./api";

const vehicleService = {
  getAllVehicles: async () => {
    const response = await API.get("/vehicles");
    return response.data.data;
  },

  getVehicleById: async (id) => {
    const response = await API.get(`/vehicles/details/${id}`);
    return response.data;
  },

  getSellerVehicles: async () => {
    const response = await API.get("/vehicles/my-inventory",{
      headers:{
      "Cache-Control":"no-cache"
    }
    });
    
    return response.data;
  },

  addVehicle: async (vehicleData) => {
    const response = await API.post("/vehicles/add", vehicleData);
    return response.data;
  },

  updateVehicle: async (id, formData) => {
    const response = await API.put(`/vehicles/${id}`, formData);
    return response.data;
  },

  deleteVehicle: async (id) => {
    const response = await API.delete(`/vehicles/${id}`);
    return response.data;
  },

  publishVehicle: async (id) => {
  const response = await API.patch(`/vehicles/publish/${id}`);
  return response.data;
},
};

export default vehicleService;