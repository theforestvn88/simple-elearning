require 'test_helper'

class MilestoneTest < ActiveSupport::TestCase
  context 'associations' do
    should belong_to(:course)
    should belong_to(:instructor)
    should have_many(:lessons)
  end

  context 'validations' do
    should validate_presence_of(:name)
    should validate_numericality_of(:estimated_minutes)
            .only_integer
            .is_greater_than_or_equal_to(0)
            .allow_nil
  end

  setup do
    @partner = create(:partner)
    @instructor = create(:instructor, partner: @partner, rank: :administrator)
    @course = create(:course, instructor: @instructor, partner: @partner)
  end

  test 'created with default position' do
    milestone1 = create(:milestone, instructor: @instructor, course: @course)
    assert_equal milestone1.position, 1

    milestone2 = create(:milestone, instructor: @instructor, course: @course)
    assert_equal milestone2.position, 2
  end

  test 'destroy will reorder milestones positions' do
    milestone1 = create(:milestone, instructor: @instructor, course: @course)
    milestone2 = create(:milestone, instructor: @instructor, course: @course)
    milestone3 = create(:milestone, instructor: @instructor, course: @course)

    milestone2.reload.destroy

    assert_equal milestone1.reload.position, 1
    assert_equal milestone3.reload.position, 2
  end

  test 'update position will reorder milestones positions' do
    milestone1 = create(:milestone, instructor: @instructor, course: @course)
    milestone2 = create(:milestone, instructor: @instructor, course: @course)
    milestone3 = create(:milestone, instructor: @instructor, course: @course)
    milestone4 = create(:milestone, instructor: @instructor, course: @course)

    milestone3.update(position: 2)

    assert_equal milestone1.reload.position, 1
    assert_equal milestone2.reload.position, 3
    assert_equal milestone3.reload.position, 2
    assert_equal milestone4.reload.position, 4
  end
end
