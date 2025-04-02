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
    dropdownContent[0]?.label || ""
  );
  dropdownValue(position);
  const capitalizeFirstLetter = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex gap-2 rounded-md shadow-md p-2">
          {capitalizeFirstLetter(position)}
          <span>
            <ChevronDown size={16} />
          </span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {dropdownContent.map((item) => (
            <DropdownMenuRadioItem value={item.value}>
              {item.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
