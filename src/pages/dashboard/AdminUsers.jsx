import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error("User fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleBlockToggle = async (user) => {
    try {
      if (user.status === "block") {
        await adminService.unblockUser(user._id);
      } else {
        await adminService.blockUser(user._id);
      }
      fetchUsers(); // refresh list
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-6 text-white bg-[#0D0D0D] min-h-screen">
      
      <h1 className="text-3xl font-bold mb-8 text-[#D4AF37]">
        User Management
      </h1>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            
            <thead className="border-b border-gray-700">
              <tr className="text-gray-400 text-sm">
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-800 hover:bg-[#111]"
                >
                  <td className="p-3">
                    {user.firstName} {user.lastName}
                  </td>

                  <td>{user.email}</td>

                  <td className="capitalize">{user.role}</td>

                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.status === "block"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>

                  <td className="text-right">
                    <Button
                      onClick={() => handleBlockToggle(user)}
                      className={
                        user.status === "block"
                          ? "bg-green-600"
                          : "bg-red-600"
                      }
                    >
                      {user.status === "block" ? "Unblock" : "Block"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminUsers;