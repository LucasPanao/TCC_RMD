<template>
  <v-container class="fill-height" fluid>
    <v-row class="mx-0" align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="elevation-12">
            <v-form ref="form">
                <v-toolbar color="primary" dark flat>
                    <v-toolbar-title>Criar um novo usuário</v-toolbar-title>
                </v-toolbar>
                <v-card-text>  
                    <v-text-field v-model="nome" :rules="NameRule" :counter="20" autocomplete="off" label="Nome" prepend-icon="mdi-account-box" type="text" pattern="[a-zA-Z0-9-]+"></v-text-field>
                    <v-text-field v-model="usuario" :rules="UserRule" :counter="20" autocomplete="off" label="Usuário" prepend-icon="mdi-account" type="text" pattern="[a-zA-Z0-9-]+"></v-text-field>
                    <v-text-field v-model="email" :rules="MailRule" autocomplete="off" label="Email" prepend-icon="mdi-at" type="text"></v-text-field>
                    <v-text-field v-model="senha" :rules="PWRule" autocomplete="off" label="Senha" prepend-icon="mdi-lock" type="password"></v-text-field>
                </v-card-text>
                <v-card-actions>
                    <v-btn block color="primary" @click="CreateAcc">Criar uma conta</v-btn>
                </v-card-actions>
                <v-card-actions class="pt-0">
                    <v-btn block color="dark" to="/">Cancelar</v-btn>
                </v-card-actions>
            </v-form>
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
export default {
    data: () => ({
        //Snackbar
        snackbar: false,
        snacktext: null,
        timeout: 3000,
        //==== login input =====
        nome: "",
        usuario: "",
        email: "",
        senha: "",
        //Regras
        NameRule: [
            v => !!v || "Você precisa especificar um nome",
            v => v.length <= 20 || "O nome deve ser menor do que 20 caracteres"
        ],
        UserRule: [
            v => /(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/g.test(v) || 'Remova os caracteres inválidos',
            v => v.length <= 20 || "O nome deve ser menor do que 20 caracteres"
        ],
        MailRule: [ v => /.+@.+/.test(v) || 'Email inválido' ],
        PWRule: [
            v => !!v || "Você precisa digitar uma senha"
        ],
    }),
    methods: {
        async CreateAcc() {
            if (this.$refs.form.validate()) {
                let ajaxconsulta = await $.ajax({
                    type: "POST",
                    url: "https://lucaspanao.ml/dl/register.php",
                    data: {
                        name: btoa(this.nome),
                        username: btoa(this.usuario),
                        email: btoa(this.email),
                        password: btoa(this.senha)
                    }
                },"json");

                if(ajaxconsulta) {
                    if(ajaxconsulta.status === "done"){
                        this.snacktext = "Conta criada com sucesso";
                        this.snackbar = true;
                        this.$router.push('/').catch(err => {})
                    }else{
                        this.snacktext = "Nome de usuário já está em uso";
                        this.snackbar = true;
                    }
                    console.log(ajaxconsulta)
                }
            }
        }
    },
};
</script>

<style scoped>
</style>