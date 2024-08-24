# frozen_string_literal: true

require 'test_helper'

class LessonPolicyTest < ActiveSupport::TestCase
    setup do
        @partner = create(:partner)
        @admin = create(:instructor, partner: @partner, rank: :administrator)
        @professor = create(:instructor, partner: @partner, rank: :professor)
        @assistant_professor = create(:instructor, partner: @partner, rank: :assistant_professor)
        @lecturer = create(:instructor, partner: @partner, rank: :lecturer)
        @lecturer2 = create(:instructor, partner: @partner, rank: :lecturer)
        @other_instructor = create(:instructor)
        @user = create(:user)
        @course = create(:course, instructor: @admin, partner: @partner)
        @milestone = create(:milestone, instructor: @professor, course: @course)
        @lesson = create(:lesson, instructor: @professor, course: @course, milestone: @milestone, estimated_minutes: 60)

        @course_assigment = create(:assignment, assignable: @course, assignee: @professor)
        @milestone_assignment = create(:assignment, assignable: @milestone, assignee: @assistant_professor)
        @lesson_assignment = create(:assignment, assignable: @lesson, assignee: @lecturer)
    end

    test 'user not allowed to create lesson policy' do
        refute_permit_policy @user, Lesson.new(course: @course, milestone: @milestone, estimated_minutes: 10), :create
    end

    test 'user not allowed to view full-detail lesson policy' do
        refute_permit_policy @user, @lesson, :show
    end

    test 'user not allowed to update lesson policy' do
        refute_permit_policy @user, @lesson, :update
    end

    test 'user not allowed to destroy lesson policy' do
        refute_permit_policy @user, @lesson, :destroy
    end

    test 'only course/milestone level assigned-instructor could create new lesson policy' do
        assert_permit_policy @admin, @lesson, :create
        assert_permit_policy @professor, @lesson, :create
        assert_permit_policy @assistant_professor, @lesson, :create
        refute_permit_policy @lecturer, @lesson, :create
        refute_permit_policy @other_instructor, @lesson, :create
    end

    test 'only partner-instructor could view full-detail lesson policy' do
        assert_permit_policy @admin, @lesson, :show
        assert_permit_policy @professor, @lesson, :show
        assert_permit_policy @assistant_professor, @lesson, :show
        assert_permit_policy @lecturer, @lesson, :show
        assert_permit_policy @lecturer2, @lesson, :show
        refute_permit_policy @other_instructor, @lesson, :show
    end

    test 'only assigned-instructor could update lesson policy' do
        assert_permit_policy @admin, @lesson, :update
        assert_permit_policy @professor, @lesson, :update
        assert_permit_policy @assistant_professor, @lesson, :update
        assert_permit_policy @lecturer, @lesson, :update
        refute_permit_policy @other_instructor, @lesson, :update
    end

    test 'only course/milestone level could destroy lesson policy' do
        assert_permit_policy @admin, @lesson, :destroy
        assert_permit_policy @professor, @lesson, :destroy
        assert_permit_policy @assistant_professor, @lesson, :destroy
        refute_permit_policy @lecturer, @lesson, :destroy
        refute_permit_policy @other_instructor, @lesson, :destroy
    end
end
