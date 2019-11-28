<template>
    <div>
        <v-row class="mx-0">
            <v-col cols="12" class="grey darken-4 text-center">
                <span class="title" v-text="`Valor base: R$ ${formatNumber(valorbase)}`"></span>
            </v-col>
            <v-col cols="12" class="grey darken-4">
                <v-row class="mx-0">
                    <v-col class="pa-0 caption text-center" cols="3">RISCO</v-col>
                    <v-col class="pa-0 caption text-center" cols="2">PROB.</v-col>
                    <v-col class="pa-0 caption text-center" cols="2">IMPACTO</v-col>
                    <v-col class="pa-0 caption text-center" cols="2">VALOR</v-col>
                </v-row>
            </v-col>
            <v-col v-for="(risco, index) in listaderiscos" :key="risco.id" class="px-1 grey darken-3" :style="risco.disabled ? 'opacity: .5':''" cols="12">
                <v-row class="mx-0">
                    <v-col class="pa-0 d-flex align-center justify-center body-2" cols="3" v-text="(risco.nome.slice(0, 9) + '...')">
                        {{risco.nome}}
                    </v-col>
                    <v-col :class="`pa-0 d-flex align-center justify-center body-2 black--text ${Color(risco.probabilidade)}`" cols="2">
                        {{risco.probabilidade}}%
                    </v-col>
                    <v-col class="pa-0 d-flex align-center justify-center body-2 green--text text--accent-2" cols="2">
                        {{risco.preco}}
                    </v-col>
                    <v-col class="pa-0 d-flex align-center justify-center body-2" cols="2" v-text="(risco.probabilidade / 100 * risco.preco.replace('R$ ', '').replace('.', '').replace(',', '.'))">
                    </v-col>
                    <v-col class="pa-0 d-flex justify-center" cols="3">
                        <v-btn @click="AceitarRisco(risco.id, index)" color="success" class="mr-1" fab x-small>
                            <v-icon>mdi-check</v-icon>
                        </v-btn>
                        <v-btn @click="EliminarRisco(risco.id, index)" color="error" fab x-small>
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import axios from "axios"
import qs from "qs"

export default {
    data() {
        return {
            listaderiscos: [],
            valorbase: 0,
        }
    },
    methods: {
        AceitarRisco(id, index) {
            let risco = this.listaderiscos[index]

            if(risco.disabled) {
                this.$set(this.listaderiscos, index, Object.assign({}, this.listaderiscos[index], {disabled: false}))
                this.valorbase += Number((risco.probabilidade / 100 * risco.preco.replace('R$ ', '').replace('.', '').replace(',', '.')).toFixed(2))
            }
        },
        EliminarRisco(id, index) {
            let risco = this.listaderiscos[index]

            if(!risco.disabled){
                this.$set(this.listaderiscos, index, Object.assign({}, this.listaderiscos[index], {disabled: true}))
                this.valorbase -= Number((risco.probabilidade / 100 * risco.preco.replace('R$ ', '').replace('.', '').replace(',', '.')).toFixed(2))
            }
        },
        Color(data) {
            if (data < 20) return "green";
            if (data < 40) return "yellow darken-2";
            if (data < 50) return "orange lighten-1";
            if (data < 70) return "orange darken-2";
            if (data < 80) return "orange darken-4";
            return "red";
        },
        formatNumber(num) {
            return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
        }
    },
    created () {
        if(this.$session.has("projectviewid") && this.$session.has("token")){
            axios.post("https://dl.lucaspanao.ml/data.php",
                qs.stringify({
                    token: this.$session.get("token"),
                    mode: 10,
                    projectid: this.$session.get("projectviewid"),
                    projectonly: true
                })
            ).then(response => {
                if(response.data.length > 0){
                    this.listaderiscos = response.data

                    this.listaderiscos.forEach(risco => {
                        this.valorbase += (risco.probabilidade / 100 * risco.preco.replace('R$ ', '').replace('.', '').replace(',', '.'))
                    });
                }
            })
        }
    }
}
</script>

<style scoped>
</style>