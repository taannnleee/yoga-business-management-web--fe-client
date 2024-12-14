import axios from "axios";
import { API_URL } from "@/config/url"; // Assuming API_URL is used for base URL configuration

export async function registerUser(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string
) {
    const url = `${API_URL}/api/auth/register`; // Use API_URL to form the complete URL

    try {
        const response = await axios.post(url, {
            username,
            fullName: `${firstName} ${lastName}`, // Combine first and last name
            email,
            phone: phoneNumber, // Match the API field for phone number
            password,
            confirmPassword,
        });

        if (response.status !== 200) {
            throw new Error(`Error: ${response.statusText}`);
        }

        return response.data; // Return the data received from the API
    } catch (error: any) {
        console.error("Error:", error.message || error);
        throw error; // Re-throw the error to handle it in the calling function
    }
}
