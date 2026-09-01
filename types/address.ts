/** Resposta crua do ViaCEP. Campos que não usamos ficam de fora. */
export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
  complemento?: string;
  /**
   * O ViaCEP responde HTTP 200 mesmo para CEP inexistente, sinalizando
   * aqui — e o tipo varia entre boolean e string conforme a resposta.
   */
  erro?: boolean | string;
}

/** O que o ViaCEP consegue preencher sozinho. */
export interface AddressFromCep {
  cep: string;
  street: string;
  neighborhood: string;
  city: string;
  state: string;
}

/** Endereço completo do pedido. */
export interface Address extends AddressFromCep {
  /** Informado pelo cliente. Obrigatório. */
  number: string;
  /** Informado pelo cliente. Opcional. */
  complement?: string;
}
