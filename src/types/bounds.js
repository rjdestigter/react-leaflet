/* @flow */

import { PropTypes } from 'react'
import { LatLngBounds } from 'leaflet-077'

import latlngList from './latlngList'

export default PropTypes.oneOfType([
  PropTypes.instanceOf(LatLngBounds),
  latlngList,
])
