import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { writeFile } from 'fs'
import { join } from 'path'

export default class MakeController extends BaseCommand {
  static commandName = 'add:controller'
  static description = 'Make a new HTTP controller with custom naming convention'

  @args.string({ argumentName: 'name', description: 'Name of the controller', required: true })
  declare name: string

  static options: CommandOptions = {}

  async run() {
    const name = this.name
    const fileName = `${name.toLowerCase()}.controller.ts`
    const filePath = join(this.app.makePath('app/controllers'), fileName)

    const template = `import type { HttpContext } from '@adonisjs/core/http'

  export default class ${name}Controller {
  async index({}: HttpContext) {
    return {}
  }
}
`

    await writeFile(filePath, template, (err) => {
      if (err) {
        this.logger.error(`Error creating controller: ${err.message}`)
        return
      }
    })
    this.logger.success(`Controller created: ${filePath}`)
  }
}
