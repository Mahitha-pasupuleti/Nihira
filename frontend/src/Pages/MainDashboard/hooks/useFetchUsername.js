
export const fetchUsername = async (userId) => {
    try {
        const response = await fetch("http://localhost:8000/api/v1/communications/username", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
        });

        if (!response.ok) {
        throw new Error("Failed to fetch username");
        }

        const data = await response.json();
        return data.data.username; // Adjust if your backend response shape is different
    } catch (error) {
        console.error("❌ Error fetching username:", error);
        return null;
    }
};