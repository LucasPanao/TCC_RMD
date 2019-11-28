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
import axios from "axios"
import qs from "qs"

export default {
  created() {
    axios.post("https://lucaspanao.ml/dl/logout.php",
      qs.stringify({
        token: this.$session.get("token")
      })
    ).then(response => {
      this.$bus.$emit('logged', false);
      this.$session.destroy();
      this.$router.push('/');
    })
  }
};
</script>