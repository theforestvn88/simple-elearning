require 'test_helper'

class ApiV1CoursesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @course = create(:course)
  end

  test 'should get index with pagination' do
    get api_v1_courses_url, as: :json

    assert_response :success
    assert_equal response.parsed_body['courses'], [{
      "id" => @course.id,
      "name" => @course.name,
      "summary" => @course.summary,
      "last_update_time"=>"less than a minute"
    }]
    assert_equal response.parsed_body['pagination'], { "pages" => ["1"], "total" => 1 }
  end

  test 'should create course' do
    assert_difference('Course.count') do
      post api_v1_courses_url, params: { course: { name: @course.name } }, as: :json
    end

    assert_response :created
  end

  test 'should show course' do
    get api_v1_course_url(@course), as: :json
    assert_response :success
  end

  test 'should update course' do
    patch api_v1_course_url(@course), params: { course: { name: @course.name } }, as: :json
    assert_response :success
  end

  test 'should destroy course' do
    assert_difference('Course.count', -1) do
      delete api_v1_course_url(@course), as: :json
    end

    assert_response :no_content
  end
end
