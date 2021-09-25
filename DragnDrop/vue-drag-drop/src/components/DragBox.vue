<template>
  <div class="drag-drop-box">
    <div class="row">
     
      <div class="col-md-3 drag-col1" v-for="box in DragnDropBox" :key="box.boxNumber">
        <div class="p-2 alert alert-warning">
          <h3>{{ box.Name }}</h3>
          <div v-if="box.Name==='CUSTOMER'">
            <div v-for="c in Countries" :key="c.id">
             <select class="form-control" @change="changeJobTitle($event)">
              <option value="" selected disabled>Choose</option>
              <option v-for="Country in c.items" :value="Country.id" :key="Country.id">{{ Country.name }}</option>
            </select> 
            </div>
          </div>
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
        <button primary v-on:click="ResetClick">Reset</button>
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
    Countries:[],
  },
   data() {
    return {
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
      if (this.clonedCustomerItems.length > 1) {
        this.clonedCustomerItems.pop();
      }
    },
     onChangeAllocation() {     
      if (this.clonedAllocationItems.length > 1) {
        this.clonedAllocationItems.pop();
      }
    },
    saveClick() {      
      let entityFormOptions = {};
      let formParameters = {};
      entityFormOptions["entityName"] = "vel_reservation";
      entityFormOptions["useQuickCreateForm"] = true;
      //Set Stock On Hand Lookup
      if(this.clonedAllocationItems){
        formParameters["vel_stockonhand"] = this.clonedAllocationItems[0].id; // ID of the user.
        formParameters["vel_stockonhandname"] = this.clonedAllocationItems[0].name; // Name of the user.
        formParameters["vel_stockonhandtype"] = "vel_stockonhand"; // Table name. 
      }
       //Set Sales Opportunity Line Lookup
      if(this.clonedCustomerItems){
        formParameters["vel_salesopportunityline"] = this.clonedCustomerItems[0].id; // ID of the user.
        formParameters["vel_salesopportunitylinename"] = this.clonedCustomerItems[0].name; // Name of the user.
        formParameters["vel_salesopportunitylinetype"] = "opportunityproduct"; // Table name. 
      }
      // Open the form.
      Xrm.Navigation.openForm(entityFormOptions, formParameters).then(
        function (success) {          
          console.log(success);
       },
        function (error) {
          console.log(error);
        }
      );
    },
    ResetClick(){
      this.clonedAllocationItems=[];
      this.clonedCustomerItems=[];
    },
    
  },
 
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
