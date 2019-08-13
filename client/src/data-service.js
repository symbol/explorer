import axios from "axios";

const url ='http://localhost:3000/api/';

class DataService{
    //get home assets
    static getHomeData(){
        return new Promise (async (resolve,reject)=>{
            try{
               const res = await axios.get(url+'homeInfo');
               const data = res.data;
             //  console.log(data);
               return resolve(data);
            }catch(err){
                reject('request error homeinfo');
            }
        })
    }
}
export default DataService;