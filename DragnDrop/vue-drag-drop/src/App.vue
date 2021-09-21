<template>
  <div class="container mt-5">
    <!-- <div class="row">
      <div class="col form-inline">
        <b-form-input
          v-model="newTask"
          placeholder="Enter Task"
          @keyup.enter="add"
        ></b-form-input>
        <b-button variant="primary" class="ml-2" @click="add">Add</b-button>
      </div>
    </div> -->
    <div>
      <drag-box :DragnDropBox="DragBoxObj" :lastBoxName="lastBoxName"></drag-box>
    </div>
  </div>
</template>

<script>
import DragBox from "./components/DragBox.vue";

export default {
  name: "App",
  components: {
    DragBox,
  },
  props:{
      DragBoxObj: [],
      lastBoxName:{type:String}
  }
  // data() {
  //   return {
  //     DragBoxObj: {},
  //     lastBoxName:String
  //   };
  // },
  // mounted() {
  //   this.lastBoxName2 = "Allocation",
  //   this.DragBoxObj1 = [
  //     {
  //       boxNumber: 1,
  //       items: [
  //         {
  //           name: "Buyer 1",
  //           property1: " Qty - 150",
  //         },
  //         {
  //           name: "Buyer 2",
  //           property1: " Qty - 150",
  //         },
  //         {
  //           name: "Buyer 3",
  //           property1: " Qty - 150",
  //         },
  //         {
  //           name: "Buyer 4",
  //           property1: " Qty - 150",
  //         }
  //       ],
  //       Name: "Buyer",
  //     },
  //   ];
  // },
};
</script>

<style>
.drag-col {
  min-height: 300px;
}
</style>
