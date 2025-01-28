import { Link } from "react-router-dom";
import { Button, TextInput } from "flowbite-react";
import { defaultTextTheme, mainButtonTheme } from "~/misc/themes";
import { useSites } from "~/contexts/SiteContext";

//component for role options
function SiteOptions() {
  const { searchTerm } = useSites();
  return (
    <div className="w-full flex items-center justify-between gap-4 pl-2">
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
      <Button
        as={Link}
        to="./add"
        color="transparent"
        className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all ml-auto"
        theme={mainButtonTheme}
      >
        Add Site
      </Button>
      <Button
        as={Link}
        to="./batch-add"
        color="transparent"
        className="text-white bg-secondary-500 hover:bg-secondary rounded-md transition-all"
        theme={mainButtonTheme}
      >
        Batch Upload Site
      </Button>
    </div>
  );
}

export default SiteOptions;
