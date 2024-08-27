require 'test_helper'
require 'api_helper'

class ApiV1InstructorCoursesControllerTest < ActionDispatch::IntegrationTest
    setup do
        @partner = create(:partner)
        @instructor1 = create(:instructor, partner: @partner, rank: :administrator)
        @instructor2 = create(:instructor, partner: @partner, rank: :professor)
        @instructor3 = create(:instructor, partner: @partner, rank: :professor)
        @instructor4 = create(:instructor, partner: @partner, rank: :assistant_professor)
        @instructor5 = create(:instructor, partner: @partner, rank: :lecturer)
        
        @other_partner = create(:partner)
        @other_instructor = create(:instructor, partner: @other_partner, rank: :administrator)
        create(:course, instructor: @other_instructor, partner: @other_partner)

        @courses = [
            @course1 = create(:course, instructor: @instructor1, partner: @partner),
            @course2 = create(:course, instructor: @instructor1, partner: @partner),
            @course3 = create(:course, instructor: @instructor2, partner: @partner),
        ]

        create(:assignment, assignable: @course1, assignee: @instructor3)
        
        @milestone1 = create(:milestone, instructor: @instructor1, course: @course1)
        create(:assignment, assignable: @milestone1, assignee: @instructor4)
        @lesson1 = create(:lesson, instructor: @instructor1, course: @course1, milestone: @milestone1, estimated_minutes: 60)
        create(:assignment, assignable: @lesson1, assignee: @instructor5)

        @partner_courses_url = api_v1_instructor_courses_url(identify: @partner.id)
        @instructor_course1_url = api_v1_instructor_course_url(id: @course1.id, identify: @partner.id)
    end

    test 'require signin as instructor' do
        get @partner_courses_url, headers: { }, as: :json
        assert_response :unauthorized

        a_user = create(:user)
        token = user_sign_in(a_user)

        get @partner_courses_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :unauthorized
    end

    test 'get partner courses' do
        token = instructor_sign_in(@instructor1)

        get @partner_courses_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        
        assert_response :success
        assert_equal response.parsed_body['courses'], @courses.sort_by(&:updated_at).reverse.map { |c|
            {
                'id' => c.id,
                'name' => c.name,
                'summary' => c.summary,
                'last_update_time' => 'less than a minute',
                'partner' => {
                    'id' => c.partner.id,
                    'name' => c.partner.name,
                }
            }
        }
        assert_equal response.parsed_body['pagination'], { "pages" => ["1"], "total" => 1 }
    end

    test 'only admin could create new course' do
        token = instructor_sign_in(@instructor1)

        assert_difference('Course.count') do
          post @partner_courses_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { course: { name: 'new course', summary: 'for test' } }, as: :json
        end

        assert_response :created
    end

    test 'normal instructor not allowed to create new course' do
        token = instructor_sign_in(@instructor3)

        assert_no_difference('Course.count') do
            post @partner_courses_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { course: { name: 'new course', summary: 'for test' } }, as: :json
        end
  
        assert_response :unauthorized
    end

    test 'only partner instructors could view full-detail course' do
        token = instructor_sign_in(@instructor2)

        get @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
    end

    test 'other partner instructors not allowed to view full-detail course' do
        token = instructor_sign_in(@other_instructor)

        get @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :unauthorized
    end

    test 'full-detail course should show milstones list, lessons list for each milestone, assignments and permissions' do
        token = instructor_sign_in(@instructor3)

        get @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
        assert_equal response.parsed_body, {
            'id' => @course1.id,
            'name' => @course1.name,
            'summary' => @course1.summary,
            'last_update_time' => 'less than a minute',
            'estimated_minutes' => @course1.estimated_minutes,
            'lessons_count' => @course1.lessons_count,
            'description' => @course1.description,
            'partner' => {
                'id' => @course1.partner.id,
                'name' => @course1.partner.name,
            },
            'assigned' => true,
            'can_edit' => true,
            'can_delete' => false,
            'milestones' => [
                {
                    'id' => @milestone1.id, 
                    'name' => @milestone1.name,
                    'can_edit' => true,
                    'can_delete' => true,
                    'lessons' => [
                        {
                            'id' => @lesson1.id,
                            'name' => @lesson1.name,
                            'can_edit' => true,
                            'can_delete' => true,
                        }
                    ]
                }
            ]
        }

        token = instructor_sign_in(@instructor4)

        get @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
        assert_equal response.parsed_body, {
            'id' => @course1.id,
            'name' => @course1.name,
            'summary' => @course1.summary,
            'last_update_time' => 'less than a minute',
            'partner' => {
                'id' => @course1.partner.id,
                'name' => @course1.partner.name,
            },
            'estimated_minutes' => @course1.estimated_minutes,
            'lessons_count' => @course1.lessons_count,
            'description' => @course1.description,
            'can_edit' => false,
            'can_delete' => false,
            'milestones' => [
                {
                    'id' => @milestone1.id, 
                    'name' => @milestone1.name,
                    'assigned' => true,
                    'can_edit' => true,
                    'can_delete' => false,
                    'lessons' => [
                        {
                            'id' => @lesson1.id,
                            'name' => @lesson1.name,
                            'can_edit' => true,
                            'can_delete' => true,
                        }
                    ]
                }
            ]
        }

        token = instructor_sign_in(@instructor5)

        get @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        assert_response :success
        assert_equal response.parsed_body, {
            'id' => @course1.id,
            'name' => @course1.name,
            'summary' => @course1.summary,
            'last_update_time' => 'less than a minute',
            'estimated_minutes' => @course1.estimated_minutes,
            'lessons_count' => @course1.lessons_count,
            'description' => @course1.description,
            'partner' => {
                'id' => @course1.partner.id,
                'name' => @course1.partner.name,
            },
            'can_edit' => false,
            'can_delete' => false,
            'milestones' => [
                {
                    'id' => @milestone1.id, 
                    'name' => @milestone1.name,
                    'can_edit' => false,
                    'can_delete' => false,
                    'lessons' => [
                        {
                            'id' => @lesson1.id,
                            'name' => @lesson1.name,
                            'assigned' => true,
                            'can_edit' => true,
                            'can_delete' => false,
                        }
                    ]
                }
            ]
        }
    end

    test 'only assigned instructors could update its course' do
        token = instructor_sign_in(@instructor3)

        patch @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { course: { name: 'updated' } }, as: :json
        assert_response :success
    end

    test 'other partner instructors not allowed to update its course' do
        token = instructor_sign_in(@other_instructor)

        patch @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, params: { course: { name: 'updated' } }, as: :json
        assert_response :unauthorized
    end

    test 'only admin could destroy course' do
        token = instructor_sign_in(@instructor1)

        assert_difference('Course.count', -1) do
            delete @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :no_content
    end

    test 'normal instructor not allowed to delete course' do
        token = instructor_sign_in(@instructor2)

        assert_no_difference('Course.count') do
            delete @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :unauthorized
    end

    test 'other instructor not allowed to delete course' do
        token = instructor_sign_in(@other_instructor)

        assert_no_difference('Course.count') do
            delete @instructor_course1_url, headers: { "X-Auth-Token" => "Bearer #{token}" }, as: :json
        end

        assert_response :unauthorized
    end
end
