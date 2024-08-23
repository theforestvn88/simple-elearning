# frozen_string_literal: true

require 'test_helper'

class CoursePolicyTest < ActiveSupport::TestCase
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @professor = create(:instructor, partner: @partner, rank: :professor)
        @other_instructor = create(:instructor)
        @course = create(:course, instructor: @admin, partner: @partner)
        @user = create(:user)

        @course_assigment = create(:assignment, assignable: @course, assignee: @professor)
    end
    
    test 'user not allowed to view course detail policy' do
        refute_permit_policy @user, @course, :show
    end

    test 'user not allowed to create course policy' do
        refute_permit_policy @user, @course, :create
    end

    test 'user not allowed to update course policy' do
        refute_permit_policy @user, @course, :update
    end

    test 'user not allowed to destroy course policy' do
        refute_permit_policy @user, @course, :destroy
    end

    test 'only partner-instructors could view course detail policy' do
        assert_permit_policy @admin, @course, :show
        assert_permit_policy @professor, @course, :show
        refute_permit_policy @other_instructor, @course, :show
    end

    test 'only admin-instructor could create new courses policy' do
        new_course = Course.new(partner: @partner)
        assert_permit_policy @admin, new_course, :create
        refute_permit_policy @professor, new_course, :create
        refute_permit_policy @other_instructor, new_course, :create
    end

    test 'only partner-instructor could update new courses policy' do
        assert_permit_policy @admin, @course, :update
        assert_permit_policy @professor, @course, :update
        refute_permit_policy @other_instructor, @course, :update
    end

    test 'only admin-instructor could destroy new courses policy' do
        assert_permit_policy @admin, @course, :destroy
        refute_permit_policy @professor, @course, :destroy
        refute_permit_policy @other_instructor, @course, :destroy
    end
end
