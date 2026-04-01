import API from "./api";

const transactionService = {
  // POST: Create transaction (final purchase)
  createTransaction: async (data) => {
    const response = await API.post("/transaction/create", data);
    return response.data;
  },

  // GET: All transactions (Admin)
  getAllTransactions: async () => {
    const response = await API.get("/transaction");
    return response.data;
  },

  // GET: Buyer transaction history
  getBuyerTransactions: async () => {
    const response = await API.get("/transaction/my-history");
    return response.data;
  },

  // GET: Single transaction
  getTransactionById: async (id) => {
    const response = await API.get(`/transaction/${id}`);
    return response.data;
  },

  // PUT: Update status (Admin)
  updateTransaction: async (id, data) => {
    const response = await API.put(`/transaction/update/${id}`, data);
    return response.data;
  },

  // DELETE: Remove transaction
  deleteTransaction: async (id) => {
    const response = await API.delete(`/transaction/${id}`);
    return response.data;
  }
};

export default transactionService;