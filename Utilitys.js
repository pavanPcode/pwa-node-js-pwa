const axios = require("axios");

const getAddress = async (lat, lng) => {
    const apiKey = "AIzaSyBGSMJxdepK8OoIkXa0z9m2ckQccDZ_r4c"; // Replace with your actual API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const data = response.data;

        if (data.status === "OK") {
            const formattedAddress = data.results[0].formatted_address;
            console.log(formattedAddress)
            return { formattedAddress:formattedAddress, status: true };
        } else {
            return { formattedAddress: "Address not found", status: false };
        }
    } catch (error) {
        console.error("Error fetching address:", error.message);
        return { address: "Error fetching address", status: false };
    }
};

// // Example Usage
// (async () => {
//     const lat = 17.393027147598918; // Replace with actual latitude
//     const lng = 78.50922086976222; // Replace with actual longitude
//     const result = await getAddress(lat, lng);
//     console.log(result);
// })();
