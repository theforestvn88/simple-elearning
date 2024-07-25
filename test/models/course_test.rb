require 'test_helper'

class CourseTest < ActiveSupport::TestCase
  context 'associations' do
    should belong_to(:instructor)
    should have_one_attached(:cover) 
  end
end
