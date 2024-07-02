require 'test_helper'

class ApiV1UsersControllerTest < ActionDispatch::IntegrationTest
    setup do
        @user = create(:user)
        @other = create(:user)
    end

    test 'anyone could view user profile' do
        get api_v1_user_url(@user), as: :json

        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @user.id, 
            "name" => @user.name, 
            "introduction" => @user.introduction, 
            "location" => @user.location, 
            "social_links"=> @user.social_links
        }
    end

    test 'only user could view edit/delete in his profile' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }
        token = response.parsed_body['token']

        get api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @user.id, 
            "name" => @user.name, 
            "introduction" => @user.introduction, 
            "location" => @user.location, 
            "social_links" => @user.social_links,
            "can_edit" => true,
            "can_delete" => true
        }
    end

    test 'other user could not view edit/delete in user profile' do
        post api_auth_login_url, params: { email: @other.email, password: '0123456789' }
        token = response.parsed_body['token']

        get api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @user.id, 
            "name" => @user.name, 
            "introduction" => @user.introduction, 
            "location" => @user.location, 
            "social_links" => @user.social_links,
            "can_edit" => false,
            "can_delete" => false
        }
    end

    test 'owner could update his profile' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }
        token = response.parsed_body['token']

        patch api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { user: { name: 'new user name' } }, as: :json
        assert_response :success
    end

    test 'other-user could not update user profile' do
        post api_auth_login_url, params: { email: @other.email, password: '0123456789' }
        token = response.parsed_body['token']

        patch api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { user: { name: 'new user name' } }, as: :json
        assert_response :unauthorized
    end

    test 'owner could delete his account' do
        post api_auth_login_url, params: { email: @user.email, password: '0123456789' }
        token = response.parsed_body['token']

        delete api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
    end

    test 'other-user could not delete user account' do
        post api_auth_login_url, params: { email: @other.email, password: '0123456789' }
        token = response.parsed_body['token']

        delete api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :unauthorized
    end
end
