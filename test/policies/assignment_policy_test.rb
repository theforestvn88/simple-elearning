# frozen_string_literal: true

require 'test_helper'

class AssignmentPolicyTest < ActiveSupport::TestCase
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

        @course_assigment = Assignment.new(assignable: @course, assignee: @professor)
        @milestone_assignment = Assignment.new(assignable: @milestone, assignee: @lecturer)
        @lesson_assignment = Assignment.new(assignable: @lesson, assignee: @lecturer)
    end

    test 'only partner-admin can assign an instructor to a course' do
        assert_permit_policy @admin, @course_assigment, :create
        refute_permit_policy @professor, @course_assigment, :create
        refute_permit_policy @other_instructor, @course_assigment, :create
        refute_permit_policy @user, @course_assigment, :create
    end

    test 'only partner-admin can delete course assignments' do
        assert_permit_policy @admin, @course_assigment, :destroy
        refute_permit_policy @professor, @course_assigment, :destroy
        refute_permit_policy @other_instructor, @course_assigment, :destroy
        refute_permit_policy @user, @course_assigment, :destroy

        assert_permit_policy @admin, @course_assigment, :cancel
        refute_permit_policy @professor, @course_assigment, :cancel
        refute_permit_policy @other_instructor, @course_assigment, :cancel
        refute_permit_policy @user, @course_assigment, :cancel
    end

    test 'only partner-admin or course-assigned-instructors can assign an instructor to a milestone/lesson' do
        Assignment.create(assignable: @course, assignee: @professor)

        assert_permit_policy @admin, @milestone_assignment, :create
        assert_permit_policy @professor, @milestone_assignment, :create
        refute_permit_policy @lecturer, @milestone_assignment, :create
        refute_permit_policy @other_instructor, @milestone_assignment, :create
        refute_permit_policy @user, @milestone_assignment, :create
    end

    test 'only partner-admin or course-assigned-instructors can delete milestone/lesson assignment' do
        Assignment.create(assignable: @course, assignee: @professor)

        assert_permit_policy @admin, @milestone_assignment, :destroy
        assert_permit_policy @professor, @milestone_assignment, :destroy
        refute_permit_policy @lecturer, @milestone_assignment, :destroy
        refute_permit_policy @other_instructor, @milestone_assignment, :destroy
        refute_permit_policy @user, @milestone_assignment, :destroy

        assert_permit_policy @admin, @milestone_assignment, :cancel
        assert_permit_policy @professor, @milestone_assignment, :cancel
        refute_permit_policy @lecturer, @milestone_assignment, :cancel
        refute_permit_policy @other_instructor, @milestone_assignment, :cancel
        refute_permit_policy @user, @milestone_assignment, :cancel
    end

    test 'only partner-admin or course-assigned-instructors or milestone-assigned-instructor can assign an instructor to a lesson' do
        Assignment.create(assignable: @course, assignee: @professor)
        Assignment.create(assignable: @milestone, assignee: @assistant_professor)

        assert_permit_policy @admin, @lesson_assignment, :create
        assert_permit_policy @professor, @lesson_assignment, :create
        assert_permit_policy @assistant_professor, @lesson_assignment, :create
        refute_permit_policy @lecturer, @lesson_assignment, :create
        refute_permit_policy @other_instructor, @lesson_assignment, :create
        refute_permit_policy @user, @lesson_assignment, :create
    end

    test 'only partner-admin or course-assigned-instructors or milestone-assigned-instructor can delete lesson asignment' do
        Assignment.create(assignable: @course, assignee: @professor)
        Assignment.create(assignable: @milestone, assignee: @assistant_professor)

        assert_permit_policy @admin, @lesson_assignment, :destroy
        assert_permit_policy @professor, @lesson_assignment, :destroy
        assert_permit_policy @assistant_professor, @lesson_assignment, :destroy
        refute_permit_policy @lecturer, @lesson_assignment, :destroy
        refute_permit_policy @other_instructor, @lesson_assignment, :destroy
        refute_permit_policy @user, @lesson_assignment, :destroy

        assert_permit_policy @admin, @lesson_assignment, :cancel
        assert_permit_policy @professor, @lesson_assignment, :cancel
        assert_permit_policy @assistant_professor, @lesson_assignment, :cancel
        refute_permit_policy @lecturer, @lesson_assignment, :cancel
        refute_permit_policy @other_instructor, @lesson_assignment, :cancel
        refute_permit_policy @user, @lesson_assignment, :cancel
    end
end
