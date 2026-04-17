
/**
 * Formata um valor numérico para o padrão de moeda (Kz) 
 * com ponto (.) para milhares e vírgula (,) para decimais.
 */
export const formatCurrency = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

/**
 * Formata um valor para exibição compacta (sem decimais por padrão)
 */
export const formatCompact = (value: number): string => {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};
