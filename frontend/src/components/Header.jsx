import React, { useState } from "react";
import { IoHome } from "react-icons/io5";
import { BsFillPeopleFill } from "react-icons/bs";
import { FaShoppingBag, FaSearch } from "react-icons/fa";
import { AiFillMessage } from "react-icons/ai";
import { IoMdNotifications } from "react-icons/io";
import { Link } from "react-router-dom";
import Profile from "./Profile";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b shadow-sm h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 md:px-10 relative">
      
      <div className="flex items-center space-x-3 sm:space-x-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 34 34"
          className="w-7 h-7 sm:w-8 sm:h-8"
        >
          <g>
            <rect width="34" height="34" fill="#0A66C2" rx="4" />
            <path
              d="M8.1,13H12v13H8.1V13Zm1.95-6.48a2.25,2.25,0,1,1,0,4.5,2.25,2.25,0,0,1,0-4.5"
              fill="#fff"
            />
            <path
              d="M14,13h3.7v1.78h.05a4.06,4.06,0,0,1,3.64-2c3.89,0,4.6,2.56,4.6,5.88V26H22V19.77c0-1.49,0-3.41-2.08-3.41s-2.39,1.62-2.39,3.29V26H14Z"
              fill="#fff"
            />
          </g>
        </svg>

        

        <div className="relative flex items-center w-28 sm:w-48 md:w-64">
          <FaSearch className="absolute left-3 text-gray-500 text-sm" />
          <input
            type="text"
            placeholder="Search"
            className="pl-9 pr-3 py-1.5 rounded-md border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
          />
        </div>
      </div>

      

      <div className="flex items-center space-x-2">
        
        {/* <nav className="hidden sm:flex space-x-4 md:space-x-6 text-gray-600"></nav> */}
        <nav className="hidden sm:flex space-x-8 md:space-x-14 text-gray-600">
          <Link to="/home" className="flex flex-col items-center hover:text-blue-600">
            <IoHome size={20} />
            <span className="text-xs">Home</span>
          </Link>
          <Link to="/network" className="flex flex-col items-center hover:text-blue-600">
            <BsFillPeopleFill size={20} />
            <span className="text-xs">Network</span>
          </Link>
          <Link to="/jobs" className="flex flex-col items-center hover:text-blue-600">
            <FaShoppingBag size={20} />
            <span className="text-xs">Jobs</span>
          </Link>
          <Link to="/messaging" className="flex flex-col items-center hover:text-blue-600">
            <AiFillMessage size={20} />
            <span className="text-xs">Messaging</span>
          </Link>
          <Link to="/notifications" className="flex flex-col items-center hover:text-blue-600">
            <IoMdNotifications size={20} />
            <span className="text-xs">Notifications</span>
          </Link>
        </nav>
        

        

        <button
          className="sm:hidden text-2xl text-gray-700"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FiX /> : <FiMenu />}
        </button>

        
        <div>
          <Profile />
        </div>
      </div>




      
      {isOpen && (
        <div className="absolute top-14 left-0 w-64 h-screen bg-white shadow-lg z-50 p-4 flex flex-col space-y-6 sm:hidden">
          <nav className="flex flex-col space-y-4 text-gray-700">
            <Link to="/home" className="flex items-center gap-3 hover:text-blue-600">
              <IoHome size={20} /> <span>Home</span>
            </Link>
            <Link to="/network" className="flex items-center gap-3 hover:text-blue-600">
              <BsFillPeopleFill size={20} /> <span>Network</span>
            </Link>
            <Link to="/jobs" className="flex items-center gap-3 hover:text-blue-600">
              <FaShoppingBag size={20} /> <span>Jobs</span>
            </Link>
            <Link to="/messaging" className="flex items-center gap-3 hover:text-blue-600">
              <AiFillMessage size={20} /> <span>Messaging</span>
            </Link>
            <Link to="/notifications" className="flex items-center gap-3 hover:text-blue-600">
              <IoMdNotifications size={20} /> <span>Notifications</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
