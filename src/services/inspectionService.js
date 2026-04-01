import API from "./api";

const inspectionService = {
  createReport: async (reportData) => {
    const response = await API.post("/inspection/add", reportData);
    return response.data;
  },

  getReportsByVehicle: async (vehicleId) => {
    const response = await API.get(`/inspection/vehicle/${vehicleId}`);
    return response.data;
  },

  getReportById: async (id) => {
    const response = await API.get(`/inspection/${id}`);
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await API.delete(`/inspection/${id}`);
    return response.data;
  }
};

export default inspectionService;