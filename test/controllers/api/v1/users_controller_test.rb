require 'test_helper'
require 'api_helper'

class ApiV1UsersControllerTest < ActionDispatch::IntegrationTest
    setup do
        @user = create(:user)
        @other = create(:user)
        @token = sign_in(@user.email, @user.password)
    end

    test 'anyone could view user profile' do
        get api_v1_user_url(@user), as: :json

        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @user.id, 
            "name" => @user.name,
            "title" => @user.title, 
            "introduction" => @user.introduction, 
            "location" => @user.location, 
            "social_links"=> @user.social_links,
            "skills" => [],
            "certificates" => [],
        }
    end

    test 'only user could view edit/delete in his profile' do
        get api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{@token}" }, as: :json
        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @user.id, 
            "name" => @user.name,
            "title" => @user.title,
            "introduction" => @user.introduction, 
            "location" => @user.location, 
            "social_links" => @user.social_links,
            "skills" => [],
            "certificates" => [],
            "can_edit" => true,
            "can_delete" => true
        }
    end

    test 'other user could not view edit/delete in user profile' do
        other_token = sign_in(@other.email, @other.password)

        get api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{other_token}" }, as: :json
        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @user.id, 
            "name" => @user.name,
            "title" => @user.title,
            "introduction" => @user.introduction, 
            "location" => @user.location, 
            "social_links" => @user.social_links,
            "skills" => [],
            "certificates" => [],
            "can_edit" => false,
            "can_delete" => false
        }
    end

    test 'owner could update his profile' do
        put api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{@token}" }, params: { 
            user: { 
                name: 'new user name', 
                title: 'new title',
                location: 'new location',
                introduction: 'new introduction',
                social_links: [{"id"=>0, "name"=>"Google", "link"=>"https://google.com"}],
            } 
        }, as: :json

        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @user.id,
            "name" => "new user name", 
            "title" => "new title",
            "introduction" => "new introduction",
            "location" => "new location",
            "social_links" => [{"id"=>0, "name"=>"Google", "link"=>"https://google.com"}],
            "skills" => [],
            "certificates" => [],
            "can_edit"=>true, 
            "can_delete"=>true
        }
    end

    test 'owner could update his profile avatar' do
        avatar_file = fixture_file_upload(Rails.root.join('test', 'fixtures', 'files', 'images', 'test_img.png'), 'image/png')

        put api_v1_user_url(@user, format: :json), 
            headers: { 
                "X-Auth-Token" => "Bearer #{@token}",
                'Content-Type' => 'multipart/form-data'
            }, 
            params: { 
                user: { 
                    avatar: avatar_file
                } 
            }

        assert_response :success
        assert_equal response.parsed_body["avatar"]["name"], "test_img.png"
        assert response.parsed_body["avatar"]["url"].present?
        assert  @user.reload.avatar.attached?
    end

    test 'other-user could not update user profile' do
        other_token = sign_in(@other.email, @other.password)

        patch api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{other_token}" }, params: { user: { name: 'new user name' } }, as: :json
        assert_response :unauthorized
    end

    test 'owner could delete his account' do
        delete api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{@token}" }, as: :json
        assert_response :success
    end

    test 'other-user could not delete user account' do
        other_token = sign_in(@other.email, @other.password)

        delete api_v1_user_url(@user), headers: { "X-Auth-Token" => "Bearer #{other_token}" }, as: :json
        assert_response :unauthorized
    end
end
