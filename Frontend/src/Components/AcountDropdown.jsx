import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { MdAccountCircle } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function AccountDropdown() {
    const Token = localStorage.getItem("token");
    const email = Token ? JSON.parse(atob(Token.split(".")[1])).email : "Please Login";
    const navigate = useNavigate();

    const handleAcount = () => {
        if (Token) {
          localStorage.removeItem("token");
          window.location.reload();
        } else {
          window.location.href = "/login";
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
          onClick={() => {
            navigate("/profile");
          }}
        >
          Profile
          <br />
          <p className="text-[8px]">({email})</p>
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
          onClick={handleAcount}
        >
          {Token ? "Logout" : "Login"}
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
