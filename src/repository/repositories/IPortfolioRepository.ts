import {Portfolio} from "../../models/Portfolio/Portfolio";
import {BaseRepository} from "../BaseRepository";

export interface IPortfolioRepository extends BaseRepository<Portfolio>{
    findByUserId(userId: string): Portfolio | null;
}