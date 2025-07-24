import { nextTick, reactive, ref, shallowRef } from 'vue'

export function usePaginationReq(req, formatResFn, pageSize = 10) {
  // 分页
  const pagination = reactive({
    total: 0,
    current: 1,
    pageSize,
    showSizeChanger: true,
    showTotal: (total) => `共${total}条`,
  })
  // 加载状态
  const loading = ref(false)
  // 表格数据
  const dataSource = shallowRef([])
  // 上次请求的查询参数
  let lastQuery = {}

  /**
   * Fetches a paginated list of data based on the provided query parameters.
   *
   * @param {Object} [query={}] - The query parameters to filter the data.
   * @returns {Promise<Object>} A promise that resolves with the server response.
   *
   * The function performs the following:
   * - Updates the `lastQuery` with the provided query.
   * - Sets the `loading` state to `true` while the request is in progress.
   * - Sends a request with pagination details and the query parameters.
   * - Processes the response using an optional `formatResFn` function.
   * - Updates the `dataSource`, `pagination.total`, and `pagination.current` with the response data.
   * - Ensures the `loading` state is set to `false` after the request completes.
   */
  function fetchList(query = {}) {
    lastQuery = query
    loading.value = true
    return req({
      size: pagination.pageSize,
      current: pagination.current,
      query,
    })
      .then((res) => {
        const formatRes = formatResFn ? formatResFn(res) : res
        dataSource.value = formatRes.data.records
        pagination.total = formatRes.data.total
        pagination.current = formatRes.data.current
        return res
      })
      .finally(() => {
        loading.value = false
      })
  }

  /**
   * Updates the pagination state and optionally refreshes the data by fetching the list.
   *
   * @param {Object} [page={}] - The pagination details to update.
   * @param {number} [page.current] - The current page number.
   * @param {number} [page.pageSize] - The number of items per page.
   * @param {number} [page.total] - The total number of items.
   * @param {boolean} [refresh=true] - Whether to refresh the data by fetching the list.
   * @returns {void}
   */
  function changePage(page = {}, refresh = true) {
    pagination.current = page.current
    pagination.pageSize = page.pageSize
    pagination.total = page.total
    if (refresh) {
      nextTick(() => {
        fetchList(lastQuery)
      })
    }
  }

  /**
   * Resets the pagination object to its initial state.
   * - Sets the current page to 1.
   * - Resets the page size to the default value.
   * - Sets the total number of items to 0.
   *
   * This function is useful for reinitializing pagination when starting a new query or dataset.
   */
  function resetPage() {
    pagination.current = 1
    pagination.pageSize = pageSize
    pagination.total = 0
  }

  return { loading, dataSource, pagination, resetPage, fetchList, changePage }
}
