require 'test_helper'

class ApiAuthRegistrationsControllerTest < ActionDispatch::IntegrationTest
    test 'register success' do
        assert_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', password_confirmation: '0123456789', name: 'tester' }
        end
        assert_response :success
        assert response.parsed_body['token'].present?
    end

    test 'register failed when missing email' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { password: '0123456789', password_confirmation: '0123456789', name: 'tester' }
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end

    test 'register failed when missing password' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password_confirmation: '0123456789', name: 'tester' }
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end

    test 'register failed when missing password_confirmation' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', name: 'tester' }
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end

    test 'register failed with wrong password_confirmation' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', password_confirmation: '', name: 'tester' }
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end

    test 'register failed when missing name' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', password_confirmation: '0123456789' }
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end
end
