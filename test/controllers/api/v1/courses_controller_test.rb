require 'test_helper'

class ApiV1CoursesControllerTest < ActionDispatch::IntegrationTest
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

  test 'query courses with pagination' do
    get api_v1_query_courses_url, as: :json

    assert_response :success
    assert_equal response.parsed_body['courses'], @expected_response_courses
    assert_equal response.parsed_body['pagination'], { "pages" => ["1"], "total" => 1 }
  end

  test 'show course' do
    get api_v1_course_introduction_url(@course1), as: :json
    assert_response :success
  end
end
