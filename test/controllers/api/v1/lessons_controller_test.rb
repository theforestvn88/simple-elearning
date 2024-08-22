require 'test_helper'

class ApiV1LessonsControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @instructor = create(:instructor_with_avatar, partner: @partner)
        @course = create(:course, instructor: @instructor, partner: @partner)
        @milestone = create(:milestone, instructor: @instructor, course: @course)
        @lessons = [
            create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60),
            create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
        ]
    end

    test 'get lessons list belong to milestone' do
        get api_v1_lessons_list_url(course_id: @course.id, milestone_id: @milestone.id), as: :json
    
        assert_response :success
        assert_equal response.parsed_body, @lessons.map { |lesson|
            {
                "id" => lesson.id,
                "name" => lesson.name,
                "estimated_minutes" => lesson.estimated_minutes
            }
        }
    end

    test 'show lesson detail' do
        get api_v1_lesson_detail_url(course_id: @course.id, milestone_id: @milestone.id, id: @lessons.first.id), as: :json

        assert_response :success
        assert_equal response.parsed_body, {
            "id" => @lessons.first.id,
            "name" => @lessons.first.name,
            "estimated_minutes" => @lessons.first.estimated_minutes,
            'content' => '',
            "instructor" => {
                "id" => @instructor.id,
                "name" => @instructor.name,
                "avatar" => rails_blob_path(@instructor.avatar, only_path: true)
            }
        }
    end
end
