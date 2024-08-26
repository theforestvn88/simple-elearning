# frozen_string_literal: true

require 'test_helper'
require 'api_helper'

class ApiV1InstructorAssignmentsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @professor = create(:instructor, partner: @partner, rank: :professor)
        @assistant_professor = create(:instructor, partner: @partner, rank: :assistant_professor)
        @lecturer = create(:instructor, partner: @partner, rank: :lecturer)
        @other_instructor = create(:instructor)
        @user = create(:user)
        @course = create(:course, instructor: @admin, partner: @partner)
        @milestone = create(:milestone, instructor: @professor, course: @course)
        @lesson = create(:lesson, instructor: @professor, course: @course, milestone: @milestone, estimated_minutes: 60)
    end

    test 'verify assigment policy when create an assignment' do
        token = instructor_sign_in(@admin)
        policy_mock = Minitest::Mock.new
        policy_mock.expect :create?, true, []

        AssignmentPolicy.stub :new, policy_mock do
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

        policy_mock.verify
    end

    test 'assign an instructor to course' do
        token = instructor_sign_in(@admin)

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

    test 'assign an instructor to milestone' do
        token = instructor_sign_in(@admin)

        assert_difference('Assignment.count') do
            post api_v1_instructor_assignments_url(identify: @partner.id), 
                 headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                 params: { 
                    assignment: { 
                        assignable_type: 'Milestone', 
                        assignable_id: @milestone.id, 
                        assignee_type: 'Instructor', 
                        assignee_id: @professor.id 
                    } 
                }, 
                as: :json
        end

        assert_response :created
    end

    test 'assign an instructor to lesson' do
        token = instructor_sign_in(@admin)

        assert_difference('Assignment.count') do
            post api_v1_instructor_assignments_url(identify: @partner.id), 
                 headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                 params: { 
                    assignment: { 
                        assignable_type: 'Lesson', 
                        assignable_id: @lesson.id, 
                        assignee_type: 'Instructor', 
                        assignee_id: @lecturer.id 
                    } 
                }, 
                as: :json
        end

        assert_response :created
    end

    test 'create assignment with invalid params' do
        token = instructor_sign_in(@admin)

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

    test 'create assignment with invalid policy' do
        token = instructor_sign_in(@lecturer)

        assert_no_difference('Assignment.count') do
            post api_v1_instructor_assignments_url(identify: @partner.id), 
                 headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                 params: { 
                    assignment: { 
                        assignable_type: 'Course', 
                        assignable_id: @course.id, 
                        assignee_type: 'Instructor', 
                        assignee_id: @lecturer.id 
                    } 
                }, 
                as: :json
        end

        assert_response :unauthorized
    end

    test 'send email inform new assigment' do
        mock_assignment_mailer = Minitest::Mock.new
        mock_assignment_mailer.expect :inform_new_assignment, mock_assignment_mailer, []
        mock_assignment_mailer.expect :deliver_later, nil, []
        
        ::AssignmentMailer.stub :with, mock_assignment_mailer do
            token = instructor_sign_in(@admin)
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

        mock_assignment_mailer.verify
    end

    test 'verify assigment policy when destroy an assignment' do
        assignment = Assignment.create(assignable: @course, assignee: @professor)

        token = instructor_sign_in(@admin)
        policy_mock = Minitest::Mock.new
        policy_mock.expect :destroy?, true, []

        AssignmentPolicy.stub :new, policy_mock do
            delete api_v1_instructor_assignment_url(identify: @partner.id, id: assignment.id), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        policy_mock.verify
    end

    test 'destroy assignment' do
        assignment = Assignment.create(assignable: @course, assignee: @professor)

        token = instructor_sign_in(@admin)

        assert_difference('Assignment.count', -1) do
            delete api_v1_instructor_assignment_url(identify: @partner.id, id: assignment.id), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :no_content
    end

    test 'destroy assignment with invalid policy' do
        assignment = Assignment.create(assignable: @course, assignee: @professor)
        token = instructor_sign_in(@lecturer)

        assert_no_difference('Assignment.count') do
            delete api_v1_instructor_assignment_url(identify: @partner.id, id: assignment.id), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :unauthorized
    end

    test 'send email inform cancel assigment' do
        mock_assignment_mailer = Minitest::Mock.new
        mock_assignment_mailer.expect :inform_cancel_assignment, mock_assignment_mailer, []
        mock_assignment_mailer.expect :deliver_later, nil, []
        
        ::AssignmentMailer.stub :with, mock_assignment_mailer do
            assignment = Assignment.create(assignable: @course, assignee: @professor)
            token = instructor_sign_in(@admin)
            delete api_v1_instructor_assignment_url(identify: @partner.id, id: assignment.id), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        mock_assignment_mailer.verify
    end
end
