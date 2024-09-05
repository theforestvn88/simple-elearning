const verifyThatLoginPageOnScreen = (screen, showSignUp = true) => {
    expect(screen.getByRole('heading', {name: 'Log In'})).toBeInTheDocument()
    expect(screen.getByTestId('login-form')).toBeInTheDocument()
    if (showSignUp) {
        expect(screen.getByRole('link', {name: 'Sign Up'})).toBeInTheDocument()
    } else {
        expect(screen.queryByRole('link', {name: 'Sign Up'})).not.toBeInTheDocument()
    }
}

export const verifyThatLoginPageWithSignUpOnScreen = (screen) => {
    verifyThatLoginPageOnScreen(screen, true)
}

export const verifyThatLoginPageWithoutSignUpOnScreen = (screen) => {
    verifyThatLoginPageOnScreen(screen, false)
}
