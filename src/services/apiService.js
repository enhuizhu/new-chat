import { config } from '../config';
import axios from 'axios'

export default class ApiService {
  static getUserData() {
    return axios.get(this.getUrl('user/1234'));
  }
  
  static getUrl(path) {
    return `${config.api}/${path}`;
  }
}