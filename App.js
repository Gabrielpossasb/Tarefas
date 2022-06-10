import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert,TextInput, Pressable,TouchableHighlight, Modal, ScrollView, Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { useFonts, Aclonica_400Regular } from '@expo-google-fonts/aclonica';
import React, {useState, useEffect} from 'react';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const image = require('./resources/images.jpg');

  const [estado,setarEstado] = useState('leitura');

  const [tarefas, setarTarefas] = useState([]);

  const [modal,setModal] = useState(false);

  const [tarefaAtual, setTarefaAtual] = useState('');

  const [anotacaoAtual, setAnotacaoAtual] = useState('');

  const [idAtual, setIdAtual] = useState();

  const [tarefaAgora, setTarefaAgora] = useState('');

  const [indexAtual, setIndexAtual] = useState();


  useEffect(()=>{
    //alert('app carregado...');
    
    (async () => {
      try {
        let tarefasAtual = await AsyncStorage.getItem('tarefas');
        if(tarefasAtual == null)
          setarTarefas([]);
        else
          setarTarefas(JSON.parse(tarefasAtual));
      } catch (error) {
        // Error saving data
      }
    })();
    
  },[])



  function deletarTarefa(id){
    alert('Tarefa ID: '+id+'deletada com sucesso! :)');
  
    let newTarefas = tarefas.filter(function(val){
      return val.id != id;
    });

    setarTarefas(newTarefas);

    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(newTarefas));
        console.log('chamado');
      } catch (error) {
        // Error saving data
      }
    })();
  }

  function addTarefa(){
    setModal(!modal);

    let id = 0;
    if(tarefas.length > 0){
      id = tarefas[tarefas.length-1].id + 1;
    }
    let tarefa = {id:id,tarefa:tarefaAtual,anotacao:anotacaoAtual};

    setarTarefas([...tarefas,tarefa]);
      
    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify([...tarefas,tarefa]));
      } catch (error) {
        // Error saving data
      }
    })();
  }
  
  function viewTarefa(id, tarefa, anotacaos, index){
    //alert(id);
    setarEstado('antRead');
    setIdAtual(id);
    setTarefaAgora(tarefa);
    setAnotacaoAtual(anotacaos);
    setIndexAtual(index);
    //alert(anotacaosAgora);
  }


  function atualizarTexto(){
    setarEstado('antRead');

    let filtrar = tarefas.map(function(val){
      return val;
    });
    filtrar[indexAtual] = {id:idAtual,tarefa:tarefaAgora,anotacao:anotacaoAtual}; 
    setarTarefas(filtrar);

    (async () => {
      try {
        await AsyncStorage.setItem('tarefas', JSON.stringify(filtrar));
      } catch (error) {
        // Error saving data
      }
    })();

    }

                 
  if(estado == 'leitura'){
    return (
      <View>
        <ScrollView style={{flex:1, height:600}}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modal}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <TextInput onChangeText={text =>setTarefaAtual(text)} style={{padding:6, borderRadius:10, width:300}} autoFocus={true}></TextInput>

                <TouchableHighlight
                  style={styles.openButton}
                  onPress={() => addTarefa()}
                >
                  <Text style={styles.textStyle}>Adicionar Tarefa</Text>
                </TouchableHighlight>
              </View>
            </View>
          </Modal>
          
          <ImageBackground source={image} style={styles.image}>
            <View style={styles.coverView}>
              <Text style={styles.textHeader}>Lista de Tarefas</Text>
            </View>
          </ImageBackground>  

          {
          tarefas.map(function(val,ind){
            return(
              <View style={styles.tarefaSingle}> 

                <TouchableOpacity style={styles.bntTarefaSimgle} onPress={()=> viewTarefa(val.id,val.tarefa,val.anotacao,ind)}>
                    <Text style={{flex:1, fontSize:16, padding:25, height:20}}>{val.tarefa}</Text>
                </TouchableOpacity>
              
                <View style={{alignItems:'flex-end', flex:1, padding:15, paddingTop:35}}>
                  <TouchableOpacity onPress={()=> deletarTarefa(val.id)}>
                    <AntDesign name="minuscircleo" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
          }
        
        </ScrollView>

        <TouchableOpacity style={styles.btnAddTarefa} onPress={()=>setModal(true)}>
          <Text style={{textAlign:'center',color:'white'}}>Adicionar Tarefa</Text>
        </TouchableOpacity>

           
        

      </View>
    );
    //fim do "if == leitura"
  }else if(estado == 'antRead'){
    return(
    
      <View style={{flex:1}}>

        <ImageBackground source={image} style={styles.image}>
          <View style={styles.coverView}>
            <Text style={styles.textHeader}>Lista de Tarefas</Text>
          </View>
        </ImageBackground>  
      

        <View style={{marginTop:10, flexDirection:'row'}}>
          <View style={{alignItems:'center', flex:1, padding:10}}>
            <Text style={{fontSize:22}}>{tarefaAgora}</Text>          
          </View>

          <View style={{position:'absolute', padding:10}}>
            <TouchableOpacity onPress={()=>setarEstado('leitura')}>
              <AntDesign name="minuscircleo" size={24} color="black"/>
            </TouchableOpacity>
          </View>
        </View>

        {
          (anotacaoAtual != '')?
          <View><ScrollView style={{padding:40, height:600}}><Text style={styles.anotacao}>{anotacaoAtual}</Text></ScrollView></View>
          :
          <View style={{padding:40}}><Text style={{opacity:0.3, fontSize:22}}>Nenhuma anotação encontrada :(</Text></View>
        }
        <TouchableOpacity onPress={()=> setarEstado('antEdit')} style={styles.btnAnotacao}>
          <Text style={styles.btnAnotacaoTexto}>+</Text>
        </TouchableOpacity>

      </View>    
    );
  }else if(estado == 'antEdit'){
    return(
    
      <View style={{flex:1}}>

        <ImageBackground source={image} style={styles.image}>
          <View style={styles.coverView}>
            <Text style={styles.textHeader}>Lista de Tarefas</Text>
          </View>
        </ImageBackground>  
      
        <View style={{marginTop:10, flexDirection:'row'}}>
          <View style={{alignItems:'center', flex:1, padding:10}}>
            <Text style={{fontSize:22}}>{tarefaAgora}</Text>          
          </View>

          <View style={{position:'absolute', padding:10}}>
            <TouchableOpacity onPress={()=>setarEstado('antRead')}>
              <AntDesign name="minuscircleo" size={24} color="black"/>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput autoFocus={true}
          onChangeText={(text) => setAnotacaoAtual(text)} 
          style={{fontSize:14, margin:40, height:580, textAlignVertical:'top'}} 
          multiline={true} 
          numberOfLines={15} 
          value={anotacaoAtual}
        ></TextInput>
      
        <TouchableOpacity onPress={()=> atualizarTexto()} style={styles.btnSalvar}> 
          <Text style ={{textAlign:'center', color:'white', fontSize:20}}> SAVE </Text>
        </TouchableOpacity>   

      </View>    
    );
  }


}

const styles = StyleSheet.create({
  image: {
    width:'100%',
    height:100,
    resizeMode:'cover'
  },
  coverView: {
    width:'100%',
    height:100,
    backgroundColor:'rgba(0,0,0,0.5)',
  },
  textHeader: {
    textAlign:'center',
    color:'white',
    fontSize:34,
    marginTop:30,
    fontFamily:'Aclonica_400Regular'
  },
  btnAddTarefa:{
    width:150,
    padding:8,
    backgroundColor:'rgba(70, 11, 7, 0.69)',
    borderRadius: 10,
    marginLeft: 15,
    marginTop:10
    },
  tarefaSingle:{
    width:'100%',
    height:100,
    borderBottomWidth:2,
    borderBottomColor:'black',
    flexDirection:"row",
  },
  bntTarefaSimgle:{
    width:'90%',
    //backgroundColor:'rgba(254, 0, 131, 0.2)',
  },
  //Anotações
  anotacao:{
    fontSize:14,
    height:600,
  },
  btnAnotacao:{
    position:'absolute',
    right:20,
    bottom:20,
    width:50,
    height:50,
    backgroundColor:'rgba(0,0,0,0.9)',
    borderRadius:25
  },
  btnAnotacaoTexto:{
    color:'white',
    position:'relative',
    textAlign:'center',
    top: 3,
    fontSize:30
  },
  btnSalvar:{
    position:'absolute',
    right:20,
    bottom:20,
    width:80,
    borderRadius:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'rgba(0,0,0,0.9)',
  },
  //Style modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor:'rgba(0,0,0,0.5)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex:5
  },
  openButton: {
    backgroundColor: "rgba(0, 70, 110, 0.73)",
    borderRadius: 15,
    marginTop: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    borderRadius: 20
  },

});

