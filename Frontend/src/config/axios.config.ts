import axios from 'axios'
import router from '@/router'

//Constants
import { 
  APP_URL
} from '@/constants'


const axiosInstance = axios.create({
  baseURL: APP_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  //withCredentials: true
})

// Request interceptor
axiosInstance.interceptors.request.use(function (config) {
  const token = localStorage.getItem('authToken')
  if (token) config.headers['Authorization'] = `Bearer ${token}`
  return config
}, function (error) {
  return Promise.reject(error)
})

// Response interceptor
axiosInstance.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response) {
    //Error token expired
    if (error.response.status === 403) {
      router.push('/logout')
    }
  }
  return Promise.reject(error)
})

export default axiosInstance