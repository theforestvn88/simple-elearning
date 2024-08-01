require 'test_helper'
require 'api_helper'

class ApiV1InstructorCoursesControllerTest < ActionDispatch::IntegrationTest
    setup do
        @instructor1 = create(:instructor)
        @instructor2 = create(:instructor)

        courses = [
        @course1 = create(:course, instructor: @instructor1),
        @course2 = create(:course, instructor: @instructor1),
        @course3 = create(:course, instructor: @instructor2),
        ]

        @expected_response_courses = courses.map do |c| 
        {
            "id" => c.id,
            "name" => c.name,
            "summary" => c.summary,
            "last_update_time"=>"less than a minute"
        }
        end
    end

    test 'get courses by instructor' do
        token = instructor_sign_in(@instructor1)

        get api_v1_instructor_courses_url(instructor: @instructor1.id), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        
        assert_response :success
        assert_equal response.parsed_body['courses'], @expected_response_courses[1..-1]
        assert_equal response.parsed_body['pagination'], { "pages" => ["1"], "total" => 1 }
    end

    # FIXME 
    #   test 'create course' do
    #     assert_difference('Course.count') do
    #       post api_v1_courses_url, params: { course: { name: @course.name, instructor: @instructor1 } }, as: :json
    #     end

    #     assert_response :created
    #   end

    #   test 'show course' do
    #     get api_v1_course_url(@course), as: :json
    #     assert_response :success
    #   end

    #   test 'update course' do
    #     patch api_v1_course_url(@course), params: { course: { name: @course.name } }, as: :json
    #     assert_response :success
    #   end

    #   test 'destroy course' do
    #     assert_difference('Course.count', -1) do
    #       delete api_v1_course_url(@course), as: :json
    #     end

    #     assert_response :no_content
    #   end
end
