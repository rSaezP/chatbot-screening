//Ejemplo
export const validYear = {
  validate: (v: string) => /^\d{4}$/.test(v),
  message: 'Año inválido'
}