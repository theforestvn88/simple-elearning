export const localStorageGetItemSpy = () => jest.spyOn(global.localStorage.__proto__, 'getItem')
export const localStorageMockReturn = (val) => localStorageGetItemSpy().mockReturnValue(JSON.stringify(val))

export const localStorageSetItemSpy = () => jest.spyOn(global.localStorage.__proto__, 'setItem')
export const localStorageRemoveItemSpy = () => jest.spyOn(window.localStorage.__proto__, 'removeItem')
