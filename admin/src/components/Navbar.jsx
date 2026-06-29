import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
  LayoutDashboard,
  List,
  PlusSquare,
  Calendar,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/list", label: "Properties", icon: List },
    { path: "/add", label: "Add Property", icon: PlusSquare },
    { path: "/appointments", label: "Appointments", icon: Calendar },
  ];

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto h-16 px-6 flex justify-between items-center">

        <Link to="/dashboard" className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <Home className="w-5 h-5 text-white"/>
          </div>
          <div>
            <h1 className="font-bold text-xl">BuildEstate</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </Link>

        <nav className="hidden md:flex gap-2">
          {navItems.map((item)=>(
            <Link
              key={item.path}
              to={item.path}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                location.pathname===item.path
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-4 h-4"/>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block relative">
          <button
            onClick={()=>setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            <div className="bg-blue-600 p-2 rounded-full">
              <User className="w-4 h-4 text-white"/>
            </div>
            <span className="font-medium">Admin</span>
            <ChevronDown className="w-4 h-4"/>
          </button>

          {profileOpen && (
            <motion.div
              initial={{opacity:0,y:-10}}
              animate={{opacity:1,y:0}}
              className="absolute right-0 mt-2 bg-white shadow-lg rounded-xl w-48 py-2 border"
            >
              <div className="px-4 py-2 border-b">
                <p className="font-semibold">Administrator</p>
                <p className="text-xs text-gray-500">
                  Manage BuildEstate
                </p>
              </div>

              <button
                onClick={logout}
                className="w-full text-left px-4 py-3 flex items-center gap-2 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4"/>
                Logout
              </button>
            </motion.div>
          )}
        </div>

        <button
          className="md:hidden"
          onClick={()=>setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X/> : <Menu/>}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white border-t">
          {navItems.map((item)=>(
            <Link
              key={item.path}
              to={item.path}
              onClick={()=>setMenuOpen(false)}
              className="flex items-center gap-3 px-6 py-4 border-b"
            >
              <item.icon className="w-5 h-5"/>
              {item.label}
            </Link>
          ))}

          <button
            onClick={logout}
            className="w-full text-left px-6 py-4 text-red-600 flex items-center gap-3"
          >
            <LogOut className="w-5 h-5"/>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
