import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/AppNavigator';
import { CartProvider } from './src/context/CartContext';

function App(): React.JSX.Element {
  return (
    <AuthProvider>
      <CartProvider>
        <AppNavigator />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
