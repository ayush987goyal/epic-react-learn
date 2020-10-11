// mocking Browser APIs and modules
// http://localhost:3000/location

import React from 'react'
import {render, screen, act} from '@testing-library/react'
import {useCurrentPosition} from 'react-use-geolocation'
import Location from '../../examples/location'

jest.mock('react-use-geolocation')

test('displays the users current location', async () => {
  const fakePosition = {
    coords: {latitude: 12.4, longitude: 23.4},
  }

  let setReturnValue
  function useMockCurrentPosition() {
    const state = React.useState([])
    setReturnValue = state[1]
    return state[0]
  }
  useCurrentPosition.mockImplementation(useMockCurrentPosition)

  render(<Location />)
  expect(screen.getByLabelText(/loading/i)).toBeInTheDocument()

  act(() => {
    setReturnValue(fakePosition)
  })

  expect(screen.queryByLabelText(/loading/i)).not.toBeInTheDocument()
  expect(
    screen.getByText(`Latitude: ${fakePosition.coords.latitude}`),
  ).toBeInTheDocument()
  expect(
    screen.getByText(`Longitude: ${fakePosition.coords.longitude}`),
  ).toBeInTheDocument()
})
