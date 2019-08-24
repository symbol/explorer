import moment from 'moment'
import helper from './helper'

// FORMAT FEE

// Convert micro-xem (smallest unit) to XEM.
const microxemToXem = (amount) =>
  amount / Math.pow(10, 6)

// Format fee (in microxem) to string (in XEM).
const formatFee = (fee) =>
  microxemToXem(fee.compact()).toString()

// FORMAT HEIGHT

// Format block/chain height to string.
const formatHeight = (height) =>
  helper.uint64ToString(height.higher, height.lower)

// FORMAT ADDRESS

// Format address to pretty string.
const formatAddress = (address) =>
  address.pretty()

// FORMAT TIMESTAMP

// Convert NEM timestamp to date.
const nemstampToDate = (nemstamp) =>
  new Date(Math.floor(nemstamp.compact() / 1000) + 1459468800)

// Convert date to moment.
const dateToMoment = (date) =>
  moment(String(date))

// Format timestamp from nemstamp.
const formatTimestamp = (nemstamp) =>
  dateToMoment(nemstampToDate(nemstamp)).format('YYYY-MM-DD H:mm:ss')

// FORMAT AGE

export default {
  formatAddress,
  formatFee,
  formatHeight,
  formatTimestamp
}
