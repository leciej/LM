import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CartScreen } from '../screens/CartScreen';

const Stack = createNativeStackNavigator();

export function CartStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CartMain"
        component={CartScreen}
        options={{ title: 'Koszyk' }}
      />
    </Stack.Navigator>
  );
}
