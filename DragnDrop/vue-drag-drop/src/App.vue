<template>
  <div class="mt-5">
    <div>
      <drag-box :DragnDropBox="DragBoxObj" :LastBoxName="LastBoxName" :Countries="Countries" :Seasons="Seasons" :Grades="Grades" :Commodities="Commodities"  :OnClickSearch="OnClickSearch"></drag-box>
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
      Seasons:[],
      Grades:[],
		  Commodities:[],
     // Customers:[],      
      OnClickSearch: []

  }
};
</script>

<style>
.drag-col {
  min-height: 300px;
}
</style>
