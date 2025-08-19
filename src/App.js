import Body from './components/Body';
import { Provider } from 'react-redux';
import appStore from './utils/apptore';

function App() {
  return (
    <div className="bg-black">
      <Provider store={appStore}> 
        <Body/>
      </Provider>
    </div>
  );
}

export default App;
