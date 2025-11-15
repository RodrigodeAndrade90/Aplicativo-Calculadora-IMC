// App.tsx (atualizado)
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';
import Home1 from './pages/Home1';
import CalculadoraIMC from './pages/CalculadoraIMC'; // Nova tela adicionada

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: '#357180', height: 120 },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold' },
        }}>
        <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
        <Stack.Screen name="Home1" component={Home1} options={{ headerShown: false }} />
        <Stack.Screen 
          name="CalculadoraIMC" 
          component={CalculadoraIMC} 
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}