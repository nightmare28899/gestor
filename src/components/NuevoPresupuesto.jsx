import React from 'react';
import {View, Text, TextInput, Pressable, StyleSheet} from 'react-native';
import globalStyles from '../styles';
import DialogComponent from "./DialogComponent";

const NuevoPresupuesto = ({
  presupuesto,
  setPresupuesto,
  handleNuevoPresupuesto,
  statusUpdate,
  setShowModalPresupuesto,
}) => {
  const onlyNumbers = (text) => {
    const regex = /^[0-9.]+$/;

    if (text === '' || regex.test(text)) {
      setPresupuesto(text);
    }
  };

  const backButton = () => {
      DialogComponent({
        dialogTitle: "Éxito",
        dialogMessage: 'Tu presupuesto ha sido actualizado correctamente',
        dialogType: "info",
        dialogButton: 'Aceptar',
      })
      setShowModalPresupuesto(false)
  }

  return (
    <View style={styles.contenedor}>
      <Text style={styles.label}>{statusUpdate ? 'Actualiza tu nuevo Presupuesto' : 'Definir Presupuesto'}</Text>

      <TextInput
        keyboardType="numeric"
        placeholder="Agrega tu presupuesto: Ej. 300"
        style={[styles.input, { color: '#000000' }]}
        value={presupuesto.toString()}
        onChangeText={onlyNumbers}
        placeholderTextColor="#000"
      />

      {
        !statusUpdate && (
          <Pressable
            style={styles.boton}
            onPress={() => handleNuevoPresupuesto(presupuesto)}>
            <Text style={styles.botonTexto}>{'Agregar Presupuesto' }</Text>
          </Pressable>
        )
      }

      {
        setShowModalPresupuesto && (
          <Pressable
            style={styles.backBoton}
            onPress={backButton}>
            <Text style={styles.botonTexto}>Regresar</Text>
          </Pressable>
        )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  contenedor: {
    ...globalStyles.contenedor,
  },
  label: {
    textAlign: 'center',
    fontSize: 24,
    color: '#3B82F6',
  },
  input: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    textAlign: 'center',
    marginTop: 30,
  },
  boton: {
    marginTop: 30,
    backgroundColor: '#1048A4',
    padding: 10,
    borderRadius: 10,
  },
  backBoton: {
    marginTop: 10,
    backgroundColor: '#DB2777',
    padding: 10,
    borderRadius: 10,
  },
  botonTexto: {
    color: '#FFF',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },
});

export default NuevoPresupuesto;
