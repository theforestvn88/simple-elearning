require 'test_helper'
require 'api_helper'

class ApiAuthSessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = create(:user_with_avatar)
  end

  test 'log in success' do
    post api_auth_login_url, params: { email: @user.email, password: '0123456789' }, as: :json
    assert_response :success
    assert response.parsed_body['token'].present?
    assert response.parsed_body['token_expire_at'].present?
    assert response.parsed_body['user'].present?
    assert_equal response.parsed_body['user']['id'], @user.id
    assert_equal response.parsed_body['user']['name'], @user.name
    assert_equal response.parsed_body['user']['rank'], @user.rank
    assert_equal response.parsed_body['user']['avatar']['url'], rails_blob_path(@user.avatar, only_path: true)
  end

  test 'login failed with invalid email' do
    post api_auth_login_url, params: { email: '---', password: '0123456789' }, as: :json
    assert_response :bad_request
    assert_nil response.parsed_body['token']
  end

  test 'login failed with invalid password' do
    post api_auth_login_url, params: { email: @user.email, password: '---------' }, as: :json
    assert_response :bad_request
    assert_nil response.parsed_body['token']
  end

  test 'log out with valid token' do
    token = sign_in(@user.email, @user.password)

    delete api_auth_logout_url, headers: { "X-Auth-Token" => "Bearer #{token}" }
    assert_response :success
  end

  test 'log out with invalid token should response :unauthorized' do
    invalid_token = ''

    delete api_auth_logout_url, headers: { "X-Auth-Token" => "Bearer #{invalid_token}" }
    assert_response :unauthorized
  end

  test 'refresh token' do
    token = sign_in(@user.email, @user.password)

    post api_auth_refresh_token_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
    
    assert_response :success
    assert response.parsed_body['token'].present?
    assert response.parsed_body['token_expire_at'].present?
  end
end
