require "test_helper"
require_relative "./shared/as_account_tests"

class InstructorTest < ActiveSupport::TestCase
  include ::Shared::AsAccountTests

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
