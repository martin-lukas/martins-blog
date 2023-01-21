# Fetching data in React

I've been developing in React for quite some time now. Usually when I needed to fetch some data, it was fine to create a `useEffect` hook, fetch it and then set it into a state using the useState hook. However, recently I've been wondering if there is a cleaner way, including error handling and retries. And of counrse there is. There is actually several. Here I'll try to learn more about the possibilities of data fetching in React

## The example app

I'll be trying the methods on an example todo app I prepared. The app looks something like this:

![TODO App example](../assets/images/todoapp-usage.gif)

The implementation is very trivial. It looks something like this:

```typescript jsx
function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState<string>("")

  const [isAppLoading, setAppLoading] = useState(false)
  const [isNewLoading, setNewLoading] = useState(false)
  const [isRemoveLoading, setRemoveLoading] = useState(false)
  const [isRemoveAllLoading, setRemoveAllLoading] = useState(false)

  const removedTodo = useRef<string | null>(null)

  function resetInput() {
    setNewTodo('')
  }

  async function fetchTodos() {
    setTodos(await getTodos())
  }

  useEffect(() => {
    (async () => {
      setAppLoading(true)

      await fetchTodos()

      setAppLoading(false)
    })()
  }, [])

  async function submitAddTodo() {
    setNewLoading(true)

    await addTodo({ id: null, content: newTodo })
    await fetchTodos()

    setNewLoading(false)
    resetInput()
  }

  async function submitDeleteTodo(todo: Todo) {
    setRemoveLoading(true)
    removedTodo.current = todo.id

    await deleteTodo(todo)
    await fetchTodos()

    setRemoveLoading(false)
    removedTodo.current = null
    resetInput()
  }

  async function submitDeleteAllTodos() {
    setRemoveAllLoading(true)

    await deleteAllTodos()
    await fetchTodos()

    setRemoveAllLoading(false)
    resetInput()
  }

  if (isAppLoading) {
    return <div className="loader"/>
  }

  return (
    <>...</>
  )
}
```

I omitted the JSX markup as that's not the point of today's exercise.

I tried to handle all the waiting for API responses in a nice UX-friendly way, but I guess you'll be the judge of that. Although that made a bit of a mess in the component's state.

The todo service functions look something like this:

```typescript
export interface Todo {
  id: string | null;
  content: string;
}

const BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8080'
  : '/'
const TODO_URL = `${BASE_URL}/api/todos`

export async function getTodos(): Promise<Todo[]> {
  const data = await fetchAPI(TODO_URL)
  return await data.json()
}

export async function addTodo(newTodo: Todo): Promise<Response> {
  return fetchAPI(TODO_URL, 'POST', JSON.stringify(newTodo))
}

export function deleteTodo(todo: Todo): Promise<Response> {
  return fetchAPI(TODO_URL, 'DELETE', JSON.stringify(todo))
}

export function deleteAllTodos(): Promise<Response> {
  return fetchAPI(`${TODO_URL}/all`, 'DELETE')
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'

async function fetchAPI(url: string, method: HttpMethod = 'GET', body?: string): Promise<Response> {
  return fetch(url, {
    method,
    headers: {
      ...(method !== 'GET' && { 'Content-Type': 'application/json' })
    },
    body
  })
}

```

It's not avery clean or a robust solution, but for the sake of this exercise, I tried to avoid too much duplication even while using the built-in fetch API. Also, the error handling and retrying of requests is completely missing. Now we'll try to improve upon this with the React Query library.

## React Query

WIP