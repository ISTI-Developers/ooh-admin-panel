import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { Avatar, Dropdown } from "flowbite-react";

import logo from "~assets/scmi.png";

function Navbar() {
  const user = JSON.parse(Cookies.get("user"));
  const domain =
    window.location.hostname == "localhost" ? "localhost" : ".scmiph.com";

  //getting user initials for the user icon
  const getInitials = () => {
    const { first_name, last_name } = user;
    return first_name.substring(0, 1) + last_name.substring(0, 1);
  };

  //logout function
  const handleLogout = () => {
    Cookies.remove("user", {
      domain: domain,
    });
    Cookies.remove("role", {
      domain: domain,
    });
    Cookies.remove("token", {
      domain: domain,
    });
    window.location.href =
      domain == "localhost"
        ? "http://localhost:5173/login"
        : "https://ooh.scmiph.com/login";
  };
  function DropdownLabel() {
    return (
      <div className="flex items-center gap-2 rounded-full p-1 px-1.5 shadow">
        <Avatar placeholderInitials={getInitials()} rounded />
        <p className="text-sm font-semibold text-slate-600">{`${user.first_name} ${user.last_name}`}</p>
      </div>
    );
  }
  return (
    <header className="w-full bg-white shadow sticky top-0 z-[11]">
      <div className="flex items-center p-4 gap-8 justify-between">
        <img
          src={logo}
          alt="United Neon Advertising Inc."
          className="w-full max-w-[200px]"
        />
        <Link
          to="https://ooh.scmiph.com/"
          className="ml-auto border p-2.5 px-4 rounded-full hover:border-slate-100 hover:shadow hover:text-secondary transition-all duration-300"
        >
          Data Platform
        </Link>
        <Dropdown label={<DropdownLabel />} arrowIcon={false} inline>
          <Dropdown.Item className="justify-end" onClick={handleLogout}>
            Logout
          </Dropdown.Item>
        </Dropdown>
      </div>
    </header>
  );
}

export default Navbar;
