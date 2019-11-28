<template>
  <v-container class="fill-height" fluid>
    <v-row class="mx-0" align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Informe os seus dados</v-toolbar-title>
            <div class="flex-grow-1"></div>
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-btn to="/criarconta" :href="source" icon large v-on="on">
                  <v-icon>mdi-account-plus-outline</v-icon>
                </v-btn>
              </template>
              <span>Criar uma conta</span>
            </v-tooltip>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field v-model="usuario" :rules="UserRule" autocomplete="off" label="Usuário" prepend-icon="mdi-account" type="text" pattern="[a-zA-Z0-9-]+"></v-text-field>
              <v-text-field v-model="senha" autocomplete="off" label="Senha" prepend-icon="mdi-lock" type="password"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn block color="primary" :loading="loading" :disabled="loading" @click="login">Acessar</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout">
      {{ snacktext }}
      <v-btn color="blue" text @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-container>
</template>
<script>
import Vue from "vue";
import router from "vue-router";

export default {
  name: "login",
  props: {
    source: String
  },
  data: () => ({
    //Snackbar
    snackbar: false,
    snacktext: null,
    timeout: 3000,
    //============
    drawer: null,
    loader: null,
    loading: false,
    //==== login input =====
    UserRule: [
      v => /(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/g.test(v) || 'Remova os caracteres inválidos',
      v => v.length <= 20 || "O nome deve ser menor do que 20 caracteres"
    ],
    usuario: "",
    senha: ""
  }),
  methods: {
    async login() {
      this.loader = "loading";
      if (this.usuario !== null && this.senha !== null) {
        const response = await $.ajax({
          type: "POST",
          url: "https://lucaspanao.ml/dl/login.php",
          data: {
            username: btoa(this.usuario),
            password: btoa(this.senha)
          }
        },"json");
        
        if (response.status === "done") {
          this.$session.start()
          this.$session.set('token', response.token);
          this.$bus.$emit('logged', true);
          this.$router.push('/home').catch(err => {})
        } else {
          this.loader = null;
          this.snacktext = "Usuário ou senha inválido";
          this.snackbar = true;
        }
      }else{
        this.snacktext = "Preencha todos os campos com os seus dados de acesso";
        this.snackbar = true;
      }
    }
  }
};
</script>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>