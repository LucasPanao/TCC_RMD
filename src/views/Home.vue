<template>
  <div>
    <v-list three-line>
      <v-subheader>Projetos</v-subheader>
      <div v-if="items.length === 0">
        <v-banner>
          Não achamos nenhum projeto em sua conta, que tal adicionar um novo ?
          <template v-slot:actions>
            <v-btn to="/newproject" text color="primary">Adicionar</v-btn>
          </template>
        </v-banner>
      </div>
      <template v-else v-for="(item, index) in items">
        <v-divider
          v-if="item.divider"
          :key="index"
          :inset="item.inset"
        ></v-divider>

        <v-list-item
          v-else
          :key="item.nome"
          @click="ViewProjectInfo(item.id, item.nomeclean)"
        >
          <v-list-item-avatar>
            <v-icon :class="item.nivel">{{item.icon}}</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title v-html="item.nome"></v-list-item-title>
            <v-list-item-subtitle v-html="item.empresa"></v-list-item-subtitle>
            <v-list-item-subtitle v-html="item.responsavel"></v-list-item-subtitle>
            <v-list-item-subtitle v-html="item.descricao"></v-list-item-subtitle>
            <v-list-item-subtitle v-html="item.status"></v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-list>
    <v-btn fab dark large color="primary" @click="dialognewproject = true" fixed right bottom>
        <v-icon dark>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialognewproject" persistent max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <h3>Preencha todos os dados solicitados</h3>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="projectname"
                  :rules="ProjectRule"
                  :counter="15"
                  prepend-icon="mdi-bullhorn"
                  label="Nome do Projeto"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="descricao"
                  :rules="DescRule"
                  :counter="50"
                  prepend-icon="mdi-folder-text"
                  label="Descrição"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="empresa"
                  :rules="EmpresaRule"
                  :counter="15"
                  prepend-icon="mdi-briefcase"
                  label="Empresa"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  v-model="responsavel"
                  :rules="RespRule"
                  :counter="15"
                  prepend-icon="mdi-account-tie"
                  label="Gerente Responsável"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12" md="12">
                <v-dialog
                  ref="dialog"
                  v-model="modal"
                  :return-value.sync="date"
                  persistent
                  width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="date"
                      id="dataproject"
                      :rules="DateRule"
                      label="Data do Projeto"
                      prepend-icon="mdi-calendar-clock"
                      readonly
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker v-model="date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="primary" @click="modal = false">Cancelar</v-btn>
                    <v-btn text color="primary" @click="$refs.dialog.save(date), datadoprojeto = (new Date(date).getTime() / 1000)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>

              <v-col cols="12" md="12">
                <v-text-field
                  id="dinheiro"
                  v-model="valor"
                  :rules="ValorRule"
                  v-model.lazy="price" 
                  v-money="money"
                  label="Valor do Projeto"
                  prepend-icon="mdi-currency-usd"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-1" @click="dialognewproject = false">Cancelar</v-btn>
          <v-btn color="primary" @click="CriarNovoProjeto()">Criar Projeto</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
//Definições Comuns, para diminuir o consumo de banda
var ArrIcon       = ["mdi-shield-plus", "mdi-shield-search", "mdi-shield-search", "mdi-shield-alert", "mdi-shield-check"]
var ArrIconStyle  = ["display-1 grey--text", "display-1 yellow--text", "display-1 yellow--text text--darken-2", "display-1 yellow--text text--darken-4", "display-1 green--text text--accent-3"]
var ArrStatus     = ["<span class='grey--text'>Nenhum risco cadastrado</span>",
                      "<span class='yellow--text'>Probabilidade Baixa de Risco</span>",
                      "<span class='yellow--text text--darken-2'>Probabilidade Média de Risco</span>",
                      "<span class='yellow--text text--darken-4'>Probabilidade Alta de Risco</span>",
                      "<span class='green--text text--accent-3'>Projeto Finalizado</span>"]

import {VMoney} from 'v-money';

export default {
  data: () => ({
    items: [],
    dialognewproject: false,
    /* BRUH MOMENT */
    price: 100,
    money: {
      decimal: ',',
      thousands: '.',
      prefix: 'R$ ',
      suffix: '',
      precision: 2,
      masked: false
    },
    directives: {money: VMoney},
    modal: false,
    date: "",
    /* FORM */
    projectname: "",
    descricao: "",
    empresa: "",
    responsavel: "",
    valor: 0,
    datadoprojeto: 0,
    /* FORM */
    ProjectRule : [
      v => !!v || "Você precisa especificar um nome",
      v => v.length <= 15 || "O nome deve ser menor do que 15 caracteres"
    ],
    DescRule: [
      v => v.length <= 50 || "Sua descrição precisa ser menor do que 50 caracteres"
    ],
    EmpresaRule: [
      v => v.length <= 15 || "O nome da empresa deve ser menor do que 15 caracteres"
    ],
    RespRule: [
      v => !!v || "Você precisa especificar um responsável",
      v => v.length <= 15 || "O nome do responsável deve ser menor do que 15 caracteres"
    ],
    DateRule: [
      v => !!v || "Você precisa selecionar uma data"
    ],
    ValorRule: [
      v => !!v || "Você precisa selecionar o valor do projeto"
    ]
  }),
  methods: {
    ViewProjectInfo(projectid, nome) {
      this.$session.set("projectviewid", projectid);
      this.$router.push('/projectinfo').catch(err => {})
      this.$bus.$emit("openproject", {titulo: nome})
    },
    async CriarNovoProjeto() {
      if(this.projectname.length > 0 && this.responsavel.length > 0 &&
         this.datadoprojeto > 0 && this.price.length > 0){
          const response = await $.ajax({
             type: "POST",
             url: "https://dl.lucaspanao.ml/data.php",
             data: {
                mode: 3,
                token: this.$session.get("token"),
                nomeprojeto: this.projectname,
                descricao: this.descricao,
                empresa: this.empresa,
                responsavel: this.responsavel,
                dataprojeto: this.datadoprojeto,
                valordoprojeto: this.price
          }}, "json");

          if(response.status === "done"){
            this.dialognewproject = false
            this.LoadProjectList()
          }
      }
    },
    async LoadProjectList() {
      const resultado = await $.ajax({
        type: "POST",
        url: "https://dl.lucaspanao.ml/data.php",
        data: {
          token: this.$session.get("token"),
          mode: 2
        }
      }, "json");
      if (resultado.status !== "failed") {
        let idx = 0;
        this.items = []
        resultado.forEach(value => {
          this.items.push({
            id: value.id,
            icon: ArrIcon[value.status], nivel: ArrIconStyle[value.status],
            nomeclean: value.nome,
            nome: value.nome + ' <span class="grey--text body-2">'+(new Date(value.registrado * 1000).toLocaleDateString("pt-BR"))+'</span>',
            empresa: value.empresa ? "<span class='text--primary'>Empresa: "+value.empresa+"</span>":"",
            responsavel: "<span class='text--primary'>Responsável: "+value.responsavel+"</span>",
            descricao: value.descricao, 
            status: ArrStatus[value.status]
          });

          if(Object.keys(resultado).length !== (idx + 1)){
            this.items.push({ divider: true, inset: true });
          }

          idx++;
        });
      }
    }
  },
  async created() {
    this.$session.remove("projectviewid");
    this.$bus.$emit("openproject", {die: true})

    function dateToYMD(date) {
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }

    this.date = dateToYMD(new Date());
    this.datadoprojeto = (new Date(dateToYMD(new Date())).getTime() / 1000);
    
    this.LoadProjectList()
  }
};
</script>