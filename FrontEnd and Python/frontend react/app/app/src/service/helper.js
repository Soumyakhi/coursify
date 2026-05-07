import axios from 'axios';
import { getUserData, getTeacherData,getRecruiterData } from '../localstorage'; 

//export const BASE_URL = 'https://nebulose-yachty-yaritza.ngrok-free.dev';
export const BASE_URL = 'http://localhost:8080';
export const publicAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        "ngrok-skip-browser-warning": "true"
    }
});

// ==========================================
// STUDENT PRIVATE AXIOS (Uses user_data)
// ==========================================
export const privateAxios = axios.create({
    baseURL: BASE_URL,
    headers:{
        'Content-Type':'application/json',
        "ngrok-skip-browser-warning": "true"
    }
});

privateAxios.interceptors.request.use(
    async config => {
        const token = await getUserData("token");
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
export const teacherPrivateAxios = axios.create({
    baseURL: BASE_URL,
    headers:{
        'Content-Type':'application/json',
        "ngrok-skip-browser-warning": "true"
    }
});

teacherPrivateAxios.interceptors.request.use(
    async config => {
        const token = await getTeacherData("token"); 
        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);
export const recruiterPrivateAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        "ngrok-skip-browser-warning": "true"
    }
});
 
recruiterPrivateAxios.interceptors.request.use(
    async config => {
        const token = await getRecruiterData("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);