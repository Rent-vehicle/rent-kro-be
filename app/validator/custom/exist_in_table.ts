import vine from '@vinejs/vine'
export const existsInTable = <T>(
  model: { findBy: (column: string, value: number) => Promise<T | null> },
  column: string,
  message: string
) => {
  return vine.createRule(async (value: unknown) => {
    const record = await model.findBy(column, value as number)
    if (!record) {
      throw new Error(message)
    }
  })
}
