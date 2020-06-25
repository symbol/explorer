<template>
    <div>
        <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            xmlns:xlink="http://www.w3.org/1999/xlink" 
            x="0px" 
            y="0px" 
            width="700px"
	        height="200px" 
            viewBox="140 200 700 200" 
            xml:space="preserve"
        >
        <defs>
            <radialGradient 
                id="gradient"
                cx="0.5" 
                cy="0.5" 
                r="0.5" 
                fx="0.25" 
                fy="0.25"
            >
                <stop offset="0%" stop-color="red"/>
                <stop offset="100%" stop-color="transparent"/>
            </radialGradient>
        </defs>
            <AccountIcon 
                :x="112" 
                :y="240" 
                :address="signer"
                @click="accountClick"
            />
            <AccountIcon 
                :x="614" 
                :y="240" 
                :address="recipient"
                @click="accountClick"
            />
            <MosaicIcon
                v-for="(mosaic, index) in mosaics"
                :x="142 + 40 * index" 
                :y="190" 
                :width="100"
                :height="100"
                :mosaicId="mosaic.mosaicId"
                :key="'mosaic'+mosaic.mosaicId+index"
            />
            <g id="arrow"> 
                <g>
                    <line 
                        fill="none" 
                        class="arrow-stroke" 
                        stroke-width="5" 
                        stroke-miterlimit="10" 
                        x1="350" 
                        y1="318.5" 
                        x2="617" 
                        y2="318.5"
                    />
                    <g>
                        <polygon 
                            points="610.177,327.628 614.267,318 610.177,308.372 633,318 "
                            class="arrow"
                        />
                    </g>
                    <g id="icons">
                        <!--<foreignObject class="circle-icon" x="446" y="318" width="100" height="100">
                            <div style="border:1px green solid">I'm a div inside a SVG.</div>                
                        </foreignObject>-->
                        <circle id="icon-3" v-if="hasMessage" fill="#FFA82D" cx="446.875" cy="318.5" r="17.25">
                            <title> {{ mosaicList }} </title>
                        </circle>
                        <circle id="icon-2" v-if="hasMosaic" fill="#3085FF" cx="484.875" cy="318.5" r="17.25"/>
                        <circle id="icon-1" v-if="hasNativeMosaic" fill="#EC33FF" cx="522.875" cy="318.5" r="17.25"/>
                    </g>
                </g>
                
                <text 
                    x="490" 
                    y="361.9268"
                    text-anchor="middle"
                    class="message"
                > {{ messageText }}
                    <title> {{ message }} </title>
                </text>
                <rect x="459.56" y="252.25" fill-rule="evenodd" clip-rule="evenodd" fill="none" width="65" height="15.5"/>
                <text 
                    x="490" 
                    y="262.8906"
                    text-anchor="middle"
                    class="message"
                >
                    <title>{{ mosaics }}</title>
                    {{ mosaic2Text }}
                </text>
                <rect x="459.56" y="269.659" fill-rule="evenodd" clip-rule="evenodd" fill="none" width="65" height="15.5"/>
                <text 
                    x="490" 
                    y="280.2993"
                    text-anchor="middle"
                    class="message"
                >
                    <title>{{ mosaics }}</title>
                    {{ mosaic1Text }}    
                </text>
            </g>
        </svg>
    </div>
</template>

<script>
import helper from '../../helper';
import http from '../../infrastructure/http';
import AccountIcon from '../graphics/AccountIcon.vue';
import MosaicIcon from '../graphics/MosaicIcon.vue';

export default {
    components: {
        AccountIcon,
        MosaicIcon
    },

    props: {
        message: {
            type: String,
            default: 'Message'
        },
        signer: {
            type: String,
            required: true,
            default: ''
        },
        recipient: {
            type: String,
            required: true,
            default: ''
        },
        mosaics: {
            type: Array,
            default: () => [
                { name: 'symbol.xym', amount: 228 },
                { name: '072031D75989B881', amount: 1 },
                { name: '6D1B935676E3659D', amount: 2 }
            ]
        }
    },

    computed: {
        hasMessage() {
            return typeof this.message === 'string' && this.message.length > 0
        },

        hasNativeMosaic() {
            return typeof this.nativeMosaic !== 'undefined';
        },

        hasMosaic() {
            return this.mosaicList.length > 0;
        },

        nativeMosaic() {
            return this.mosaics.find( mosaic => mosaic.mosaicId === http.networkCurrecy.mosaicId );
        },

        mosaicList() {
            return this.mosaics.filter( mosaic => mosaic.mosaicId !== http.networkCurrecy.mosaicId );
        },

        mosaicListText() {
            const mosaicList = this.mosaicList;
            const name = mosaicList[0].mosaicAliasName !== 'N/A'
                ? mosaicList[0].mosaicAliasName
                : this.trunc(mosaicList[0].mosaicId);
            const amount = mosaicList[0].amount;
            const more = mosaicList.length - 1 > 0 
                ? `[+${mosaicList.length - 1}]`
                : '';
            return `${name} - ${amount} ${more}`
        },

        nativeMosaicText() {
            if(this.hasNativeMosaic)
                return `${this.nativeMosaic.amount} XYM`;
            return '';
        },

        mosaic2Text() {
            if(this.hasMosaic)
                return this.nativeMosaicText;
            return '';
        },

        mosaic1Text() {
            if(this.hasMosaic)
                return this.mosaicListText;
            return this.nativeMosaicText
        },

        messageText() {
            return this.message?.substring(0, 30) + (this.message?.length > 30 ? '...' : '');
        },

        signerColor() {
            return this.getColor(this.signer)
        },

        recipientColor() {
            return this.getColor(this.recipient)
        },
    },

    methods: {
        getColor(hash) {
            const color = helper.getColorFromHash(hash, false); 
            return `RGB(${color.R},${color.G},${color.B})`
        },

        trunc(hash, strLen = 5) {
            return `${hash.substring(0, strLen)}...${hash.substring(hash.length - strLen, hash.length)}`
        },

        accountClick(address) {
            this.$store.dispatch(`ui/openPage`, {
                pageName: 'address',
                param: address
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.account {
    cursor: pointer;
}

.account-text {
    font-size: 18px;
    font-weight: bold;
    fill: var(--secondary);
}

.message {
    font-size: 13px;
    font-weight: bold;
    fill: var(--blue);
}

.arrow-stroke {
    stroke: var(--secondary);
}

.arrow {
    fill: var(--secondary);
}

</style>