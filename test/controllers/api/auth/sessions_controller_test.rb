require 'test_helper'

class ApiAuthSessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user)
  end

  test 'log in success' do
    post api_auth_login_url, params: { email: @user.email, password: '0123456789' }
    assert_response :success
    assert response.parsed_body['token'].present?
  end

  test 'login failed with invalid email' do
    post api_auth_login_url, params: { email: '---', password: '0123456789' }
    assert_response :bad_request
    assert_nil response.parsed_body['token']
  end

  test 'login failed with invalid password' do
    post api_auth_login_url, params: { email: @user.email, password: '---------' }
    assert_response :bad_request
    assert_nil response.parsed_body['token']
  end

  test 'log out' do
    post api_auth_login_url, params: { email: @user.email, password: '0123456789' }
    token = response.parsed_body['token']

    delete api_auth_logout_url, headers: { "X-Auth-Token" => "Bearer #{token}" }
    assert_response :success
  end
end
