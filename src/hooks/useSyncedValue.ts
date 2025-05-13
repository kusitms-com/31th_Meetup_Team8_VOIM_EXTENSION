import { useEffect, useState } from "react";

export function useSyncedValue<T>(key: string, defaultValue: T): T {
    const [value, setValue] = useState<T>(defaultValue);

    useEffect(() => {
        chrome?.storage?.sync?.get([key], (result) => {
            if (result[key] !== undefined) {
                setValue(result[key]);
            }
        });
    }, [key]);

    useEffect(() => {
        const handleChange = (
            changes: { [key: string]: chrome.storage.StorageChange },
            areaName: string,
        ) => {
            if (areaName === "sync" && changes[key]) {
                setValue(changes[key].newValue);
            }
        };

        chrome?.storage?.onChanged?.addListener(handleChange);
        return () => {
            chrome?.storage?.onChanged?.removeListener(handleChange);
        };
    }, [key]);

    return value;
}
