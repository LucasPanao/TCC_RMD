<template>
  <div>
    <v-app-bar app class="primary">
      <v-app-bar-nav-icon v-if="logado" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title v-if="!customtitle" class="headline text-uppercase white--text">
        <span>RMD</span>
        <span class="font-weight-light">beta</span>
      </v-toolbar-title>
      <v-toolbar-title v-else class="headline text-uppercase white--text">
        <span>{{ customtitle }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="exitproject" v-if="customtitle" icon>
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
      <!--
      <v-btn v-if="logado && !customtitle" icon>
        <v-icon>mdi-bell</v-icon>
      </v-btn>
      -->
    </v-app-bar>

    <v-navigation-drawer v-if="logado" v-model="drawer" app fixed>
      <v-list-item>
        <v-list-item-avatar class="mr-2">
          <v-icon x-large>mdi-account-circle</v-icon>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ username }}</v-list-item-title>
          <v-list-item-subtitle>{{ usermail }}</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list v-if="!customtitle" dense>
        <v-list-item v-for="item in items" :key="item.title" :to="item.local" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-list v-else dense>
        <v-list-item v-for="item in itemsproject" :key="item.title" :to="item.local" link>
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>
<script>
import axios from 'axios';
import qs from "qs";

export default {
  data() {
    return {
      customtitle: null,
      logado: false,
      drawer: null,
      username: "carregando...",
      usermail: null,
      items: [
        { title: 'Inicio', icon: 'mdi-monitor-dashboard', local: "/home" },
        { title: 'Lista de Riscos', icon: 'mdi-clipboard-list-outline', local: "/risklist" },
        { title: 'Sair', icon: 'mdi-exit-to-app', local: "/logout" },
      ],
      itemsproject: [
        { title: 'Informações do Projeto', icon: 'mdi-folder-information', local: "/projectinfo" },
        { title: 'Novo Risco', icon: 'mdi-timeline-plus', local: "/newrisk" },
        { title: 'Identificação de Riscos', icon: 'mdi-file-document-box-search', local: "/riskidentify"},
        { title: 'Análise Quantitativa', icon: 'mdi-file-settings-variant', local: "/analyze"},
        { title: 'Resposta aos Riscos', icon: 'mdi-hammer', local: "/respostarisk"},
        { title: 'Sair do projeto', icon: 'mdi-window-close', local: "/home"},
      ],
      token: null
    };
  },
  methods: {
    exitproject() {
      this.$session.remove("projectviewid");
      this.$bus.$emit("openproject", {die: true})
      this.$router.push('/home').catch(err => {});
    }
  },
  async created() {
    this.$bus.$on('logged', (resultado) => {
      this.logado = resultado;
      if(!resultado){
        this.customtitle = null;
      }else{
        this.token = this.$session.get("token");

        axios.post("https://dl.lucaspanao.ml/data.php", 
          qs.stringify({
            token: this.token,
            mode: 1
          })
        ).then(response => {
          if (response.data.status !== "failed") {
            this.logado = true;
            this.username = response.data.nome;
            this.usermail = response.data.email;
          }else{
            this.logado = false;
            this.$session.destroy();
            this.$router.push('/').catch(err => {})
          }
        })
      }
    })

    this.$bus.$on('openproject', (data) => {
      if(data.die){
        this.customtitle = null
      }else{
        this.customtitle = data.titulo
        //this.itemsproject[0].title = data.titulo
      }
    })
    
    if (this.$session.has("token")) {
      if(this.$session.has("projectviewid"))
        this.$router.push('/home').catch(err => {})

      this.token = this.$session.get("token");
      axios.post("https://dl.lucaspanao.ml/data.php", 
        qs.stringify({
          token: this.token, 
          mode: 1
        })
      ).then(response => {
        if (response.data.status !== "failed") {
          this.logado = true;
          this.username = response.data.nome;
          this.usermail = response.data.email;
        }else{
          this.logado = false;
          this.$session.destroy();
          this.$router.push('/').catch(err => {})
        }
      })
    }
  }
};
</script>