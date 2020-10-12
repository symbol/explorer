<template>
    <div class="nodes-map">
        <div ref="map" :style="style"></div>
    </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import leaflet from 'leaflet';
import markerCluster from 'leaflet.markercluster';
import iconUrl from '../styles/img/node-marker-3.png';

export default {
    props: {
        nodes: {
            type: Array,
            default: () => []
        },

        height: {
            type: Number,
            default: 300
        },

        zoom: {
            type: Number,
            default: 1
        },

        minZoom: {
            type: Number,
            default: 1
        },
    },

    mounted() {
        this.initialize();
        this.addMarkers();
    },

    data() {
        return {
            map: {}
        }
    },

    computed: {
        style() {
            return {
                height: this.height + 'px'
            }
        },

        buttonContainerStyle() {
            return `display: flex;
                justify-content: flex-end;
                margin: 15px 0;
            `;
        },

        button1Style() {
            return `border-radius: 3px; 
                color: #fff;
                background-color: #5200c6;
                font-family: Noto Sans;
                font-weight: bold;
                font-size: 13px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 5px 10px;
                cursor: pointer;
                text-decoration: none;
            `;
        },

        button2Style() {
            return `border-radius: 3px;
                border-width: 2px;
                border-style: solid;
                border-color: #5200c6;
                color: #5200c6;
                background-color: #fff;
                font-family: Noto Sans;
                font-weight: bold;
                font-size: 13px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 5px 10px;
                cursor: pointer;
                text-decoration: none;
                margin-left: 10px;
                display: none;
            `;
        }
    },

    methods: {
        initialize() {
            const southWest = leaflet.latLng(-89.98155760646617, -180);
            const northEast = leaflet.latLng(89.99346179538875, 180);
            const bounds = L.latLngBounds(southWest, northEast);

            const map = leaflet.map(
                this.$refs.map,
                {
                    center: [35, 0],
                    minZoom: this.minZoom,
                    zoom: this.zoom,
                    maxBounds: bounds,
                }
            )

            leaflet.tileLayer( 
                 //'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', 
                 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    subdomains: ['a','b','c']
                }
            ).addTo(map);

            this.map = map;
        },

        addMarkers() {
            // const icon = leaflet.icon({
            //     iconUrl,
            //     iconRetinaUrl: iconUrl,
            //     iconSize: [32, 46],
            //     iconAnchor: [9, 46],
            //     popupAnchor: [7, -46]
            // });

            const icon = leaflet.icon({
                iconUrl,
                iconRetinaUrl: iconUrl,
                iconSize: [46, 46],
                iconAnchor: [20, 23],
                popupAnchor: [3, -15]
            });

            const markerClusters = leaflet.markerClusterGroup({
                maxClusterRadius: 30
            });

            for (const node of this.nodes) {
                const popup = 
                    '<br/><span title="' + node.friendlyName +'"><b>' + this.getNameByKey('friendlyName') + ':</b> ' + this.formatText(node.friendlyName) +
                    '</span><br/><span title="' + node.host +'"><b>' + this.getNameByKey('host') + ':</b> ' + this.formatText(node.host) +
                    '</span><br/><span title="' + node.network +'"><b>' + this.getNameByKey('network') + ':</b> ' + this.formatText(node.network) +
                    '</span><br/><span title="' + node.address +'"><b>' + this.getNameByKey('address') + ':</b> ' + this.formatText(node.address) +
                    '</span><br/><span title="' + node.location +'"><b>' + this.getNameByKey('location') + ':</b> ' + this.formatText(node.location) +
                    '</span><br/><span style="' + this.buttonContainerStyle + '">' + 
                    '<a style="' + this.button1Style + '" href="' + this.getPageHref('node', node.publicKey) + '">' + this.getNameByKey('nodeDetailTitle') + 
                    '</a><a style="' + this.button2Style + '" href="' + this.getPageHref('address', node.address) + '"> ' + this.getNameByKey('accountDetailTitle') + '</a>' +
                    '</span>';
                
                if(node.coordinates) {
                    const m = L.marker([node.coordinates.latitude, node.coordinates.longitude], {icon})
                        .bindPopup(popup);
                    
                    markerClusters.addLayer(m);
                }
            }
 
            this.map.addLayer(markerClusters);
        },

        formatText(value) {
            return typeof value === 'string' 
                ? (
                    value.length > 30
                    ? (value.slice(0, 15) + '...' + value.slice(value.length - 14, value.length - 1))
                    : value
                )
                : 'n/a'
        },

        getNameByKey(e) {
            return this.$store.getters['ui/getNameByKey'](e)
        },

        getPageHref(itemKey, item) {
            return this.$store.getters[`ui/getPageHref`]({
                pageName: itemKey,
                param: item
            });
		},
    }
}
</script>

<style lang="scss" scoped>
.nodes-map {
    width: 100%;
    height: 100%;
    max-height: 800px;

    .map {
        width: 100%;
        height: 100%;
    }
}
</style>