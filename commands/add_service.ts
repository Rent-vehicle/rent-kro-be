import { args, BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { writeFile } from 'fs'
import { join } from 'path'

export default class AddService extends BaseCommand {
  static commandName = 'add:service'
  static description = 'Add a new service to the application'

  @args.string({ argumentName: 'name', description: 'Name of the service', required: true })
  declare name: string

  @args.string({ argumentName: 'folder', description: 'Folder name inside services' })
  declare folder: string

  static options: CommandOptions = {}

  async run() {
    const upperName = this.name.charAt(0).toUpperCase() + this.name.slice(1)
    const lowerName = this.name.toLowerCase()
    const fileName = `${lowerName}.service.ts`
    const filePath = this.folder
      ? join(this.app.makePath('app/services/' + this.folder), fileName)
      : join(this.app.makePath('app/services'), fileName)

    const template = `class ${upperName}Service {
  public static getInstance(): ${upperName}Service {
    return new ${upperName}Service()
  }
}
export const ${lowerName}Service = ${upperName}Service.getInstance()`

    writeFile(filePath, template, (err) => {
      if (err) {
        this.logger.error(`Error creating service: ${err.message}`)
        return
      }
    })
    this.logger.success(`Service created: ${filePath}`)
  }
}
