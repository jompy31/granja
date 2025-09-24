import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Fetch all animals from json-server
export const fetchAnimals = async () => {
  try {
    console.log('Fetching animals from:', `${API_URL}/animals`);
    const response = await axios.get(`${API_URL}/animals`);
    console.log('Animals fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching animals:', error.message, error.response?.data);
    throw new Error('Failed to fetch animals. Please ensure json-server is running.');
  }
};

// Create a new animal
export const createAnimal = async (animal) => {
  try {
    // Force ID to string if present (prevents numeric ID issues)
    const animalToPost = {
      ...animal,
      id: String(animal.id || Date.now()),  // Fallback to timestamp if no ID, but as string
    };
    console.log('Creating animal:', animalToPost);
    const response = await axios.post(`${API_URL}/animals`, animalToPost);
    console.log('Animal created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating animal:', error.message, error.response?.data);
    throw new Error('Failed to create animal. Please check json-server.');
  }
};

// Update an existing animal by ID
export const updateAnimal = async (id, animal) => {
  try {
    const stringId = String(id);  // Ensure ID is string for URL and matching
    console.log(`Updating animal with ID ${stringId}:`, animal);
    const response = await axios.put(`${API_URL}/animals/${stringId}`, animal);
    console.log('Animal updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating animal:', error.message, error.response?.data);
    throw new Error('Failed to update animal. Ensure the animal ID exists.');
  }
};

// Delete an animal by ID
export const deleteAnimal = async (id) => {
  try {
    const stringId = String(id);  // Ensure ID is string for URL and matching
    console.log(`Deleting animal with ID ${stringId}`);
    await axios.delete(`${API_URL}/animals/${stringId}`);
    console.log(`Animal with ID ${stringId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting animal:', error.message, error.response?.data);
    throw new Error('Failed to delete animal. Please check json-server.');
  }
};

// Fetch all users from json-server
export const fetchUsers = async () => {
  try {
    console.log('Fetching users from:', `${API_URL}/users`);
    const response = await axios.get(`${API_URL}/users`);
    console.log('Users fetched successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.message, error.response?.data);
    throw new Error('Failed to fetch users. Please ensure json-server is running.');
  }
};

// Create a new user
export const createUser = async (user) => {
  try {
    const userToPost = {
      ...user,
      id: String(user.id || Date.now()),  // Fallback to timestamp if no ID, but as string
    };
    console.log('Creating user:', userToPost);
    const response = await axios.post(`${API_URL}/users`, userToPost);
    console.log('User created successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error.message, error.response?.data);
    throw new Error('Failed to create user. Please check json-server.');
  }
};

// Update an existing user by ID
export const updateUser = async (id, user) => {
  try {
    const stringId = String(id);  // Ensure ID is string for URL and matching
    console.log(`Updating user with ID ${stringId}:`, user);
    const response = await axios.put(`${API_URL}/users/${stringId}`, user);
    console.log('User updated successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating user:', error.message, error.response?.data);
    throw new Error('Failed to update user. Ensure the user ID exists.');
  }
};

// Delete a user by ID
export const deleteUser = async (id) => {
  try {
    const stringId = String(id);  // Ensure ID is string for URL and matching
    console.log(`Deleting user with ID ${stringId}`);
    await axios.delete(`${API_URL}/users/${stringId}`);
    console.log(`User with ID ${stringId} deleted successfully`);
  } catch (error) {
    console.error('Error deleting user:', error.message, error.response?.data);
    throw new Error('Failed to delete user. Please check json-server.');
  }
};