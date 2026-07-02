// import { useState, useEffect } from "react";
// import { User, Mail, MapPin, Edit2, Check } from "lucide-react";
// import { motion } from "framer-motion";
// import { useAuth } from "../context/AuthContext";

// const Profile = () => {
//   const { user: authUser } = useAuth();

//   const [isEditing, setIsEditing] = useState(false);
  
//   // Local state initialized with context data or default fallbacks
//   const [profileData, setProfileData] = useState({
//     name: "Ashwini Bhat M",
//     email: "ashbhat821@gmail.com",
//     location: "Mysuru, Karnataka",
//   });

//   // Keep local state in sync if the authentication context user finishes loading later
//   useEffect(() => {
//     if (authUser) {
//       setProfileData({
//         name: authUser.name || "Ashwini Bhat M",
//         email: authUser.email || "ashbhat821@gmail.com",
//         location: authUser.location || "Mysuru, Karnataka",
//       });
//     }
//   }, [authUser]);

//   const handleSave = (e) => {
//     if (e) e.preventDefault();
//     setIsEditing(false);
//     // Note: To make this update the dropdown up top, you would call an API 
//     // endpoint here and refresh your global AuthContext state!
//   };

//   const getInitials = (nameString) => {
//     if (!nameString) return "U";
//     return nameString
//       .trim()
//       .split(/\s+/)
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 pt-28 pb-20 px-4 sm:px-6 lg:px-16">
//       <div className="max-w-4xl mx-auto">
        
//         {/* --- HEADER PROFILE CARD --- */}
//         <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 lg:p-8 border border-slate-100 relative overflow-hidden mb-8">
//           <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-[0.05]" />
          
//           <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pt-6">
//             <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
//               {/* Avatar Box linked dynamically to local profileData */}
//               <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[3px] shadow-xl shadow-blue-500/10">
//                 <div className="w-full h-full rounded-[13px] bg-white flex items-center justify-center font-extrabold text-2xl text-slate-800">
//                   <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
//                     {getInitials(profileData.name)}
//                   </span>
//                 </div>
//               </div>
              
//               {/* Header Title linked dynamically to local profileData */}
//               <div>
//                 <h1 className="text-2xl font-black text-slate-900 tracking-tight">
//                   {profileData.name}
//                 </h1>
//                 <p className="text-slate-500 text-sm font-semibold mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start">
//                   <MapPin size={15} className="text-blue-500" /> 
//                   {profileData.location}
//                 </p>
//               </div>
//             </div>

//             {/* Edit / Save Button */}
//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               onClick={isEditing ? handleSave : () => setIsEditing(true)}
//               className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
//                 isEditing
//                   ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
//                   : "bg-slate-900 hover:bg-slate-800 text-white shadow-slate-200"
//               }`}
//             >
//               {isEditing ? (
//                 <>
//                   <Check size={16} /> Save Changes
//                 </>
//               ) : (
//                 <>
//                   <Edit2 size={16} /> Edit Profile
//                 </>
//               )}
//             </motion.button>
//           </div>
//         </div>

//         {/* --- TAB NAVIGATION (Clean & Minimal) --- */}
//         <div className="flex border-b border-slate-200 gap-8 mb-8 px-2">
//           <div className="pb-3.5 font-bold text-sm tracking-wider uppercase relative text-blue-600">
//             Account Overview
//             <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
//           </div>
//         </div>

//         {/* --- MAIN PROFILE FORM PANEL --- */}
//         <motion.div
//           initial={{ opacity: 0, y: 12 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.2 }}
//           className="w-full"
//         >
//           <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 lg:p-8 shadow-xl shadow-slate-100 border border-slate-100/80 flex flex-col gap-6">
//             <div>
//               <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-1">Personal Details</h3>
//               <p className="text-xs text-slate-400 font-medium">Manage your contact information details</p>
//             </div>
            
//             <div className="h-px bg-slate-100" />

//             {/* Name Input Field */}
//             <div>
//               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={profileData.name}
//                   onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
//                   className="w-full mt-2 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-semibold transition-all"
//                   required
//                 />
//               ) : (
//                 <div className="flex items-center gap-3 mt-2 px-4 py-3 bg-slate-50/60 rounded-xl text-slate-700 font-semibold border border-transparent">
//                   <User size={18} className="text-slate-400" /> {profileData.name}
//                 </div>
//               )}
//             </div>

//             {/* Email Input Field */}
//             <div>
//               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
//               {isEditing ? (
//                 <input
//                   type="email"
//                   value={profileData.email}
//                   onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
//                   className="w-full mt-2 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-semibold transition-all"
//                   required
//                 />
//               ) : (
//                 <div className="flex items-center gap-3 mt-2 px-4 py-3 bg-slate-50/60 rounded-xl text-slate-700 font-semibold border border-transparent truncate">
//                   <Mail size={18} className="text-slate-400" /> {profileData.email}
//                 </div>
//               )}
//             </div>

