<script>
import helper from "../../helper";
import http from '../../infrastructure/http';

export default {
    props: {
        x: {
            type: Number,
            default: 0
        },

        y: {
            type: Number,
            default: 0
        },
    },

    computed: {
        nativeMosaicId() {
            return http.networkCurrecy.mosaicId;
        },

        nativeMosaicAliasName() {
            return http.networkCurrecy.mosaicId.namespace;
        },

        _x() {
            return this.x + 'px';
        },

        _y() {
            return this.y + 'px';
        },

        _height() {
            return (this.height || '0') + 'px';
        },

        _width() {
            return (this.width || '0') + 'px';
        },
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

        truncString(str) {
            return helper.truncString(str);
        },

        getId(id) {
            return id + '-' + Math.floor(Math.random() * Math.floor(1000));
        }
    },
}
</script>

<style lang="scss" scoped>

</style>