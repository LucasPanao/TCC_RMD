<template>
    <div>
        <v-list v-if="listaderiscos.length > 0" two-line>
            <v-list-item v-for="(risco, index) in listaderiscos" :key="risco.id">
                <v-list-item-avatar>
                    <v-icon large>mdi-briefcase</v-icon>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-list-item-title v-text="risco.nome"></v-list-item-title>
                    <v-list-item-subtitle v-text="`Probabilidade: ${risco.probabilidade}%`"></v-list-item-subtitle>
                </v-list-item-content>

                <div>
                    <v-btn class="mr-2 black--text" icon dark color="yellow darken-1">
                        <v-icon>mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn color="primary" icon dark @click="DeletarRisco(risco.id, index)">
                        <v-icon>mdi-delete</v-icon>
                    </v-btn>
                </div>
            </v-list-item>
        </v-list>
        <v-subheader v-else>Nenhum risco encontrado</v-subheader>
    </div>
</template>

<script>
import axios from "axios"
import qs from "qs"

export default {
    data() {
        return {
            listaderiscos: []
        }
    },
    methods: {
        DeletarRisco(id, index) {
            axios.post("https://dl.lucaspanao.ml/data.php", 
                qs.stringify({
                    projetoid: this.$session.get("projectviewid"),
                    idtarget: id,
                    token: this.$session.get("token"),
                    mode: 12,
                    projectonly: true
                })
            ).then(response => {
                if(response.data.status === "done"){
                    this.listaderiscos.splice(index, 1);
                }
            })
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
                }
            })
        }
    },
}
</script>

<style scoped>

</style>