//             {/* Location Input Field */}
//             <div>
//               <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</label>
//               {isEditing ? (
//                 <input
//                   type="text"
//                   value={profileData.location}
//                   onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
//                   className="w-full mt-2 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-slate-800 font-semibold transition-all"
//                 />
//               ) : (
//                 <div className="flex items-center gap-3 mt-2 px-4 py-3 bg-slate-50/60 rounded-xl text-slate-700 font-semibold border border-transparent">
//                   <MapPin size={18} className="text-slate-400" /> {profileData.location}
//                 </div>
//               )}
//             </div>
//           </form>
//         </motion.div>

//       </div>
//     </div>
//   );
// };

// export default Profile;


// trial for UI changes

import { useState, useEffect } from "react"; 
import { User, Mail, MapPin, Edit2, Check } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import profileBg from "../assets/images/profile.png";

const Profile = () => {
  const { user: authUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: "Ashwini Bhat M",
    email: "ashbhat821@gmail.com",
    location: "Mysuru, Karnataka",
  });

  useEffect(() => {
    if (authUser) {
      setProfileData({
        name: authUser.name || "Shambhavi",
        email: authUser.email || "kulkarnishambhavi31@gmail.com",
        location: authUser.location || "Mysuru, Karnataka",
      });
    }
  }, [authUser]);

  const handleSave = (e) => {
    if (e) e.preventDefault();
    setIsEditing(false);
  };

  const getInitials = (nameString) => {
    if (!nameString) return "U";
    return nameString
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-16 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url(${profileBg})`,
      }}
    >
      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* --- HEADER PROFILE CARD (Light Glassmorphism with Slate-Black Border) --- */}
        <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-slate-900/40 p-6 lg:p-8 relative overflow-hidden mb-8">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-[0.05]" />
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 pt-6">
            <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
              {/* Avatar Box */}
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-[3px] shadow-lg shadow-blue-500/10">
                <div className="w-full h-full rounded-[13px] bg-white flex items-center justify-center font-extrabold text-2xl text-slate-800">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    {getInitials(profileData.name)}
                  </span>
                </div>
              </div>
              
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {profileData.name}
                </h1>
                <p className="text-slate-600 text-sm font-semibold mt-1.5 flex items-center gap-1.5 justify-center sm:justify-start">
                  <MapPin size={15} className="text-blue-600" /> 
                  {profileData.location}
                </p>
              </div>
            </div>

            {/* Edit / Save Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={isEditing ? handleSave : () => setIsEditing(true)}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 shadow-md ${
                isEditing
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
              }`}
            >
              {isEditing ? (
                <>
                  <Check size={16} /> Save Changes
                </>
              ) : (
                <>
                  <Edit2 size={16} /> Edit Profile
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* --- TAB NAVIGATION --- */}
        <div className="flex border-b border-slate-300 gap-8 mb-8 px-2">
          <div className="pb-3.5 font-bold text-sm tracking-wider uppercase relative text-blue-600">
            Account Overview
            <div className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-full" />
          </div>
        </div>

        {/* --- MAIN PROFILE FORM PANEL (Light Glassmorphism with Slate-Black Border) --- */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full"
        >
          <form
            onSubmit={handleSave}
            className="bg-white/70 backdrop-blur-md rounded-3xl p-6 lg:p-8 shadow-xl border border-slate-900/40 flex flex-col gap-6"
          >
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 tracking-wider uppercase mb-1">Personal Details</h3>
              <p className="text-xs text-slate-500 font-medium">Manage your contact information details</p>
            </div>
            
            <div className="h-px bg-slate-300" />

            {/* Name Input Field */}
            <div>
              <label className="text-xs font-bold text-black-800 uppercase tracking-widest">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="w-full mt-2 px-4 py-3 bg-white/90 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-800 font-semibold transition-all shadow-sm"
                  required
                />
              ) : (
                <div className="flex items-center gap-3 mt-2 px-4 py-3 bg-white/50 border border-slate-300 rounded-xl text-slate-700 font-semibold shadow-sm">
                  <User size={18} className="text-black-800" /> {profileData.name}
                </div>
              )}
            </div>

            {/* Email Input Field */}
            <div>
              <label className="text-xs font-bold text-black-800 uppercase tracking-widest">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full mt-2 px-4 py-3 bg-white/90 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-800 font-semibold transition-all shadow-sm"
                  required
                />
              ) : (
                <div className="flex items-center gap-3 mt-2 px-4 py-3 bg-white/50 border border-slate-300 rounded-xl text-slate-700 font-semibold shadow-sm truncate">
                  <Mail size={18} className="text-slate-400" /> {profileData.email}
                </div>
              )}
            </div>

            {/* Location Input Field */}
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                  className="w-full mt-2 px-4 py-3 bg-white/90 border border-slate-300 rounded-xl outline-none focus:border-blue-500 text-slate-800 font-semibold transition-all shadow-sm"
                />
              ) : (
                <div className="flex items-center gap-3 mt-2 px-4 py-3 bg-white/50 border border-slate-300 rounded-xl text-slate-700 font-semibold shadow-sm">
                  <MapPin size={18} className="text-slate-400" /> {profileData.location}
                </div>
              )}
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;