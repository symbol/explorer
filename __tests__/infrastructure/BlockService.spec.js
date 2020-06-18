import { BlockService } from '../../src/infrastructure'
import networkConfig from '../config/network.conf.json'
import { constructHttp } from '../utils'

beforeAll(async() => {
    jest.setTimeout(10000)
    await constructHttp()
});

describe('Block Service', () => {

    describe('getBlockInfo should', () => {

        it('return custom block object', async () => {
            const blockInfo = await BlockService.getBlockInfo(networkConfig.testBlock.height)
            expect(blockInfo).not.toBeNull()
            expect(blockInfo.height).toEqual(networkConfig.testBlock.height)
        })
    })
})