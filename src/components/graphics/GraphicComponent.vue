<script>
import helper from "../../helper";
import http from "../../infrastructure/http";
import Constants from "../../config/constants";

export default {
    props: {
        x: {
            type: Number,
            default: 0
        },

        y: {
            type: Number,
            default: 0
        }
    },

    data() {
        return {
            // Transaction graphic
            desktopTransactionGraphicViewbox: '140 200 700 200',
            mobileTransactionGraphicViewbox: '380 240 200 170',
            desktopSubjectWidth: 700,
            desktopSubjectHeight: 200,
            mobileSubjectWidth: 370,
            mobileSubjectHeight: 150,


            // Subject
            desktopSubjectPositionX: 112,
            desktopSubjectPositionY: 240,
            desktopSubjectWidth: 261.333,
            desktopSubjectHeight: 131.313,

            mobileSubjectPositionX: 180,
            mobileSubjectPositionY: 275,
            mobileSubjectWidth: 261,
            mobileSubjectHeight: 80,
            

            // Object
            desktopObjectPositionX: 614,
            mobileObjectPositionX: 505,

            // objectPositionY: 240,

            // Transaction type text
            transactionTypeTextPositionX: 485,
            transactionTypeTextPositionY: 361.9268,

            // Arrow
            arrowPositionX: 341,
            arrowPositionY: 305,

            // Circle icons
            circlesIconsPositionsX: [[466], [447, 485], [428, 466, 504]],
            circleIconPositionY: 300,
        };
    },

    computed: {
        transactionGraphicViewbox() {
            return this.$store.getters['ui/isMobile']
                ? this.mobileTransactionGraphicViewbox
                : this.desktopTransactionGraphicViewbox;
        },

        subjectPositionX() {
            return this.$store.getters['ui/isMobile']
                ? this.mobileSubjectPositionX
                : this.desktopSubjectPositionX;
        },

        subjectPositionY() {
            return this.$store.getters['ui/isMobile']
                ? this.mobileSubjectPositionY
                : this.desktopSubjectPositionY;
        },

        objectPositionX() {
            return this.$store.getters['ui/isMobile']
                ? this.mobileObjectPositionX
                : this.desktopObjectPositionX;
        },

        objectPositionY() {
            return this.subjectPositionY;
        },

        subjectWidth() {
            return this.$store.getters['ui/isMobile']
                ? this.mobileSubjectWidth
                : this.desktopSubjectWidth;
        },

        subjectHeight() {
            return this.$store.getters['ui/isMobile']
                ? this.mobileSubjectHeight
                : this.desktopSubjectHeight;
        },

        nativeMosaicId() {
            return http.networkCurrecy.mosaicId;
        },

        nativeMosaicAliasName() {
            return http.networkCurrecy.mosaicId.namespace;
        },

        _x() {
            return this.x + "px";
        },

        _y() {
            return this.y + "px";
        },

        _height() {
            return (this.height || "0") + "px";
        },

        _width() {
            return (this.width || "0") + "px";
        },

        circlesCount() {
            return Array.isArray(this.circleIconsToDisplay)
                ? this.circleIconsToDisplay.reduce((acc, value) => acc + value)
                : 0;
        }
    },

    methods: {
        getIconColor(str) {
            const color = helper.getColorFromHash(str, false);
            return `RGB(${color.R},${color.G},${color.B})`;
        },

        getIconColorFromHex(str) {
            const color = helper.getColorFromHash(str, true);
            return `RGB(${color.R},${color.G},${color.B})`;
        },

        truncString(str, strLen) {
            return helper.truncString(str, strLen);
        },

        getId(id) {
            return id + "-" + Math.floor(Math.random() * Math.floor(1000));
        },

        getCircleIconPositionX(index) {
            const circlesCount = this.circlesCount

            switch (index) {
                case 0:
                    if (this.circleIconsToDisplay[0])
                        return this.circlesIconsPositionsX[
                            circlesCount - 1
                        ][0];
                    break;
                case 1:
                    if (this.circleIconsToDisplay[1]) {
                        if (this.circleIconsToDisplay[0])
                            return this.circlesIconsPositionsX[
                                circlesCount - 1
                            ][1];
                        return this.circlesIconsPositionsX[
                            circlesCount - 1
                        ][0];
                    }
                    break;
                case 2:
                    if (this.circleIconsToDisplay[2]) {
                        if (
                            this.circleIconsToDisplay[0] &&
                            this.circleIconsToDisplay[1]
                        )
                            return this.circlesIconsPositionsX[
                                circlesCount - 1
                            ][2];
                        if (
                            this.circleIconsToDisplay[0] ||
                            this.circleIconsToDisplay[1]
                        )
                            return this.circlesIconsPositionsX[
                                circlesCount - 1
                            ][1];
                        return this.circlesIconsPositionsX[
                            circlesCount - 1
                        ][0];
                    }
                    break;
            }
        },

        getMosaicName(mosaic) {
            return mosaic.mosaicAliasName !== 'N/A' 
                ? mosaic.mosaicAliasName 
                : mosaic.mosaicId;
        },

        getMosaicTitle(mosaic) {
            return `Mosaic: ${this.getMosaicName(mosaic)}`;
        },

        getAddressTitle(address) {
            return `Account: ${address}`;
        },

        getTransactionTypeCaption(type) {
            return Constants.TransactionType[type];
        },

        onAccountClick(address) {
            this.$store.dispatch(`ui/openPage`, {
                pageName: "address",
                param: address
            });
            this.$emit('click', address);
        },

        onMosaicClick(mosaicId) {
            this.$store.dispatch(`ui/openPage`, {
                pageName: "mosaic",
                param: mosaicId
            });
            this.$emit('click', mosaicId);
        }
    }
};
</script>

<style lang="scss" scoped>
.circle-icon {
    margin-left: 2px;
    margin-right: 2px;
}
</style>
