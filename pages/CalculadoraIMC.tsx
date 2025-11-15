import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Keyboard,
  Animated,
  Easing,
  Dimensions,
  ScrollView
} from 'react-native';

const { width, height } = Dimensions.get('window');

const CalculadoraIMC = ({ navigation }: { navigation: any }) => {
  const [peso, setPeso] = useState('');
  const [altura, setAltura] = useState('');
  const [imc, setImc] = useState<number | null>(null);
  const [classificacao, setClassificacao] = useState('');
  const [corClassificacao, setCorClassificacao] = useState('#2c3e50');
  const [animacao] = useState(new Animated.Value(0));
  const [pesoError, setPesoError] = useState('');
  const [alturaError, setAlturaError] = useState('');

  const validarCampos = () => {
    let valido = true;
    setPesoError('');
    setAlturaError('');

    const pesoNum = parseFloat(peso.replace(',', '.'));
    const alturaNum = parseFloat(altura.replace(',', '.'));

    if (!peso.trim()) {
      setPesoError('Peso é obrigatório');
      valido = false;
    } else if (isNaN(pesoNum)) {
      setPesoError('Digite um número válido');
      valido = false;
    } else if (pesoNum <= 0) {
      setPesoError('Peso deve ser maior que zero');
      valido = false;
    } else if (pesoNum > 300) {
      setPesoError('Peso muito alto');
      valido = false;
    }

    if (!altura.trim()) {
      setAlturaError('Altura é obrigatória');
      valido = false;
    } else if (isNaN(alturaNum)) {
      setAlturaError('Digite um número válido');
      valido = false;
    } else if (alturaNum <= 0) {
      setAlturaError('Altura deve ser maior que zero');
      valido = false;
    } else if (alturaNum > 3) {
      setAlturaError('Altura deve estar em metros (ex: 1.75)');
      valido = false;
    }

    return valido;
  };

  const calcularIMC = () => {
    Keyboard.dismiss();

    if (!validarCampos()) {
      return;
    }

    const pesoNum = parseFloat(peso.replace(',', '.'));
    const alturaNum = parseFloat(altura.replace(',', '.'));

    const imcCalculado = pesoNum / (alturaNum * alturaNum);
    const imcArredondado = parseFloat(imcCalculado.toFixed(2));

    setImc(imcArredondado);
    classificarIMC(imcArredondado);
    
    // Animação do resultado
    Animated.timing(animacao, {
      toValue: 1,
      duration: 800,
      easing: Easing.out(Easing.back(1.7)),
      useNativeDriver: true,
    }).start();
  };

  const classificarIMC = (valorIMC: number) => {
    let classificacaoTemp = '';
    let corTemp = '#2c3e50';

    if (valorIMC < 18.5) {
      classificacaoTemp = 'Abaixo do Peso';
      corTemp = '#FF6B35'; // Laranja vibrante
    } else if (valorIMC < 25) {
      classificacaoTemp = 'Peso Normal';
      corTemp = '#2ECC71'; // Verde
    } else if (valorIMC < 30) {
      classificacaoTemp = 'Sobrepeso';
      corTemp = '#F39C12'; // Amarelo laranja
    } else if (valorIMC < 35) {
      classificacaoTemp = 'Obesidade Grau I';
      corTemp = '#E67E22'; // Laranja
    } else if (valorIMC < 40) {
      classificacaoTemp = 'Obesidade Grau II';
      corTemp = '#E74C3C'; // Vermelho
    } else {
      classificacaoTemp = 'Obesidade Grau III';
      corTemp = '#C0392B'; // Vermelho escuro
    }

    setClassificacao(classificacaoTemp);
    setCorClassificacao(corTemp);
  };

  const limparCampos = () => {
    setPeso('');
    setAltura('');
    setImc(null);
    setClassificacao('');
    setCorClassificacao('#2c3e50');
    setPesoError('');
    setAlturaError('');
    animacao.setValue(0);
    Keyboard.dismiss();
  };

  const getDicasIMC = () => {
    if (!imc) return '';
    
    if (imc < 18.5) {
      return '• Consulte um nutricionista\n• Aumente a ingestão calórica\n• Pratique exercícios de força';
    } else if (imc < 25) {
      return '• Mantenha hábitos saudáveis\n• Exercite-se regularmente\n• Alimentação balanceada';
    } else if (imc < 30) {
      return '• Aumente atividades físicas\n• Reduza alimentos processados\n• Consulte um profissional';
    } else {
      return '• Procure orientação médica\n• Programa de exercícios\n• Reeducação alimentar';
    }
  };

  const animatedStyle = {
    transform: [
      {
        scale: animacao.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1],
        }),
      },
    ],
    opacity: animacao,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.titulo}>Calculadora de IMC</Text>
          <Text style={styles.subtitulo}>
            Calcule seu Índice de Massa Corporal
          </Text>
        </View>

        <View style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={[
                styles.input,
                pesoError ? styles.inputError : null
              ]}
              placeholder="Ex: 70.5"
              placeholderTextColor="#A0A0A0"
              keyboardType="decimal-pad"
              value={peso}
              onChangeText={(text) => {
                setPeso(text);
                setPesoError('');
              }}
              maxLength={6}
            />
            {pesoError ? <Text style={styles.errorText}>{pesoError}</Text> : null}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Altura (m)</Text>
            <TextInput
              style={[
                styles.input,
                alturaError ? styles.inputError : null
              ]}
              placeholder="Ex: 1.75"
              placeholderTextColor="#A0A0A0"
              keyboardType="decimal-pad"
              value={altura}
              onChangeText={(text) => {
                setAltura(text);
                setAlturaError('');
              }}
              maxLength={4}
            />
            {alturaError ? <Text style={styles.errorText}>{alturaError}</Text> : null}
          </View>

          <View style={styles.botoesContainer}>
            <TouchableOpacity 
              style={styles.botaoCalcular} 
              onPress={calcularIMC}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoTexto}>Calcular IMC</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.botaoLimpar} 
              onPress={limparCampos}
              activeOpacity={0.8}
            >
              <Text style={styles.botaoTexto}>Limpar</Text>
            </TouchableOpacity>
          </View>
        </View>

        {imc && (
          <Animated.View style={[styles.resultadoContainer, animatedStyle]}>
            <Text style={styles.resultadoTitulo}>Resultado do IMC</Text>
            
            <View style={styles.imcCircle}>
              <Text style={styles.imcValor}>{imc}</Text>
              <Text style={styles.imcLabel}>IMC</Text>
            </View>

            <View style={[styles.classificacaoBadge, { backgroundColor: corClassificacao }]}>
              <Text style={styles.classificacaoTexto}>{classificacao}</Text>
            </View>

            <View style={styles.dicasContainer}>
              <Text style={styles.dicasTitulo}>Recomendações:</Text>
              <Text style={styles.dicasTexto}>{getDicasIMC()}</Text>
            </View>

            <View style={styles.legendaContainer}>
              <Text style={styles.legendaTitulo}>Classificação IMC:</Text>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#FF6B35' }]} />
                <Text style={styles.legendaTexto}>Abaixo do Peso</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#2ECC71' }]} />
                <Text style={styles.legendaTexto}>Peso Normal</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#F39C12' }]} />
                <Text style={styles.legendaTexto}>Sobrepeso</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#E67E22' }]} />
                <Text style={styles.legendaTexto}>Obesidade Grau I</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#E74C3C' }]} />
                <Text style={styles.legendaTexto}>Obesidade Grau II</Text>
              </View>
              <View style={styles.legendaItem}>
                <View style={[styles.legendaCor, { backgroundColor: '#C0392B' }]} />
                <Text style={styles.legendaTexto}>Obesidade Grau III</Text>
              </View>
            </View>
          </Animated.View>
        )}

        {!imc && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitulo}>O que é IMC?</Text>
            <Text style={styles.infoTexto}>
              O Índice de Massa Corporal (IMC) é uma medida internacional usada para calcular 
              se uma pessoa está no peso ideal. Desenvolvido pelo polímata Lambert Quételet 
              no século XIX, é um método fácil e rápido para a avaliação do nível de gordura 
              de cada pessoa.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitulo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#7f8c8d',
    maxWidth: 300,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '500',
  },
  inputError: {
    borderColor: '#e74c3c',
    backgroundColor: '#fdf2f2',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 14,
    marginTop: 5,
    fontWeight: '500',
  },
  botoesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  botaoCalcular: {
    flex: 1,
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 12,
    marginRight: 10,
    alignItems: 'center',
    shadowColor: '#3498db',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  botaoLimpar: {
    flex: 1,
    backgroundColor: '#95a5a6',
    padding: 18,
    borderRadius: 12,
    marginLeft: 10,
    alignItems: 'center',
  },
  botaoTexto: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultadoContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  resultadoTitulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  imcCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#3498db',
    marginBottom: 20,
  },
  imcValor: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  imcLabel: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  classificacaoBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  classificacaoTexto: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dicasContainer: {
    backgroundColor: '#e8f4f8',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    width: '100%',
  },
  dicasTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  dicasTexto: {
    fontSize: 14,
    color: '#34495e',
    lineHeight: 20,
  },
  legendaContainer: {
    width: '100%',
  },
  legendaTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  legendaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendaCor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 12,
  },
  legendaTexto: {
    fontSize: 14,
    color: '#2c3e50',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  infoTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  infoTexto: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    textAlign: 'justify',
  },
});

export default CalculadoraIMC;