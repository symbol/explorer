import axios from 'axios';

export class PayoutService {
    static async getPayouts(nodeId, pageNumber = 1) {
        try {
            const response = (await axios.get(`http://api-01.ap-southeast-1.0.10.0.x.symboldev.network:3000/transactions/confirmed?type=16724&pageSize=10&pageNumber=${pageNumber}&order=desc`))
            .data
            const payouts = response.data;
            console.log(response)
            
            return payouts;
        }
        catch(e) {
            return []
        }
    }
}