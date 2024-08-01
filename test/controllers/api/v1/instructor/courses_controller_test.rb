require 'test_helper'
require 'api_helper'

class ApiV1InstructorCoursesControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @instructor1 = create(:instructor, partner: @partner, rank: :administrator)
        @instructor2 = create(:instructor, partner: @partner, rank: :professor)
        @instructor3 = create(:instructor, partner: @partner, rank: :professor)
        
        @other_partner = create(:partner)
        @other_instructor = create(:instructor, partner: @other_partner, rank: :administrator)

        courses = [
            @course1 = create(:course, instructor: @instructor1, partner: @partner),
            @course2 = create(:course, instructor: @instructor1, partner: @partner),
            @course3 = create(:course, instructor: @instructor2, partner: @partner),
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

    test 'require signin as instructor' do
        get api_v1_instructor_courses_url, headers: { }, as: :json
        assert_response :unauthorized

        a_user = create(:user)
        token = user_sign_in(a_user)

        get api_v1_instructor_courses_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :unauthorized
    end

    test 'get courses by instructor' do
        token = instructor_sign_in(@instructor1)

        get api_v1_instructor_courses_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        
        assert_response :success
        assert_equal response.parsed_body['courses'], @expected_response_courses[0..-2]
        assert_equal response.parsed_body['pagination'], { "pages" => ["1"], "total" => 1 }
    end

      test 'only admin could create new course' do
        token = instructor_sign_in(@instructor1)

        assert_difference('Course.count') do
          post api_v1_instructor_courses_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { course: { name: 'new course', summary: 'for test' } }, as: :json
        end

        assert_response :created
    end

    test 'normal instructor not allowed to create new course' do
        token = instructor_sign_in(@instructor3)

        assert_no_difference('Course.count') do
            post api_v1_instructor_courses_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { course: { name: 'new course', summary: 'for test' } }, as: :json
        end
  
        assert_response :unauthorized
    end

    test 'only partner instructors could view full-detail course' do
        token = instructor_sign_in(@instructor3)

        get api_v1_instructor_course_url(@course1), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
    end

    test 'other partner instructors not allowed to view full-detail course' do
        token = instructor_sign_in(@other_instructor)

        get api_v1_instructor_course_url(@course1), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :unauthorized
    end

    test 'only partner instructors could update its course' do
        token = instructor_sign_in(@instructor3)

        patch api_v1_instructor_course_url(@course1), headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { course: { name: 'updated' } }, as: :json
        assert_response :success
    end

    # TODO: only assigned instructor could update course

    test 'other partner instructors not allowed to update its course' do
        token = instructor_sign_in(@other_instructor)

        patch api_v1_instructor_course_url(@course1), headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { course: { name: 'updated' } }, as: :json
        assert_response :unauthorized
    end

    test 'only admin could destroy course' do
        token = instructor_sign_in(@instructor1)

        assert_difference('Course.count', -1) do
            delete api_v1_instructor_course_url(@course1), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :no_content
    end

    test 'normal instructor not allowed to delete course' do
        token = instructor_sign_in(@instructor2)

        assert_no_difference('Course.count') do
            delete api_v1_instructor_course_url(@course1), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :unauthorized
    end

    test 'other instructor not allowed to delete course' do
        token = instructor_sign_in(@other_instructor)

        assert_no_difference('Course.count') do
            delete api_v1_instructor_course_url(@course1), headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :unauthorized
    end
end
