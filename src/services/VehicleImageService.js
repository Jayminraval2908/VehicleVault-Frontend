import API from "./api";

const vehicleImageService = {
  // GET: All images
  getAllImages: async () => {
    const response = await API.get("/vehicleimages");
    return response.data;
  },

  // GET: Images by vehicle
  getImagesByVehicle: async (vehicleId) => {
    const response = await API.get(`/vehicleimages/vehicle/${vehicleId}`);
    return response.data;
  },

  // POST: Upload single image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await API.post("/vehicleimages/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // POST: Upload multiple images
  uploadMultipleImages: async (files) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await API.post("/vehicleimages/upload-multiple", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // PUT: Update image
  updateImage: async (id, file) => {
    const formData = new FormData();
    formData.append("image", file);

    const response = await API.put(`/vehicleimages/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },

  // DELETE: Delete image
  deleteImage: async (id) => {
    const response = await API.delete(`/vehicleimages/${id}`);
    return response.data;
  },
};

export default vehicleImageService;