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
          <!-- <td>2019-08-06 17:22:17</td>
          <td>0.05</td>
          <td>0.05</td>
          <td>NCKZD7JGDLNDIVVPH6U2PG2QKD3PX3FX4CPZMF2A</td>
          <td>NALEA4T4SW7UP3EDYPPOVR7O2MBTIARMJ2IMB7PV</td>-->
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
    tableData: {}
  },
  methods: {}
};
</script>