# Selectorize

This library is to create memoized selectors to work with libraries like Redux. Combining the mentality of [reselect](https://github.com/reduxjs/reselect) with techniques from KnockoutJS and MobX. It works alongside reselect and other memoization techniques but focuses on autotracking inputs from immutable objects.

From reselect example:

```js
import { connect } from 'react-redux'
import { toggleTodo } from '../actions'
import TodoList from '../components/TodoList'

const getVisibleTodos = (todos, filter) => {
  switch (filter) {
    case 'SHOW_ALL':
      return todos
    case 'SHOW_COMPLETED':
      return todos.filter(t => t.completed)
    case 'SHOW_ACTIVE':
      return todos.filter(t => !t.completed)
  }
}

const mapStateToProps = (state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onTodoClick: (id) => {
      dispatch(toggleTodo(id))
    }
  }
}

const VisibleTodoList = connect(
  mapStateToProps,
  mapDispatchToProps
)(TodoList)

export default VisibleTodoList
```

With selectorize all you do is wrap mapStateToProps:
```js
import { selectorize } from 'selectorize'

const mapStateToProps = selectorize((state) => {
  return {
    todos: getVisibleTodos(state.todos, state.visibilityFilter)
  }
})
```

How does this work? Selectorize wraps the immutable object props with a ES Proxy that detects getters and memoizes over it. Since immutable data always creates new refs on updates right down to the root even when nested all we need to do is track the immediate properties.

Selectors can also be nested. Again due to the properties of immutability things will track all the way down. However, unlike standard argument memoization, if a property is changed the cache will only be invalidated if it is one that is accessed in the descendant execution thread. This reduces many cases where selector composition is necessary. Just remember to selectorize outside of the execution context.

## Thoughts

This is not much more than a gist currently. Still needs to benchmark to see if the performance completely invalidates the usefulness.

While applicable to redux and the like, what influenced this library was the thought that this technique could be used to auto memoize render trees in a way similar to fine grained change detection libraries for non-fine grained immutable approaches as an alternative to techniques used by virtual dom libraries and without the creation/teardown overhead of subscriptions.
