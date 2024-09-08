require "test_helper"
require_relative "./shared/as_account_tests"

class InstructorTest < ActiveSupport::TestCase
  include ::Shared::AsAccountTests

  context 'properties' do
    should define_enum_for(:rank).
      with_values(
        lecturer: 'Lecturer', 
        assistant_professor: "Assistant Professor", 
        associate_professor: "Associate Professor", 
        professor: "Professor", 
        administrator: "President"
      ).
      backed_by_column_of_type(:enum)
  end

  context 'associations' do
    should belong_to(:partner)
    should have_many(:courses).dependent(:nullify)
    should have_many(:activities)
    should have_many(:assignments)
  end

  test 'default rank' do
    assert_equal 'Lecturer', Instructor.default_rank
  end

  test 'admin rank' do
    assert_equal 'President', Instructor.admin_rank
  end

  test 'rank name' do
    assert_equal 'Lecturer', Instructor.new(rank: :lecturer).rank_name
    assert_equal 'Assistant Professor', Instructor.new(rank: :assistant_professor).rank_name
    assert_equal 'Associate Professor', Instructor.new(rank: :associate_professor).rank_name
    assert_equal 'Professor', Instructor.new(rank: :professor).rank_name
    assert_equal 'President', Instructor.new(rank: :administrator).rank_name
  end

  test 'order by rank' do
    partner = create(:partner)
    instructor1 = create(:instructor, partner: partner, rank: :lecturer)
    instructor2 = create(:instructor, partner: partner, rank: :assistant_professor)
    instructor3 = create(:instructor, partner: partner, rank: :associate_professor)
    instructor5 = create(:instructor, partner: partner, rank: :administrator)
    instructor4 = create(:instructor, partner: partner, rank: :professor)


    assert_equal ::Instructor.order_by_rank.all, [instructor5, instructor4, instructor3, instructor2, instructor1]
  end
end
