import API from "./api";

const adminService = {
  getDashboard: async () => {
    const res = await API.get("/admin/dashboard");
    return res.data.stats;
  },

  getUsers: async () => {
    const res = await API.get("/admin/users");
    return res.data;
  },

  blockUser: (id) => API.put(`/admin/user/block/${id}`),
  unblockUser: (id) => API.put(`/admin/user/unblock/${id}`),

  getPendingVehicles: async () => {
    const res = await API.get("/vehicles/pending");
    return res.data.data;
  },

  approveVehicle: (id) => API.patch(`vehicles/approve/${id}`),
  rejectVehicle: (id) => API.patch(`/vehicles/reject/${id}`)
};

export default adminService;