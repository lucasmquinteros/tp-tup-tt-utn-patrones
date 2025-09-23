import {Portfolio} from "../../models/Portfolio/Portfolio";
import {BaseRepository} from "../BaseRepository";
import {PortfolioHolding} from "../../models/Portfolio/PortfolioHolding";

export interface IPortfolioRepository extends BaseRepository<Portfolio>{
    updatePortfolio(): void;
    savePortfolio(): void;
    getHolding(portfolio: Portfolio, symbol: string): PortfolioHolding;
}