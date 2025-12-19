import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export default function AccountDropdown() {
  const token = localStorage.getItem("token");
  const [email, setEmail] = useState("Please Login");

  useEffect(() => {
    if (token && typeof token === "string" && token.split(".").length === 3) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        setEmail(decoded?.email || "Please Login");
      } catch (error) {
        console.error("Invalid token:", error);
      }
    }
  }, [token]);

  const navigate = useNavigate();

  const handleAccount = () => {
    if (token) {
      localStorage.removeItem("token");
      navigate("/"); // or reload if you prefer
    } else {
      navigate("/login");
    }
  };
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button>
          <MdAccountCircle />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        className="bg-black text-white text-[14px] shadow-md rounded-md p-1 mt-1 w-30"
        sideOffset={4}
      >
        <DropdownMenu.Item
          className="px-3 py-2 hover:text-gray-200 rounded cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          Profile
          {token && (
            <p className="text-[10px] opacity-60 leading-tight whitespace-normal break-words mt-1">
              {email}
            </p>
          )}
        </DropdownMenu.Item>

        <DropdownMenu.Item
          className="px-3 py-2 hover:text-gray-200 rounded cursor-pointer"
          onClick={() => {
            navigate("/orders");
          }}
        >
          Orders
        </DropdownMenu.Item>
        <DropdownMenu.Item className="px-3 py-2 hover:text-gray-200 rounded cursor-pointer">
          Settings
        </DropdownMenu.Item>
        <DropdownMenu.Item
          className="px-3 py-2 hover:text-gray-200 rounded cursor-pointer"
          onClick={handleAccount}
        >
          {token ? "Logout" : "Login"}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
