// Batch fetch GEO
https://ip-api.com/docs/api:batch

Faucet
2. User can specify transaction MAX_FEE

LOW
2. create wiki for explorer
3. update the language pack
4. test:e2e test the defaultNode endpoint
- R&D Implement view merkle data in explorer. (View graphic)
- Faucet Node Status Check -> Create Github issue
- Status (for all) - 898C163DE3894948BDFF237DF9FC16482F38CB5C13A2B4F28984382074AC3E83 // Failure_Core_Insufficient_Balance

Todo
- Continue infrastructure rewrite ( call function in dispatch)
- add infra test

- deploy mosaic-faucet

- missing mosaicid in mosaic Detail
- statics tab


Flow
- fliter data object in `list-paging.json`
- private format class
- public function class
- one card 1 function object
- using Dataset to create Object
- use store manage

Top:
2. uncomfirm tab
4. mosaic display like box

action
deltacc
nonce

Discussion
- https://github.com/soonjing/catapultvote-decentralised



Complete task
- read https://github.com/nemtech/NIP/blob/master/NIPs/nip-0014.md


http://172.104.179.84:3001/stat/transactionPerBlock/limit/240/grouping/60

http://172.104.179.84:3001/stat/blockDifficulty/limit/240/grouping/60

http://172.104.179.84:3001/stat/transactionPerDay/days/:days

http://139.162.19.139:8090/statistics

db.getCollection('accounts').find({"account.importances": { $ne: [] }}).count()

db.getCollection('accounts')
.aggregate([
{
        "$match": {
            "account.importances": { $ne: [] }
        }npm
 },
 {
         "$project": {
             "_id": 0,
            "importances": { $arrayElemAt: [ "$account.importances.value", 0 ] },
        }
     },

 {
       "$group":
         {
           "_id": 0,
           "totalAmount": { $sum: "$importances" },
         }
     }
])