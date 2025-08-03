import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const API_BASE_URL = `${apiUrl}/api/League`;
//const API_BASE_URL = 'https://localhost:7055/api/League';

const apiClient = axios.create({
    baseURL: API_BASE_URL
  });

// Interceptor para requests
apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      //console.log("get token")
      //console.log(token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

// Interceptor para responses
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Manejar token expirado
      }
      return Promise.reject(error);
    }
);

export const leagueService = {
    ClandestinaMain: async (params) => {
      const response = await apiClient.post('/week-song-main-table', params);
      //console.log(response.data.result);
      return response.data.result;
    },
    AllLeague: async () => {
      const response = await apiClient.get();
      return response.data.result;
    },
    AllWeek: async (params) => {
      const response = await apiClient.post('/all-week',params);
      return response.data.result;
    },
    songWeek: async (params) => {
      const response = await apiClient.post('/songs-week', params)
      return response.data.result;
    },
    songWeekDetail: async(params) => {
      const response = await apiClient.post('/clandestina-week', params)
      return response.data.result;
    }
    // logout: async () => {
    //   const response = await apiClient.post('/auth/logout');
    //   return response.data;
    // }
  };