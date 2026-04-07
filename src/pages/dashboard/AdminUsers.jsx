// import React, { useEffect, useState } from "react";
// import adminService from "../../services/adminService";
// import Loader from "../../components/common/Loader";
// import Card from "../../components/common/Card";
// import Button from "../../components/common/Button";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchUsers = async () => {
//     try {
//       const data = await adminService.getUsers();
//       setUsers(data);
//     } catch (err) {
//       console.error("User fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   const handleBlockToggle = async (user) => {
//     try {
//       if (user.status === "block") {
//         await adminService.unblockUser(user._id);
//       } else {
//         await adminService.blockUser(user._id);
//       }
//       fetchUsers(); // refresh list
//     } catch (err) {
//       console.error("Action failed:", err);
//     }
//   };

//   if (loading) return <Loader fullScreen />;

//   return (
//     <div className="p-6 text-white bg-[#0D0D0D] min-h-screen">
      
//       <h1 className="text-3xl font-bold mb-8 text-[#D4AF37]">
//         User Management
//       </h1>

//       <Card>
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
            
//             <thead className="border-b border-gray-700">
//               <tr className="text-gray-400 text-sm">
//                 <th className="p-3">Name</th>
//                 <th>Email</th>
//                 <th>Role</th>
//                 <th>Status</th>
//                 <th className="text-right">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {users.map((user) => (
//                 <tr
//                   key={user._id}
//                   className="border-b border-gray-800 hover:bg-[#111]"
//                 >
//                   <td className="p-3">
//                     {user.firstName} {user.lastName}
//                   </td>

//                   <td>{user.email}</td>

//                   <td className="capitalize">{user.role}</td>

//                   <td>
//                     <span
//                       className={`px-2 py-1 rounded text-xs ${
//                         user.status === "block"
//                           ? "bg-red-500/20 text-red-400"
//                           : "bg-green-500/20 text-green-400"
//                       }`}
//                     >
//                       {user.status}
//                     </span>
//                   </td>

//                   <td className="text-right">
//                     <Button
//                       onClick={() => handleBlockToggle(user)}
//                       className={
//                         user.status === "block"
//                           ? "bg-green-600"
//                           : "bg-red-600"
//                       }
//                     >
//                       {user.status === "block" ? "Unblock" : "Block"}
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AdminUsers;


// import React, { useEffect, useState } from "react";
// import adminService from "../../services/adminService";
// import Loader from "../../components/common/Loader";
// import Card from "../../components/common/Card";
// import Button from "../../components/common/Button";
// import { Users, ShieldCheck, UserCircle } from "lucide-react";
// import { toast } from "react-toastify";

// const AdminUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState("buyer"); // Default tab

//   const fetchUsers = async () => {
//     try {
//       const data = await adminService.getUsers();
//       setUsers(data || []);
//     } catch (err) {
//       console.error("User fetch error:", err);
//       toast.error("Failed to load members");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   // 🔥 Filtering logic based on active tab
//   const filteredUsers = users.filter((user) => user.role === activeTab);

//   const handleBlockToggle = async (user) => {
//     try {
//       if (user.status === "block") {
//         await adminService.unblockUser(user._id);
//         toast.success(`${user.firstName} Unblocked ✅`);
//       } else {
//         await adminService.blockUser(user._id);
//         toast.warning(`${user.firstName} Blocked 🚫`);
//       }
//       fetchUsers(); // Refresh list
//     } catch (err) {
//       console.error("Action failed:", err);
//       toast.error("Action failed");
//     }
//   };

//   if (loading) return <Loader fullScreen />;

//   return (
//     <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
//       <h1 className="text-3xl font-bold mb-8 text-[#D4AF37]">
//         Member <span className="text-white">Management</span>
//       </h1>

//       {/* --- TAB NAVIGATION --- */}
//       <div className="flex gap-2 mb-8 border-b border-gray-800">
//         <TabItem
//           active={activeTab === "buyer"}
//           onClick={() => setActiveTab("buyer")}
//           icon={<UserCircle size={18} />}
//           label="Buyers"
//           count={users.filter((u) => u.role === "buyer").length}
//         />
//         <TabItem
//           active={activeTab === "seller"}
//           onClick={() => setActiveTab("seller")}
//           icon={<Users size={18} />}
//           label="Sellers"
//           count={users.filter((u) => u.role === "seller").length}
//         />
//         <TabItem
//           active={activeTab === "admin"}
//           onClick={() => setActiveTab("admin")}
//           icon={<ShieldCheck size={18} />}
//           label="Admins"
//           count={users.filter((u) => u.role === "admin").length}
//         />
//       </div>

