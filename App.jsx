import React, { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Alert,
  Pressable,
  Image,
  Modal, Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AlertNotificationRoot } from "react-native-alert-notification";
import Header from "./src/components/Header";
import NuevoPresupuesto from "./src/components/NuevoPresupuesto";
import ControlPresupuesto from "./src/components/ControlPresupuesto";
import FormularioGasto from "./src/components/FormularioGasto";
import ListadoGastos from "./src/components/ListadoGastos";
import Filtro from "./src/components/Filtro";
import { generarId } from "./src/helpers";
import DialogComponent from "./src/components/DialogComponent";
import Loader from "./src/components/Loader";

const App = () => {
    const [isValidPresupuesto, setIsValidPresupuesto] = useState(false);
    const [presupuesto, setPresupuesto] = useState("");
    const [gastos, setGastos] = useState([]);
    const [modal, setModal] = useState(false);
    const [gasto, setGasto] = useState({});
    const [filtro, setFiltro] = useState("");
    const [gastosFiltrados, setGastosFiltrados] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showModalPresupuesto, setShowModalPresupuesto] = useState(false);
    const [updateStorage, setUpdateStorage] = useState(false);

    useEffect(() => {
      const obtenerPresupuestoStorage = async () => {
        try {
          const presupuestoStorage =
            (await AsyncStorage.getItem("planificador_presupuesto")) ?? 0;

          if (presupuestoStorage > 0) {
            setPresupuesto(presupuestoStorage);
            setIsValidPresupuesto(true);
          }
        } catch (error) {
          console.log(error);
        }
      };
      obtenerPresupuestoStorage().then();
    }, []);

    useEffect(() => {
      if (isValidPresupuesto) {
        const guardarPresupuestoStorage = async () => {
          try {
            await AsyncStorage.setItem("planificador_presupuesto", presupuesto);
          } catch (error) {
            console.log(error);
          }
        };
        guardarPresupuestoStorage().then();
      }
    }, [isValidPresupuesto, presupuesto]);

    useEffect(() => {
      const obtenerGastosStorage = async () => {
        try {
          const gastosStorage = await AsyncStorage.getItem("planificador_gastos");

          setGastos(gastosStorage ? JSON.parse(gastosStorage) : []);
        } catch (error) {
          console.log(error);
        }
      };
      obtenerGastosStorage();
    }, []);

    useEffect(() => {
      const guardarGastosStorage = async () => {
        try {
          await AsyncStorage.setItem(
            "planificador_gastos",
            JSON.stringify(gastos),
          );
        } catch (error) {
          console.log(error);
        }
      };
      guardarGastosStorage().then();
    }, [gastos]);

    const handleNuevoPresupuesto = presupuesto => {
      if (Number(presupuesto) > 0) {
        setLoading(true);

        if (showModalPresupuesto) {
          setShowModalPresupuesto(false);
        }

        setTimeout(() => {
          setIsValidPresupuesto(true);
          DialogComponent({
            dialogTitle: "Éxito",
            dialogMessage: "El presupuesto se ha guardado correctamente.",
            dialogType: "success",
            dialogButton: "Aceptar",
          });
          setLoading(false);
          setShowModalPresupuesto(false);
        }, 2000);
      } else {
        DialogComponent({
          dialogTitle: "Error",
          dialogMessage: "El presupuesto no es válido, debe ser mayor a 0",
          dialogType: "error",
          dialogButton: "Aceptar",
        });
      }
    };

    const handleGasto = gasto => {
      if ([gasto.nombre, gasto.categoria, gasto.cantidad].includes("")) {
        DialogComponent({
          dialogTitle: "Error",
          dialogMessage: "Todos los campos son obligatorios",
          dialogType: "error",
          dialogButton: "Aceptar",
        });
        return;
      }

      if (gasto.id) {
        const gastosActualizados = gastos.map(gastoState =>
          gastoState.id === gasto.id ? gasto : gastoState,
        );
        setLoading(true);
        setTimeout(() => {
          setGastos(gastosActualizados);
          DialogComponent({
            dialogTitle: "Éxito",
            dialogMessage: "El gasto se ha actualizado correctamente",
            dialogType: "info",
            dialogButton: "Aceptar",
          });
          setLoading(false);
        }, 1500);
      } else {
        // Añadir el nuevo gasto al state
        gasto.id = generarId();
        gasto.fecha = Date.now();
        setLoading(true);
        setTimeout(() => {
          setGastos([...gastos, gasto]);
          DialogComponent({
            dialogTitle: "Éxito",
            dialogMessage: "El gasto se ha guardado correctamente",
            dialogType: "success",
            dialogButton: "Aceptar",
          });
          setLoading(false);
        }, 1500);
      }
      setModal(!modal);
    };

    const eliminarGasto = id => {
      Alert.alert(
        "¿Deseas eliminar este gasto?",
        "Un gasto eliminado no se puede recuperar",
        [
          { text: "No", style: "cancel" },
          {
            text: "Si, Eliminar",
            onPress: () => {
              const gastosActualizados = gastos.filter(
                gastoState => gastoState.id !== id,
              );
              setLoading(true);
              setModal(!modal);
              setTimeout(() => {
                DialogComponent({
                  dialogTitle: "Éxito",
                  dialogMessage: "Se ha eliminado el gasto correctamente",
                  dialogType: "success",
                  dialogButton: "Aceptar",
                });
                setGastos(gastosActualizados);
                setGasto({});
                setLoading(false);
              }, 1500);
            },
          },
        ],
      );
    };

    const resetearApp = () => {
      Alert.alert(
        "Deseas resetear la app?",
        "Esto eliminará presupuesto y gastos",
        [
          { text: "No", style: "cancel" },
          {
            text: "Si, Eliminar",
            onPress: async () => {
              try {
                await AsyncStorage.clear();

                setLoading(true);
                setTimeout(() => {
                  setPresupuesto("");
                  setGastos([]);
                  setIsValidPresupuesto(false);
                  DialogComponent({
                    dialogTitle: "Success",
                    dialogMessage: "Se ha reseteado la app correctamente.",
                    dialogType: "success",
                    dialogButton: "Aceptar",
                  });
                  setLoading(false);
                }, 1500);
              } catch (error) {
                console.log(error);
              }
            },
          },
        ],
      );
    };


    return (
      <View style={styles.contenedor}>
        {loading && <Loader />}
        <AlertNotificationRoot>
          <ScrollView>
            <View style={styles.header}>
              <Header />
              {isValidPresupuesto ? (
                <ControlPresupuesto
                  presupuesto={presupuesto}
                  gastos={gastos}
                  resetearApp={resetearApp}
                  setShowModalPresupuesto={setShowModalPresupuesto}
                  setPresupuesto={setPresupuesto}
                />
              ) : (
                <>
                  <NuevoPresupuesto
                    presupuesto={presupuesto}
                    setPresupuesto={setPresupuesto}
                    handleNuevoPresupuesto={handleNuevoPresupuesto}
                  />
                </>
              )}
            </View>

            {isValidPresupuesto && (
              <>
                <Filtro
                  filtro={filtro}
                  setFiltro={setFiltro}
                  gastos={gastos}
                  setGastosFiltrados={setGastosFiltrados}
                />

                <ListadoGastos
                  gastos={gastos}
                  setModal={setModal}
                  setGasto={setGasto}
                  filtro={filtro}
                  gastosFiltrados={gastosFiltrados}
                />
              </>
            )}
          </ScrollView>

          {modal && (
            <Modal
              animationType="slide"
              visible={modal}
              onRequestClose={() => {
                setModal(false);
              }}>
              <FormularioGasto
                setModal={setModal}
                handleGasto={handleGasto}
                gasto={gasto}
                setGasto={setGasto}
                eliminarGasto={eliminarGasto}
              />
            </Modal>
          )}

          {isValidPresupuesto && (
            <Pressable style={styles.pressable} onPress={() => setModal(true)}>
              <Image
                style={styles.imagen}
                source={require("./src/img/nuevo-gasto.png")}
              />
            </Pressable>
          )}

          {showModalPresupuesto && (
            <Modal
              animationType="slide"
              visible={showModalPresupuesto}
              onRequestClose={() => {
                setShowModalPresupuesto(false);
              }}>
              <View style={styles.modalContainer}>
                <NuevoPresupuesto
                  presupuesto={presupuesto}
                  setPresupuesto={setPresupuesto}
                  handleNuevoPresupuesto={handleNuevoPresupuesto}
                  statusUpdate={showModalPresupuesto}
                  setShowModalPresupuesto={setShowModalPresupuesto}
                />
              </View>
            </Modal>
          )}
        </AlertNotificationRoot>
      </View>
    );
  }
;

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: "#F5F5F5",
    flex: 1,
  },
  header: {
    backgroundColor: "#3B82F6",
    minHeight: 400,
  },
  pressable: {
    width: 60,
    height: 60,
    position: "absolute",
    bottom: 40,
    right: 30,
    backgroundColor: "white",
    borderRadius: 30,
    ...Platform.select({
      ios: {
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  imagen: {
    width: 60,
    height: 60,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#3B82F6",
  },
});

export default App;
