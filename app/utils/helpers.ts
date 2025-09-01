import fs from 'fs'
import path from 'path'

interface TemplateData {
  [key: string]: string
}

/**
 * Reads an HTML file and replaces {{placeholders}} with given values
 * @param templateName Name of the file inside resources/views/emails (without .html)
 * @param data Object with key-value pairs for replacement
 */
export function loadEmailTemplate(templateName: string, data: TemplateData = {}): string {
  const filePath = path.join(
    path.dirname(new URL(import.meta.url).pathname),
    `../html_templates/${templateName}.html`
  )

  // Read file
  let html = fs.readFileSync(filePath, 'utf-8')

  // Replace placeholders
  for (const key in data) {
    const regex = new RegExp(`{{${key}}}`, 'g')
    html = html.replace(regex, data[key])
  }

  return html
}

export const spiltName = (fullName: string) => {
  const nameParts = fullName.trim().split(' ')
  const firstName = nameParts[0] || ''
  const lastName = nameParts.slice(1).join(' ') || ''
  return { firstName, lastName }
}
