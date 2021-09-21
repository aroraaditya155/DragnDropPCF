<template>
  <div class="drag-drop-box">
    <div class="row">
      <div class="col-md-3 drag-col1" v-for="box in DragnDropBox" :key="box.boxNumber">
        <div class="p-2 alert alert-warning">
          <h3>{{ box.Name }}</h3>
          <draggable class="list-group list-col1" v-model="box.items" :options="availableItemOptions">
            <div class="list-group-item" v-for="item in box.items" :key="item.name">
              <p>{{ item.name }}</p>
              <p>Qty - {{ item.property1 }}</p>
              <p>Product - {{ item.property2 }}</p>
            </div>
          </draggable>
        </div>
      </div>
      <div class="col-md-3 drag-col2">
        <div class="p-2 alert alert-success">
          <h3>{{ lastBoxName }}</h3>
          <div>
            <h4>Customer</h4>
            <draggable class="list-group list-col2" v-model="clonedCustomerItems" :options="clonedCustomerItemOptions" @change="onChangeCustomer">
              <div class="list-group-item" v-for="item in clonedCustomerItems" :key="item.name">
                <p>{{ item.name }}</p>
                <p>Qty - {{ item.property1 }}</p>
                <p>Product - {{ item.property2 }}</p>
              </div>
            </draggable>
          </div>
          <div>
            <h4>Allocation</h4>
            <draggable class="list-group list-col2" v-model="clonedAllocationItems" :options="clonedItemAllocationOptions" @change="onChangeAllocation">
              <div class="list-group-item" v-for="item in clonedAllocationItems" :key="item.name">
                <p>{{ item.name }}</p>
                <p>Qty - {{ item.property1 }}</p>
                <p>Product - {{ item.property2 }}</p>
              </div>
            </draggable>
          </div>
        </div>
        <button primary v-on:click="saveClick">Save</button>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  components: { draggable },

  props: {
    DragnDropBox: [],
    lastBoxName: { type: String, required: true },
  },
  data() {
    return {
      newTask: "",
      arrBacklog: [
        { name: "Buyer 1 - Qty - 50" },
        { name: "Buy2" },
        { name: "Buy3" },
        { name: "Buy4" },
      ],
      arr2: [
        { name: "Sup1" },
        { name: "Sup2" },
        { name: "Sup3" },
        { name: "Sup4" },
      ],
      arr3: [],
      availableItemOptions: {
        group: {
          name: "items",
          pull: "clone",
          put: false,
        },

        sort: false,
      },
      clonedCustomerItemOptions: {
        group: "items",
      },
      clonedCustomerItems: [],
      clonedItemAllocationOptions: {
        group: "items",
      },
      clonedAllocationItems: []
    };
  },
  methods: {
    onChangeCustomer() {
      // alert();
      if (this.clonedCustomerItems.length > 1) {
        this.clonedCustomerItems.pop();
      }
    },
     onChangeAllocation() {
      // alert();
      if (this.clonedAllocationItems.length > 1) {
        this.clonedAllocationItems.pop();
      }
    },
    saveClick() {
      var entityFormOptions = {};
      entityFormOptions["entityName"] = "vel_allocation";

 entityFormOptions["useQuickCreateForm"] = true;
 
      // Open the form.
      Xrm.Navigation.openForm(entityFormOptions).then(
        function (success) {
          console.log(success);
        },
        function (error) {
          console.log(error);
        }
      );
    },
    // add() {
    //   if (this.newTask) {
    //     this.arrBacklog.push({ name: this.newTask });
    //     this.newTask = "";
    //   }
    // },
  },
  // mounted() {
  //   this.newObj = [
  //     {
  //       heading: "Section 1",
  //       content: "something something",
  //       questionAndAnswer: [
  //         { question: "Q1fddf", answer: "A1" },
  //         { question: "Q2", answer: "A2" },
  //       ],
  //       sectionNumber:1
  //     },
  //     {
  //       heading: "Section 2",
  //       content: "something something for the section2",
  //       questionAndAnswer: [
  //         { question: "Q1", answer: "A1" },
  //         { question: "Q2", answer: "A2" },
  //       ],
  //       sectionNumber:2
  //     },
  //   ];
  // },
};
</script>

<style>
.drag-col1 {
  min-height: 250px;
  width: 25%;
  float: left;
  background-color: #fff3cd;
  margin: 15px;
  padding: 10px;
  align-content: center;
  align-items: center;
  color: #856404;
}
.drag-col2 {
  min-height: 250px;
  width: 25%;
  float: left;
  background-color: #d4edda;
  margin: 15px;
  padding: 10px;
  align-content: center;
  align-items: center;
  color: #155724;
}
.list-col1 {
  min-height: 250px;
  background-color: #fff3cd;
  margin: 15px;
  padding: 10px;
  align-content: center;
  align-items: center;
}
.list-col2 {
  min-height: 250px;
  background-color: #d4edda;
  margin: 15px;
  padding: 10px;
  align-content: center;
  align-items: center;
}
.list-group-item {
  background-color: #fff;
  border-bottom: solid;
  border-top-color: rgba(0, 0, 0, 0.125);
  border-top-style: solid;
  border-top-width: 1px;
  border-right-color: rgba(0, 0, 0, 0.125);
  border-right-style: solid;
  border-right-width: 1px;
  border-bottom-color: rgba(0, 0, 0, 0.125);
  border-bottom-style: solid;
  border-bottom-width: 1px;
  border-left-color: rgba(0, 0, 0, 0.125);
  border-left-style: solid;
  border-left-width: 1px;
  border-image-source: initial;
  border-image-slice: initial;
  border-image-width: initial;
  border-image-outset: initial;
  border-image-repeat: initial;
  padding: 0.75rem 1.25rem;
}
h3 {
  font-size: 1.75rem;
}
p {
  padding: 3px;
}
</style>
