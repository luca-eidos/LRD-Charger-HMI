
export type HMIState = 
  | 'IDLE' 
  | 'AUTHORIZING' 
  | 'AUTHORIZED_SUCCESS' 
  | 'AUTHORIZATION_DENIED' 
  | 'CHARGING' 
  | 'SUMMARY';

export interface ChargingData {
  energyDelivered: number; // kWh
  currentPower: number;    // kW
  soc: number;            // State of Charge (%)
  cost: number;           // Euro
  elapsedTime: number;    // Seconds
}

export type ImageSize = '1K' | '2K' | '4K';

export interface ImageGenerationConfig {
  prompt: string;
  size: ImageSize;
}
