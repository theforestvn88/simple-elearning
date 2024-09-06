require 'test_helper'
require 'api_helper'

class ApiV1InstructorsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @other_partner = create(:partner)
        @admin = create(:instructor_with_avatar, partner: @partner, rank: :administrator)
        @instructor = create(:instructor_with_avatar, partner: @partner, rank: :professor)
        @instructor2 = create(:instructor_with_avatar, partner: @partner, rank: :lecturer)
        @instructor3 = create(:instructor_with_avatar, partner: @partner, rank: :assistant_professor)
        @other = create(:instructor, partner: @other_partner, rank: :professor)
        @token = instructor_sign_in(@instructor)
    end

    test 'query partner instructors list' do
        token = instructor_sign_in(@admin)
        get api_v1_instructors_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, params: {partner_id: @partner.id}, as: :json

        assert_response :success
        assert_equal response.parsed_body, [@admin, @instructor, @instructor2, @instructor3].map { |ins| 
            {
                "id" => ins.id,
                "name" => ins.name,
                "rank" => ins.rank,
                "avatar" => {
                    "url" => rails_blob_path(ins.avatar, only_path: true)
                }
            }
        }
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
            "avatar" => {
                "byte_size"=> 4066, 
                "url" => rails_blob_path(@instructor.avatar, only_path: true), 
                "name" => "test_img.png"},
            "can_edit"=>true
        }
    end

    test 'verify instructor policy when create an instructor' do
        policy_mock = Minitest::Mock.new
        policy_mock.expect :create?, false, []

        InstructorPolicy.stub :new, policy_mock do
            post api_v1_instructors_url, headers: { "X-Auth-Token" => "Bearer #{@token}" }, params: { 
                instructor: { 
                    name: 'name',
                    rank: 'professor',
                } 
            }, as: :json
        end

        policy_mock.verify
    end
    
    test 'create instructor' do
        instructor_params = {
            email: 'instructor1@example.com', 
            name: 'name',
            rank: 'professor'
        }

        mock_instructor_creator_service = Minitest::Mock.new
        mock_instructor_creator_service.expect :call, 
            ::InstructorCreateService::Result.new(true, ::Instructor.new(instructor_params.merge(id: 1000, partner_id: @admin.partner_id)), 'random_password'), 
            **instructor_params.merge(partner_id: @admin.partner_id)

        token = instructor_sign_in(@admin)

        ::InstructorCreateService.stub :new, -> { mock_instructor_creator_service } do
            post api_v1_instructors_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { 
                instructor: instructor_params
            }, as: :json

            assert_response :success
            assert_equal response.parsed_body['name'], instructor_params[:name]
            assert_equal response.parsed_body['rank'], instructor_params[:rank]
            assert_equal response.parsed_body['can_edit'], true
            assert_equal response.parsed_body['can_delete'], true
        end

        mock_instructor_creator_service.verify
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
            "avatar" => {
                "byte_size"=> 4066, 
                "url" => rails_blob_path(@instructor.avatar, only_path: true), 
                "name" => "test_img.png"},
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
