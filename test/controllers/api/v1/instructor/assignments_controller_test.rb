# frozen_string_literal: true

require 'test_helper'
require 'api_helper'

class ApiV1InstructorAssignmentsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @instructor = create(:instructor_with_avatar, partner: @partner, rank: :administrator)
        @course = create(:course, instructor: @instructor, partner: @partner)
        @professor = create(:instructor, partner: @partner, rank: :professor)
    end

    test 'assign to course' do
        token = instructor_sign_in(@instructor)

        assert_difference('Assignment.count') do
            post api_v1_instructor_assignments_url(identify: @partner.id), 
                 headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                 params: { 
                    assignment: { 
                        assignable_type: 'Course', 
                        assignable_id: @course.id, 
                        assignee_type: 'Instructor', 
                        assignee_id: @professor.id 
                    } 
                }, 
                as: :json
        end

        assert_response :created
    end

    test 'create assignment with invalid params' do
        token = instructor_sign_in(@instructor)

        assert_no_difference('Assignment.count') do
            post api_v1_instructor_assignments_url(identify: @partner.id), 
                 headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                 params: { 
                    assignment: { 
                        assignable_type: 'UnknowClazz', 
                        assignable_id: @course.id, 
                        assignee_type: 'Instructor', 
                        assignee_id: @professor.id 
                    } 
                }, 
                as: :json
        end

        assert_response :bad_request
    end

    test 'destroy assignment' do
        assignment = Assignment.create(assignable: @course, assignee: @professor)

        token = instructor_sign_in(@instructor)

        assert_difference('Assignment.count', -1) do
            delete api_v1_instructor_assignment_url(identify: @partner.id, id: assignment.id), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :no_content
    end
end
