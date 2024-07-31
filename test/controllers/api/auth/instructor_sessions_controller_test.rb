require 'test_helper'
require 'api_helper'

class ApiAuthInstructorSessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @instructor = create(:instructor)
  end

  test 'instructor login to his partner page' do
    post "/api/auth/instructor/#{@instructor.partner.slug}/login", params: { email: @instructor.email, password: @instructor.password }, as: :json

    assert_response :success
    assert response.parsed_body['token'].present?
    assert response.parsed_body['token_expire_at'].present?
    assert response.parsed_body['user'].present?
    assert_equal response.parsed_body['user']['id'], @instructor.id
    assert_equal response.parsed_body['user']['name'], @instructor.name
  end

  test 'instructor login to other partner page' do
    post "/api/auth/instructor/another-partner-page/login", params: { email: @instructor.email, password: @instructor.password }, as: :json

    assert_response :forbidden
  end

  test 'log out' do
    token = instructor_sign_in(@instructor)

    delete "/api/auth/instructor/#{@instructor.partner.slug}/logout", headers: { "X-Auth-Token" => "Bearer #{token}" }
    assert_response :success
  end

  test 'refresh token' do
    token = instructor_sign_in(@instructor)

    post "/api/auth/instructor/#{@instructor.partner.slug}/refresh_token", headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
    
    assert_response :success
    assert response.parsed_body['token'].present?
    assert response.parsed_body['token_expire_at'].present?
  end
end
