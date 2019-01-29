import { config } from '../config';
import axios from 'axios'

export default class ApiService {

  static getGameData() {
    return axios.get(this.getUrl('game-data'));
  }

  static login(userInfo) {
    return axios.post(this.getUrl('login'), userInfo);
  }

  static logout(userInfo) {
    return axios.post(this.getUrl('logout'), userInfo);
  }
  
  static getUrl(path) {
    return `${config.api}/${path}`;
  }
}