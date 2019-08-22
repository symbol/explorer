import axios from "axios";

const url = window.conf.api;

class DataService {
    //get home assets
    static getHomeData() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + 'homeInfo');
                const data = res.data;
                //  console.log(data);
                return resolve(data.data);
            } catch (err) {
                reject('request error homeinfo');
            }
        })
    }
    static getBlocks(page=1) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + 'blocks?page='+page);
                const data = res.data;
                //  console.log(data);
                return resolve(data.data);
            } catch (err) {
                reject('request error getBlocks');
            }
        })
    }
    static getBlockinfo(blockid) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + 'block/'+blockid);
                const data = res.data;
                //  console.log(data);
                return resolve(data.data);
            } catch (err) {
                reject('request error getBlockinfo');
            }
        })
    }
    static getTrxdetail(trx_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + 'transaction/'+trx_id);
                const data = res.data;
                //  console.log(data);
                return resolve(data.data);
            } catch (err) {
                reject('request error getBlockinfo');
            }
        })
    }

    static syncWs(update_id=null) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url + 'ws/'+update_id);
                const data = res.data;
                return resolve(data);
            } catch (err) {
                reject('request error syncWs ');
            }
        })
    }
}
export default DataService;