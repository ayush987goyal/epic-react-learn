// simple test with ReactDOM
// http://localhost:3000/counter

import React from 'react'
import ReactDOM from 'react-dom'
import Counter from '../../components/counter'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('counter increments and decrements when the buttons are clicked', () => {
  const root = document.createElement('div')
  document.body.appendChild(root)

  ReactDOM.render(<Counter />, root)

  const [decrementBtn, incrementBtn] = root.querySelectorAll('button')
  const messageEl = root.firstChild.querySelector('div')

  expect(messageEl.textContent).toBe('Current count: 0')

  incrementBtn.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  )
  expect(messageEl.textContent).toBe('Current count: 1')

  decrementBtn.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      button: 0,
    }),
  )
  expect(messageEl.textContent).toBe('Current count: 0')
})

/* eslint no-unused-vars:0 */
