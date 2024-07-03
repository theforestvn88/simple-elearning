global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([]),
  })
)

export const fetchMock = jest.spyOn(global, 'fetch')

export const fetchMockReturn = (res) => fetchMock.mockImplementation(() => Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve(res) }))

export const fetchMockError = (status, err) => fetchMock.mockImplementation(() => Promise.resolve({ status: status, json: () => Promise.resolve(err) }))

export const fetchMockReject = (err) => fetchMock.mockImplementation(() => Promise.reject(err))