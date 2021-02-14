import { Hooka, Site } from './ModeloHookasBack';

export interface HookasWithSiteMetadata extends Hooka {
  logoCompany: string;
  nameCompany: string;
}
