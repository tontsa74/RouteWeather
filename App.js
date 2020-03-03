import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import AppNavigator from './AppNavigator';
import { store, persistor } from './store';
import { PersistGate } from 'redux-persist/integration/react';
import Loading from './components/Loading';

export default function App() {
    const [welcome, setWelcome] = useState(true);

    /** Set welcome screen timeout */
    useEffect(() => {
        if (welcome) {
            setTimeout(() => {
                setWelcome(false);
            }, 1000);
        }
    });

    return (
        <Provider store={store}>
            <PersistGate
                loading={<Loading loading={true} />}
                persistor={persistor}>
                {welcome ? <Loading loading={false} /> : <AppNavigator />}
            </PersistGate>
        </Provider>
    );
}
