//implementar iportfolio
import {IPortfolioRepository} from "../repositories/IPortfolioRepository";
import {Portfolio} from "../../models/Portfolio/Portfolio";
import {storage} from "../../utils/storage";
import {BaseRepository} from "../BaseRepository";
import {PortfolioHolding} from "../../models/Portfolio/PortfolioHolding";

export class PortfolioRepository extends BaseRepository<Portfolio> implements IPortfolioRepository{
    updatePortfolio(): void {
        throw new Error("Method not implemented.");
    }
    savePortfolio(): void {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Portfolio | null {
        return storage.getPortfolioByUserId(id) ?? null;
    }
    findByUserIdOrFail(id: string): Portfolio {
        const p = this.findById(id);
        if (!p) throw new Error("Portafolio no encontrado");
        return p;
    }
    getHolding(portfolio: Portfolio, symbol: string): PortfolioHolding {
        const holding =  portfolio.holdings.find(holding => holding.symbol === symbol);
        if(!holding) throw new Error("Holding no encontrado");
        return holding;
    }
}
