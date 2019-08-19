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
    <div class="table-footer">
      <div class="pagination-container">
        <ul class="pagination">
          <li class="page-item">
            <a href="#">
              <i class="ico-angle-double-left"></i>
            </a>
          </li>
          <li class="page-item">
            <a href="#">
              <i class="ico-angle-left"></i>
            </a>
          </li>
          <li class="page-item">
            <span>1</span>
          </li>
          <li class="page-item">
            <a href="#">
              <i class="ico-angle-right"></i>
            </a>
          </li>
          <li class="page-item">
            <a href="#">
              <i class="ico-angle-double-right"></i>
            </a>
          </li>
        </ul>
      </div>
    </div>
    <script type="application/javascript"></script>
  </div>
</template>
<script>
import router from "../router";
import helper from "../helper";

export default {
  props: {
    blockslist: {}
  },
  methods: {
    load_block_info: function(id) {
      router.push({ path: `/block/${id}` });
    },
    timefix: function(time) {
      return helper.timeSince(new Date(time));
    }
  }
};
</script>
