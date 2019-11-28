<template>
  <div>
    <v-list two-line subheader>
      <v-subheader>Informações do Projeto</v-subheader>
      <v-list-item v-for="campo in projectinfo" :key="campo.id">
        <v-list-item-content>
          <v-list-item-title v-text="campo.nome"></v-list-item-title>
          <v-list-item-subtitle v-text="campo.valor"></v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <v-divider></v-divider>
    <div class="bgdark">
      <v-col class="text-center" cols="12" sm="12">
        <div class="my-0">
          <v-btn block text><v-icon left>mdi-pencil</v-icon>Alterar as Informações</v-btn>
          <v-btn block text color="error" @click="DeletarProjeto"><v-icon left>mdi-delete</v-icon>Deletar o Projeto</v-btn>
        </div>
      </v-col>
    </div>
    <v-divider></v-divider>

    <v-list subheader two-line flat>
      <v-subheader>Riscos</v-subheader>

      <v-list-item-group v-if="listrisco.length > 0" multiple>
        <v-list-item :ripple="false" v-for="(item, index) in listrisco" :key="index">
          <template>
            <v-list-item-action style="margin-right: 12px;" :key="index">
              <v-switch v-model="selected" @click="checkbox_select($event)" inset :ripple="false" color="primary" :value="item.idtarget"></v-switch>
            </v-list-item-action>

            <v-list-item-content :key="item.idtarget">
              <v-list-item-title v-html="item.nome"></v-list-item-title>
            </v-list-item-content>
          </template>
        </v-list-item>
      </v-list-item-group>
      <v-subheader v-else >Nenhum risco encontrado</v-subheader>
    </v-list>
    <v-btn fab dark large color="primary" to="/newrisk" fixed right bottom>
        <v-icon dark>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>
<script>
import axios from 'axios';
import qs from "qs";

export default {
  data() {
      return {
        selected: [],
        listrisco: [],
        projectinfo: [],
        nomedoprojeto: "carregando...",
        empresa: "carregando...",
        responsavel: "carregando...",
        descricao: "carregando...",
        valordoprojeto: "carregando...",
        datadoprojeto: "carregando..."
      }
  },
  methods: {
    checkbox_select(evento) {
      axios.post("https://dl.lucaspanao.ml/data.php",
        qs.stringify({
          projetoid: this.$session.get("projectviewid"),
          idtarget: evento.target.value,
          checked: evento.target.checked,
          token: this.$session.get("token"),
          mode: 8
        })
      )
    },
    DeletarProjeto() {
      axios.post("https://dl.lucaspanao.ml/data.php",
        qs.stringify({
          projetoid: this.$session.get("projectviewid"),
          token: this.$session.get("token"),
          mode: 9
        })
      ).then(response => {
        if(response.data.status === "done") {
          //sair
          this.$session.remove("projectviewid");
          this.$bus.$emit("openproject", {die: true})
          this.$router.push('/home').catch(err => {});
        }
      })
    }
  },
  created () {
    if(this.$session.has("projectviewid")){
      axios.post("https://dl.lucaspanao.ml/data.php",
        qs.stringify({
          idprojeto: this.$session.get("projectviewid"),
          token: this.$session.get("token"),
          mode: 4
        })
      ).then(response => {
        if(response.data){
          this.projectinfo.push(
            { id: 0, nome: "Nome do Projeto", valor: response.data.nome},
            { id: 1, nome: "Empresa", valor: response.data.empresa ? response.data.empresa:"Nenhuma empresa cadastrada"},
            { id: 2, nome: "Responsável", valor: response.data.responsavel},
            { id: 3, nome: "Descrição", valor: response.data.descricao ? response.data.descricao:"Nenhuma descrição cadastrada"},
            { id: 4, nome: "Valor do Projeto", valor: response.data.valor },
            { id: 5, nome: "Data do Projeto", valor: new Date(response.data.registrado * 1000).toLocaleDateString("pt-BR")}
          )
        }
      })

      axios.post("https://dl.lucaspanao.ml/data.php",
        qs.stringify({
          token: this.$session.get("token"),
          userid: this.$session.get("userid"),
          mode: 6
        })
      ).then(response => {
        if(response.data.length > 0 ){
          response.data.forEach(elemento => {
            this.listrisco.push({
              idtarget: elemento.id,
              nome: elemento.nome
            });
          });

          axios.post("https://dl.lucaspanao.ml/data.php",
            qs.stringify({
              token: this.$session.get("token"),
              projeto: this.$session.get("projectviewid"),
              mode: 7
            })
          ).then(response => {
            if(response.data.status !== "failed") {
              response.data.forEach(item => {
                this.selected.push(item.risco_id)
              })
            }
          })
        }
      })
      
    }else{
      this.$router.push('/home').catch(err => {})
    }
  },
};
</script>
<style scoped>
.bgdark {
  background: #424242 !important;
}
</style>