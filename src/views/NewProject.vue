<template>
  <div>
    <v-form class="mx-5" v-model="valid">
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

          <v-col cols="12" md="12">
            <div class="text-center">
                <v-btn block rounded color="primary" @click="CriarNovoProjeto" dark>Adicionar Projeto</v-btn>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </div>
</template>
<script>
import {VMoney} from 'v-money';

export default {
  data: () => ({
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
    //========================
    modal: false,
    valid: false,
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
            this.$router.push('/home').catch(err => {})
          }
      }
    }
  },
  created () {
    function dateToYMD(date) {
      var d = date.getDate();
      var m = date.getMonth() + 1;
      var y = date.getFullYear();
      return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    }
    this.date = dateToYMD(new Date());
    this.datadoprojeto = (new Date(dateToYMD(new Date())).getTime() / 1000);
  }
};
</script>