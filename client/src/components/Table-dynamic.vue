<template>
  <div>
    <table
      id="table-dynmic"
      class="table table-striped table-bordered"
      v-bind:class="tableClass"
      cellspacing="0"
      width="100%"
    >
      <thead>
        <tr>
          <th v-for="(item,index) in tableHead" v-bind:key="index">{{item}}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item,index) in tableData" v-bind:key="index">
          <td v-for="(subitem,idx) in item" v-bind:key="idx">{{subitem}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    tableClass: "",
    tableHead: {},
    tableData: {},
    tableRowAction:{ type: Function }
  },
  methods: {}
};
</script>