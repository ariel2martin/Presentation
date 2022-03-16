<template>
  <v-app>
    <v-main>
      <v-carousel hide-delimiters height="100%">
        <v-carousel-item>
          <v-container class="mt-4">
            <v-row>
              <v-col cols="12" xs="12" sm="12" md="6">
                <v-file-input
                  chips
                  id="file"
                  multiple
                  outlined
                  label="Agregar jugadores desde un archivo"
                  accept="text/csv,text/plain"
                  style="max-width: 80%"
                ></v-file-input>
                <v-spacer></v-spacer>
              </v-col>

              <v-col cols="12" xs="12" sm="12" md="6">
                <div class="text-right">
                  <v-spacer></v-spacer>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        elevation="2"
                        :color="Complementario1"
                        large
                        @click="daNumero()"
                        v-bind="attrs"
                        v-on="on"
                        class="mr-4"
                      >
                        Numerar
                      </v-btn>
                    </template>
                    <span
                      >Asigna numero a los que les falta, a partir del numero
                      mayor de ellos</span
                    >
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        elevation="2"
                        :color="Complementario1"
                        large
                        @click="vaciar()"
                        v-bind="attrs"
                        v-on="on"
                        class="mr-4"
                      >
                        Vaciar
                      </v-btn>
                    </template>
                    <span>vacía el listado</span>
                  </v-tooltip>
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        elevation="2"
                        :color="Complementario1"
                        large
                        @click="agrupar()"
                        v-bind="attrs"
                        v-on="on"
                        class="mr-4"
                      >
                        agrupar
                      </v-btn>
                    </template>
                    <span>a todos les asigna un grupo nuevo a azar, </span>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
          </v-container>
          <v-container>
            <v-data-table
              :headers="tableheader"
              :items="listado"
              :items-per-page="10"
              class="elevation-1"
            >
              <template v-slot:top>
                <v-toolbar flat>
                  <v-toolbar-title>Listado de jugadores</v-toolbar-title>
                  <v-spacer></v-spacer>
                </v-toolbar>
              </template>

              <template v-slot:item.comandos="{ item }">
                <v-icon small class="mr-2" @click="editJugador(item)">
                  mdi-pencil
                </v-icon>
                <v-icon small @click="deleteJugador(item)"> mdi-delete </v-icon>
              </template>
              <template v-slot:footer.page-text>
                <v-btn
                  :color="Complementario4"
                  class="ma-2"
                  @click="overlayAgregaJugador = true"
                >
                  <v-icon small> mdi-plus </v-icon>Agregar
                </v-btn>
              </template>
            </v-data-table>
          </v-container>

          <v-snackbar
            v-model="snackbar"
            timeout="10000"
            :color="Complementario4"
          >
            {{ snackbartext }}

            <template v-slot:action="{ attrs }">
              <v-btn
                color="black"
                text
                v-bind="attrs"
                @click="snackbar = false"
              >
                Cerrar
              </v-btn>
            </template>
          </v-snackbar>

          <v-overlay :value="overlay">
            <v-card class="mx-auto" max-width="450" :color="Complementario2">
              <v-card-text>
                <p class="text-h5 text--primary">¿cuantos grupos va a armar?</p>

                <v-simple-table dense>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th class="text-left">Grupos</th>
                        <th class="text-left">composición</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in gruposPosibles"
                        :key="item.name"
                        @click="
                          cantGruposElegidos = item;
                          eligeCantGrupos();
                        "
                      >
                        <td class="text-center">{{ item.cuantos }}</td>
                        <td>{{ item.texto }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  elevation="2"
                  :color="Complementario3"
                  @click="overlay = false"
                >
                  Cancelar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-overlay>

          <v-overlay :value="logoespera">
            <v-progress-circular
              :size="150"
              :width="17"
              color="purple"
              indeterminate
            ></v-progress-circular>
          </v-overlay>
          <v-overlay :value="overlayConfirmaAsignarGrupo">
            <template>
              <v-card
                class="mx-auto my-12"
                max-width="374"
                :color="Complementario5"
              >
                <v-card-title>Ya había asignado grupos</v-card-title>
                <v-card-text>
                  <div>
                    Si vuelve a asignar, los grupos actuales se reemplazarán por
                    otros al azar
                  </div>
                </v-card-text>
                <v-divider class="mx-4"></v-divider>
                <v-card-actions>
                  <v-btn
                    :color="Complementario1"
                    text
                    @click="
                      confirmadoAsignarGrupo = true;

                      eligeCantGrupos();
                    "
                  >
                    Confirmar
                  </v-btn>
                  <v-btn
                    :color="Complementario1"
                    text
                    @click="
                      overlayConfirmaAsignarGrupo = false;
                      overlay = false;
                    "
                  >
                    Cancelar
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-overlay>

          <v-overlay :value="overlayAgregaJugador">
            <v-card class="mx-auto" elevation="24" :color="Complementario3">
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    v-model="editaJugador[0].nombre"
                    :rules="[(v) => !!v || 'Faltó el nombre']"
                    required
                    label="Nombre"
                  ></v-text-field>

                  <v-text-field
                    v-model="editaJugador[0].posicion"
                    label="Numero"
                  ></v-text-field>
                  <v-text-field
                    v-model="editaJugador[0].grupo"
                    label="Grupo"
                  ></v-text-field>

                  <v-btn
                    :color="Complementario4"
                    class="mr-4"
                    @click="listadoAgrega(editaJugador)"
                  >
                    Agregar </v-btn
                  ><v-btn
                    :color="Complementario5"
                    class="mr-4"
                    @click="overlayAgregaJugador = false"
                  >
                    Cancelar
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-overlay>

          <v-overlay :value="overlayEditaJugador">
            <v-card class="mx-auto" elevation="24" :color="Complementario3">
              <v-card-text>
                <v-form ref="form">
                  <v-text-field
                    v-model="editaJugador[0].nombre"
                    :rules="[(v) => !!v || 'Faltó el nombre']"
                    required
                    label="Nombre"
                  ></v-text-field>

                  <v-text-field
                    v-model="editaJugador[0].posicion"
                    label="Numero"
                  ></v-text-field>
                  <v-text-field
                    v-model="editaJugador[0].grupo"
                    label="Grupo"
                  ></v-text-field>

                  <v-btn
                    :color="Complementario4"
                    class="mr-4"
                    @click="reemplazaJugador()"
                  >
                    Cambiar </v-btn
                  ><v-btn
                    :color="Complementario5"
                    class="mr-4"
                    @click="overlayEditaJugador = false"
                  >
                    Cancelar
                  </v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-overlay>
        </v-carousel-item>
        <v-carousel-item>
          <template>
            <v-container>
              <v-row class="text-center">
                <v-col cols="12" md="2">
                  <v-card
                    class="mx-auto"
                    elevation="24"
                    max-width="200px"
                    min-width="160px"
                    :color="Complementario3"
                    outlined
                  >
                    <v-card-text>
                      <v-form ref="form">
                        <v-select
                          :items="puntaje"
                          item-text="grupo"
                          :rules="[(v) => !!v || 'Falta']"
                          label="Grupo"
                          required
                          v-model="auxPuntoGrupo"
                          return-object
                        ></v-select>

                        <v-text-field
                          :rules="[numberRule]"
                          label="Puntaje"
                          v-model="auxPuntoValor"
                          type="number"
                        ></v-text-field>

                        <v-btn
                          :color="Complementario4"
                          class="mr-4"
                          @click="sumapuntos()"
                        >
                          Agregar
                        </v-btn>
                      </v-form>
                    </v-card-text>
                  </v-card>
                </v-col>
                <v-col cols="12" md="10">
                  <v-row no-gutters>
                    <v-col
                      v-for="item in puntaje"
                      :key="item.grupo"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-card class="mx-auto mb-5" width="300">
                        <v-card-text>
                          <p class="text-h4 text--primary">
                            {{ item.grupo }} ({{ item.total }})
                          </p>
                        </v-card-text>

                        <v-sparkline
                          :fill="true"
                          :gradient="gradients[4]"
                          line-width="2"
                          padding="2"
                          smooth="6"
                          :value="item.puntos"
                          auto-draw
                        ></v-sparkline>
                        <v-card-text>
                          <p>Puntos: {{ item.value.toString() }}</p>
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-container>
          </template>
        </v-carousel-item>
      </v-carousel>
    </v-main>
  </v-app>
</template>
<script>
import config from "../../configuraciones.js";
const gradients = [
  ["#222"],
  ["#42b3f4"],
  ["red", "orange", "yellow"],
  ["purple", "violet"],
  ["#00c6ff", "#F0F", "#FF0"],
  ["#f72047", "#ffd200", "#1feaea"],
];
export default {
  components: { config },
  data() {
    return {
      gradients,
      gruposPosibles: [],
      cantGruposElegidos: [],
      posicionDuplicada: [],
      listado: [],
      editaJugador: [{ nombre: "", posicion: "", grupo: "" }],
      editaJugadoraux: [],
      tableheader: [
        {
          text: "Nombre",
          align: "start",
          sortable: true,
          value: "nombre",
        },

        { text: "num", value: "posicion" },
        { text: "grupo", value: "grupo" },

        { text: "", value: "comandos" },
      ],
      overlay: false,
      logoespera: false,
      yaAsignoGrupo: undefined,
      overlayConfirmaAsignarGrupo: false,
      confirmadoAsignarGrupo: false,
      overlayAgregaJugador: false,
      overlayEditaJugador: false,
      snackbar: false,
      snackbartext: "",

      Complementario1: config.colors.complemento1,
      Complementario2: config.colors.complemento2,
      Complementario3: config.colors.complemento3,
      Complementario4: config.colors.complemento4,
      Complementario5: config.colors.complemento5,

      puntaje: [],
      auxPuntoGrupo: 0,
      auxPuntoValor: 0,
      numberRule: (v) => {
        if (!isNaN(parseFloat(v)) && v >= -99 && v <= 99) return true;
        return "numero entre -99 y 99";
      },
    };
  },
  //{ text: "grupo", value: "grupo" },
  beforeCreate() {
    console.log("beforeCreate");
  },
  created() {
    console.log("created");
  },
  beforeMount() {
    console.log("beforeMount");
  },
  mounted() {
    document
      .getElementById("file")

      .addEventListener("input", this.readFile, false);
    //change
    let pun = JSON.parse(localStorage.getItem("puntaje"));
    //console.warn(pun);
    if (pun != null) {
      this.puntaje = pun;
    }
    // es importante que primero tome el puntaje, que tiene grupos, y luego agregue el listado de jugadores
    // si listado de jugadores tien egrupos los agrega con puntaje cero
    this.yaAsignoGrupo = localStorage.getItem("yaAsignoGrupo") === "true"; //localstorage guarda texto, no booleans. hay que pasar de "false" a false
    this.listadoAgrega(JSON.parse(localStorage.getItem("listado")));

    console.log("mounted");
  },
  beforeUpdate() {
    console.log("beforeUpdate");
  },
  updated() {
    console.log("updated");
  },
  beforeDestroy() {
    console.log("beforeDestroy");
  },
  destroyed() {
    console.log("destroyed");
  },
  watch: {
    logoespera(val) {
      val &&
        setTimeout(() => {
          this.logoespera = false;
          this.overlay = false;
          this.overlayConfirmaAsignarGrupo = false;
        }, 3000);
    },
  },
  methods: {
    parseCSV(text) {
      // Obtenemos las lineas del texto
      let lines = text.replace(/\r/g, "").split("\n");

      return lines.map((line) => {
        // Por cada linea un nuevo array con los campos
        let values = line.split(",");
        return values.map((a) => {
          //a cada campo le hacemos Trim()
          let cada = a.replace(/^\s+|\s+$/gm, "");
          return cada;
        });
      });
    },

    creaJson(matrix) {
      let arrobj = [];

      for (var i in matrix) {
        var row = matrix[i];
        arrobj.push({
          nombre: row[0],
          posicion: row[1],
          grupo: row[2],
          adicional: row[3],
        });
      }
      return arrobj;
    },
    readFile(evt) {
      let file = evt.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        // Cuando el archivo se terminó de cargar
        let lines = this.parseCSV(e.target.result);
        let output = this.creaJson(lines);
        //console.log(lines);
        this.yaAsignoGrupo = false;
        localStorage.setItem("yaAsignoGrupo", false);
        this.listadoAgrega(output);
        document.getElementById("file").value = "";
      };
      // Leemos el contenido del archivo seleccionado
      //reader.readAsBinaryString(file);
      reader.readAsText(file);
    },
    listadoAgrega(datos) {
      //this.listado.push(datos);

      for (var i in datos) {
        if (datos[i].nombre > " ") {
          if (!this.duplicado(datos[i].nombre)) {
            this.pushSinDuplicadopos(datos[i]);
            this.preparaVariablePuntaje(datos[i].grupo);
            if (this.posicionDuplicada.length > 0) {
              this.snackbartext =
                "estos números estaban duplicados, entonces se importó el nombre del jugador pero no su número: " +
                this.posicionDuplicada.toString();
              this.snackbar = true;
              this.posicionDuplicada = [];
            }
          }
        }
      }
      localStorage.setItem("listado", JSON.stringify(this.listado));
      //localStorage.setItem("yaAsignoGrupo", this.yaAsignoGrupo);
      this.editaJugador = [{ nombre: "", posicion: "", grupo: "" }];
      this.overlayAgregaJugador = false;
    },

    listadoActualiza() {
      localStorage.setItem("listado", JSON.stringify(this.listado));
      localStorage.setItem("yaAsignoGrupo", this.yaAsignoGrupo);
    },
    vaciar() {
      this.listado = [];
      this.yaAsignoGrupo = false;
      this.listadoActualiza();
      //console.warn(document.getElementById("file").value.toString());
      document.getElementById("file").value = "";
      this.puntaje = [];
      localStorage.setItem("puntaje", JSON.stringify(this.puntaje));
    },
    daNumero() {
      let mayor = 0;
      for (let i = 0; i < this.listado.length; i++) {
        if (parseInt(this.listado[i].posicion) > mayor)
          mayor = parseInt(this.listado[i].posicion);
      }

      for (let i = 0; i < this.listado.length; i++) {
        if (
          this.listado[i].posicion == undefined ||
          this.listado[i].posicion < 1
        ) {
          this.listado[i].posicion = ++mayor;
        }
      }
      this.listadoActualiza();
    },
    duplicado(nombr) {
      if (this.listado.find((e) => e.nombre == nombr) == undefined) {
        return false;
      } else {
        return true;
      }
    },
    pushSinDuplicadopos(dato) {
      if (this.listado.find((e) => e.posicion == dato.posicion) == undefined) {
      } else {
        if (dato.posicion > " ") {
          this.posicionDuplicada.push(dato.posicion);
          dato.posicion = "";
        }
      }
      this.listado.unshift(dato);
    },
    agrupar() {
      this.gruposPosibles = [];
      let personas = this.listado.length;
      let aux1;
      let aux2;
      let grupos1, elementos1, grupos2, elementos2;
      for (let t = 2; t <= personas / 2 + 1; t++) {
        aux2 = "";
        grupos2 = personas % t;
        grupos1 = Math.floor(t - grupos2);
        elementos1 = Math.floor(personas / t);
        elementos2 = Math.ceil(personas / t);
        if (grupos1 > 1) {
          aux1 = grupos1.toString() + " grupos de " + elementos1.toString();
        } else {
          aux1 = grupos1.toString() + " grupo de " + elementos1.toString();
        }
        if (grupos2 > 0) {
          if (grupos2 > 1) {
            aux2 =
              " y\n" +
              grupos2.toString() +
              " grupos de " +
              elementos2.toString();
          } else {
            aux2 =
              " y\n" +
              grupos2.toString() +
              " grupo de " +
              elementos2.toString();
          }
        } else {
          grupos2 = 0;
          elementos2 = 0;
        }

        this.gruposPosibles.push({
          cuantos: t,
          texto: aux1 + aux2,
          grupos1: grupos1,
          elementos1: elementos1,
          grupos2: grupos2,
          elementos2: elementos2,
        });
      }
      this.overlay = true;
    },
    eligeCantGrupos() {
      if (this.yaAsignoGrupo && !this.confirmadoAsignarGrupo) {
        //que confirme porque  ya asigno grupos antes, no sea cosa que los pierda
        this.overlayConfirmaAsignarGrupo = true;
      }

      if (
        !this.yaAsignoGrupo ||
        (this.yaAsignoGrupo && this.confirmadoAsignarGrupo)
      ) {
        this.overlayConfirmaAsignarGrupo = false;
        this.logoespera = true;
        //a cada elemento le pone un numero al azar
        //luego se ordena por ese numero
        //y finalmente, con ese orden, se asignan los grupos
        for (let i = 0; i < this.listado.length; i++) {
          this.listado[i].random = Math.random();
        }
        this.listado.sort(function (a, b) {
          if (a.random > b.random) {
            return 1;
          }
          if (a.random < b.random) {
            return -1;
          }

          return 0;
        });

        let g = 0;
        let pos = 0;
        this.puntaje = [];
        // hay dos tipos de grupo, por eso dos for
        for (let i = 0; i < this.cantGruposElegidos.grupos1; i++) {
          for (let j = 0; j < this.cantGruposElegidos.elementos1; j++) {
            this.listado[pos].grupo = "G" + (g + 1).toString();
            this.preparaVariablePuntaje("G" + (g + 1).toString());
            pos++;
          }
          g++;
        }

        for (let i = 0; i < this.cantGruposElegidos.grupos2; i++) {
          for (let j = 0; j < this.cantGruposElegidos.elementos2; j++) {
            this.listado[pos].grupo = "G" + (g + 1).toString();
            this.preparaVariablePuntaje("G" + (g + 1).toString());
            pos++;
          }
          g++;
        }

        this.yaAsignoGrupo = true;
        this.confirmadoAsignarGrupo = false;
        this.listadoActualiza();
      }
    },
    preparaVariablePuntaje(q) {
      // me fijo si no está dado de alta el grupo, lo agrego
      if (
        q != undefined &&
        q.toString > "" &&
        this.puntaje.findIndex((i) => i.grupo === q) == -1
      ) {
        let cuerpo = {
          grupo: q,
          value: [0],
          puntos: [0],
          total: 0,
        };
        this.puntaje.push(cuerpo);
      }
    },
    editJugador(item) {
      this.editaJugadoraux = item;
      this.overlayEditaJugador = true;

      this.editaJugador[0].nombre = item.nombre;
      this.editaJugador[0].posicion = item.posicion;
      this.editaJugador[0].grupo = item.grupo;
    },
    deleteJugador(item) {
      let donde = this.listado.findIndex((i) => i === item);

      if (donde > -1) {
        this.listado.splice(donde, 1);
        this.listadoActualiza();
      } else alert("No puedo manejar este nombre: " + item.nombre);
    },
    reemplazaJugador() {
      this.deleteJugador(this.editaJugadoraux);
      this.listadoAgrega(this.editaJugador);
      this.overlayEditaJugador = false;
    },
    sumapuntos(e) {
      if (!this.auxPuntoGrupo.grupo) return;
      let posicion = this.puntaje.findIndex(
        (i) => i.grupo === this.auxPuntoGrupo.grupo
      );

      this.puntaje[posicion].value.push(parseInt(this.auxPuntoValor));
      /* esto funciona muy bien, lee el ultimo valor de los puntos,  sin usar slice que crearia un array nuevo,  pero mejor creo un campo Puntaje donde acumulo el total y listo
      let ultimo =
        this.puntaje[posicion].puntos[this.puntaje[posicion].puntos.length - 1];
      console.warn(ultimo);
      if (ultimo == undefined) {
        console.log("si");
        ultimo = 0;
      }
      ultimo = ultimo + parseInt(this.auxPuntoValor);
      this.puntaje[posicion].puntos.push(ultimo);
*/
      let total = this.puntaje[posicion].total + parseInt(this.auxPuntoValor);
      this.puntaje[posicion].total = total;
      this.puntaje[posicion].puntos.push(total);
      localStorage.setItem("puntaje", JSON.stringify(this.puntaje));
    },
  },
};
</script>
