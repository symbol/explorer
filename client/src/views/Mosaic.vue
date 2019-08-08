<template>
  <div>
    <top-header></top-header>
    <page-menu></page-menu>
    <div class="page_con">
      <div class="full-con mob_con">
        <div class="container p-0">
          <div class="widget has-shadow mt-4">
            <div class="box">
              <div class="box-title">
                <h1 class="inline-block">Mosaic List </h1>
                <div class="btn_grp inline-block flt-rt"></div>
              </div>
              <div class="box-con mt-0">
                <div class="table-responsive">
                  <div
                    id="sorting-table_wrapper"
                    class="dataTables_wrapper container-fluid dt-bootstrap4 no-footer p-0"
                  >
                    <table
                      id="table-acnts"
                      class="table table-striped table-bordered"
                      cellspacing="0"
                      width="100%"
                    >
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>MosaicID</th>
                          <th>Creator</th>
                          <th>Supply	</th>
                          <th>Divisibility</th>
                           <th>CreateTime</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr @click="load_mosaic_info('nemona','xemona')">
                          <td>1</td>
                          <td>nemona:xemona</td>
                          <td>NAAXHJM65OKDFSYGW4XW4EKJXUIRTKEZZWRK45YF	</td>
                          <td>100,000</td>
                          <td>0</td>
                          <td>2019-08-06 15:57:28</td>
                        </tr>
                        <tr @click="load_mosaic_info('nemona','xemona')">
                          <td>2</td>
                          <td>nemona:nemona</td>
                          <td>NAAXHJM65OKDFSYGW4XW4EKJXUIRTKEZZWRK45YF</td>
                          <td>1,000,000	</td>
                          <td>0</td>
                          <td>2019-08-06 15:57:28</td>
                        </tr>
                      </tbody>
                    </table>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <page-footer></page-footer>
    <script type="application/javascript"></script>
  </div>
</template>
<script>
import router from '../router'
export default {
  methods: {
    load_mosaic_info: function (ns,m) {
      
      router.push({ path: `/mosaic/${ns}/${m}` })
    }
  }
}
</script>
</script>
