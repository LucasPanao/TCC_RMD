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
          <v-btn block text small color="error"><v-icon left>mdi-delete</v-icon>Deletar o Projeto</v-btn>
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
    async checkbox_select(evento) {
      const resultado = await $.ajax({
        type: "POST",
        url: "https://dl.lucaspanao.ml/data.php",
        data: {
            projetoid: this.$session.get("projectviewid"),
            idtarget: evento.target.value,
            checked: evento.target.checked,
            token: this.$session.get("token"),
            mode: 8
        }
      }, "json");

      if(resultado){
        console.log(resultado);
      }
    }
  },
  async created () {
      if(this.$session.has("projectviewid")){
        let resultado = await $.ajax({
            type: "POST",
            url: "https://dl.lucaspanao.ml/data.php",
            data: {
                idprojeto: this.$session.get("projectviewid"),
                token: this.$session.get("token"),
                mode: 4
            }
        }, "json");

        if (resultado) {
          this.projectinfo.push(
            { id: 0, nome: "Nome do Projeto", valor: resultado.nome},
            { id: 1, nome: "Empresa", valor: resultado.empresa ? resultado.empresa:"Nenhuma empresa cadastrada"},
            { id: 2, nome: "Responsável", valor: resultado.responsavel},
            { id: 3, nome: "Descrição", valor: resultado.descricao ? resultado.descricao:"Nenhuma descrição cadastrada"},
            { id: 4, nome: "Valor do Projeto", valor: resultado.valor },
            { id: 5, nome: "Data do Projeto", valor: new Date(resultado.registrado * 1000).toLocaleDateString("pt-BR")}
          )
        }

        let resultado2 = await $.ajax({
            type: "POST",
            url: "https://dl.lucaspanao.ml/data.php",
            data: {
                token: this.$session.get("token"),
                mode: 6
            }
        }, "json");

        if (resultado2) {
          //vai pegar todos os riscos que existirem.
          resultado2.forEach(elemento => {
            this.listrisco.push({
              idtarget: elemento.id,
              nome: elemento.nome
            });
          });

          let resultado3 = await $.ajax({
            type: "POST",
            url: "https://dl.lucaspanao.ml/data.php",
            data: {
              token: this.$session.get("token"),
              projeto: this.$session.get("projectviewid"),
              mode: 7
            }
          }, "json");

          if(resultado3){
            if(resultado3.status !== "failed") {
              resultado3.forEach(item => {
                this.selected.push(item.risco_id)
              })
            }
          }
        }
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