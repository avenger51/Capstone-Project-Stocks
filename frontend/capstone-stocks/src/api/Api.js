
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

class StocksApi {
  static token;

  static async request(endpoint, data = {}, method = 'get') {
    console.debug('API Call:', endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${StocksApi.token}` };
    const params = method === 'get' ? data : {};

    try {
      const response = await axios({ url, method, data, params, headers });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response);
      let message = error.response?.data?.error?.message || 'Unknown error occurred';
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async getCurrentUser() {
    try {
      const response = await this.request('user_details');
      return response;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
  
//not used:
  static async getStockInfo(tickerSymbol) {
    try {
      const response = await this.request(`get_stock_info/${tickerSymbol}`);
      return response.stockInfo;
    } catch (error) {
      console.error('Error fetching stock info:', error);
      throw error;
    }
  }
  
  static async login(data) {
    try {
      const response = await this.request('login', data, 'post');
      // access_token and user keys
      const { access_token } = response;
      // Handle response data 
      StocksApi.token = access_token;
      return response; 
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

static async signup(data) {
    try {
        const response = await this.request('signup', data, 'post');
        if (response.access_token) {
            this.token = response.access_token;
        }
        return response;
    } catch (error) {
        console.error('Signup failed:', error);
        throw error;
    }
}

}

export default StocksApi;
