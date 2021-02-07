import { BootstrapColors } from '../../card-viewer/models/AnunciosHookas';

export interface PosibleActions {
  icon: string;
  color: BootstrapColors;
  tooltip: string;
  action: Function;
}
