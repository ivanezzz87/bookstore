import { all } from 'redux-saga/effects'
import { watchBooksSaga } from './bookSaga'
import { watchUserSaga } from './userSaga'
import { watchCartSaga } from './cartSaga'

export default function* rootSaga() {
  yield all([
    watchBooksSaga(),
    watchUserSaga(),
    watchCartSaga(),
  ])
}