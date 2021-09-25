<template>
  <div class="container mt-5">
    <div>
      <drag-box :DragnDropBox="DragBoxObj" :lastBoxName="lastBoxName" :Countries="Countries" :context="context"></drag-box>
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
      lastBoxName:{type:String},
      Countries:[],
      context: [],
  }
};
</script>

<style>
.drag-col {
  min-height: 300px;
}
</style>
