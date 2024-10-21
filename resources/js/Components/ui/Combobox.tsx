import React, { useState } from "react";
import { Combobox as HeadlessCombobox } from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";

interface ComboboxProps {
    items: { value: string; label: string }[];
    placeholder: string;
    onSelect: (value: string) => void;
    className?: string;
    disabled?: boolean;
    required?: boolean;
    value?: string | number;
    onChange?: (value: string) => void;
}

export const Combobox: React.FC<ComboboxProps> = ({
    items,
    placeholder,
    onSelect,
    value,
    className,
    disabled,
    onChange,
    required,
}) => {
    const [selected, setSelected] = useState<{
        value: string | number;
        label: string;
    } | null>(null);
    const [query, setQuery] = useState("");

    const filteredItems =
        query === ""
            ? items
            : items.filter((item) =>
                  item.label
                      .toLowerCase()
                      .replace(/\s+/g, "")
                      .includes(query.toLowerCase().replace(/\s+/g, ""))
              );

    return (
        <HeadlessCombobox
            as="div"
            value={selected}
            onChange={(item) => {
                if (item) {
                    setSelected(item);
                    onSelect(item.value.toString());
                    onChange?.(item.value.toString());
                }
            }}
            disabled={disabled}
            className={`relative ${className}`}
        >
            <div className="relative">
                <HeadlessCombobox.Input
                    className="w-full rounded-md border border-input bg-transparent py-2 pl-3 pr-10 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    displayValue={(item: { label: string } | null) =>
                        item?.label ?? ""
                    }
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder={placeholder}
                />
                <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronsUpDown
                        className="h-4 w-4 opacity-50"
                        aria-hidden="true"
                    />
                </HeadlessCombobox.Button>
            </div>
            <HeadlessCombobox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-popover py-1 text-base shadow-md ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {filteredItems.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                        Nothing found.
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <HeadlessCombobox.Option
                            key={item.value}
                            className={({ active }) =>
                                `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                        ? "bg-accent text-accent-foreground"
                                        : "text-popover-foreground"
                                }`
                            }
                            value={item}
                        >
                            {({ selected, active }) => (
                                <>
                                    <span
                                        className={`block truncate ${
                                            selected
                                                ? "font-medium"
                                                : "font-normal"
                                        }`}
                                    >
                                        {item.label}
                                    </span>
                                    {selected ? (
                                        <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                active
                                                    ? "text-white"
                                                    : "text-primary"
                                            }`}
                                        >
                                            <Check
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </span>
                                    ) : null}
                                </>
                            )}
                        </HeadlessCombobox.Option>
                    ))
                )}
            </HeadlessCombobox.Options>
        </HeadlessCombobox>
    );
};
