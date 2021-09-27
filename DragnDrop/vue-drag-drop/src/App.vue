<template>
  <div class="container mt-5">
    <div>
      <drag-box :DragnDropBox="DragBoxObj" :LastBoxName="LastBoxName" :Countries="Countries" :OnChange="OnChange" :OnChangeCountry="OnChangeCountry" :OnClickSearch="OnClickSearch"></drag-box>
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
      LastBoxName:{type:String},
      Countries:[],
      OnChange: [],
      OnChangeCountry: [],
      OnClickSearch: []
  }
};
</script>

<style>
.drag-col {
  min-height: 300px;
}
</style>
