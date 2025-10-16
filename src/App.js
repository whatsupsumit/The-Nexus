import Body from './components/Body';
import { Provider } from 'react-redux';
import appStore from './utils/apptore';
import ThemeProvider from './components/ThemeProvider';

function App() {
  return (
    <div className="bg-theme">
      <Provider store={appStore}> 
        <ThemeProvider>
          <Body/>
        </ThemeProvider>
      </Provider>
    </div>
  );
}

export default App;
