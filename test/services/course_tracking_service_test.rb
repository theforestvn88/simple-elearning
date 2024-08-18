require 'test_helper'

class CourseTrackingServiceTest < ActiveSupport::TestCase
    setup do
        @subject = CourseTrackingService.new
        @partner = create(:partner)
        @instructor = create(:instructor, partner: @partner, rank: :administrator)
        @course = create(:course, instructor: @instructor, partner: @partner)
        @milestone = create(:milestone, instructor: @instructor, course: @course)
        @lesson = create(:lesson, instructor: @instructor, milestone: @milestone, course: @course, estimated_minutes: 60)
    end

    test 'tracking create course' do
        @subject.track_create_course(course: @course, by: @instructor)
        assert_equal Activity.last.action, 'create'
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end

    test 'tracking update course' do
        @course.update(name: 'updated')
        @subject.track_update_course(course: @course, by: @instructor)
        assert_equal Activity.last.action, "update|name"
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end

    test 'tracking destroy course' do
        @subject.track_destroy_course(course: @course, by: @instructor)
        assert_equal Activity.last.action, 'destroy'
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end

    test 'tracking create milestone' do
        @subject.track_create_milestone(milestone: @milestone, by: @instructor)
        assert_equal Activity.last.action, "add_milestone|#{@milestone.id}"
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end

    test 'tracking update milestone' do
        @milestone.update(name: 'updated')
        @subject.track_update_milestone(milestone: @milestone, by: @instructor)
        assert_equal Activity.last.action, "update_milestone|name"
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end

    test 'tracking destroy milestone' do
        @subject.track_destroy_milestone(milestone: @milestone, by: @instructor)
        assert_equal Activity.last.action, "destroy_milestone|#{@milestone.id}"
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end

    test 'tracking create lesson' do
        @subject.track_create_lesson(lesson: @lesson, by: @instructor)
        assert_equal Activity.last.action, "add_lesson|#{@lesson.id}"
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end

    test 'tracking update lesson' do
        @lesson.update(name: 'updated')
        @subject.track_update_lesson(lesson: @lesson, by: @instructor)
        assert_equal Activity.last.action, "update_lesson|name"
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end

    test 'tracking destroy lesson' do
        @subject.track_destroy_lesson(lesson: @lesson, by: @instructor)
        assert_equal Activity.last.action, "destroy_lesson|#{@lesson.id}"
        assert_equal Activity.last.trackable, @course
        assert_equal Activity.last.actor, @instructor
    end
end
