require 'test_helper'

class ApiAuthRegistrationsControllerTest < ActionDispatch::IntegrationTest
    test 'register success' do
        assert_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', password_confirmation: '0123456789', name: 'tester' }, as: :json
        end
        assert_response :success
        assert response.parsed_body['token'].present?
        assert response.parsed_body['token_expire_at'].present?
        assert response.parsed_body['user'].present?
        assert_equal response.parsed_body['user']['id'], User.last.id
        assert_equal response.parsed_body['user']['name'], 'tester'
        assert_equal response.parsed_body['user']['rank'], 'user'
    end

    test 'send verify email' do
        mock_user_mailer = Minitest::Mock.new
        mock_user_mailer.expect :account_verification, mock_user_mailer, []
        mock_user_mailer.expect :deliver_later, nil, []
        
        ::UserMailer.stub :with, mock_user_mailer do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', password_confirmation: '0123456789', name: 'tester' }, as: :json
        end

        mock_user_mailer.verify
    end

    test 'register failed when missing email' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { password: '0123456789', password_confirmation: '0123456789', name: 'tester' }, as: :json
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end

    test 'register failed when missing password' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password_confirmation: '0123456789', name: 'tester' }, as: :json
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end

    test 'register failed when missing password_confirmation' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', name: 'tester' }, as: :json
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end

    test 'register failed with wrong password_confirmation' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', password_confirmation: '', name: 'tester' }, as: :json
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end

    test 'register failed when missing name' do
        assert_no_difference("User.count") do
            post api_auth_signup_url, params: { email: 'tester@example.com', password: '0123456789', password_confirmation: '0123456789' }, as: :json
        end
        assert_response :bad_request
        assert_nil response.parsed_body['token']
    end
end
