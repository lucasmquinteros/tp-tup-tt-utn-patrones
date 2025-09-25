// Servicio de simulación de mercado
import {MarketData} from "../../models/MarketData/MarketData";
import {Asset} from "../../models/Asset/Asset";
import { storage } from "../../utils/storage";
import { config } from "../../config/config";
import {FacadeRepository} from "../../repository/infra/FacadeRepository";
export interface IMarketSimulationService {
    startMarketSimulation(): void;
    stopMarketSimulation(): void;
    simulateMarketEvent(eventType: eventType): void;
    getSimulationStatus(): { isRunning: boolean; lastUpdate: Date | null };
}
export enum eventType {
    bull = "bull",
    bear = "bear",
    crashed = "crashed",
    recovery = "recovery",
}


export class MarketSimulationService implements IMarketSimulationService{
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;
  private facade: FacadeRepository;
  constructor(facade: FacadeRepository) {
    this.facade = facade;
  }

  // Iniciar simulación de mercado
  startMarketSimulation(): void {
    if (this.isRunning) {
      console.log("La simulación de mercado ya está ejecutándose");
      return;
    }

    this.isRunning = true;
    console.log("Iniciando simulación de mercado...");

    this.intervalId = setInterval(() => {
      this.updateMarketPrices();
    }, config.market.updateIntervalMs);
  }

  // Detener simulación de mercado
  stopMarketSimulation(): void {
    if (!this.isRunning) {
      console.log("La simulación de mercado no está ejecutándose");
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log("Simulación de mercado detenida");
  }

  // Actualizar precios de mercado
  private updateMarketPrices(): void {


      // Actualizar asset correspondiente

  }

  // Actualizar todos los portafolios
  private updateAllPortfolioValues(): void {
      // TODO: Implementar actualización de valores de todos los portafolios si es necesario
  }

  // Simular evento de mercado específico
  simulateMarketEvent(eventType: eventType): void {
    console.log(`Simulando evento de mercado: ${eventType}`);

    const allMarketData = this.facade.getAllMarketData();

    allMarketData.forEach((marketData) => {
      let impactFactor = 0;
    //posible refactorizacion de codigo para que sea mas dinamico y no se repita
      switch (eventType) {
        case "bull":
          impactFactor = 0.05 + Math.random() * 0.1; // +5% a +15%
          break;
        case "bear":
          impactFactor = -(0.05 + Math.random() * 0.1); // -5% a -15%
          break;
        case "crashed":
          impactFactor = -(0.15 + Math.random() * 0.2); // -15% a -35%
          break;
        case "recovery":
          impactFactor = 0.1 + Math.random() * 0.15; // +10% a +25%
          break;
      }

      const priceChange = marketData.price * impactFactor;
      const newPrice = Math.max(marketData.price + priceChange, 0.01);
      const change = newPrice - marketData.price;
      const changePercent = (change / marketData.price) * 100;

      // Actualizar persistencia a través de la fachada
      this.facade.updateMarketDataPrice(marketData.symbol, newPrice);

      // Actualizar asset también mediante fachada
      this.facade.updateAssetPrice(marketData.symbol, newPrice);
    });

    // Actualizar portafolios
    this.updateAllPortfolioValues();
  }

  // Obtener estado de simulación
  getSimulationStatus(): { isRunning: boolean; lastUpdate: Date | null } {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.isRunning ? new Date() : null,
    };
  }
}
