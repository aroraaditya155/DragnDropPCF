<template>
  <div class="container mt-5">
    <div>
      <drag-box :DragnDropBox="DragBoxObj" :LastBoxName="LastBoxName" :Countries="Countries" :Seasons="Seasons" :Grades="Grades" :Commodities="Commodities" :Customers="Customers" :OnClickSearch="OnClickSearch"></drag-box>
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
      Customers:[],
      //OnChange: [],
      //OnChangeCountry: [],
      OnClickSearch: []

  }
};
</script>

<style>
.drag-col {
  min-height: 300px;
}
</style>
