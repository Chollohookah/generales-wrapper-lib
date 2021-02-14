import { HookasWithSiteMetadata } from '../../../interfaces/RelationSiteHooka';

export interface EnvioHookasFiltradas {
  confPaginador: BasicPaginatorChangeModel;
  resultadoFiltraje: Array<HookasWithSiteMetadata>;
}

export interface BasicPaginatorChangeModel {
  pageIndex: number;
  pageSize: number;
}
