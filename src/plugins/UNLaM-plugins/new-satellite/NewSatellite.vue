<template>
  <form @submit.prevent="onSubmit">
    <label for="name">Satellite Name</label>
    <input type="text" placeholder="SatName" v-model="satName" />
  </form>
</template>

<script>
export default {
  data() {
    return {
      satName: ''
    };
  },
  methods: {
    onSubmit() {
      console.log(this.satName);
    }
  }
};
</script>
