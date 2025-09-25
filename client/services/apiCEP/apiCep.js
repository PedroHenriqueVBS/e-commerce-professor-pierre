// client/services/apiCEP/apiCep.js
export async function fetchAddressByCEP(rawCep) {
  // Normaliza: remove tudo que não é dígito
  const cep = String(rawCep || '').replace(/\D/g, '');
  if (cep.length !== 8) {
    return { ok: false, code: 'invalid', message: 'CEP inválido: informe 8 dígitos.' };
  }

  const url = `https://viacep.com.br/ws/${cep}/json/`;

  try {
    const resp = await fetch(url, { cache: 'no-store' });
    if (!resp.ok) {
      return { ok: false, code: 'network', message: 'Falha na requisição do CEP.' };
    }
    const data = await resp.json();
    if (data.erro) {
      return { ok: false, code: 'notfound', message: 'CEP não encontrado. Preencha manualmente.' };
    }

    // Retorna apenas os campos que precisamos
    return {
      ok: true,
      data: {
        cep: data.cep || '',
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        localidade: data.localidade || '',
        uf: (data.uf || '').toUpperCase()
      }
    };
  } catch (err) {
    return { ok: false, code: 'network', message: 'Erro de rede ao consultar CEP.' };
  }
}
