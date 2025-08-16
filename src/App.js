import Body from './components/Body';
import NexusBackground from './components/NexusBackground';
import SmoothScrollEnhancer from './components/SmoothScrollEnhancer';
import ScrollToTop from './components/ScrollToTop';
import { Provider } from 'react-redux';
import appStore from './utils/apptore';
import useLenis from './hooks/useLenis';
import './utils/errorSuppression'; // Initialize error suppression


function App() {
  // Initialize Lenis smooth scrolling
  useLenis();

  return (
    <div className="relative min-h-screen smooth-scroll-container bg-black">
      <SmoothScrollEnhancer />
      <NexusBackground />
      <div className="relative z-10 bg-black min-h-screen">
        <Provider store={appStore}> 
          <Body/>
        </Provider>
      </div>
      <ScrollToTop />
    </div>
  );
}

export default App;
