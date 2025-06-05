
/// <reference types="vite/client" />

// Ethereum provider interface for wallet integration
interface EthereumProvider {
  request: (args: { method: string; params?: any[] }) => Promise<any>;
  on: (event: string, handler: (...args: any[]) => void) => void;
  removeListener: (event: string, handler: (...args: any[]) => void) => void;
  isMetaMask?: boolean;
}

// Extend the Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: EthereumProvider;
    Razorpay?: any;
  }
}

export {};
