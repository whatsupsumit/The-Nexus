import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('NEXUS Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-red-950/20 to-black flex items-center justify-center p-8">
          <div className="bg-black/80 backdrop-blur-sm rounded-xl border border-red-900/30 p-8 max-w-md text-center">
            <div className="text-red-400 mb-6">
              <svg className="w-16 h-16 mx-auto animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="font-['JetBrains_Mono',monospace] text-white text-xl font-bold mb-4">
              NEXUS SYSTEM ERROR
            </h2>
            <p className="font-['JetBrains_Mono',monospace] text-gray-400 text-sm mb-6">
              A quantum anomaly has been detected. Our AI is working to restore stability.
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => this.setState({ hasError: false, error: null })}
                className="bg-red-600 hover:bg-red-700 text-white font-['JetBrains_Mono',monospace] py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                RESTART NEXUS
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-700 hover:bg-gray-600 text-white font-['JetBrains_Mono',monospace] py-2 px-4 rounded-lg transition-all duration-200"
              >
                RELOAD SYSTEM
              </button>
            </div>
            <div className="flex justify-center space-x-1 mt-6">
              <div className="w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-ping delay-75"></div>
              <div className="w-2 h-2 bg-red-400 rounded-full animate-ping delay-150"></div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
