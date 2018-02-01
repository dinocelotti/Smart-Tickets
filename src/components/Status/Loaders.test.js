import React from 'react'
import { LoadingSplash } from './Loaders'
import renderer from 'react-test-renderer'

it('renders correctly', () => {
  const tree = renderer
    .create(<LoadingSplash message="Loading..."/>)
    .toJSON();
  expect(tree).toMatchSnapshot();
});