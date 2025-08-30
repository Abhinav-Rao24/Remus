import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { UserContext } from '@/context/UserContext';
import { Plus } from 'lucide-react';

const TopNav = () => {
  const navigate = useNavigate();
  const { user, clearUser } = useContext(UserContext);

  return (
    <div className="w-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-md relative">
      <div className="container mx-auto px-6 py-4 overflow-visible">
        <div className="flex justify-between items-center">
          {/* Logo on the far left */}
          <div 
            className="text-2xl font-bold text-white hover:text-black transition-colors cursor-pointer"
            onClick={() => navigate('/')}
          >
            REMUS
          </div>

          <div className="flex-1 flex justify-between items-center ml-16">
            {/* Navigation Menu */}
            <div className="flex items-center gap-8">
              <button
                className="text-lg font-medium text-white hover:text-amber-100 transition-colors px-4 py-2 rounded-md"
                onClick={() => navigate('/dashboard')}
              >
                Home
              </button>

              <button
                className="text-lg font-medium flex items-center gap-1 text-white hover:text-amber-100 transition-colors px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-700"
                onClick={() => navigate('/create-resume')}
              >
                Create Project
                <Plus size={20} />
              </button>
            </div>

            {/* User Avatar with right-aligned dropdown */}
            <div className="relative z-50">
              <DropdownMenu>
                <DropdownMenuTrigger className="outline-none">
                  <Avatar className="cursor-pointer w-12 h-12 border-2 border-white">
                    <AvatarImage src={user?.profileImageUrl} alt={user?.name} />
                    <AvatarFallback className="bg-amber-600 text-white text-lg">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64" align="end">
                  <div className="p-2">
                    <div className="text-sm font-medium truncate">{user?.name || 'User'}</div>
                    <div className="text-sm text-gray-500 mt-1 truncate">{user?.email}</div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600 cursor-pointer"
                    onClick={() => {
                      clearUser();
                      navigate('/');
                    }}
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
