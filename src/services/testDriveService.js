import API from "./api";

const testDriveService = {
  bookTestDrive: async (data) => {
    const response = await API.post("/testdrives/book", data);
    return response.data;
  },

  getAllBookings: async () => {
    const response = await API.get("/testdrives");
    return response.data;
  },

  getBuyerBookings: async () => {
    const response = await API.get("/testdrives/my-bookings");
    return response.data.data || response.data;
  },

  getBookingById: async (id) => {
    const response = await API.get(`/testdrives/details/${id}`);
    return response.data;
  },

  updateStatus: async (id, data) => {
    const response = await API.put(`/testdrives/status/${id}`, data);
    return response.data;
  },

  cancelBooking: async (id) => {
    const response = await API.delete(`/testdrives/${id}`);
    return response.data;
  }
};

export default testDriveService;