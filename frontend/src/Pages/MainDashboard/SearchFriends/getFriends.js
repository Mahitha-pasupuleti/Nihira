
export const getFriends = async (searchString, token) => {
  try {
        if (!searchString) return [];  // return empty array if no input

        const response = await fetch("http://localhost:8000/api/v1/communications/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: token,
            },
            body: JSON.stringify({ searchString }),
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        // console.log(data.userList[1])
        return data.data.userList || []; // Assuming your backend returns { users: [...] }
  } catch (error) {
        console.error("Error loading friend list:", error);
        return [];
  }
};
