import '@testing-library/jest-dom'


jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn(),
}))

export const setupNavigateSpyOn = (react_router) => {
    const navigateSpy = jest.fn();
    jest.spyOn(react_router, 'useNavigate').mockImplementation(() => navigateSpy)
    return navigateSpy
}
