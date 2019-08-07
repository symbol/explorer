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
            <tr @click="load_block_info(2271554)">
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr @click="load_block_info(2271554)">
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr @click="load_block_info(2271554)">
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr @click="load_block_info(2271554)">
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr @click="load_block_info(2271554)">
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr @click="load_block_info(2271554)">
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr @click="load_block_info(2271554)">
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr @click="load_block_info(2271554)">
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr>
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
            </tr>
            <tr>
              <td>2271554</td>
              <td>34m, 57s</td>
              <td>14</td>
              <td>1.15</td>
              <td>2019-08-06 11:39:06</td>
              <td>NAIPPHMWSIZ6GL2Q6LCCXSTEHMHZXVLL47P5PXA2</td>
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
import router from '../router'
export default {
  methods: {
    load_block_info: function (id) {
      router.push({ path: `/block/${id}` })
    }
  }
}
</script>
