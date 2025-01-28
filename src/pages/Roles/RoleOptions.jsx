import { Link } from "react-router-dom";
import { Button, TextInput } from "flowbite-react";
import { useRoles } from "~/contexts/RoleContext";
import { defaultTextTheme, mainButtonTheme } from "~/misc/themes";

//component for role options
function RoleOptions() {
  const { searchTerm } = useRoles();
  return (
    <div className="w-full flex items-center justify-between gap-4">
    {/* SEARCH FUNCTION */}
      <TextInput
        type="search"
        placeholder="Search"
        className="min-w-[300px]"
        theme={{
          ...defaultTextTheme,
          field: { input: { withAddon: { off: "rounded-lg" } } },
        }}
        onChange={(e) => {
          searchTerm(e.target.value);
        }}
      />
      {/* ADD ROLE BUTTON */}
      <Button
        as={Link}
        to="./add"
        color="transparent"
        className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all ml-auto"
        theme={mainButtonTheme}
      >
        Add Role
      </Button>
    </div>
  );
}

export default RoleOptions;
