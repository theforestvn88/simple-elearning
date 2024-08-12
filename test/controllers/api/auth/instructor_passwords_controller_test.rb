require 'test_helper'
require 'api_helper'

class ApiAuthInstructorSessionsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @instructor = create(:instructor)
    end

    test 'after change password success, all existed tokens should be delete' do
        token1 = instructor_sign_in(@instructor)#sign_in(@user.email, @user.password)
        sleep 0.1
        token2 = instructor_sign_in(@instructor)#sign_in(@user.email, @user.password)

        update_pass_api_path = "/api/auth/instructor/#{@instructor.partner.slug}/password/update"
        refresh_token_api_path = "/api/auth/instructor/#{@instructor.partner.slug}/refresh_token"
        
        put update_pass_api_path, 
            headers: { "X-Auth-Token" => "Bearer #{token2}" }, 
            params: {
                password: 'updated-password',
                password_confirmation: 'updated-password',
                password_challenge: @instructor.password
            }, as: :json
        assert_response :success

        post refresh_token_api_path, headers: { "X-Auth-Token" => "Bearer #{token1}" }, as: :json
        assert_response :unauthorized

        post refresh_token_api_path, headers: { "X-Auth-Token" => "Bearer #{token2}" }, as: :json
        assert_response :unauthorized
    end
end
