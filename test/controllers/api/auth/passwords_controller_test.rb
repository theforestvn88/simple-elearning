require 'test_helper'
require 'api_helper'

class ApiV1PasswordsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @user = create(:user)
    end

    test 'anynomous should not able to change password' do
        put api_auth_password_update_url, headers: { "X-Auth-Token" => "Bearer fake-token" }, as: :json
        assert_response :unauthorized
    end

    test 'should not change password with wrong old password' do
        token = sign_in(@user.email, @user.password)

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
        token = sign_in(@user.email, @user.password)

        put api_auth_password_update_url, 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: {
                password: '123456789',
                password_confirmation: '123456789',
                password_challenge: @user.password
            }, as: :json
            
        assert_response :bad_request
    end

    test 'should not change password with wrong password-confirmation' do
        token = sign_in(@user.email, @user.password)

        put api_auth_password_update_url, 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: {
                password: '123456789',
                password_confirmation: 'xxxxxxxxxx',
                password_challenge: @user.password
            }, as: :json
            
        assert_response :bad_request
    end

    test 'should change pasword success with valid params' do
        token = sign_in(@user.email, @user.password)

        put api_auth_password_update_url, 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: {
                password: 'updated-password',
                password_confirmation: 'updated-password',
                password_challenge: @user.password
            }, as: :json
            
        assert_response :success
    end
end
