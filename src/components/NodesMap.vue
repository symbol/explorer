<template>
    <div class="nodes-map">
        <div ref="map" :style="style"></div>
    </div>
</template>

<script>
import leaflet from 'leaflet'
import markerCluster from 'leaflet.markercluster';
import iconUrl from '../styles/img/logo-w.png'

export default {
    props: {
        nodes: {
            type: Array,
            default: () => []
        },

        height: {
            type: Number,
            default: 300
        }
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
        }
    },

    methods: {
        initialize() {
            const map = leaflet.map(
                this.$refs.map,
                {
                    center: [35, 0],
                    minZoom: 1,
                    zoom: 1
                }
            )

            leaflet.tileLayer( 
                'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png', 
                {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    subdomains: ['a','b','c']
                }
            ).addTo(map);

            this.map = map;
        },

        addMarkers() {
            const icon = leaflet.icon({
                iconUrl,
                iconRetinaUrl: iconUrl,
                iconSize: [24, 24],
                iconAnchor: [9, 21],
                popupAnchor: [0, -14]
            });

            const markerClusters = leaflet.markerClusterGroup();

            for (const node of this.nodes) {
                const popup = 
                    '<br/><span title="' + node.friendlyName +'"><b>' + this.getNameByKey('friendlyName') + ':</b> ' + this.formatText(node.friendlyName) +
                    '</span><br/><span title="' + node.host +'"><b>' + this.getNameByKey('host') + ':</b> ' + this.formatText(node.host) +
                    '</span><br/><span title="' + node.network +'"><b>' + this.getNameByKey('network') + ':</b> ' + this.formatText(node.network) +
                    '</span><br/><span title="' + node.address +'"><b>' + this.getNameByKey('address') + ':</b> ' + this.formatText(node.address) +
                    '</span><br/><span title="' + node.location +'"><b>' + this.getNameByKey('location') + ':</b> ' + this.formatText(node.location) +
                    '</span>';
                
                if(node.coordinates?.length === 2) {
                    const m = L.marker([node.coordinates[0], node.coordinates[1]], {icon})
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