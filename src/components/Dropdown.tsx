import * as React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function Dropdown({
  dropdownValue,
  dropdownContent,
}: {
  dropdownValue: (data: string) => void;
  dropdownContent: { value: string; label: string }[];
}) {
  const [position, setPosition] = React.useState(
    dropdownContent[0]?.value || ""
  );
  const [dropdownLabel, setDropdownLabel] = React.useState(
    dropdownContent[0]?.label || ""
  );
  // Update the label when the position changes
  React.useEffect(() => {
    const selectedItem = dropdownContent.find(
      (item) => item.value === position
    );
    if (selectedItem) {
      setDropdownLabel(selectedItem.label);
    }
  }, [position, dropdownContent]);

  // ✅ Update parent state only when position changes (NOT during render)
  React.useEffect(() => {
    dropdownValue(position);
  }, [position]); // Runs only when `position` changes

  // const capitalizeFirstLetter = (str: string) =>
  //   str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex gap-2 rounded-md shadow-md py-2 px-4">
          {dropdownLabel}
          <span className="flex items-center justify-center ">
            <ChevronDown size={16} className="" />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {dropdownContent.map((item) => (
            <DropdownMenuRadioItem value={item.value} key={item.label}>
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
