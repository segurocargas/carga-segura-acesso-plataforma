// Função principal que será executada pelo Bolt
export async function run(params: any) {
  // Defina os valores das variáveis
  const valorFIPE = params.valorFIPE || 0; // Valor da FIPE (exemplo: R$ 228.185,00)
  const valorSeguroTabela = params.valorSeguroTabela || 0; // Valor do seguro tabela (exemplo: 0,09)
  const valorSeguroAtual = params.valorSeguroAtual || 0; // Valor do seguro atual (exemplo: 0,020)
  const percentualIOF = 7.38; // Percentual fixo do IOF (7,38%)
  const percentualBaseCalculoSeguro = 0.02; // Percentual da base de cálculo do seguro (0,020%)
  const percentualProLabore = 0.045; // Percentual do Pró labore (0,045)

  // Cálculos
  const seguroSeguradoraSemIOF = (valorFIPE * percentualBaseCalculoSeguro) / 100;
  const seguroSeguradoraComIOF = (seguroSeguradoraSemIOF * percentualIOF) / 100;
  const totalSeguradoraComIOF = seguroSeguradoraSemIOF + seguroSeguradoraComIOF;

  const proLabore = (valorFIPE * percentualProLabore) / 100;
  const totalCegonheiro = totalSeguradoraComIOF + proLabore;

  // Retorne os resultados
  return {
    valorFIPE,
    valorSeguroTabela,
    valorSeguroAtual,
    percentualIOF,
    percentualBaseCalculoSeguro,
    percentualProLabore,
    seguroSeguradoraSemIOF: seguroSeguradoraSemIOF.toFixed(2),
    seguroSeguradoraComIOF: seguroSeguradoraComIOF.toFixed(2),
    totalSeguradoraComIOF: totalSeguradoraComIOF.toFixed(2),
    proLabore: proLabore.toFixed(2),
    totalCegonheiro: totalCegonheiro.toFixed(2),
  };
}