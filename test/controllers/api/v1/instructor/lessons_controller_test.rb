require 'test_helper'
require 'api_helper'

class ApiV1InstructorLessonsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @instructor = create(:instructor_with_avatar, partner: @partner, rank: :administrator)
        @instructor2 = create(:instructor, partner: @partner, rank: :professor)
        @instructor3 = create(:instructor, partner: @partner, rank: :lecturer)
        @course = create(:course, instructor: @instructor, partner: @partner)
        @milestone = create(:milestone, instructor: @instructor, course: @course)
        @lesson = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
        create(:assignment, assignable: @lesson, assignee: @instructor3)

        @other_partner = create(:partner)
        @other_instructor = create(:instructor, partner: @other_partner, rank: :administrator)
    end

    test 'only partner-instructor could view lesson full-detail (instructor version)' do
        token = instructor_sign_in(@instructor2)

        get api_v1_instructor_course_milestone_lesson_url(identify: 'xxx', course_id: @course.id, milestone_id: @milestone.id, id: @lesson.id),
            headers: { 'X-Auth-Token' => "Bearer #{token}" }, as: :json
        
        assert_response :success
    end

    test 'full-detail should show assigned, permissions' do
        token = instructor_sign_in(@instructor3)

        get api_v1_instructor_course_milestone_lesson_url(identify: 'xxx', course_id: @course.id, milestone_id: @milestone.id, id: @lesson.id),
            headers: { 'X-Auth-Token' => "Bearer #{token}" }, as: :json
        
        assert_response :success
        assert_equal response.parsed_body, {
            'id' => @lesson.id,
            'name' => @lesson.name,
            'estimated_minutes' => @lesson.estimated_minutes,
            "course_id" => @lesson.course_id,
            "milestone_id" => @lesson.milestone_id,
            'content' => '',
            'instructor' => {
                'id' => @instructor.id,
                'name' => @instructor.name,
                'avatar' => { "url" => rails_blob_path(@instructor.avatar, only_path: true) }
            },
            'created_time' => 'less than a minute',
            'updated_time' => 'less than a minute',
            'assigned' => true,
            'can_edit' => true,
            'can_delete' => false,
            'assignees' => [
                {
                    'id' => @instructor3.id,
                    'name' => @instructor3.name
                }
            ]
        }
    end

    test 'only assigned-instructor could create lesson' do
        token = instructor_sign_in(@instructor)

        assert_difference('Lesson.count') do
            post api_v1_instructor_course_milestone_lessons_url(identify: 'xxx', course_id: @course.id, milestone_id: @milestone.id), 
                headers: { 'X-Auth-Token' => "Bearer #{token}" }, 
                params: { lesson: { name: 'new lesson', estimated_minutes: 60 } }, 
                as: :json
        end

        assert_response :success
        assert_equal response.parsed_body, {
            'id' => Lesson.last.id
        }
    end

    test 'other instructor not allowed to create lesson' do
        token = instructor_sign_in(@other_instructor)

        post api_v1_instructor_course_milestone_lessons_url(identify: 'xxx', course_id: @course.id, milestone_id: @milestone.id),
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            params: { lesson: { name: 'new lesson', estimated_minutes: 60 } }, 
            as: :json

        assert_response :unauthorized
    end

    test 'only assigned-instructor could update lesson' do
        token = instructor_sign_in(@instructor)

        patch api_v1_instructor_course_milestone_lesson_url(identify: 'xxx', course_id: @course.id, milestone_id: @milestone.id, id: @lesson.id),
                headers: { 'X-Auth-Token' => "Bearer #{token}" }, 
                params: { lesson: { name: 'updated', estimated_minutes: 15 } }, 
                as: :json

        assert_response :success
        assert_equal response.parsed_body, {
            'name' => 'updated',
            'estimated_minutes' => 15
        }
    end

    test 'other instructor not allowed to update lesson' do
        token = instructor_sign_in(@other_instructor)

        patch api_v1_instructor_course_milestone_lesson_url(identify: 'xxx', course_id: @course.id, milestone_id: @milestone.id, id: @lesson.id),
                headers: { "X-Auth-Token" => "Bearer #{token}" }, 
                params: { lesson: { name: 'updated' } }, 
                as: :json

        assert_response :unauthorized
    end

    test 'only assigned-instructor could destroy lesson' do
        token = instructor_sign_in(@instructor)

        assert_difference('Lesson.count', -1) do
            delete api_v1_instructor_course_milestone_lesson_url(identify: 'xxx', course_id: @course.id, milestone_id: @milestone.id, id: @lesson.id),
                headers: { 'X-Auth-Token' => "Bearer #{token}" }, 
                as: :json
        end

        assert_response :no_content
    end

    test 'other instructor not allowed to destroy milestone' do
        token = instructor_sign_in(@other_instructor)

        delete api_v1_instructor_course_milestone_lesson_url(identify: 'xxx', course_id: @course.id, milestone_id: @milestone.id, id: @lesson.id),
            headers: { "X-Auth-Token" => "Bearer #{token}" }, 
            as: :json

        assert_response :unauthorized
    end
end
