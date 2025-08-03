import axios from 'axios';
const apiUrl = process.env.REACT_APP_API_URL;
//const API_BASE_URL = 'https://localhost:7055/api/WeekSong';
const API_BASE_URL = `${apiUrl}/api/WeekSong`;
const apiClient = axios.create({
    baseURL: API_BASE_URL
  });

// Interceptor para requests
apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      console.log("get token")
      console.log(token);
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

export const WeekSongServices = {
    getByWeek: async (params) => {
      const response = await apiClient.post('get-by-week', params);
      //console.log(response.data.result);
      return response.data.result;
    },
    add: async (params) => {
      const response = await apiClient.post('add-songs-week', params);
      //console.log(response.data.result);
      return response.data.result;
    },
    getUsers: async () => {
      const response = await apiClient.get('users');
      //console.log(response.data.result);
      return response.data.result;
    },
    setUserSongLevels: async (params) => {
      const response = await apiClient.post('set-user-week-songs',params);
      //console.log(response.data.result);
      return response.data;
    },
    getUserStatusWeek: async (week) => {
      const response = await apiClient.get(`/${week}`);
      //console.log(response.data.result);
      return response.data.result;
    },
    getSongStatusWeek: async (idUser, week) => {
      const response = await apiClient.get(`songs/${idUser}/${week}`);
      //console.log(response.data.result);
      return response.data.result;
    },
    setScoreUser: async (values) => {
      const response = await apiClient.post("add-score", values);

      return response.data;
    }
};