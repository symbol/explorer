<template>
    <div class="transaction-type">
        <div v-if="iconUrl" class="icon">
            <img :src="iconUrl" />
        </div>
        <div class="text">
            {{ text }}
        </div>
    </div>
</template>

<script>
import IconTransfer from '../../styles/img/tx-transfer.png'
import IconTransferIncoming from '../../styles/img/tx-incoming.png'
import IconTransferOutgoing from '../../styles/img/tx-outgoing.png'
import IconAggregate from '../../styles/img/tx-aggregate.png'
import IconLock from '../../styles/img/tx-lock.png'
import IconNamespace from '../../styles/img/tx-namespace.png'
import IconMosaic from '../../styles/img/tx-mosaic.png'

export default {
    props: {
        value: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            IconTransfer,
            IconTransferIncoming,
            IconTransferOutgoing,
            IconAggregate,
            IconLock,
            IconNamespace,
            IconMosaic
        }
    },

    computed: {
        iconUrl() {
            if(this.isTypeOf('incoming')) return this.IconTransferIncoming;
            if(this.isTypeOf('outgoing')) return this.IconTransferOutgoing;
            if(this.isTypeOf('transfer')) return this.IconTransfer;
            if(this.isTypeOf('namespace')) return this.IconNamespace;
            if(this.isTypeOf('alias')) return this.IconNamespace;
            if(this.isTypeOf('mosaic')) return this.IconMosaic;
            if(this.isTypeOf('aggregate')) return this.IconAggregate;
            if(this.isTypeOf('lock') || this.isTypeOf('secret')) return this.IconLock;
            return null;
        },

        text() {
            return this.value
                .replace('Incoming', '')
                .replace('Outgoing', '')
        }
    },

    methods: {
        isTypeOf(type) {
            return (
                typeof this.value === 'string' &&
                typeof type === 'string' &&
                this.value
                    .toUpperCase()
                    .includes(
                        type.toUpperCase()
                    )
            )
        }
    }
}
</script>

<style lang="scss" scoped>
.transaction-type {
    display: flex;

    .icon {
        margin-right: 10px;

        img {
            height: 32px;
            width: 32px;
        }
    }

    .text {
        display: flex;
        align-items: center;
    }
}
</style>