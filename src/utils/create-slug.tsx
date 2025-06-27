// Função para formatar username removendo caracteres especiais, acentos e substituindo espaços por hifens
export function createSlug(username: string): string {
  return username
    .normalize('NFD') // decompõe acentos
    .replace(/[^\w\s-]/g, '') // remove caracteres especiais exceto underline, espaço e hifen
    .replace(/[\s_]+/g, '-') // substitui espaços e underlines por hifen
    .replace(/-+/g, '-') // evita múltiplos hifens
    .replace(/^-+|-+$/g, '') // remove hifens do início/fim
    .toLowerCase()
    .trim(); // remove espaços em branco no início e fim
}
