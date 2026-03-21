import API from "./api";

const testDriveService = {
  // POST: Book a new test drive session
  bookTestDrive: async (data) => {
    const response = await API.post("/testdrives/book", data);
    return response.data;
  },

  // GET: Fetch test drives for a specific buyer
  getBuyerBookings: async (buyerId) => {
    const response = await API.get(`/testdrives/buyer/${buyerId}`);
    return response.data;
  },

  // GET: Fetch test drives for a specific vehicle (for Sellers)
  getVehicleBookings: async (vehicleId) => {
    const response = await API.get(`/testdrives/vehicle/${vehicleId}`);
    return response.data;
  },

  // DELETE: Cancel a booking
  cancelBooking: async (id) => {
    const response = await API.delete(`/testdrives/${id}`);
    return response.data;
  }
};

export default testDriveService;