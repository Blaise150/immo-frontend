const API_URL = 'https://immo-backend-production-deb8.up.railway.app/api';

export async function fetchUsers() {
  const response = await fetch(`${API_URL}/users/`);
  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }
  return response.json();
}