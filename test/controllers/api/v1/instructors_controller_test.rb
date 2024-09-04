require 'test_helper'
require 'api_helper'

class ApiV1InstructorsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @instructor = create(:instructor, partner: @partner, rank: :professor)
        # @other = create(:instructor, partner: @partner, rank: :professor)
        @token = instructor_sign_in(@instructor)
    end

    test 'verify instructor policy when show an instructor' do
        policy_mock = Minitest::Mock.new
        policy_mock.expect :show?, true, []
        policy_mock.expect :update?, true, []
        policy_mock.expect :destroy?, true, []

        InstructorPolicy.stub :new, policy_mock do
            get api_v1_instructor_url(@instructor), as: :json
        end

        policy_mock.verify
    end

    
    test 'show instructor profile' do
        get api_v1_instructor_url(@instructor), headers: { "X-Auth-Token" => "Bearer #{@token}" }, as: :json

        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @instructor.id, 
            "name" => @instructor.name,
            "title" => @instructor.title, 
            "introduction" => @instructor.introduction, 
            "location" => @instructor.location, 
            "rank" => "professor",
            "social_links"=> @instructor.social_links,
            "can_edit"=>true
        }
    end

    test 'verify instructor policy when update an instructor' do
        policy_mock = Minitest::Mock.new
        policy_mock.expect :update?, false, []

        InstructorPolicy.stub :new, policy_mock do
            put api_v1_instructor_url(@instructor), headers: { "X-Auth-Token" => "Bearer #{@token}" }, params: { 
                instructor: { 
                    name: 'new name', 
                } 
            }, as: :json
        end

        policy_mock.verify
    end

    test 'update instructor profile' do
        put api_v1_instructor_url(@instructor), headers: { "X-Auth-Token" => "Bearer #{@token}" }, params: { 
            instructor: { 
                name: 'new user name', 
                title: 'new title',
                location: 'new location',
                introduction: 'new introduction',
                social_links: [{"id"=>0, "name"=>"Google", "link"=>"https://google.com"}],
            } 
        }, as: :json

        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @instructor.id,
            "name" => "new user name", 
            "title" => "new title",
            "location" => "new location",
            "introduction" => "new introduction",
            "rank" => "professor",
            "social_links" => [{"id"=>0, "name"=>"Google", "link"=>"https://google.com"}],
            "can_edit"=>true
        }
    end

    test 'verify instructor policy when delete an instructor' do
        policy_mock = Minitest::Mock.new
        policy_mock.expect :destroy?, true, []

        InstructorPolicy.stub :new, policy_mock do
            delete api_v1_instructor_url(@instructor), headers: { "X-Auth-Token" => "Bearer #{@token}" }, as: :json
        end

        policy_mock.verify
    end

    test 'admin could delete instructor account' do
        token = instructor_sign_in(@admin)
        delete api_v1_instructor_url(@instructor), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
    end
end
