<template>
  <v-container fill-height>
    <v-layout row wrap align-center>
      <v-flex class="text-xs-center">
        <div class="text-center justify-center">
          <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular>
          <br />
          <h3>Finalizando a sessão...</h3>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
export default {
  async created() {
    const response = await $.ajax({
      type: "POST",
      url: "https://lucaspanao.ml/dl/logout.php",
      data: { token: this.$session.get("token") }
    },"json");

    this.$bus.$emit('logged', false);
    this.$session.destroy();
    this.$router.push('/');
  }
};
</script>