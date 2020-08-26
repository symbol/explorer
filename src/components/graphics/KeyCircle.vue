<template>
    <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        :x="_x"
        :y="_y"
        width="38.5px"
        height="38.167px"
        viewBox="0 0 38.5 38.167"
        xml:space="preserve"
        class="circle-icon"
    >
        <defs>
            <linearGradient id="key-circle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="RGB(255, 197, 255)" />
                <stop offset="100%" stop-color="RGB(255, 0, 255)" />
            </linearGradient>
        </defs>
        <foreignObject x="446" y="318" width="100" height="100">
            <TablePopover :title="title" :target="this.id" :data="data" />
        </foreignObject>
        <circle
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="url(#key-circle-gradient)"
            cx="19.115"
            cy="19.094"
            r="17.26"
        />
        <g>
            <path
                id="outer"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                stroke-miterlimit="10"
                d="M18.213,27.658c-0.092,0-0.167-0.074-0.167-0.167
					v-7.905c0-0.213-0.149-0.401-0.355-0.451c-2.213-0.53-3.763-2.264-3.763-4.218c0-2.419,2.327-4.388,5.188-4.388
					s5.188,1.968,5.188,4.388c0,1.944-1.535,3.678-3.731,4.218c-0.206,0.046-0.355,0.234-0.355,0.448v3.208
					c0,0.255,0.209,0.465,0.465,0.465h1.133c0.092,0,0.167,0.074,0.167,0.167v2.299c0,0.092-0.075,0.167-0.167,0.167h-1.133
					c-0.256,0-0.465,0.209-0.465,0.465v1.133c0,0.092-0.075,0.167-0.167,0.167h-1.837V27.658z M19.116,10.881
					c-2.672,0-4.846,1.815-4.846,4.047c0,1.947,1.666,3.621,3.965,3.976c0.082,0.011,0.146,0.082,0.146,0.16v7.795
					c0,0.256,0.209,0.466,0.465,0.466H19.4c0.256,0,0.465-0.21,0.465-0.466v-1.133c0-0.092,0.075-0.167,0.167-0.167h1.134
					c0.259,0,0.465-0.209,0.465-0.465v-1.013c0-0.231-0.178-0.465-0.579-0.465h-1.03c-0.093,0-0.167-0.075-0.167-0.167v-4.385
					c0-0.082,0.057-0.149,0.138-0.16c2.295-0.363,3.958-2.033,3.958-3.976c0.003-0.941-0.395-1.862-1.116-2.586
					C21.916,11.414,20.558,10.881,19.116,10.881z"
            />
            <path
                id="inner"
                fill="#FFFFFF"
                stroke="#FFFFFF"
                stroke-miterlimit="10"
                d="M19.109,17.703c-1.979,0-3.589-1.247-3.589-2.782
					c0-1.535,1.609-2.782,3.589-2.782c1.979,0,3.588,1.247,3.588,2.782C22.697,16.456,21.088,17.703,19.109,17.703z M19.116,12.483
					c-1.787,0-3.24,1.094-3.24,2.441s1.453,2.441,3.24,2.441s3.24-1.094,3.24-2.441S20.903,12.483,19.116,12.483z"
            />
        </g>
        <circle
            :id="this.id"
            fill-rule="evenodd"
            clip-rule="evenodd"
            fill="transparent"
            cx="19.115"
            cy="19.094"
            r="17.26"
        />
    </svg>
</template>

<script>
import GraphicComponent from "./GraphicComponent.vue";
import TablePopover from "./TablePopover.vue";

export default {
    extends: GraphicComponent,

    components: {
        TablePopover,
    },

    props: {
        title: {
            type: String,
            default: "Key",
        },
        data: {
            type: Object,
            default: () => ({}),
        },
    },

    data() {
        return {
            id: this.getId("key-circle"),
        };
    },
};
</script>
