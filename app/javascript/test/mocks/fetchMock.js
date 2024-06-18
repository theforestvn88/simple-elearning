global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(fakePokemons),
    })
)

export const fetchMock = jest.spyOn(global, 'fetch')

export const fetchMockReturn = (res) => fetchMock.mockImplementation(() => Promise.resolve({ ok: true, json: () => Promise.resolve(res) }))

export const fetchMockError = (err) => fetchMock.mockImplementation(() => Promise.resolve({ ok: false, json: () => Promise.resolve(err) }))

export const fetchMockReject = (err) => fetchMock.mockImplementation(() => Promise.reject(err))
