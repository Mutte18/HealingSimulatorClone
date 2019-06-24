<template>
  <div>
    <div class="raid-member disable-select"
         :class="{targeted: isTargeted}"
         :style="getHealthPointStyle"
    >
      <p>{{ healthPoints }} / {{ maxHealth }}</p>
    </div>
  </div>
</template>

<script>
  import {EventBus} from "./main";

  export default {
    props: {
      id: {
        type: Number,
        required: true
      },
      isTargeted: {
        type: Boolean,
        required: true
      },
      healthPoints: {
        type: Number,
        required: true
      },
      maxHealth: {
        type: Number,
        required: true
      }

    },
    data() {
      return {

      }
    },
    computed: {
      getHealthPointStyle(){
        if(this.healthPoints > 75){
          return {
            'background-color': 'green'
          };
        }
        else if(this.healthPoints > 50){
          return {
            'background-color': 'lightgreen'
          };
        }
        else if(this.healthPoints > 25){
          return {
            'background-color': 'yellow'
          };
        }
        else if(this.healthPoints > 0){
          return {
            'background-color': 'red'
          };
        }
      }
    },
    methods: {
      getTargeted(){
        //return this.isTargeted;
      },
      setTargeted(){
        //this.isTargeted = !this.isTargeted;
      }
    },
    created(){
      EventBus.$on('setTarget', (event) => {
        console.log(event);

        this.setTargeted();
      })
    }
  }
</script>

<style>
  .raid-member {
    width: 100px;
    height: 50px;
    border: 1px solid black;
    float: left;
    margin-left: 1px;
    text-align: center;
  }
  .targeted{
    border: 1px solid red;
  }

  .mouseOverTarget{
    border: 1px dashed yellow;
  }
  .health{
    background-color: green;
  }

  .disable-select {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none;
    /* Non-prefixed version, currently
                                     supported by Chrome and Opera */
  }

</style>
