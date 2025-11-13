import { call, put, takeEvery } from "redux-saga/effects";
import {
  fetchNewReleasesStart,
  fetchNewReleasesSuccess,
  fetchNewReleasesFailure,
  searchBooksStart,
  searchBooksSuccess,
  searchBooksFailure,
  fetchBookDetailsStart,
  fetchBookDetailsSuccess,
  fetchBookDetailsFailure,
} from "../store/books/bookSlice";
import { getNewReleases, searchBooks, getBookDetails } from "../helpers/api";
import type { Book, BookDetails, BooksResponse } from "../types/book";

function* fetchNewReleasesSaga() {
  try {
    console.log("📚 Saga: Starting fetchNewReleasesSaga");
    const newReleases: Book[] = yield call(getNewReleases);
    console.log("📚 Saga: Successfully fetched", newReleases.length, "books");
    yield put(fetchNewReleasesSuccess(newReleases));
  } catch (error) {
    console.error('📚 Saga: Error in fetchNewReleasesSaga', error)
    yield put(
      fetchNewReleasesFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

function* searchBooksSaga(action: ReturnType<typeof searchBooksStart>) {
  try {
    const { query, page = 1 } = action.payload;
    const response: BooksResponse = yield call(searchBooks, query, page);
    yield put(searchBooksSuccess(response));
  } catch (error) {
    yield put(
      searchBooksFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

function* fetchBookDetailsSaga(
  action: ReturnType<typeof fetchBookDetailsStart>
) {
  try {
    const bookDetails: BookDetails = yield call(getBookDetails, action.payload);
    yield put(fetchBookDetailsSuccess(bookDetails));
  } catch (error) {
    yield put(
      fetchBookDetailsFailure(
        error instanceof Error ? error.message : "Unknown error"
      )
    );
  }
}

export function* watchBooksSaga() {
  yield takeEvery(fetchNewReleasesStart.type, fetchNewReleasesSaga);
  yield takeEvery(searchBooksStart.type, searchBooksSaga);
  yield takeEvery(fetchBookDetailsStart.type, fetchBookDetailsSaga);
}
