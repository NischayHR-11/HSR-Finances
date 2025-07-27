// API service for HSR-Finances backend communication

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to get headers
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Helper method to handle responses
  async handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      // Handle authentication errors
      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid, logout user
        this.logout();
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  }

  // Authentication Methods
  async register(userData) {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      });

      const data = await this.handleResponse(response);
      
      if (data.success && data.data.token) {
        this.token = data.data.token;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('lenderData', JSON.stringify(data.data.lender));
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async login(credentials) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      });

      const data = await this.handleResponse(response);
      
      if (data.success && data.data.token) {
        this.token = data.data.token;
        localStorage.setItem('authToken', this.token);
        localStorage.setItem('lenderData', JSON.stringify(data.data.lender));
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async getProfile() {
    try {
      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('lenderData');
  }

  // Lender Methods
  async updateProfile(updateData) {
    try {
      const response = await fetch(`${this.baseURL}/lender/profile`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(updateData),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  async getDashboardStats() {
    try {
      const response = await fetch(`${this.baseURL}/lender/dashboard`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  // Borrower Methods
  async getBorrowers(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          queryParams.append(key, params[key]);
        }
      });

      const url = `${this.baseURL}/borrowers${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get borrowers error:', error);
      throw error;
    }
  }

  async getBorrower(id) {
    try {
      const response = await fetch(`${this.baseURL}/borrowers/${id}`, {
        method: 'GET',
        headers: this.getHeaders(true),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Get borrower error:', error);
      throw error;
    }
  }

  async createBorrower(borrowerData) {
    try {
      const response = await fetch(`${this.baseURL}/borrowers`, {
        method: 'POST',
        headers: this.getHeaders(true),
        body: JSON.stringify(borrowerData),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Create borrower error:', error);
      throw error;
    }
  }

  async updateBorrower(id, updateData) {
    try {
      const response = await fetch(`${this.baseURL}/borrowers/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(true),
        body: JSON.stringify(updateData),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Update borrower error:', error);
      throw error;
    }
  }

  async deleteBorrower(id) {
    try {
      const response = await fetch(`${this.baseURL}/borrowers/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(true),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Delete borrower error:', error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  }

  // Helper method to check if user is authenticated
  isAuthenticated() {
    if (!this.token) {
      return false;
    }

    try {
      // Decode JWT token to check expiry
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        // Token expired, logout
        this.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      // Invalid token format, logout
      this.logout();
      return false;
    }
  }

  // Helper method to get stored lender data
  getLenderData() {
    const data = localStorage.getItem('lenderData');
    return data ? JSON.parse(data) : null;
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
