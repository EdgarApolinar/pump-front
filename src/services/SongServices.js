import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL;
const API_BASE_URL = `${apiUrl}/api/Song`;
//const API_BASE_URL = 'https://localhost:7055/api/Song';
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
      if(error.response){
      
        if (error.response?.status === 401) {
          // Manejar token expirado
        }
        // if(error.response?.status === 400){
        //   console.log(error.response.data);
        //   return Promise.reject(error.response.data)
        // }

        const errorData = error.response.data || error.response;

         if (!errorData.message) {
        errorData.message = `Error ${error.response.status}: ${error.response.statusText}`;
      }

      // Rechazar con el error procesado
      return Promise.reject(errorData);

      }

      const networkError = {
        message: 'Error de conexión',
        originalError: error
      };
    
      return Promise.reject(networkError);
    }
);

export const songServices = {
    Add: async (params) => {
      const response = await apiClient.post('', params);
      //console.log(response.data.result);
      return response.data.result;
    },
    get: async (params) => {
      const response = await apiClient.post('/get-all', params);
      //console.log(response.data.result);
      return response.data.result;
    },
    getSongLevels: async (idSong) => {
      const response = await apiClient.get(`/${idSong}`);
      //console.log(response.data.result);
      return response.data.result;
    },
    getSongLevelsSelect: async (idSong) => {
      const response = await apiClient.get(`/select/${idSong}`);
      //console.log(response.data.result);
      return response.data.result;
    },
    setSongLevels: async (params) => {
      const response = await apiClient.post('/add-levels', params);
      //console.log(response.data.result);
      return response.data.result;
    },
};