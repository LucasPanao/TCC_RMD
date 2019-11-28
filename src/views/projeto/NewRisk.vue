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
              v-model="riskname"
              :rules="NameRule"
              :counter="20"
              prepend-icon="mdi-bullhorn"
              label="Nome do Risco"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <v-subheader class="pl-0">Probabilidade de Risco</v-subheader>
            <v-slider
              v-model="slider"
              :color="color"
              track-color="grey"
              :thumb-size="28"
              thumb-label="always"
            ></v-slider>
          </v-col>

          <v-col cols="12" md="12">
            <v-text-field
              v-model="valor"
              :rules="CostRule"
              v-model.lazy="price" 
              v-money="money"
              prepend-icon="mdi-briefcase"
              label="Custo do Risco"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="12">
            <div class="text-center">
              <v-btn block rounded @click="adicionarRisco()" color="primary" dark>Adicionar novo Risco</v-btn>
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
  data() {
    return {
      /* BRUH MOMENT */
      price: "15,00",
      money: {
        decimal: ",",
        thousands: ".",
        prefix: "R$ ",
        suffix: "",
        precision: 2,
        masked: false
      },
      valor: 0,
      directives: { money: VMoney },
      //==================
      valid: false,
      riskname: "",
      slider: 0,
      empresa: "",
      NameRule: [
        v => !!v || "Você precisa especificar um nome",
        v => v.length <= 20 || "O nome deve ser menor do que 20 caracteres"
      ],
      CostRule: [
        v => !!v || "Você precisa especificar um custo"
      ]
    };
  },
  methods: {
      async adicionarRisco() {
          if(this.riskname.length > 0 && this.price.length > 0){
              const resposta = await $.ajax({
                  type: "POST",
                  url: "https://dl.lucaspanao.ml/data.php",
                  data: {
                      mode: 5,
                      token: this.$session.get("token"),
                      projeto: this.$session.get("projectviewid"),
                      risco: this.riskname,
                      preco: this.price,
                      probabilidade: this.slider
                  },
              }, "json");

              if(resposta.status === "done"){
                  this.$router.push('/projectinfo').catch(err => {})
              }
          }
      }
  },
  computed: {
    color() {
      if (this.slider < 20) return "green";
      if (this.slider < 40) return "yellow darken-2";
      if (this.slider < 50) return "orange lighten-1";
      if (this.slider < 70) return "orange darken-2";
      if (this.slider < 80) return "orange darken-4";
      return "red";
    }
  }
};
</script>