import vine from '@vinejs/vine'

export const testValidator = vine.compile(
  vine.object({
    file_name: vine.string().trim(),
    directory: vine.string().trim(),
    content_type: vine.string().trim(),
    customMeta: vine.object({}).allowUnknownProperties(),
  })
)
