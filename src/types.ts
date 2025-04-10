export interface Veiculo {
  placa?: string;
  foto?: string;
  fotoBase64?: string;
  valor?: number;
  modelo?: string;
  situacaoFurtoRoubo?: string;
  chassi?: string;
  geolocalizacao?: {
    latitude: number;
    longitude: number;
  };
  dataFoto?: string;
  nomeArquivo?: string;
}

export interface Seguro {
  ESTADO: string;
  [key: string]: number | string;
  NR_APOLICE?: number;
  VALOR?: number;
  PERCENTUAL?: number;
  TOTAL?: number;
  A_PAGAR?: number;
}

export interface EstadosMap {
  [key: string]: string;
}

export interface CalculoSeguro {
  valorTotalFixo: number;
  valorIOF: number;
  totalValorFixoComIOF: number;
  percentualProLabore: number;
  valorProLabore: number;
  valorTotalSeguro: number;
}

export interface ResultadoConsulta {
  estadoOrigem: string;
  estadoDestino: string;
  cidadeOrigem: string;
  cidadeDestino: string;
  percentual: number;
  veiculos: Veiculo[];
  quantidadeVeiculos: number;
  valorTotalVeiculos: number;
  calculoSeguro: CalculoSeguro;
  fotoCaminhao?: string;
}