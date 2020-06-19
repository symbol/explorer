<template>
    <Card>
        <template #title>
            Mosaic color test
        </template>

        <template #body>
            <b-container fluid style="height: 100%">
                <b-row>
                    <b-col sm="12">
                        <b-form-group class="ex-item" label="Icon">
                            <b-form-radio-group id="radio-group-2" v-model="iconSelectorValue" name="radio-sub-component">
                                <b-form-radio :value="0">White and color shade</b-form-radio>
                                <b-form-radio :value="1">Whole color</b-form-radio>
                            </b-form-radio-group>
                        </b-form-group>
                    </b-col>
                    <b-col class="ex-item" sm="7" lg="10">
                        <b-form-input 
                            v-model="mosaicIdInputValue" 
                            placeholder="MosaicId"
                        ></b-form-input>
                    </b-col>
                    <b-col class="ex-item" sm="5" lg="2">
                       <b-button 
                            variant="outline-primary" 
                            @click="addMosaic"
                        >Add</b-button>
                    </b-col>
                    <b-col class="ex-item" sm="12">
                        <div v-for="item in mosaicIdList" :key="item">
                            <img 
                                :src="iconUrl" 
                                :style="getColorStyle(item)"
                            />
                            <span class="mosaicItemText">
                                {{ item }}
                            </span>
                        </div>
                    </b-col>
                </b-row>
            </b-container>
        </template>
    </Card>
</template>

<script>
import Card from '@/components/containers/Card.vue';
import Connector from '../../styles/img/connector_uncolored.png'
import Connector2 from '../../styles/img/connector_uncolored_2.png'
export default {
    components: {
        Card
    },

    data() {
        return {
            mosaicIdList: [
                         
            ],
            mosaicIdInputValue: '',
            connectorImgUrl: Connector,
            connectorImgUrl2: Connector2,
            iconSelectorValue: 0
        }
    },

    computed: {
        iconUrl() {
            return this.iconSelectorValue === 0
                ? this.connectorImgUrl
                : this.connectorImgUrl2;
        }
    },

    methods: {
        addMosaic() {
            if(this.mosaicIdInputValue.length !== 16) {
                alert('Invalid mosaicId');
                return;
            }
            this.mosaicIdList.push(this.mosaicIdInputValue);    
            this.mosaicIdInputValue = '';
        },

        hexToRGB(hexString) {
            let totalHex = 0;

            for(const hex of hexString) 
                totalHex += parseInt(hex, 16);
                
            return Math.trunc(totalHex * 255 / (15 * 4));
        },

        getMosaicColor(mosaicId) {
            const alphabetLength = 26;
            const color = {
                R: 0,
                G: 0,
                B: 0
            };

            const rawRed = mosaicId.substring(0, 4);
            const rawGreen = mosaicId.substring(4, 8);
            const rawBlue = mosaicId.substring(8, 12);

            color.R = this.hexToRGB(rawRed);
            color.G = this.hexToRGB(rawGreen);
            color.B = this.hexToRGB(rawBlue);

            return color;
        },

        getColorStyle(mosaicId) {
            const color = this.getMosaicColor(mosaicId);
            return { background: `RGB(${color.R}, ${color.G}, ${color.B})` };
        }
    }
}
</script>

<style lang="scss" scoped>
.mosaicItemText {
    vertical-align: middle;
    font-size: 24px;
    opacity: 0.9;
}
</style>