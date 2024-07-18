require 'test_helper'

class ApiV1PasswordsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @user = create(:user)
    end

    test 'anynomous should not able to change password' do
        put api_auth_password_update_url, headers: { "X-Auth-Token" => "Bearer fake-token" }, as: :json
        assert_response :unauthorized
    end

    test 'should not change password with wrong old password' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }, as: :json
        assert_response :success
        token = response.parsed_body['token']

        put api_auth_password_update_url, 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: {
                password: 'updated-password',
                password_confirmation: 'updated-password',
                password_challenge: 'xxxxxxxxxx'
            }, as: :json
            
        assert_response :bad_request
    end

    test 'should not change password with invalid password' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }, as: :json
        assert_response :success
        token = response.parsed_body['token']

        put api_auth_password_update_url, 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: {
                password: '123456789',
                password_confirmation: '123456789',
                password_challenge: '0123456789'
            }, as: :json
            
        assert_response :bad_request
    end

    test 'should not change password with wrong password-confirmation' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }, as: :json
        assert_response :success
        token = response.parsed_body['token']

        put api_auth_password_update_url, 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: {
                password: '123456789',
                password_confirmation: 'xxxxxxxxxx',
                password_challenge: '0123456789'
            }, as: :json
            
        assert_response :bad_request
    end

    test 'should change pasword success with valid params' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }, as: :json
        assert_response :success
        token = response.parsed_body['token']

        put api_auth_password_update_url, 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: {
                password: 'updated-password',
                password_confirmation: 'updated-password',
                password_challenge: '0123456789'
            }, as: :json
            
        assert_response :success
    end

    test 'after change password success, all existed tokens should be delete' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }, as: :json
        assert_response :success
        token1 = response.parsed_body['token']

        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }, as: :json
        assert_response :success
        token2 = response.parsed_body['token']

        put api_auth_password_update_url, 
            headers: { "X-Auth-Token" => "Bearer #{token2}" }, 
            params: {
                password: 'updated-password',
                password_confirmation: 'updated-password',
                password_challenge: '0123456789'
            }, as: :json
        assert_response :success

        post api_auth_refresh_token_url, headers: { "X-Auth-Token" => "Bearer #{token1}" }, as: :json
        assert_response :unauthorized

        post api_auth_refresh_token_url, headers: { "X-Auth-Token" => "Bearer #{token2}" }, as: :json
        assert_response :unauthorized
    end
end
