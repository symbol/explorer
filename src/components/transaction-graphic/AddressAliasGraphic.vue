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
            :viewBox="transactionGraphicViewbox"
            xml:space="preserve"
        >
            <AccountIcon 
                :x="subjectPositionX" 
                :y="subjectPositionY" 
                :width="subjectWidth"
                :height="subjectHeight"
                :address="signer" 
            />
            <AccountIcon 
                v-if="0"
                :x="objectPositionX" 
                :y="objectPositionY" 
                :width="subjectWidth"
                :height="subjectHeight"
                :address="signer" 
            />
            <NamespaceIcon
                :x="objectPositionX" 
                :y="objectPositionY" 
                :width="subjectWidth"
                :height="subjectHeight"
                :namespace="{namespaceName: namespaceId, namespaceId}"
            />
            <Arrow :x="arrowPositionX" :y="arrowPositionY" />
            <NamespaceCircle
                v-if="isLinkAction"
                :x="getCircleIconPositionX(0)"
                :y="circleIconPositionY"
                :namespaceName="namespaceId"
            />
            <NamespaceUnlinkCircle
                v-else
                :x="getCircleIconPositionX(0)"
                :y="circleIconPositionY"
                :namespaceName="namespaceId"
            />
            <text :x="transactionTypeTextPositionX" :y="transactionTypeTextPositionY" text-anchor="middle" class="message">
                {{ transactionType + subTitle }}
                <title>{{ transactionType }}</title>
            </text>
        </svg>
    </div>
</template>

<script>
import GraphicComponent from "../graphics/GraphicComponent.vue";
import AccountIcon from "../graphics/AccountIcon.vue";
import NamespaceCircle from "../graphics/NamespaceCircle.vue";
import NamespaceUnlinkCircle from "../graphics/NamespaceUnlinkCircle.vue";
import NamespaceIcon from "../graphics/NamespaceIcon.vue"
import Arrow from "../graphics/Arrow.vue";

export default {
    extends: GraphicComponent,

    components: {
        AccountIcon,
        NamespaceCircle,
        NamespaceUnlinkCircle,
        Arrow,
        NamespaceIcon
    },

    props: {
        message: {
            type: String,
            default: ""
        },
        signer: {
            type: String,
            required: true,
            default: ""
        },
        namespaceId: {
            type: String,
            required: true
        },
        aliasAction: {
            type: String,
            required: true
        }
    },

    computed: {
        transactionType() {
            return this.getTransactionTypeCaption(16974); // Address Alias
        },

        circleIconsToDisplay() {
            return [true];
        },

        isLinkAction() {
            return this.aliasAction === 'Link';
        },

        subTitle() {
            return `. ${this.aliasAction} namespace`
        }
    }
};
</script>


<style lang="scss" scoped>
.message {
    font-size: 13px;
    font-weight: bold;
    fill: var(--blue);
}
</style>