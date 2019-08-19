<template>
  <div>
    <div class="raid-member disable-select outerHpBar"
         :class="{targeted: isTargeted}"

    >
      <app-health-bar
        :health-points="healthPoints"
        :max-health="maxHealth"
        :is-alive="isAlive"
        :classification="classification"
      />

    </div>

  </div>
</template>

<script>
  import {EventBus} from "../../main";
  import HealthBar from "./HealthBar";

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
      },
      isAlive: {
        type: Boolean,
        required: true
      },
      classification: {
        type: String,
        required: true
      }

    },
    data() {
      return {}
    },
    components: {'app-health-bar': HealthBar},

    computed: {

    },
    methods: {
      getTargeted() {
        //return this.isTargeted;
      },
      setTargeted() {
        //this.isTargeted = !this.isTargeted;
      }
    },
    created() {
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
  }

  .targeted {
    border: solid red 1px;
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
