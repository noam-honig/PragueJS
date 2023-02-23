import { FormEvent, useEffect, useState } from 'react'
import { remult } from 'remult'
import { Task } from '../shared/Task'
import { TasksController } from '../shared/TasksController'

const taskRepo = remult.repo(Task)

function App() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    return taskRepo
      .liveQuery({
        where: {
          completed: undefined
        }
      })
      .subscribe((info) => setTasks(info.applyChanges))
  }, [])

  const [newTaskTitle, setNewTaskTitle] = useState('')

  const addTask = async (e: FormEvent) => {
    e.preventDefault()
    try {
      await taskRepo.insert({
        title: newTaskTitle,
        completed: false,
        id: tasks.length + 1
      })

      setNewTaskTitle('')
    } catch (error: any) {
      alert(error.message)
    }
  }

  const setAllCompleted = async (completed: boolean) => {
    await TasksController.setAllCompleted(completed)
  }

  return (
    <main>
      {taskRepo.metadata.apiInsertAllowed && (
        <form onSubmit={addTask}>
          <input
            value={newTaskTitle}
            placeholder="What needs to be done?"
            onChange={(e) => setNewTaskTitle(e.target.value)}
          />
          <button>Add</button>
        </form>
      )}
      {tasks.map((task) => {
        const setTask = (value: typeof task) =>
          setTasks((tasks) => tasks.map((t) => (t === task ? value : t)))

        const setCompleted = async (completed: boolean) => {
          setTask(await taskRepo.save({ ...task, completed }))
        }
        const setTitle = (title: string) => {
          setTask({ ...task, title })
        }

        const saveTask = async () => {
          try {
            setTask(await taskRepo.save(task))
          } catch (error: any) {
            alert(error.message)
          }
        }

        const deleteTask = async () => {
          try {
            await taskRepo.delete(task)
          } catch (error: any) {
            alert(error.message)
          }
        }

        return (
          <div key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            <input
              onBlur={saveTask}
              value={task.title}
              onChange={(e) => setTitle(e.target.value)}
            />
            {taskRepo.metadata.apiDeleteAllowed && (
              <button onClick={deleteTask}>x</button>
            )}
          </div>
        )
      })}
      <footer>
        <button onClick={() => setAllCompleted(true)}>Set all completed</button>
        <button onClick={() => setAllCompleted(false)}>
          Set all uncompleted
        </button>
      </footer>
    </main>
  )
}
export default App
