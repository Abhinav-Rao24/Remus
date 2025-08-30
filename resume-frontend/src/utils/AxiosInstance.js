import axios from 'axios';
import {BASE_URL} from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers:{
        'Content-type': 'application/json',
        Accept: 'application/json',
    },
});

// request interceptor
axiosInstance.interceptors.request.use(
    (config)=>{
        const accessToken = localStorage.getItem('token');
        if(accessToken){
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error)=>{
        return Promise.reject(error);
    }
);

//response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    // handle common errors globally
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                // redirect to login
                window.location.href = '/';
            } else if (error.response.status === 500) {
                console.error('request timeout. try again mf');
            }
        } else if (error.code === 'ECONNABORTED') {
            console.error('request timeout. try again mf');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;