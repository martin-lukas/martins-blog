# Learning Styled Components with React

I've never been a big fan of tinkering with CSS. It was always a struggle to try to achieve a pixel-perfect design of the app, and the process wasn't satisfying at all. In the backend, it always felt more satisfying to improve the existing architecture, or fix some issues in the logic. If I fixed some styling issues on the frontend, usually it led to an even more complicated CSS file. But that's probably mostly from lack of experience with it.

But today I'll try to rewrite the basic Todo app's CSS into a cleaner Styled Components solution, while preserving the current design.

## The example app

I'll be trying Styled Components with an example Todo app I prepared. The app looks something like this:

![TODO App usage example](../assets/images/todoapp-usage.gif)

My main goal is to not break the app when trying to fit in the Styled Components.

## Styled Components

Let's start by installing the Styled Components library. I'll actually need two packages, as I'm using TypeScript:

- styled-components
- @types/styled-components

Now let's see how I can improve the existing code with it.

Here is the markup for the app now:

```tsx
function App() {
  // logic here
  
  return (
    <div className="container">
      <div className="app-wrapper">
        <h1>TODO App</h1>
        <section className="add-todo-section">
          <label>New todo:</label>
          <input
            autoFocus
            autoComplete="off"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyUp={e => e.key === 'Enter' && submitAddTodo()}
          />
          <button onClick={submitAddTodo}>✔</button>
        </section>
        {todos.length > 0 && (
          <>
            <section className="todo-list-section">
              {todos.map(todo => (
                <div className="todo-item-group" key={todo.id}>
                  <div>
                    <input type="checkbox" key={todo.id}/>
                    <label>{todo.content}</label>
                  </div>
                  <button onClick={() => submitDeleteTodo(todo)}>✗</button>
                </div>
              ))}
            </section>
            <section className="global-actions-section">
              <button onClick={submitDeleteAllTodos}>Remove All</button>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
```

I'll start from the top. I'll try to refactor the container div into a styled component, and replace the div with it:

```typescript
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`
```

Nothing broke, which is great! Let's continue with the rest of the CSS classes used in the markup.

There is one CSS selector that I couldn't transform into a styled one:

```css
html, body {
  margin: 0 auto;
  color: white;
  background-color: #2a2a2a;
}
```

The problem lies in not having any place to put this style. The React app is rendered within the `<body>` tag, so it's not like I can just wrap my app with `<Body>` styled components. Not even considering the `<html>` tag. The easier way (based on the library's docs) is to just put them in a `<style>` tag in the static `index.html` file itself, either manually or with code generation. I chose the first approach.

Now the markup looks like this:

```tsx
function App() {
  // logic here
  
  return (
    <Container>
      <Wrapper>
        <Heading>TODO App</Heading>
        <AddTodoSection>
          <label>New todo:</label>
          <Input
            autoFocus
            autoComplete="off"
            value={newTodo}
            onChange={e => setNewTodo(e.target.value)}
            onKeyUp={e => e.key === 'Enter' && submitAddTodo()}
          />
          <Button onClick={submitAddTodo}>✔</Button>
        </AddTodoSection>
        {todos.length > 0 && (
          <>
            <TodoListSection>
              {todos.map(todo => (
                <TodoItem key={todo.id}>
                  <div>
                    <input type="checkbox" key={todo.id} />
                    <label>{todo.content}</label>
                  </div>
                  <Button onClick={() => submitDeleteTodo(todo)}>✗</Button>
                </TodoItem>
              ))}
            </TodoListSection>
            <GlobalActionsSection>
              <Button onClick={submitDeleteAllTodos}>Remove All</Button>
            </GlobalActionsSection>
          </>
        )}
      </Wrapper>
    </Container>
  )
}
```

## Conclusion

### Readability

Personally, I think the readability of the app's markup improved. The length of the code is almost the same, but the fact that I don't have to intentionally skip over the class names among the other props actually helps a lot.

### Clarity of the code

On the other hand, looking at the element, it might seem confusing which ones are just a styled HTML tag and which are actual subcomponents. E.g. what is `<TodoItem>`? Is it a component with its own logic of rendering and controlling the todo item? Or is it just a `<div>` pretending to be something more complex than it is? If I looked at this code in a few days, I'd actually have to go to its definition to realize it's just styled.

I'm not sure if there is a solution for this issue. It might help to create a naming convention for all styled components, like `StyledButton` instead of `Button`, but that would also increase verbosity. What I think would help a lot would be IDE hints, in the form of a different color for styled components and actual React function components. However, currently they are the same color in my IDE (Intellij IDEA).

&nbsp;

For now I might just accept the confusing nature of styled components appearing as real function components in the markup. The advantage of the overall readability outweighs this issue. But I'll still need to examine more features of this library to get a full view, and form a more complete opinion of it.