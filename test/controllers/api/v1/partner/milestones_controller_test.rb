require 'test_helper'
require 'api_helper'

class ApiV1PartnerMilestonesControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @instructor = create(:instructor, partner: @partner, rank: :administrator)
        @instructor2 = create(:instructor, partner: @partner, rank: :professor)
        @instructor3 = create(:instructor, partner: @partner, rank: :professor)
        @course = create(:course, instructor: @instructor, partner: @partner)
        @milestone = create(:milestone, instructor: @instructor, course: @course)

        @other_partner = create(:partner)
        @other_instructor = create(:instructor, partner: @other_partner, rank: :administrator)

        create(:assignment, assignable: @course, assignee: @instructor2)
        create(:assignment, assignable: @milestone, assignee: @instructor3)
    end

    test 'only course-assigned-instructor could create milestones' do
        token = instructor_sign_in(@instructor2)

        assert_difference('Milestone.count') do
            post api_v1_partner_course_milestones_url(identify: @instructor.id, course_id: @course.id), 
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                params: { milestone: { name: 'new milestone' } }, 
                as: :json
        end

        assert_response :success
        assert_equal response.parsed_body['name'], 'new milestone'
        assert_equal response.parsed_body['can_edit'], true
        assert_equal response.parsed_body['can_delete'], true


        token = instructor_sign_in(@instructor3)

        assert_no_difference('Milestone.count') do
            post api_v1_partner_course_milestones_url(identify: @instructor.id, course_id: @course.id), 
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                params: { milestone: { name: 'new milestone' } }, 
                as: :json
        end

        assert_response :unauthorized
    end

    test 'other instructor not allowed to create milestone' do
        token = instructor_sign_in(@other_instructor)

        post api_v1_partner_course_milestones_url(identify: @other_instructor.id, course_id: @course.id), 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: { milestone: { name: 'new milestone' } }, 
            as: :json

        assert_response :unauthorized
    end

    test 'only assigned-instructor could update milestone' do
        token = instructor_sign_in(@instructor3)

        patch api_v1_partner_course_milestone_url(identify: @instructor.id, course_id: @course.id, id: @milestone.id),
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                params: { milestone: { name: 'updated' } }, 
                as: :json

        assert_response :success
        assert_equal response.parsed_body['name'], 'updated'
        assert_equal response.parsed_body['can_edit'], true
        assert_equal response.parsed_body['can_delete'], false
    end

    test 'other instructor not allowed to update milestone' do
        token = instructor_sign_in(@other_instructor)

        patch api_v1_partner_course_milestone_url(identify: @other_instructor.id, course_id: @course.id, id: @milestone.id),
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                params: { milestone: { name: 'updated' } }, 
                as: :json

        assert_response :unauthorized
    end

    test 'only course-assigned-instructor could destroy milestone' do
        token = instructor_sign_in(@instructor3)

        assert_difference('Milestone.count', 0) do
            delete api_v1_partner_course_milestone_url(identify: @instructor.id, course_id: @course.id, id: @milestone.id), 
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                as: :json
        end

        assert_response :unauthorized

        token = instructor_sign_in(@instructor2)

        assert_difference('Milestone.count', -1) do
            delete api_v1_partner_course_milestone_url(identify: @instructor.id, course_id: @course.id, id: @milestone.id), 
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                as: :json
        end

        assert_response :no_content
    end

    test 'other instructor not allowed to destroy milestone' do
        token = instructor_sign_in(@other_instructor)

        delete api_v1_partner_course_milestone_url(identify: @other_instructor.id, course_id: @course.id, id: @milestone.id), 
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            as: :json

        assert_response :unauthorized
    end
end
