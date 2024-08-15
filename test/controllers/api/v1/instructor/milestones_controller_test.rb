require 'test_helper'
require 'api_helper'

class ApiV1InstructorMilestonesControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @instructor = create(:instructor, partner: @partner, rank: :administrator)
        @course = create(:course, instructor: @instructor, partner: @partner)
        @milestone = create(:milestone, instructor: @instructor, course: @course)
    end

    test 'create milestone' do
        token = instructor_sign_in(@instructor)

        assert_difference('Milestone.count') do
            post api_v1_instructor_course_milestones_url(identify: @instructor.id, course_id: @course.id), 
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                params: { milestone: { name: 'new milestone' } }, 
                as: :json
        end

        assert_response :success
        assert_equal response.parsed_body['name'], 'new milestone'
    end

    test 'update milestone' do
        token = instructor_sign_in(@instructor)

        patch api_v1_instructor_course_milestone_url(identify: @instructor.id, course_id: @course.id, id: @milestone.id),
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                params: { milestone: { name: 'updated' } }, 
                as: :json

        assert_response :success
        assert_equal response.parsed_body['name'], 'updated'
    end

    test 'destroy milestone' do
        token = instructor_sign_in(@instructor)

        assert_difference('Milestone.count', -1) do
            delete api_v1_instructor_course_milestone_url(identify: @instructor.id, course_id: @course.id, id: @milestone.id), 
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                as: :json
        end

        assert_response :no_content
    end
end
