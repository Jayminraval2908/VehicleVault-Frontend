import API from "./api";

const inspectionService = {
  // POST: Create a new report (Admin/Inspector only)
  createReport: async (reportData) => {
    const response = await API.post("/inspections/add", reportData);
    return response.data;
  },

  // GET: Fetch all reports for a specific vehicle (Public)
  getReportsByVehicle: async (vehicleId) => {
    const response = await API.get(`/inspections/vehicle/${vehicleId}`);
    return response.data;
  },

  // GET: Fetch a single report by ID
  getReportById: async (id) => {
    const response = await API.get(`/inspections/${id}`);
    return response.data;
  },

  // DELETE: Remove a report
  deleteReport: async (id) => {
    const response = await API.delete(`/inspections/${id}`);
    return response.data;
  }
};

export default inspectionService;