<template>
  <div>
    <div class="table-responsive">
      <div
        id="sorting-table_wrapper"
        class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
      >
        <table
          id="table-block-list"
          class="table table-striped table-bordered"
          cellspacing="0"
          width="100%"
        >
          <thead>
            <tr>
              <th>Block Height</th>
              <th>Age</th>
              <th>Transactions</th>
              <th>Fee</th>
              <th>Timestamp</th>
              <th>Harvester</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item,index) in blockslist"
              v-bind:key="item.height"
              @click="load_block_info(item.height)"
            >
              <td>{{item.height}}</td>
              <td>{{timefix(item.date)}}</td>
              <td>{{item.numTransactions}}</td>
              <td>{{item.totalFee}}</td>
              <td>{{item.date}}</td>
              <td>{{item.signer.address.address}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <script type="application/javascript"></script>
  </div>
</template>
<script>
import router from "../router";
import helper from "../helper";
import moment from "moment-timezone";
export default {
  props: {
    blockslist: {}
  },
  methods: {
    load_block_info: function(id) {
      router.push({ path: `/block/${id}` });
    },
    timefix: function(time) {
      var time_fx = new Date(time);
      var offset = new Date().getTimezoneOffset();
      return helper.timeSince(time_fx);
    }
  }
};
</script>