//       {/* --- TABLE SECTION --- */}
//       <Card className="p-0 overflow-hidden border-gray-800">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-[0.2em] border-b border-gray-800">
//                 <th className="p-4 font-black">Full Name</th>
//                 <th className="p-4 font-black">Email Address</th>
//                 <th className="p-4 font-black">Status</th>
//                 <th className="p-4 font-black text-right">Control</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredUsers.length > 0 ? (
//                 filteredUsers.map((user) => (
//                   <tr
//                     key={user._id}
//                     className="border-b border-gray-800/50 hover:bg-white/[0.02] transition-colors"
//                   >
//                     <td className="p-4 font-medium">
//                       {user.firstName} {user.lastName}
//                     </td>
//                     <td className="p-4 text-gray-400 text-sm">{user.email}</td>
//                     <td className="p-4">
//                       <span
//                         className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
//                           user.status === "block"
//                             ? "bg-red-500/10 text-red-500 border border-red-500/20"
//                             : "bg-green-500/10 text-green-500 border border-green-500/20"
//                         }`}
//                       >
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="p-4 text-right">
//                       <Button
//                         onClick={() => handleBlockToggle(user)}
//                         className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-lg transition-all ${
//                           user.status === "block"
//                             ? "bg-green-600 hover:bg-green-700 text-white"
//                             : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
//                         }`}
//                       >
//                         {user.status === "block" ? "Unblock User" : "Block User"}
//                       </Button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4" className="p-20 text-center text-gray-600 italic">
//                     No {activeTab} accounts currently registered in the vault.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// // --- Helper Tab Component ---
// const TabItem = ({ active, onClick, icon, label, count }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-3 px-6 py-4 transition-all duration-300 border-b-2 font-bold uppercase text-[11px] tracking-widest ${
//       active
//         ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
//         : "border-transparent text-gray-500 hover:text-white hover:bg-white/5"
//     }`}
//   >
//     {icon}
//     {label}
//     <span className={`ml-2 px-2 py-0.5 rounded-md text-[9px] ${
//       active ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-gray-400"
//     }`}>
//       {count}
//     </span>
//   </button>
// );

// export default AdminUsers;



import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import Loader from "../../components/common/Loader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { Users, ShieldCheck, UserCircle, CheckCircle, Ban } from "lucide-react";
import { toast } from "react-toastify";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState("buyer"); 
  const [statusFilter, setStatusFilter] = useState("active"); // "active" or "block"

  const fetchUsers = async () => {
    try {
      const data = await adminService.getUsers();
      setUsers(data || []);
    } catch (err) {
      console.error("User fetch error:", err);
      toast.error("Failed to load members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔥 DOUBLE FILTER: Filter by ROLE first, then by STATUS
  const filteredUsers = users.filter(
    (u) => u.role === activeRole && u.status === statusFilter
  );

  const handleBlockToggle = async (user) => {
    try {
      if (user.status === "block") {
        await adminService.unblockUser(user._id);
        toast.success(`${user.firstName} restored to the Vault ✅`);
      } else {
        await adminService.blockUser(user._id);
        toast.warning(`${user.firstName} has been restricted 🚫`);
      }
      fetchUsers(); 
    } catch (err) {
      toast.error("Action failed");
    }
  };

  if (loading) return <Loader fullScreen />;

  return (
    <div className="p-8 bg-[#0D0D0D] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8 text-[#D4AF37]">
        Member <span className="text-white">Management</span>
      </h1>

      {/* --- TOP LEVEL: ROLE TABS --- */}
      <div className="flex gap-2 mb-6 border-b border-gray-800">
        <RoleTab
          active={activeRole === "buyer"}
          onClick={() => setActiveRole("buyer")}
          icon={<UserCircle size={18} />}
          label="Buyers"
        />
        <RoleTab
          active={activeRole === "seller"}
          onClick={() => setActiveRole("seller")}
          icon={<Users size={18} />}
          label="Sellers"
        />
        <RoleTab
          active={activeRole === "admin"}
          onClick={() => setActiveRole("admin")}
          icon={<ShieldCheck size={18} />}
          label="Admins"
        />
      </div>

      {/* --- SECOND LEVEL: STATUS TABS (Active vs Blocked) --- */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setStatusFilter("active")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            statusFilter === "active"
              ? "bg-green-500/10 text-green-500 border border-green-500/20"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <CheckCircle size={14} /> 
          Active {activeRole}s ({users.filter(u => u.role === activeRole && u.status === 'active').length})
        </button>

        <button
          onClick={() => setStatusFilter("block")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            statusFilter === "block"
              ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Ban size={14} /> 
          Blocked {activeRole}s ({users.filter(u => u.role === activeRole && u.status === 'block').length})
        </button>
      </div>

      {/* --- DATA TABLE --- */}
      <Card className="p-0 overflow-hidden border-gray-800 bg-[#111]/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-[0.2em] border-b border-gray-800">
                <th className="p-5 font-black">Identity</th>
                <th className="p-5 font-black">Contact Info</th>
                <th className="p-5 font-black text-right">Vault Access</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b border-gray-800/30 hover:bg-white/[0.02] transition-colors">
                    <td className="p-5">
                      <p className="font-bold text-white uppercase tracking-tight">{user.firstName} {user.lastName}</p>
                      <p className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest">{user.role}</p>
                    </td>
                    <td className="p-5">
                      <p className="text-sm text-gray-300">{user.email}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{user.phone || "No Phone Provided"}</p>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => handleBlockToggle(user)}
                        className={`text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-lg transition-all active:scale-95 ${
                          user.status === "block"
                            ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20"
                        }`}
                      >
                        {user.status === "block" ? "Restore Access" : "Revoke Access"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="p-24 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <ShieldCheck size={40} />
                      <p className="text-sm italic tracking-widest uppercase">
                        No {statusFilter} {activeRole}s found
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- Helper Components ---
const RoleTab = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-3 px-8 py-5 transition-all duration-300 border-b-2 font-black uppercase text-[11px] tracking-[0.2em] ${
      active
        ? "border-[#D4AF37] text-[#D4AF37] bg-[#D4AF37]/5"
        : "border-transparent text-gray-600 hover:text-white"
    }`}
  >
    {icon} {label}
  </button>
);

export default AdminUsers;