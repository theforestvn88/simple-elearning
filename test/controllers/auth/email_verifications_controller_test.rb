require 'test_helper'

class EmailVerificationsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @user = create(:user)
    end

    test 'email verify success' do
        token = @user.generate_token_for(:email_verification)

        get auth_email_verify_url, params: { token: token }
        assert_redirected_to '/'
    end

    test 'email verify failed with wrong token' do
        token = @user.generate_token_for(:email_verification)

        get auth_email_verify_url, params: { token: '____' }
        assert_response :bad_request
    end

    test 'email verify failed with outdated token' do
        token = @user.generate_token_for(:email_verification)

        travel 2.days

        get auth_email_verify_url, params: { token: token }
        assert_response :bad_request
    end
end
