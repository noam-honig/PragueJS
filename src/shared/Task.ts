import { Allow, Entity, Fields, Validators } from 'remult'

@Entity('tasks', {
  allowApiCrud: Allow.authenticated,
  allowApiDelete: 'admin',
  allowApiInsert: 'admin'
})
export class Task {
  @Fields.autoIncrement()
  id = 0
  @Fields.string<Task>({
    allowApiUpdate: 'admin',
    validate: (task) => {
      if (task.title.length < 3) throw Error('Too short')
    }
  })
  title = ''
  @Fields.boolean()
  completed = false
}
