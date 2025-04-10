/**
 * Função para calcular o seguro de veículos
 * @param valorFipe Valor FIPE do veículo
 * @param percentualBase Percentual base para cálculo
 * @returns Objeto com os valores calculados do seguro
 */
export function calcularSeguro(valorFipe: number, percentualBase: number) {
  // Constantes para cálculo do seguro
  const VALOR_FIXO = 0.02; // 0,02%
  const PERCENTUAL_IOF = 7.38; // 7,38%
  const VALOR_MINIMO = 15; // Valor mínimo do seguro (R$ 15,00)
  const ADICIONAL_MINIMO = 10; // Valor adicional para seguros abaixo do mínimo (R$ 10,00)

  // Cálculo do Seguro da Seguradora sem IOF
  const seguroSemIOF = (valorFipe * VALOR_FIXO) / 100;

  // Cálculo do Seguro da Seguradora com IOF
  const seguroComIOF = (seguroSemIOF * PERCENTUAL_IOF) / 100;

  // Total da Seguradora com IOF
  const totalSeguradora = seguroSemIOF + seguroComIOF;

  // Pró labore Total (metade do percentual base)
  const percentualProLabore = percentualBase / 2;
  const proLaboreTotal = (valorFipe * percentualProLabore) / 100;

  // Total inicial do seguro (antes de verificar valor mínimo)
  let totalCegonheiro = proLaboreTotal + totalSeguradora;

  // Se o valor total for menor ou igual a R$ 15,00, adiciona R$ 10,00
  // Exemplos:
  // - Se totalCegonheiro = R$ 12,65 → Resultado final = R$ 22,65
  // - Se totalCegonheiro = R$ 15,00 → Resultado final = R$ 25,00
  // - Se totalCegonheiro = R$ 8,50 → Resultado final = R$ 18,50
  if (totalCegonheiro <= VALOR_MINIMO) {
    totalCegonheiro += ADICIONAL_MINIMO;
  }

  return {
    valorTotalFixo: Number(seguroSemIOF.toFixed(2)),
    valorIOF: Number(seguroComIOF.toFixed(2)),
    totalValorFixoComIOF: Number(totalSeguradora.toFixed(2)),
    percentualProLabore: Number(percentualProLabore.toFixed(4)),
    valorProLabore: Number(proLaboreTotal.toFixed(2)),
    valorTotalSeguro: Number(totalCegonheiro.toFixed(2))
  };
}