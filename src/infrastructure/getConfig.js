import axios from 'axios';
const CONFIG_ROUTE = 'http://46.101.151.173/config/peers-api.json';


const getConfig = () => {
    return new Promise((resolve, reject) => {
        let config = {
            nodes: []
        };

        let url = process.env.NODE_ENV === 'production' 
            ? CONFIG_ROUTE
            : process.env.BASE_URL + CONFIG_ROUTE;

        axios.get(CONFIG_ROUTE)
            .then( res => {
                let data = res.data;
                if(data && Array.isArray(data.nodes))
                    config = { ...data };
                resolve(config);
            })
            .catch( err => reject(Error("Config file is not provided")))

        // import('../config/peers-api.json') 
        //     .then( res => console.log("Config", res))
        //     .catch( err => console.error(err))
    })
    
}


export default getConfig