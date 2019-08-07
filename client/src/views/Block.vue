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
                <h1 class="inline-block">Blocks</h1>
                <div class="btn_grp inline-block flt-rt">
                  <span>Last Block : 209234</span>
                </div>
              </div>
              <div class="box-con mt-0">
                 <table-blocks>

                 </table-blocks>
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
import w1 from '@/components/Table-block.vue'

export default {
  name: 'block',
  components: {
    'table-blocks': w1
  },
  data () {
    return {}
  },
  methods: {},
  mounted () {}
}
</script>
