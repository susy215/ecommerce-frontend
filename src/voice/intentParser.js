// Intérprete sencillo de intents en español para comandos de voz
// Soporta: agregar al carrito, comprar, ir al carrito/checkout, buscar

const NUMBER_WORDS = {
  'uno': 1, 'una': 1, 'un': 1,
  'dos': 2,
  'tres': 3,
  'cuatro': 4,
  'cinco': 5,
  'seis': 6,
  'siete': 7,
  'ocho': 8,
  'nueve': 9,
  'diez': 10
}

function parseQuantity(text) {
  // x2, por 2, con 2, cantidad 2, 2 unidades, dos, etc
  const xMatch = text.match(/x\s*(\d+)/i)
  if (xMatch) return Number(xMatch[1])

  const numMatch = text.match(/(?:por|con|de|cantidad|son|agrega|añade|anade)?\s*(\d{1,2})\b/)
  if (numMatch) return Number(numMatch[1])

  const word = Object.keys(NUMBER_WORDS).find(w => new RegExp(`\\b${w}\\b`, 'i').test(text))
  if (word) return NUMBER_WORDS[word]

  return 1
}

function cleanProductQuery(text) {
  let q = text
  // Remover verbos y conectores comunes
  const remove = [
    'agrega', 'agregar', 'añade', 'anade', 'añadir', 'sumar', 'pon', 'poner', 'mete',
    'al carrito', 'a carrito', 'carrito',
    'comprar', 'comprar ahora', 'compra', 'pagar', 'checkout',
    'ir a', 'ir al', 'ver', 'buscar', 'busca', 'muestrame', 'muéstrame'
  ]
  remove.forEach(w => { q = q.replace(new RegExp(w, 'gi'), ' ') })
  // Remover patrones de cantidad
  q = q.replace(/x\s*\d+/gi, ' ')
  q = q.replace(/\b(?:por|con|de|cantidad)\s*\d+\b/gi, ' ')
  // Colapsar espacios
  q = q.replace(/\s+/g, ' ').trim()
  return q
}

export function parseIntent(rawText) {
  const text = (rawText || '').toLowerCase().trim()
  if (!text) return { type: 'unknown' }

  // Navegación simple
  if (/ver carrito|abrir carrito|ir al carrito/.test(text)) {
    return { type: 'go_cart' }
  }
  if (/checkout|pagar|ir al checkout|finalizar compra|comprar ahora/.test(text)) {
    return { type: 'go_checkout' }
  }

  // Carrito: vaciar
  if (/vaciar carrito|limpiar carrito|vacía carrito|elimina todo|borrar carrito/.test(text)) {
    return { type: 'clear_cart' }
  }

  // Buscar
  if (/^buscar\b|\bbusca\b|\bmuestrame\b|\bmuéstrame\b|\bver\b/.test(text)) {
    return { type: 'search', query: cleanProductQuery(text) }
  }

  // Comprar directo: "comprar [2] [producto]"
  if (/\bcomprar\b|\bcomprar ahora\b/.test(text)) {
    const qty = parseQuantity(text)
    const query = cleanProductQuery(text)
    return { type: 'buy', quantity: qty, query }
  }

  // Agregar al carrito: "agrega/añade [2] [producto] al carrito"
  if (/agrega|agregar|añade|anade|añadir|mete|poner|sumar/.test(text) && /carrito/.test(text)) {
    const qty = parseQuantity(text)
    const query = cleanProductQuery(text)
    return { type: 'add_to_cart', quantity: qty, query }
  }

  // Atajo: "agrega coca cola x2" (sin decir carrito)
  if (/agrega|añade|anade|añadir/.test(text)) {
    const qty = parseQuantity(text)
    const query = cleanProductQuery(text)
    return { type: 'add_to_cart', quantity: qty, query }
  }

  // Remover del carrito: "quitar coca cola" / "eliminar 1 coca cola"
  if (/(quitar|eliminar|sacar|remover)/.test(text)) {
    const qty = parseQuantity(text)
    const query = cleanProductQuery(text)
    return { type: 'remove_from_cart', quantity: qty, query }
  }

  return { type: 'unknown' }
}


