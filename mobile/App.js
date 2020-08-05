import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView, Modal, Image, Alert, ActivityIndicator } from 'react-native';
import { Camera } from 'expo-camera';


// Icon
import button from './assets/button.png';
import vetor from './assets/vetor.png';
import ChangeCamera from './assets/trocar-camera.png';
import flashOff from './assets/flash-desligado.png';
import flashOn from './assets/flash-ligado.png';

import api from './api';

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [visible, setVisible] = useState(false)
  const [r, setR] = useState();
  const [b, setB] = useState();
  const [g, setG] = useState();
  const [loading, setLoading] = useState(false);
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.on);


  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if(hasPermission === null){
    return <View/>
  }

  if(hasPermission === false){
    return <Text>Acesso negado!</Text>
  }

  async function takePicture() {
    if(camRef){
      const options = { quality: 1, base64: true };
      const data = await camRef.current.takePictureAsync(options);

      const dataFile = new FormData();
      dataFile.append("file", {
        uri: data.uri,
        name: 'photo.jpg',
        type: "image/jpeg"
      });
      setLoading(true);
      await api.post('/imageProcessing/getColor', dataFile).then(response => {
        setR(response.data.r);
        setG(response.data.g);
        setB(response.data.b);
      }).catch(err => {
        console.log({error: err});
      });
      setLoading(false)

      setVisible(true)
    }
  }

  return (
    <View style={styles.container}>

      <Camera  
        style={styles.camera}
        type={type}
        ref={camRef}
        autoFocus={Camera.Constants.AutoFocus.on}
        flashMode={flashMode}
      >
        <View style={styles.changeCamera}>

          <Image source={vetor} style={styles.iconVetor} />
          
          {/* <TouchableOpacity
            style={styles.buttonChangeCamera}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back 
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
              )
            }}
          >
            <Text style={{fontSize: 20, marginBottom: 13, color: '#fff'}} >Trocar</Text>
          </TouchableOpacity> */}
        </View>
      </Camera>
      
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.buttonChangeCamera} 
          onPress={() => {
              setType(
                type === Camera.Constants.Type.back 
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
              )}
          }
        >
              <Image source={ChangeCamera} style={{width: 45, height: 45}}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={takePicture}>
              <Image source={button} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonFlash} 
          onPress={() => {
            setFlashMode(
              flashMode === Camera.Constants.FlashMode.on
              ? Camera.Constants.FlashMode.off
              : Camera.Constants.FlashMode.on
            )
          }}
        >
              <Image source={flashOn} style={{width: 45, height: 45}}/>
        </TouchableOpacity>
      </View>
      {loading && 
        <View style={styles.loading}>
          <ActivityIndicator  size={50} style={{position: 'absolute', marginHorizontal: 150}}/>
        </View>
      }
        <Modal
          animationType="slide"
          transparent={true}
          visible={visible}
          
        >
          
          <View style={styles.modal}>
              

              <View
              style={{width: '100%', height: 150, borderTopLeftRadius: 40, borderTopRightRadius: 40, backgroundColor: `rgba(${r}, ${g}, ${b}, 1)`}} 
              >
                <Text style={styles.title}>Acquired Color</Text>
                <View style={styles.colors}>
                  <Text style={styles.colorRGB}>rgb({r}, {g}, {b})</Text>
                </View>
                <TouchableOpacity style={styles.buttonClose} onPress={() => setVisible(false)}>
                    <Text style={styles.textButtonClose}>Close</Text>
                </TouchableOpacity>
              </View>

          </View>
        </Modal>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  iconVetor: {
    position: 'absolute',
  },  
  changeCamera: {
    flex: 1, 
    backgroundColor: 'transparent', 
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonChangeCamera: {
    
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 35,
  }, 
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    height: 100
  },
  modal: {
    flex: 1, 
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  buttonClose: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEEDFF',
    top: 40,
    width: '68%',
    marginHorizontal: 54,
    borderRadius: 20
  },
  textButtonClose: {
    marginVertical: 10,
    fontWeight: 'bold'
  },
  title: {
    color: '#fff',
    marginLeft: 25,
    marginTop: 20,
    fontSize: 20
  },
  colors: {
    marginHorizontal: 70,
    top: 20,
  },
  colorHex: {
    color: '#fff',
    fontSize: 16
  },
  colorRGB: {
    color: '#fff',
    fontSize: 16
  },
  loading: {
    position: 'absolute',
    width: '100%', 
    height: '100%', 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center'
  }
});
