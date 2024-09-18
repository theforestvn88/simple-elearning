require 'test_helper'
require 'api_helper'

class ApiAuthInstructorSessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @instructor = create(:instructor)
  end

  test 'instructor login to his partner page' do
    post "/api/auth/partner/#{@instructor.partner.slug}/login", params: { email: @instructor.email, password: @instructor.password }, as: :json

    assert_response :success
    assert response.parsed_body['token'].present?
    assert response.parsed_body['token_expire_at'].present?
    assert response.parsed_body['user'].present?
    assert_equal response.parsed_body['user']['id'], @instructor.id
    assert_equal response.parsed_body['user']['name'], @instructor.name
    assert_equal response.parsed_body['user']['rank'], @instructor.rank
  end

  test 'instructor login to other partner page' do
    post "/api/auth/partner/another-partner-page/login", params: { email: @instructor.email, password: @instructor.password }, as: :json

    assert_response :forbidden
  end

  test 'log out' do
    token1 = instructor_sign_in(@instructor)
    sleep 0.1
    token2 = instructor_sign_in(@instructor)

    delete "/api/auth/partner/#{@instructor.partner.slug}/logout", headers: { "X-Auth-Token" => "Bearer #{token1}" }
    assert_response :success

    post "/api/auth/partner/#{@instructor.partner.slug}/refresh_token", headers: { "X-Auth-Token" => "Bearer #{token1}" }, as: :json
    assert_response :unauthorized

    post "/api/auth/partner/#{@instructor.partner.slug}/refresh_token", headers: { "X-Auth-Token" => "Bearer #{token2}" }, as: :json
    assert_response :unauthorized
  end

  test 'refresh token' do
    token = instructor_sign_in(@instructor)

    post "/api/auth/partner/#{@instructor.partner.slug}/refresh_token", headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
    
    assert_response :success
    assert response.parsed_body['token'].present?
    assert response.parsed_body['token_expire_at'].present?
  end
end
