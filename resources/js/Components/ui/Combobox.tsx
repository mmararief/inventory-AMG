import React, { useState } from "react";
import { Combobox as HeadlessCombobox } from "@headlessui/react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

interface ComboboxProps {
    items: { value: string; label: string }[];
    placeholder: string;
    onSelect: (value: string) => void;
    className?: string;
    disabled?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
    items,
    placeholder,
    onSelect,
    className,
    disabled,
}) => {
    const [selected, setSelected] = useState(items[0]);
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
        <div className="relative ">
            <HeadlessCombobox
                value={selected}
                onChange={(item) => {
                    if (item) {
                        setSelected(item);
                        onSelect(item.value);
                    }
                }}
                disabled={disabled}
            >
                <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-opacity-75 focus-within:ring-offset-2 focus-within:ring-offset-indigo-300 transition-all duration-300 ease-in-out">
                    <HeadlessCombobox.Input
                        className="w-full border-none py-3 pl-4 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 placeholder-gray-400"
                        displayValue={(item: { label: string }) => item.label}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder={placeholder}
                    />
                    <HeadlessCombobox.Button className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <ChevronsUpDownIcon
                            className="h-5 w-5 text-gray-400 hover:text-indigo-500 transition-colors duration-200"
                            aria-hidden="true"
                        />
                    </HeadlessCombobox.Button>
                </div>
                <HeadlessCombobox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {filteredItems.length === 0 && query !== "" ? (
                        <div className="relative cursor-default select-none py-3 px-4 text-gray-700">
                            Nothing found.
                        </div>
                    ) : (
                        filteredItems.map((item) => (
                            <HeadlessCombobox.Option
                                key={item.value}
                                className={({ active }) =>
                                    `relative cursor-pointer select-none py-3 pl-10 pr-4 ${
                                        active
                                            ? "bg-indigo-600 text-white"
                                            : "text-gray-900"
                                    }`
                                }
                                value={item}
                            >
                                {({ selected, active }) => (
                                    <>
                                        <span
                                            className={`block truncate ${
                                                selected
                                                    ? "font-semibold"
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
                                                        : "text-indigo-600"
                                                }`}
                                            >
                                                <CheckIcon
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
        </div>
    );
};
