import { useEffect, useState } from "react";

export default function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedValue(value) // change debounce value after a delay of 300ms
        }, delay)

        return () => clearTimeout(timeout);
    }, [value, delay])

    return debouncedValue;
}