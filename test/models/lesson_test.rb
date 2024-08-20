require "test_helper"

class LessonTest < ActiveSupport::TestCase
  context 'associtations' do
    should belong_to(:instructor)
    should belong_to(:course)
    should belong_to(:milestone)
  end

  context 'validations' do
    should validate_presence_of(:name)
    should validate_numericality_of(:estimated_minutes)
            .only_integer
            .is_greater_than_or_equal_to(1)
  end

  setup do
    @partner = create(:partner)
    @instructor = create(:instructor, partner: @partner, rank: :administrator)
    @course = create(:course, instructor: @instructor, partner: @partner)
    @milestone = create(:milestone, instructor: @instructor, course: @course)
    @milestone2 = create(:milestone, instructor: @instructor, course: @course)
  end

  test 'update milestone lesson counter when create new lesson' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    assert_equal @milestone.reload.lessons_count, 1
    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    assert_equal @milestone.reload.lessons_count, 2
  end

  test 'update course lesson counter when create new lesson' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    assert_equal @course.reload.lessons_count, 1
    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone2, estimated_minutes: 60)
    assert_equal @course.reload.lessons_count, 2
  end

  test 'update milestone estimated_time when create new lesson' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 56)
    assert_equal @milestone.reload.estimated_minutes, 56
    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 100)
    assert_equal @milestone.reload.estimated_minutes, 156
  end

  test 'update course estimated_time when create new lesson' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 56)
    assert_equal @course.reload.estimated_minutes, 56
    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone2, estimated_minutes: 100)
    assert_equal @course.reload.estimated_minutes, 156
  end

  test 'update milestone estimated_time when update lesson estimated_time' do
    lesson = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    assert_equal @milestone.reload.lessons_count, 1
    assert_equal @milestone.reload.estimated_minutes, 60

    lesson.update(estimated_minutes: 156)
    assert_equal @milestone.reload.lessons_count, 1
    assert_equal @milestone.reload.estimated_minutes, 156
  end

  test 'update course estimated_time when update lesson estimated_time' do
    lesson = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    assert_equal @course.reload.lessons_count, 1
    assert_equal @course.reload.estimated_minutes, 60

    lesson.update(estimated_minutes: 156)
    assert_equal @course.reload.lessons_count, 1
    assert_equal @course.reload.estimated_minutes, 156
  end

  test 'update milestone estimated_time when destroy its lesson' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 56)
    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 100)
    assert_equal @milestone.reload.estimated_minutes, 156

    lesson1.reload.destroy
    assert_equal @milestone.reload.estimated_minutes, 100
  end

  test 'update course estimated_time when destroy its lesson' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 56)
    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone2, estimated_minutes: 100)
    assert_equal @course.reload.estimated_minutes, 156

    lesson1.reload.destroy
    assert_equal @course.reload.estimated_minutes, 100
  end

  test 'created with default position' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    assert_equal lesson1.position, 1

    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    assert_equal lesson2.position, 2
  end

  test 'destroy will reorder milestones positions' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    lesson3 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)

    lesson2.reload.destroy

    assert_equal lesson1.reload.position, 1
    assert_equal lesson3.reload.position, 2
  end

  test 'update position will reorder milestones positions' do
    lesson1 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    lesson2 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    lesson3 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)
    lesson4 = create(:lesson, instructor: @instructor, course: @course, milestone: @milestone, estimated_minutes: 60)

    lesson3.update(position: 2)

    assert_equal lesson1.reload.position, 1
    assert_equal lesson2.reload.position, 3
    assert_equal lesson3.reload.position, 2
    assert_equal lesson4.reload.position, 4
  end
end
