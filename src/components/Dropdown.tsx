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
  value,
}: {
  dropdownValue: (data: string) => void;
  dropdownContent: { value: string; label: string }[];
  value?: string;
}) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState(
    dropdownContent[0]?.value || "",
  );

  const selectedValue = isControlled ? value || "" : internalValue;
  const selectedItem = dropdownContent.find(
    (item) => item.value === selectedValue,
  );

  const dropdownLabel = selectedItem?.label || "Select";

  const handleValueChange = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue);
    }
    dropdownValue(nextValue);
  };

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
        <DropdownMenuRadioGroup
          value={selectedValue}
          onValueChange={handleValueChange}
        >
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
